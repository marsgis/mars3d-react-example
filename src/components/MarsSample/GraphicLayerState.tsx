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
  $hideLoading,
  MarsFormItem,
  MarsForm
} from "@mars/components/MarsUI"
import { Space, Upload } from "antd"
import { Component } from "react"
import { activate, disable, updateWidget, isActive } from "@mars/widgets/common/store/widget"

const mapWork = window.mapWork
const mars3d = mapWork.mars3d

interface GraphicTableItem {
  key: number
  name: string
}

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

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })

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
function getGraphicName(graphic) {
  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`
  }
  if (graphic.attr.index) {
    return `${graphic.type} - ${graphic.attr.index}`
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`
  }
  if (graphic?.style?.label?.text && graphic.style.label.text !== "0") {
    return `${graphic.type} - ${graphic.style.label.text}`
  }

  return `${graphic.type} - ${graphic.name || "未命名"}`
}

export class GraphicLayerState extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      drawLabel1: props.drawLabel1 || "标绘",
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
      enabledCluster: true,
      isDrawing: false,
      isCluster: false,
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
    if (props.getChildThis) {
      props.getChildThis(this)
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
            enabledEdit: graphics[0].hasEdit,
            enabledCluster: graphics[0].hasCluster
          })
        }
        // 当加载矢量只有一条时，自动打开编辑面板
        if (graphics.length === 1) {
          this.startEditGraphic({ key: graphics[0].id, name: graphics[0].name })
        }

        this.setState({
          hasTable: graphics.length > 0
        })

        const that = this
        layer.on([mars3d.EventType.drawCreated, mars3d.EventType.addGraphic, mars3d.EventType.removeGraphic], function (e) {
          that.setState({ isDrawing: layer.isDrawing })
        })

        // 触发属性编辑面板
        const editUpdateFun = mars3d.Util.funDebounce(that.openGraphicOptionsWidget, 500)
        layer.on([mars3d.EventType.click, mars3d.EventType.drawCreated, mars3d.EventType.editStart, mars3d.EventType.editStyle], editUpdateFun, that)
        const removeFun = mars3d.Util.funDebounce(that.closeGraphicOptionsWidget, 500)
        layer.on(mars3d.EventType.removeGraphic, removeFun, that)

        // 表格相关操作 - 添加、删除
        this.initGraphicableData(layer)

        layer.on(mars3d.EventType.drawCreated, (event: any) => {
          const item = event.graphic
          if (item.isPrivate) {
            return
          }

          const listArr = that.state.graphicDataList
          listArr.push({ key: item.id, name: getGraphicName(item) })

          const listRowKey = that.state.rowKeys
          listRowKey.push(item.id)

          that.setState({ graphicDataList: [...listArr], rowKeys: [...listRowKey] })
        })

        layer.on(mars3d.EventType.removeGraphic, (event) => {
          const graphicId = event.graphic.id

          const listArr = that.state.graphicDataList

          const idx = listArr.findIndex((item) => item.key === graphicId)
          listArr.splice(idx, 1)

          that.setState({ graphicDataList: [...listArr] })
        })
      }
    }, 500)
  }

  initGraphicableData(graphicLayer) {
    const listArr = []
    const listRowKey = []

    let graphic
    graphicLayer.graphics.forEach((item) => {
      if (item.isPrivate) {
        return
      }

      listArr.push({
        key: item.id,
        name: getGraphicName(item)
      })
      listRowKey.push(item.id)

      graphic = item
    })
    this.setState({
      graphicDataList: [...listArr],
      rowKeys: [...listRowKey]
    })

    if (graphic) {
      this.setState({
        enabledOpacity: graphic.hasOpacity,
        enabledEdit: graphic.hasEdit,
        enabledCluster: graphic.hasCluster
      })
    }
  }

  // 展示属性面板
  openGraphicOptionsWidget(event: any) {
    const graphic = event.graphic
    // || !this.state.hasEdit -- 加上后只有选中 是否编辑 才弹出属性面板
    if (graphic.isDrawing) {
      return
    }
    const graphicLayer = getManagerLayer()

    if (graphic.isDestroy || graphic.isPrivate) {
      return
    }

    if (this.props?.customEditor === graphic.type) {
      this.closeGraphicOptionsWidget() // 关闭属性面板
      this.props.onStartEditor({ graphicId: graphic.id, graphicName: getGraphicName(graphic) })
      return
    }
    if (this.props?.onStopEditor) {
      this.props.onStopEditor() // 关闭参数调节面板
    }

    const data = { layerId: graphicLayer.id, graphicId: graphic.id }
    if (isActive("graphic-options")) {
      updateWidget("graphic-options", data)
    } else {
      activate({ name: "graphic-options", data: data })
    }
  }

  closeGraphicOptionsWidget() {
    if (this.props?.onStopEditor) {
      this.props.onStopEditor() // 关闭参数调节面板
    } else {
      disable("graphic-options")
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

          return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
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

  onChangClustering = (checked: boolean) => {
    const layer = getManagerLayer()
    layer.clusterEnabled = checked

    this.setState({ isCluster: checked })
  }

  //  ***************************** 数据维护 ***********************  //
  // drawLabel1
  onClickStartDraw() {
    mapWork.startDrawGraphic()

    const layer = getManagerLayer()
    this.setState({ isDrawing: layer.isDrawing })
  }

  // drawLabel2
  onClickStartDraw2() {
    mapWork.startDrawGraphic2()

    const layer = getManagerLayer()
    this.setState({ isDrawing: layer.isDrawing })
  }

  onClickClearDrawing() {
    const layer = getManagerLayer()
    layer.clearDrawing()
    this.setState({ isDrawing: layer.isDrawing })
  }

  // 是否编辑
  onChangeHasEdit(checked: boolean) {
    mapWork.graphicLayer.isAutoEditing = checked

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

    this.setState({ graphicDataList: [], rowKeys: [], isDrawing: false })

    this.closeGraphicOptionsWidget() // 关闭属性面板
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
      const that = this
      reader.onloadend = function (e) {
        const geojson = JSON.parse(String(this.result))

        if (geojson.type === "graphic" && geojson.data) {
          graphicLayer.addGraphic(geojson.data)
          graphicLayer.flyTo()
        } else {
          graphicLayer.loadGeoJSON(geojson, { flyTo: true })
        }
        // 导入文件时表格展示导入的数据
        that?.initGraphicableData(graphicLayer)
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

    this.openGraphicOptionsWidget({ graphic }) // 修改style
  }

  // 表格行: 删除graphic
  deleteGraphic(record: GraphicTableItem) {
    const graphicLayer = getManagerLayer()
    const graphic = graphicLayer.getGraphicById(record.key)
    graphic && graphic.remove(true)
  }

  render() {
    return (
      <MarsForm labelCol={{ span: 4 }}>
        <MarsFormItem label="图层状态">
          <Space>
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
        </MarsFormItem>

        {this.state.interaction && (
          <MarsFormItem label="数据维护">
            <Space wrap>
              <MarsCheckbox checked={this.state.enabledPopup} onChange={(e) => this.onChangePopup(e.target.checked)}>
                单击Popup
              </MarsCheckbox>
              <MarsCheckbox checked={this.state.enabledTooltip} onChange={(e) => this.onChangeTooltip(e.target.checked)}>
                移入Tooltip
              </MarsCheckbox>
              <MarsCheckbox checked={this.state.enabledRightMenu} onChange={(e) => this.onChangeRightMenu(e.target.checked)}>
                右键菜单
              </MarsCheckbox>
              {this.state.enabledCluster && (
                <MarsCheckbox checked={this.state.isCluster} onChange={(e) => this.onChangClustering(e.target.checked)}>
                  是否聚合
                </MarsCheckbox>
              )}
            </Space>
          </MarsFormItem>
        )}

        <MarsFormItem label={this.state.enabledDraw ? "数据维护" : null}>
          <Space wrap>
            {this.state.enabledDraw && (
              <>
                <MarsButton onClick={() => this.onClickStartDraw()} style={{ display: !this.state.isDrawing ? "block" : "none" }}>
                  {this.state.drawLabel1}
                </MarsButton>
                <MarsButton
                  onClick={() => this.onClickStartDraw2()}
                  style={{ display: this.state.drawLabel2 && !this.state.isDrawing ? "block" : "none" }}
                >
                  {this.state.drawLabel2}
                </MarsButton>
                <MarsButton onClick={() => this.onClickClearDrawing()} style={{ display: this.state.isDrawing ? "block" : "none" }}>
                  取消绘制
                </MarsButton>
              </>
            )}

            {this.state.interaction && this.state.enabledEdit ? (
              <MarsCheckbox checked={this.state.hasEdit} onChange={(e) => this.onChangeHasEdit(e.target.checked)}>
                是否编辑
              </MarsCheckbox>
            ) : (
              ""
            )}

            {(this.props.enabledTable ?? true) && (
              <MarsCheckbox checked={this.state.hasTable} onChange={(e) => this.setState({ hasTable: e.target.checked })}>
                显示列表
              </MarsCheckbox>
            )}
          </Space>
        </MarsFormItem>

        {mapWork.addRandomGraphicByCount && (
          <MarsFormItem label="数据测试">
            <Space>
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
          </MarsFormItem>
        )}

        <MarsFormItem label="数据导出">
          <Space>
            <MarsButton onClick={() => this.expJSONFile()} title={"导出图层数据为JSON文件"}>
              导出数据
            </MarsButton>
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
              <MarsButton title={"打开历史导出的JSON文件图层数据"}>
                <MarsIcon icon="folder-open" />
                导入数据
              </MarsButton>
            </Upload>
            {!mapWork.addRandomGraphicByCount && (
              <MarsButton danger onClick={() => this.onClickClear()}>
                清除
              </MarsButton>
            )}

            {/* <MarsButton onClick={() => this.expGeoJSONFile()} title={"保存GeoJSON"}>
              <MarsIcon icon="save-one" />
              导出GeoJSON
            </MarsButton> */}
          </Space>
        </MarsFormItem>

        <MarsFormItem style={{ width: "450px" }}>
          {this.state.hasTable && (this.props.enabledTable ?? true) ? (
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
        </MarsFormItem>
      </MarsForm>
    )
  }
}
