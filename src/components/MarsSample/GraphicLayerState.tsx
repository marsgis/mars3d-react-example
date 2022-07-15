import {
  MarsButton,
  MarsIcon,
  MarsInputNumber,
  MarsCheckbox,
  MarsSlider,
  MarsTable,
  $message,
  $alert,
  $showLoading,
  $hideLoading
} from "@mars/components/MarsUI"
import { Space, Upload } from "antd"
import { Component } from "react"
import classNames from "classnames"
import { activate, disable, updateWidget, isActive } from "@mars/widgets/common/store/widget"

const mapWork = window.mapWork
const mars3d = mapWork.mars3d

const graphicDataList = []
const rowKeys = []

interface GraphicTableItem {
  key: number
  name: string
}

let lastGraphic = null

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  if (mapWork.getManagerLayer) {
    return mapWork.getManagerLayer()
  }
  return mapWork.graphicLayer
}

// 在图层绑定Popup弹窗
function bindLayerPopup() {
  const graphicLayer = getManagerLayer()
  graphicLayer.bindPopup(
    function (event) {
      const attr = getAttrForEvent(event)
      attr["类型"] = event.graphic?.type
      attr["来源"] = "我是layer上绑定的Popup"
      attr["备注"] = "我支持鼠标交互"

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })

      // return new Promise((resolve) => {
      //   //这里可以进行后端接口请求数据，setTimeout测试异步
      //   setTimeout(() => {
      //     resolve('Promise异步回调显示的弹窗内容信息')
      //   }, 2000)
      // })
    },
    { pointerEvents: true }
  )
}
function getAttrForEvent(event) {
  if (event?.graphic?.attr) {
    return event.graphic.attr
  }
  if (!event.czmObject) {
    return {}
  }

  let attr = event.czmObject._attr || event.czmObject.properties || event.czmObject.attribute
  if (attr && attr.type && attr.attr) {
    attr = attr.attr // 兼容历史数据,V2内部标绘生产的geojson
  }
  return attr ?? {}
}

// 绑定右键菜单
function bindLayerContextMenu() {
  const graphicLayer = getManagerLayer()

  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP" ||
          graphic.type === "scrollWall" ||
          graphic.type === "water"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        $alert("该对象的面积为:" + strArea)
      }
    }
  ])
}

// 表格中的矢量数据命名
let graphicIndex = 0
function getGraphicName(graphic) {
  if (graphic?.style?.label?.text) {
    return `${graphic.type} - ${graphic.style.label.text}`
  }

  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`
  }

  graphic.name = `未命名${++graphicIndex}`
  return `${graphic.type} - ${graphic.name}`
}

export class GraphicLayerState extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      drawLabel1: props.drawLabel1 || "图上标绘",
      drawLabel2: props.drawLabel2 || null,
      interaction: props.interaction === undefined ? true : props.interaction, // 是否可以鼠标拾取和交互
      enabledDraw: props.enabledDraw === undefined ? true : props.enabledDraw, // 是否可以绘制
      count: props.defaultCount || 100, // 数据测试生成的条数
      hasEdit: false, // 数据维护中的是否编辑
      hasTable: false, // 数据维护中的是否显示表格
      enabledEdit: true,
      enabledPopup: true,
      enabledTooltip: false,
      enabledRightMenu: false,
      enabledShowHide: true,
      enabledOpacity: true,
      opacity: 1,
      currentPage: 5, // 分页查询每页条数
      graphicDataList: [], // 表格数据
      rowKeys: [], // 默认选中的表格数据key
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "caozuo",
          key: "caozuo",
          width: 60,
          align: "center",
          render: (comp: string, record: any) => {
            return (
              <>
                <Space>
                  <MarsIcon
                    style={{ cursor: "pointer" }}
                    icon="editor"
                    color="#f2f2f2"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.startEditGraphic(record)
                    }}
                  />
                  <MarsIcon
                    style={{ cursor: "pointer" }}
                    icon="delete"
                    color="#f2f2f2"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.deleteGraphic(record)
                    }}
                  />
                </Space>
              </>
            )
          }
        }
      ] // 表头
    }
  }

  componentDidMount(): void {
    setTimeout(() => {
      // 恢复默认状态
      if (mapWork.eventTarget) {
        mapWork.eventTarget.on("defuatData", (item: any) => {
          this.setState({
            opacity: 1.0,
            enabledShowHide: item.enabledShowHide,
            enabledPopup: item.enabledPopup,
            enabledTooltip: item.enabledTooltip,
            enabledRightMenu: item.enabledRightMenu
          })
        })
      }

      const layer = getManagerLayer()
      if (layer) {
        this.setState({
          enabledShowHide: layer.show,
          enabledPopup: layer.hasPopup(),
          enabledTooltip: layer.hasTooltip(),
          enabledRightMenu: layer.hasContextMenu()
        })
        const graphics = layer.getGraphics()
        if (graphics.length > 0) {
          this.setState({
            enabledOpacity: graphics[0].hasOpacity,
            enabledEdit: graphics[0].hasEdit
          })
        }
        this.setState({
          hasTable: graphics.length > 0
        })
      }

      const that = this
      // 矢量数据创建完成
      mapWork.graphicLayer.on(mars3d.EventType.drawCreated, (e) => {
        if (that.state.hasEdit) {
          this.showEditor(e.graphic)
        }
      })
      // 修改了矢量数据
      mapWork.graphicLayer.on(
        [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
        (e) => {
          this.showEditor(e.graphic)
        }
      )
      // 停止编辑
      mapWork.graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], (e) => {
        setTimeout(() => {
          if (!mapWork.graphicLayer.isEditing) {
            if (this.props.customEditor) {
              this.props.onStopEditor()
            } else {
              disable("GraphicEditor")
            }
          }
        }, 100)
      })

      // 添加表格数据

      const graphicLayer = getManagerLayer()
      this.initGraphicableData(graphicLayer)

      graphicLayer.on(mars3d.EventType.addGraphic, (event: any) => {
        const item = event.graphic
        if (item.isPrivate) {
          return
        }

        graphicDataList.push({
          key: item.id,
          name: getGraphicName(item)
        })
        rowKeys.push(item.id)

        this.setState({
          graphicDataList: [...graphicDataList],
          rowKeys: [...rowKeys]
        })
      })

      graphicLayer.on(mars3d.EventType.removeGraphic, (event) => {
        const graphicId = event.graphic.id
        const idx = graphicDataList.findIndex((item) => item.key === graphicId)
        graphicDataList.splice(idx, 1)

        this.setState({
          graphicDataList: [...graphicDataList],
          rowKeys: [...rowKeys]
        })
      })
    }, 500)
  }

  initGraphicableData(graphicLayer) {
    const list = graphicLayer.graphics

    list.forEach((item) => {
      if (item.isPrivate) {
        return
      }

      graphicDataList.push({
        key: item.id,
        name: getGraphicName(item)
      })
      rowKeys.push(item.id)
    })

    this.setState({
      graphicDataList: [...graphicDataList],
      rowKeys: [...rowKeys]
    })
  }

  // 展示属性面板
  showEditor(graphic: any) {
    if (this.props.customEditor === graphic.type) {
      disable("GraphicEditor") // 关闭属性面板
      this.props.onStartEditor({
        graphicId: graphic.id,
        graphicName: getGraphicName(graphic)
      })
      return
    }
    if (this.props.onStopEditor) {
      this.props?.onStopEditor() // 关闭参数调节面板
    }

    if (!graphic._conventStyleJson) {
      graphic.options.style = graphic.toJSON().style // 因为示例中的样式可能有复杂对象，需要转为单个json简单对象
      graphic._conventStyleJson = true // 只处理一次
    }

    if (!isActive("GraphicEditor") || lastGraphic !== graphic) {
      activate({
        name: "GraphicEditor",
        data: {
          graphic: graphic
        }
      })
      lastGraphic = graphic
    } else {
      updateWidget("GraphicEditor", {
        graphic: graphic
      })
    }
  }

  //  ***************************** 图层状态 ***********************  //
  onChangeShow(checked: boolean) {
    const layer = getManagerLayer()
    layer.show = checked

    this.setState({
      enabledShowHide: checked
    })
  }

  onClickFlyTo() {
    const layer = getManagerLayer()
    layer.flyTo()
  }

  // 调整透明度
  onOpacityChange(num: number) {
    mapWork.graphicLayer.opacity = num

    this.setState({
      opacity: num
    })
  }

  //  ***************************** 图层交互 ***********************  //
  onChangePopup(checked: boolean) {
    const layer = getManagerLayer()
    if (checked) {
      if (mapWork.bindLayerPopup) {
        mapWork.bindLayerPopup()
      } else {
        bindLayerPopup()
      }
    } else {
      layer.unbindPopup()
    }

    this.setState({
      enabledPopup: checked
    })
  }

  onChangeTooltip(checked: boolean) {
    const layer = getManagerLayer()
    if (checked) {
      // layer.bindTooltip("我是layer上绑定的Tooltip")
      layer.bindTooltip(
        function (event) {
          const attr = getAttrForEvent(event)
          attr["类型"] = event.graphic?.type
          attr["来源"] = "我是layer上绑定的Toolip"
          attr["备注"] = "我支持鼠标移入交互"

          return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
        },
        { pointerEvents: true }
      )
    } else {
      layer.unbindTooltip()
    }

    this.setState({
      enabledTooltip: checked
    })
  }

  onChangeRightMenu = (checked: boolean) => {
    const layer = getManagerLayer()
    if (checked) {
      if (mapWork.bindLayerContextMenu) {
        mapWork.bindLayerContextMenu()
      } else {
        bindLayerContextMenu()
      }
    } else {
      layer.unbindContextMenu(true)
    }

    this.setState({
      enabledRightMenu: checked
    })
  }

  //  ***************************** 数据维护 ***********************  //
  // drawLabel1
  onClickStartDraw() {
    mapWork.startDrawGraphic()
  }

  // drawLabel2
  onClickStartDraw2() {
    mapWork.startDrawGraphic2()
  }

  // 是否编辑
  onChangeHasEdit(checked: boolean) {
    mapWork.graphicLayer.hasEdit = checked

    this.setState({
      hasEdit: checked
    })

    // 编辑时，为了方便操作自动关闭Popup，真实项目中请按需修改
    this.onChangePopup(!checked)
  }

  //  ***************************** 数据测试 ***********************  //
  // 生成大数据
  addRandomGraphicByCount() {
    $showLoading()
    const startTime = new Date().getTime()

    const result = mapWork.addRandomGraphicByCount(this.state.count)

    $hideLoading()
    const endTime = new Date().getTime()
    const usedTime = (endTime - startTime) / 1000 // 两个时间戳相差的毫秒数
    $message(`生成${result || this.state.count}条数据，共耗时${usedTime.toFixed(2)}秒`)

    const layer = getManagerLayer()
    this.initGraphicableData(layer)
    layer.flyTo({ duration: 0, heading: 0, pitch: -40, scale: 1.2 })
  }

  //  清除数据
  onClickClear() {
    mapWork.graphicLayer.enabledEvent = false // 关闭事件，大数据removeGraphic时效率低
    mapWork.graphicLayer.clear()
    mapWork.graphicLayer.enabledEvent = true

    graphicDataList.length = 0
    rowKeys.length = 0

    this.setState({
      graphicDataList: [],
      rowKeys: []
    })

    if (this.props.customEditor) {
      this.props.onStopEditor()
    } else {
      disable("GraphicEditor")
    }
  }

  //  ***************************** 数据导出 ***********************  //
  // 保存GeoJSON
  expGeoJSONFile() {
    const graphicLayer = mapWork.graphicLayer

    if (graphicLayer.length === 0) {
      $message("当前没有标注任何数据，无需保存！")
      return
    }
    const geojson = graphicLayer.toGeoJSON()
    mars3d.Util.downloadFile("矢量数据GeoJSON.json", JSON.stringify(geojson))
  }

  // 保存 json
  expJSONFile() {
    const graphicLayer = mapWork.graphicLayer

    if (graphicLayer.length === 0) {
      $message("当前没有标注任何数据，无需保存！")
      return
    }
    const geojson = graphicLayer.toJSON()
    mars3d.Util.downloadFile("矢量数据构造参数.json", JSON.stringify(geojson))
  }

  // 打开geojson
  onClickImpFile(info: any) {
    // 上传文件
    const graphicLayer = mapWork.graphicLayer

    const item = info.file
    const fileName = item.name
    const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

    if (fileType === "json" || fileType === "geojson") {
      const reader = new FileReader()
      reader.readAsText(item, "UTF-8")
      reader.onloadend = function (e) {
        const geojson = JSON.parse(String(this.result))

        if (geojson.type === "graphic" && geojson.data) {
          graphicLayer.addGraphic(geojson.data)
          graphicLayer.flyTo()
        } else {
          graphicLayer.loadGeoJSON(geojson, { flyTo: true })
        }
      }
    } else if (fileType === "kml") {
      const reader = new FileReader()
      reader.readAsText(item, "UTF-8")
      reader.onloadend = function (e) {
        const strkml = this.result

        mapWork.kgUtil.toGeoJSON(strkml).then((geojson) => {
          console.log("kml2geojson转换结果为", geojson)
          graphicLayer.loadGeoJSON(geojson, {
            flyTo: true
          })
        })
      }
    } else if (fileType === "kmz") {
      // 加载input文件控件的二进制流

      mapWork.kgUtil.toGeoJSON(item).then((geojson) => {
        console.log("kmz2geojson", geojson)

        graphicLayer.loadGeoJSON(geojson, {
          flyTo: true
        })
      })
    } else {
      $message("暂不支持 " + fileType + " 文件类型的数据！")
    }
  }

  // 表格行: 开始编辑graphic
  startEditGraphic(record: GraphicTableItem) {
    const graphicLayer = getManagerLayer()
    const graphic = graphicLayer.getGraphicById(record.key)
    this.showEditor(graphic) // 修改style
  }

  // 表格行: 删除graphic
  deleteGraphic(record: GraphicTableItem) {
    const graphicLayer = getManagerLayer()
    const graphic = graphicLayer.getGraphicById(record.key)
    graphic && graphic.remove(true)
  }

  render() {
    return (
      <>
        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">图层状态:</span>
            <MarsCheckbox checked={this.state.enabledShowHide} onChange={(e) => this.onChangeShow(e.target.checked)}>
              显示
            </MarsCheckbox>
            <span style={{ display: this.state.enabledOpacity ? "inline-block" : "none" }}>透明度:</span>
            <MarsSlider
              {...{ defaultValue: this.state.opacity, min: 0.0, max: 1.0, step: 0.1 }}
              onChange={(data) => this.onOpacityChange(data)}
              style={{ width: "80px", display: this.state.enabledOpacity ? "inline-block" : "none" }}
            ></MarsSlider>

            <MarsButton size="small" shape="round" title="视角定位" onClick={() => this.onClickFlyTo()}>
              <MarsIcon icon="aiming" />
              定位
            </MarsButton>
          </Space>
        </div>

        <div
          className={classNames({
            "f-mb": true,
            "f-dn": !this.state.interaction
          })}
        >
          <Space>
            <span className="mars-pannel-item-label">图层交互:</span>
            <MarsCheckbox checked={this.state.enabledPopup} onChange={(e) => this.onChangePopup(e.target.checked)}>
              单击Popup
            </MarsCheckbox>
            <MarsCheckbox checked={this.state.enabledTooltip} onChange={(e) => this.onChangeTooltip(e.target.checked)}>
              移入Tooltip
            </MarsCheckbox>
            <MarsCheckbox checked={this.state.enabledRightMenu} onChange={(e) => this.onChangeRightMenu(e.target.checked)}>
              右键菜单
            </MarsCheckbox>
          </Space>
        </div>

        <div
          className={classNames({
            "f-mb": true,
            "f-dn": !this.state.enabledDraw
          })}
        >
          <Space>
            <span className="mars-pannel-item-label">数据维护:</span>
            <MarsButton onClick={() => this.onClickStartDraw()}>{this.state.drawLabel1}</MarsButton>
            <MarsButton onClick={() => this.onClickStartDraw2()} style={{ display: this.state.drawLabel2 ? "block" : "none" }}>
              {this.state.drawLabel2}
            </MarsButton>
            <span
              className={classNames({
                "f-dn": !this.state.interaction && this.state.enabledEdit
              })}
            >
              {this.state.interaction && this.state.enabledEdit ? (
                <MarsCheckbox checked={this.state.hasEdit} onChange={(e) => this.onChangeHasEdit(e.target.checked)}>
                  是否编辑
                </MarsCheckbox>
              ) : (
                ""
              )}
            </span>

            <MarsCheckbox checked={this.state.hasTable} onChange={(e) => this.setState({ hasTable: e.target.checked })}>
              显示列表
            </MarsCheckbox>
          </Space>
        </div>

        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">数据测试:</span>
            <MarsInputNumber
              defaultValue={this.state.count}
              {...{ min: 1, max: 1000000, step: 1 }}
              onChange={(data: number) => {
                this.setState({
                  count: data
                })
              }}
              style={{ width: "152px" }}
            ></MarsInputNumber>
            条<MarsButton onClick={() => this.addRandomGraphicByCount()}>生成</MarsButton>
            <MarsButton onClick={() => this.onClickClear()}>
              <MarsIcon icon="delete" />
              清除
            </MarsButton>
          </Space>
        </div>

        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">数据导出:</span>

            <Upload
              {...{
                name: "file",
                accept: "json,geojson", // 接受文件类型
                multiple: false, // 不支持多选
                showUploadList: false,
                beforeUpload() {
                  return false
                },
                onChange: (info: any) => this.onClickImpFile(info)
              }}
            >
              <MarsButton title={"打开GeoJSON"}>
                <MarsIcon icon="folder-open" />
                打开
              </MarsButton>
            </Upload>

            <MarsButton onClick={() => this.expGeoJSONFile()} title={"保存GeoJSON"}>
              <MarsIcon icon="save-one" />
              导出GeoJSON
            </MarsButton>

            <MarsButton onClick={() => this.expJSONFile()} title={"导出构造参数Json"}>
              导出构造JSON
            </MarsButton>
          </Space>
        </div>

        <div className="f-mb t-tac" style={{ width: "400px" }}>
          {this.state.hasTable ? (
            <MarsTable
              bordered
              pagination={{ pageSize: this.state.currentPage }}
              dataSource={this.state.graphicDataList}
              columns={this.state.columns}
              scroll={{ y: 400 }}
              onChange={(pagination) => {
                this.setState({
                  currentPage: pagination.pageSize
                })
              }}
              rowSelection={{
                hideSelectAll: true,
                selectedRowKeys: this.state.rowKeys,
                onChange: (selectedRowKeys: string[]) => {
                  // 使得点击之后选项改变
                  this.setState({
                    rowKeys: selectedRowKeys
                  })
                },
                onSelect: (record: GraphicTableItem, selected: boolean) => {
                  const graphicLayer = getManagerLayer()
                  const graphic = graphicLayer.getGraphicById(record.key)
                  if (graphic) {
                    graphic.show = selected
                  }
                }
              }}
              onRow={(record: GraphicTableItem) => {
                return {
                  onClick: () => {
                    const graphicLayer = getManagerLayer()
                    const graphic = graphicLayer.getGraphicById(record.key)
                    graphic.flyTo()
                  }
                }
              }}
            ></MarsTable>
          ) : null}
        </div>
      </>
    )
  }
}
