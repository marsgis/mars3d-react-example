import { useState, useEffect } from "react"
import * as mapWork from "./map.js"
import { MarsSelect, MarsInput, MarsFormItem, MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [startNumber, setStartValue] = useState("")
  const [endNumber, setEndtValue] = useState("")
  const [seltValue, setselctValue] = useState("1")

  const [roamValue, setRoamVlaue] = useState({
    allDiatance: "",
    useTime: "",
    routePath: ""
  })

  useEffect(() => {
    mapWork.eventTarget.on("analyse", function (event: any) {
      setRoamVlaue({ useTime: event.allTime, allDiatance: event.allDistance, routePath: event.dhHtml })
    })
  }, [])

  // 下拉菜单
  const selectWayOptions = [
    {
      // 1-步行路线
      value: "1",
      label: "步行路线查询"
    },
    {
      // 2-行车路线
      value: "3",
      label: "驾车路线查询"
    }
  ]

  return (
    <MarsPannel visible={true} right="10" width={"295px"} top="10">
      <MarsFormItem label="方式">
        <MarsSelect
          defaultValue={seltValue}
          options={selectWayOptions}
          onChange={(data) => {
            if (startNumber && endNumber) {
              mapWork.btnAnalyse(data)
            }
            setselctValue(data)
          }}
        ></MarsSelect>
      </MarsFormItem>
      <MarsFormItem label="起点">
        <Space>
          <MarsInput value={startNumber} disabled></MarsInput>
          <MarsButton
            onClick={async () => {
              const startPoint: string = await mapWork.startPoint(seltValue)
              setStartValue(startPoint)
            }}
          >
            选点
          </MarsButton>
        </Space>
      </MarsFormItem>
      <MarsFormItem label="终点">
        <Space>
          <MarsInput value={endNumber} disabled></MarsInput>
          <MarsButton
            onClick={async () => {
              const endPoint: string = await mapWork.endPoint(seltValue)
              setEndtValue(endPoint)
            }}
          >
            选点
          </MarsButton>
        </Space>
      </MarsFormItem>
      <div className="f-tac">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.btnAnalyse(seltValue)
            }}
          >
            开始分析
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeAll()

              setStartValue("")
              setEndtValue("")
              setRoamVlaue({ useTime: "", allDiatance: "", routePath: "" })
            }}
          >
            清除
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.saveGeoJSON()
            }}
          >
            保存GeoJSON
          </MarsButton>
        </Space>
      </div>
      <div className="f-push-20-t" style={{ display: roamValue.allDiatance ? "" : "none" }}>
        <p style={{ color: "#cad1d1" }}>总距离：{roamValue.allDiatance}</p>
        <p style={{ color: "#cad1d1" }}>预计时间：{roamValue.useTime}</p>
        <p className="f-lhn" style={{ color: "#cad1d1" }}>
          导航：{roamValue.routePath}
        </p>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
