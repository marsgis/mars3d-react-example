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

    mapWork.eventTarget.on("initTree", () => {
      const showIds = [] // 是显示状态的图层id集合
      const openIds = [] // 展开的树节点id集合（如果不想展开，对应图层配置open:false）
      const result = mapWork.getLayrsTree({
        forEach: function (item) {
          item.key = item.id // 树控件api需要的唯一标识
          item.title = item.name // 树控件api需要的显示文本字段

          if (item.show) {
            showIds.push(item.id)
          }
          if (item.group && item.open !== false) {
            openIds.push(item.id)
          }
        }
      })
      this.setState({
        expandedKeys: openIds,
        checkedKeys: showIds,
        treeData: result.tree
      })
    })
  }

  onCheckTreeItem(keys: string[], e: any) {
    this.setState({
      checkedKeys: keys
    })

    const layer = mapWork.getLayerById(e.node?.key)

    if (layer) {
      const show = keys.indexOf(e.node.key) !== -1
      mapWork.updateLayerShow(layer, show)
    }

    // 处理子节点
    if (e.node.children && e.node.children.length) {
      e.node.children.forEach((child) => {
        this.onCheckTreeItem(keys, { node: child })
      })
    }
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
              onCheck={(v: any, e) => this.onCheckTreeItem(v, e)}
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
