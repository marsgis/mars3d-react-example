import { MarsButton, MarsTable, MarsIcon, MarsCheckbox, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import { Component } from "react"

const mapWork = window.mapWork
const mars3d = mapWork.mars3d

const list = [] // 用于浅拷贝
let layer = null // 用于参数属性
let map = null
let options: GuiItem[]

// 表格相关
interface LayerTableItem {
  key: number
  name: string
  isTile: boolean
}

export class TileLayerState extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      hasAddTileLayer: true,
      showTable: true,
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          align: "center"
        },
        {
          title: "编辑",
          dataIndex: "edit",
          key: "edit",
          align: "center",
          render: (comp: string, record: any) => {
            return (
              <>
                <Space>
                  <MarsIcon
                    style={{ cursor: "pointer" }}
                    icon="aiming"
                    color="#f2f2f2"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.flyToLayer(record)
                    }}
                  />
                  <MarsIcon
                    style={{ cursor: "pointer" }}
                    icon="delete"
                    color="#f2f2f2"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.deleteLayer(record)
                    }}
                  />
                </Space>
              </>
            )
          }
        }
      ],
      tileLayerList: [],
      rowKeys: [],
      thisLayer: {}, // 选中的图层
      layerName: "",
      layerShow: true
    }
  }

  componentDidMount(): void {
    const that = this
    // 编辑图层面板的参数
    options = [
      {
        type: "slider",
        field: "opacity",
        label: "透明度",
        step: 0.01,
        min: 0,
        max: 1,
        value: 1.0,
        extra: "{opacity}",
        extraWidth: 40,
        change(data) {
          that.setLayerOptions("opacity", data)
        }
      },
      {
        type: "slider",
        field: "brightness",
        label: "亮度",
        step: 0.01,
        min: 0,
        max: 3,
        value: 1.0,
        extra: "{brightness}",
        extraWidth: 40,
        change(data) {
          that.setLayerOptions("brightness", data)
        }
      },
      {
        type: "slider",
        field: "contrast",
        label: "对比度",
        step: 0.01,
        min: 0,
        max: 3,
        value: 1.16,
        extra: "{contrast}",
        extraWidth: 40,
        change(data) {
          that.setLayerOptions("contrast", data)
        }
      },
      {
        type: "slider",
        field: "hue",
        label: "色彩",
        step: 0.01,
        min: 0,
        max: 3,
        value: 0.1,
        extra: "{hue}",
        extraWidth: 40,
        change(data) {
          that.setLayerOptions("hue", data)
        }
      },
      {
        type: "slider",
        field: "saturation",
        label: "饱和度",
        step: 0.01,
        min: 0,
        max: 3,
        value: 1.0,
        extra: "{saturation}",
        extraWidth: 40,
        change(data) {
          that.setLayerOptions("saturation", data)
        }
      },
      {
        type: "slider",
        field: "gamma",
        label: "伽马值",
        step: 0.01,
        min: 0,
        max: 3,
        value: 0.53,
        extra: "{gamma}",
        extraWidth: 40,
        change(data) {
          that.setLayerOptions("gamma", data)
        }
      }
    ]

    setTimeout(() => {
      map = mapWork.map
      this.setState({ hasAddTileLayer: Boolean(mapWork.addTileLayer) })

      const layers = map.getLayers()
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i]
 
        if (layer.isPrivate || layer.name === "POI查询") {
          continue
        }

        list.push({
          key: layer.id,
          name: `${layer.type} - ${layer.name || "未命名"}`,
          isTile: layer.isTile
        })
      }

      console.log("当前图层列表为", list)

      // 实现默认全部选中
      this.setState({
        tileLayerList: [...list],
        rowKeys: [...list.map((item) => item.key)]
      })

      this.selectedFirst()
      // 添加新的图层，数组中也添加数据
      map.on(mars3d.EventType.addLayer, (event) => {
        const layer = event.layer

        list.push({
          key: layer.id,
          name: `${layer.type} - ${layer.name || "未命名"}`,
          isTile: layer.isTile
        })

        this.setState({
          tileLayerList: [...list],
          rowKeys: [...list.map((item) => item.key)]
        })

        this.selectedFirst()
      })

      // 删除图层
      map.on(mars3d.EventType.removeLayer, (event) => {
        const layerId = event.layer.id

        const idx = this.state.tileLayerList.findIndex((item) => item.key === layerId)

        list.splice(idx, 1)
        this.setState({
          tileLayerList: [...list],
          rowKeys: [...list.map((item) => item.key)]
        })

        if (this.state.thisLayer?.id === layerId) {
          this.setState({
            thisLayer: null,
            layerName: ""
          })
        }
      })
    }, 100)
  }

  setLayerOptions = (attribute: string, val: number) => {
    if (this.state.thisLayer) {
      layer[attribute] = val
      this.setState({
        thisLayer: { ...layer }
      })
    }
  }

  selectedFirst = () => {
    setTimeout(() => {
      // 选中第一个
      if (this.state.tileLayerList.length === 1) {
        this.startEditingLayer(this.state.tileLayerList[0])
      }
    }, 50)
  }

  // 表格行：点击定位图层
  flyToLayer = (record: LayerTableItem) => {
    const layer = map.getLayerById(record.key)
    if (layer) {
      layer.flyTo()
    }
  }

  // 表格行：点击删除图层
  deleteLayer = (record: LayerTableItem) => {
    const layer = map.getLayerById(record.key)
    if (layer) {
      layer.remove(true)
      this.setState({
        layerName: "" // 隐藏编辑面板
      })
    }
  }

  // 点击显示编辑图层面板,将获取的面板数据放在新出现的面板上
  startEditingLayer = (record: LayerTableItem) => {
    if (!record.isTile) {
      return
    }

    layer = map.getLayerById(record.key)
    const show = layer?.show
    console.log("startEditingLayer", layer, record.name)

    this.setState({
      layerName: record.name, // 获取到的对应图层的信息
      layerShow: show,
      thisLayer: { ...layer }
    })
  }

  render() {
    return (
      <>
        <div className="f-push-10-b">
          <Space>
            {this.state.hasAddTileLayer ? (
              <>
                <MarsButton onClick={() => mapWork.addTileLayer()} title={"添加图层"}>
                  添加图层
                </MarsButton>
                <MarsButton
                  onClick={() => {
                    mapWork.removeTileLayer()
                    this.setState({
                      layerName: null
                    })
                  }}
                  title={"移除图层"}
                >
                  移除图层
                </MarsButton>
              </>
            ) : null}
            <MarsCheckbox checked={this.state.showTable} onChange={(e) => this.setState({ showTable: e.target.checked })}>
              显示列表
            </MarsCheckbox>
          </Space>
        </div>

        {this.state.showTable ? (
          <MarsTable
            bordered
            pagination={false}
            dataSource={this.state.tileLayerList}
            columns={this.state.columns}
            rowSelection={{
              hideSelectAll: true,
              selectedRowKeys: this.state.rowKeys,
              onChange: (selectedRowKeys: string[]) => {
                // 使得点击之后选项改变
                this.setState({
                  rowKeys: selectedRowKeys
                })
              },
              onSelect: (record, selected) => {
                const layer = map.getLayerById(record.key)
                layer.show = selected // 图层显示
              }
            }}
            onRow={(record: any) => {
              return {
                onClick: (e) => {
                  console.log("aa")

                  e.stopPropagation()
                  console.log("gg")
                  this.startEditingLayer(record)
                }
              }
            }}
          ></MarsTable>
        ) : null}

        {this.state.showTable && this.state.layerName ? (
          // 编辑图层的面板
          <div className="property-content">
            <h2 className="f-mb f-mt f-tac" style={{ color: "white", fontSize: "14px" }}>
              {this.state.layerName}
            </h2>

            <div className="bottomBox">
              <div className="f-mb">
                <Space>
                  <span className="mars-pannel-item-label">状态:</span>
                  <MarsCheckbox
                    checked={this.state.layerShow}
                    onChange={(e) => {
                      this.setState({ layerShow: e.target.checked })
                      if (this.state.thisLayer) {
                        layer.show = e.target.checked
                      }
                    }}
                  >
                    显示
                  </MarsCheckbox>
                </Space>
              </div>

              <div className="f-mb">
                <MarsGui
                  options={options}
                  formProps={{
                    labelCol: { span: 4 }
                  }}
                ></MarsGui>
              </div>
            </div>
          </div>
        ) : null}
      </>
    )
  }
}
