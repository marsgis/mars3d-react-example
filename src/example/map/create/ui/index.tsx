import { Component } from "react"
import * as mapWork from "./map.js"
import axios from "axios"
import { Space, Row, Col } from "antd"
import {
  MarsInput,
  MarsInputNumber,
  MarsSelect,
  MarsOption,
  MarsCheckbox,
  MarsCollapse,
  MarsCollapsePanel,
  MarsForm,
  MarsFormItem,
  MarsRadioGroup,
  MarsRadio,
  MarsSlider,
  MarsSwitch,
  MarsButton,
  MarsDatePicker,
  MarsPannel,
  MarsInputGroup,
  MarsColor,
  MarsIcon,
  $message,
  $alert,
  $notify,
  $showLoading,
  $hideLoading,
  MarsTable,
  MarsTree
} from "@mars/components/MarsUI"

class UIComponent extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      inputValue: 5,
      extent: "",
      color: "#ffff00",
      typhoonList: [],
      treeData: [],
      expandedKeys: [],
      checkedKeys: [],
      columns: [
        {
          title: "台风编号",
          dataIndex: "typnumber",
          key: "typnumber"
        },
        {
          title: "台风名(中文)",
          dataIndex: "name_cn",
          key: "name_cn"
        },
        {
          title: "台风名(英文)",
          dataIndex: "name_en",
          key: "name_en"
        }
      ],
      rowSelection: {
        onSelect: (selectedRow: any, isSelected: boolean) => {
          if (isSelected) {
            $message("勾选了行:" + selectedRow.name_cn)
          } else {
            $message("取消了勾选行:" + selectedRow.name_cn)
          }
        }
      }
    }
    mapWork.eventTarget.on("init", ({ value }) => {
      this.setInputValue(value)
    })

    mapWork.eventTarget.on("drawExtent", (event: any) => {
      this.setState({
        extent: event.extent
      })
    })
  }

  hidePannel() {
    this.setState(() => ({
      visible: false
    }))
  }

  setInputValue(value) {
    this.setState(() => ({
      inputValue: value
    }))
  }

  private layersObj = {}
  private expandedKeys = []
  private checkedKeys = []
  componentDidMount(): void {
    // 访问后端接口，取台风列表数据
    const url = "//data.mars3d.cn/file/apidemo/typhoon/list_2020.json"
    axios.get(url).then((res: any) => {
      const data = res.data
      this.setState({
        typhoonList: data.typhoonList.map((item: any) => ({
          id: item[0],
          key: item[0],
          name_en: item[1],
          name_cn: item[2],
          typnumber: item[3],
          state: item[7]
        }))
      })
    })

    // 取图层列表数据
    const layerUrl = "/config/tileset.json"
    axios.get(layerUrl).then((res: any) => {
      const data = res.data
      const layers = data.layers

      const treeData = []
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = mapWork.createLayer(layers[i]) // 创建图层
        if (layer && layer.pid === 20) {
          const node: any = {
            title: layer.name,
            key: layer.id,
            id: layer.id,
            pId: layer.pid 
          }
          node.children = this.findChild(node, layers)
          treeData.push(node)
          this.expandedKeys.push(node.key)
        }
      }

      this.setState({
        expandedKeys: this.expandedKeys,
        checkedKeys: this.checkedKeys,
        treeData
      })
    })
  }

  findChild(parent: any, list: any[]) {
    return list
      .filter((item: any) => item.pid === parent.id)
      .map((item: any) => {
        const node: any = {
          title: item.name,
          key: item.id,
          id: item.id,
          pId: item.pid 
        }
        const nodeLayer = mapWork.createLayer(item) // 创建图层
        this.layersObj[item.id] = nodeLayer
        node.children = this.findChild(node, list)
        this.expandedKeys.push(node.key)
        if (item.isAdded && item.show) {
          this.checkedKeys.push(node.key)
        }
        return node
      })
  }

  onCheckTreeItem(keys: string[]) {
    this.setState({
      checkedKeys: keys
    })
    Object.keys(this.layersObj).forEach((k) => {
      const newKeys = keys.map((item) => {
        return String(item)
      })
      const show = newKeys.indexOf(k) !== -1
      const layer = this.layersObj[k]
      layer.show = show
      if (show) {
        if (!layer.isAdded) {
          window.mapWork.map.addLayer(layer)
        }
        layer.flyTo()
      } else {
        if (layer.isAdded) {
          window.mapWork.map.removeLayer(layer)
        }
      }
    })
  }

  render() {
    return (
      <MarsPannel visible={this.state.visible} right="10" top="10" bottom="60" width="400" onClose={() => this.hidePannel()}>
        <MarsCollapse defaultActiveKey={["1", "2", "3"]} expandIconPosition="start">
          <MarsCollapsePanel key="1" header="表单控件">
            <MarsForm labelCol={{ span: 5 }}>
              <MarsFormItem label="简单文本">
                <MarsInput
                  value={this.state.inputValue}
                  onChange={(e) =>
                    this.setState({
                      inputValue: e.target.value
                    })
                  }
                ></MarsInput>
              </MarsFormItem>
              <MarsFormItem label="地图交互">
                <Row gutter={5}>
                  <Col span={19}>
                    <MarsInput
                      value={this.state.extent}
                      allowClear
                      onChange={(e) => {
                        this.setState({
                          extent: e.target.value
                        })
                      }}
                    ></MarsInput>
                  </Col>
                  <Col span={5}>
                    <MarsButton className="small-btn" onClick={mapWork.drawExtent}>
                      绘制
                    </MarsButton>
                  </Col>
                </Row>
              </MarsFormItem>
              <MarsFormItem label="数字">
                <MarsInputNumber></MarsInputNumber>
              </MarsFormItem>
              <MarsFormItem label="日期选择">
                <MarsDatePicker></MarsDatePicker>
              </MarsFormItem>
              <MarsFormItem label="下拉框">
                <MarsSelect defaultValue="2">
                  <MarsOption value="2">1</MarsOption>
                  <MarsOption value="3">2</MarsOption>
                  <MarsOption value="4">3</MarsOption>
                </MarsSelect>
              </MarsFormItem>
              <MarsFormItem label="多选">
                <MarsCheckbox>选项一</MarsCheckbox>
                <MarsCheckbox>选项二</MarsCheckbox>
              </MarsFormItem>
              <MarsFormItem label="单选">
                <MarsRadioGroup defaultValue={1}>
                  <MarsRadio value={1}>选项一</MarsRadio>
                  <MarsRadio value={2}>选项二</MarsRadio>
                </MarsRadioGroup>
              </MarsFormItem>
              <MarsFormItem label="滑动条">
                <MarsSlider min={-0.5} max={1.5} step={0.05} defaultValue={0} onChange={(v) => mapWork.updateBrightness(v)}></MarsSlider>
              </MarsFormItem>
              <MarsFormItem label="滑动条2">
                <MarsSlider
                  defaultValue={30}
                  marks={{ "-255": "-255", "-125": "-125", 0: "0", 125: "125", 255: "255" }}
                  min={-255}
                  max={255}
                  step={1}
                  onChange={(v) => mapWork.updateContrast(v)}
                ></MarsSlider>
              </MarsFormItem>
              <MarsFormItem className="f-push-20-t" label="鼠标操作">
                <MarsSwitch defaultChecked onChange={(v) => mapWork.enableMapMouseController(v)}></MarsSwitch>
              </MarsFormItem>
              <MarsFormItem label="输入框组">
                <MarsInputGroup value={["1", "2", "3"]} units={[",", ",", "."]} onChange={(v) => console.log(v)}></MarsInputGroup>
              </MarsFormItem>
              <MarsFormItem label="颜色选择器">
                <Space>
                  <MarsColor
                    value={this.state.color}
                    onChange={(e) => {
                      this.setState({
                        color: e
                      })
                    }}
                  ></MarsColor>
                  <label>已选择: {this.state.color}</label>
                </Space>
              </MarsFormItem>
            </MarsForm>
            <div className="f-tac">
              <Space wrap>
                <MarsButton onClick={() => $message("message提示信息")}>
                  <MarsIcon icon="aiming"></MarsIcon>
                  <span>提示</span>
                </MarsButton>
                <MarsButton onClick={() => $alert("alert提示信息")}>
                  <MarsIcon icon="aiming"></MarsIcon>
                  <span>弹框</span>
                </MarsButton>
                <MarsButton onClick={() => $notify("notify提示信息", "今天天气很好")}>
                  <MarsIcon icon="aiming"></MarsIcon>
                  <span>通知</span>
                </MarsButton>
                <MarsButton disabled>
                  <span>禁用</span>
                </MarsButton>
              </Space>
            </div>
          </MarsCollapsePanel>
          <MarsCollapsePanel key="2" header="表格控件">
            <MarsTable
              className="f-push-10-t"
              rowSelection={{
                type: "checkbox",
                ...this.state.rowSelection
              }}
              pagination={{ pageSize: 5 }}
              dataSource={this.state.typhoonList}
              columns={this.state.columns}
            />
          </MarsCollapsePanel>
          <MarsCollapsePanel key="3" header="树控件">
            <MarsTree
              checkable
              treeData={this.state.treeData}
              expandedKeys={this.state.expandedKeys}
              checkedKeys={this.state.checkedKeys}
              onCheck={(v: any) => this.onCheckTreeItem(v)}
              onExpand={(v: any) => this.setState({ expandedKeys: v })}
            ></MarsTree>
            <div className="f-tac">
              <Space wrap>
                <MarsButton onClick={() => $showLoading()}>
                  <MarsIcon icon="aiming"></MarsIcon>
                  <span>打开loading</span>
                </MarsButton>
                <MarsButton onClick={() => $hideLoading()}>
                  <MarsIcon icon="aiming"></MarsIcon>
                  <span>关闭loading</span>
                </MarsButton>
              </Space>
            </div>
          </MarsCollapsePanel>
        </MarsCollapse>
      </MarsPannel>
    )
  }
}

export default UIComponent
