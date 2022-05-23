import { Component } from "react"
import * as mapWork from "./map.js"
import axios from "axios"
import { Space } from "antd"
import {
  MarsInput,
  MarsInputNumber,
  MarsSelect,
  MarsOption,
  MarsCheckbox,
  MarsForm,
  MarsFormItem,
  MarsRadioGroup,
  MarsRadio,
  MarsSlider,
  MarsSwitch,
  MarsButton,
  MarsPannel,
  MarsInputGroup,
  MarsIcon,
  $message,
  $alert,
  $notify,
  $showLoading,
  $hideLoading,
  MarsTable
} from "@mars/components/MarsUI"

class UIComponent extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      inputValue: 5,
      typhoonList: []
    }
    mapWork.eventTarget.on("init", ({ value }) => {
      this.setInputValue(value)
      this.getTyphoonList()
    })
  }

  hidePannel() {
    this.setState((prevState) => ({
      ...prevState,
      visible: false
    }))
  }

  setInputValue(value) {
    this.setState((prevState) => ({
      ...prevState,
      inputValue: value
    }))
  }

  columns = [
    {
      title: "台风编号",
      dataIndex: "typnumber",
      key: "typnumber"
    },
    {
      title: "台风名(中文)",
      dataIndex: "name_cn"
    },
    {
      title: "台风名(英文)",
      dataIndex: "name_en"
    }
  ]

  getTyphoonList() {
    const url = "//data.mars3d.cn/file/apidemo/typhoon/list_2020.json"
    axios.get(url).then((res: any) => {
      const data = res.data
      const resultData = data.typhoonList.map((item: any) => ({
        key: item[0],
        id: item[0],
        name_en: item[1],
        name_cn: item[2],
        typnumber: item[3],
        state: item[7]
      }))

      this.setState((prevState) => ({
        ...prevState,
        typhoonList: resultData
      }))
    })
  }

  rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys: string[]) => {}
  }

  render() {
    return (
      <>
        <MarsPannel closeable visible={this.state.visible} right="10" top="10" width="400" onClose={() => this.hidePannel()}>
          <MarsForm>
            <MarsFormItem label="输入框">
              <MarsInput value={this.state.inputValue}></MarsInput>
            </MarsFormItem>
            <MarsFormItem label="数字">
              <MarsInputNumber></MarsInputNumber>
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
              <MarsSlider defaultValue={30}></MarsSlider>
            </MarsFormItem>
            <MarsFormItem label="滑动条">
              <MarsSwitch defaultChecked></MarsSwitch>
            </MarsFormItem>
            <MarsFormItem label="输入框组">
              <MarsInputGroup value={["1", "2", "3"]} units={[",", ",", "."]} onChange={(v) => console.log(v)}></MarsInputGroup>
            </MarsFormItem>
          </MarsForm>
          <MarsTable
            size="small"
            dataSource={this.state.typhoonList}
            columns={this.columns}
            bordered
            pagination={{ pageSize: 5 }}
            rowSelection={this.rowSelection}
          ></MarsTable>

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
            <MarsButton onClick={() => $showLoading()}>
              <MarsIcon icon="aiming"></MarsIcon>
              <span>打开loading</span>
            </MarsButton>
            <MarsButton onClick={() => $hideLoading()}>
              <MarsIcon icon="aiming"></MarsIcon>
              <span>关闭loading</span>
            </MarsButton>
          </Space>
        </MarsPannel>
      </>
    )
  }
}

export default UIComponent
