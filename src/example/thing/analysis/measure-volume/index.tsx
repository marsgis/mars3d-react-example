import { MarsPannel, MarsGui, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useMemo, useRef, useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const guiRef = useRef<any>()

  const [isShowSjw, setIsShowSjw] = useState(false)

  useMemo(() => {
    mapWork.eventTarget.on("heightVal", function (event: any) {
      guiRef.current.updateField("baseHeight", event.baseHeight)
      guiRef.current.updateField("bottomValue", event.minHeight)
      guiRef.current.updateField("topValue", event.maxHeight)
      mapWork.showResult(isShowSjw)
    })
  }, [isShowSjw])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <p className="f-mb">提示：单击分析按钮激活绘制分析，对绘制面(墙)内的进行以下计算。</p>
        <p className="f-mb">1. 挖方量: 计算“基准面”到地表之间的凸出部分进行挖掉的体积。</p>
        <p className="f-mb">2. 填方量：计算“基准面”与“墙底部”之间的缺少部分进行填平的体积。</p>
        <MarsGui
          ref={guiRef}
          formProps={{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }}
          options={[
            {
              type: "number",
              field: "baseHeight",
              label: "基准面高（米）",
              extra: <MarsButton onClick={() => mapWork.selHeight()}>点选高度</MarsButton>,
              value: "",
              change(value) {
                mapWork.baseHeight(value)
              }
            },
            {
              type: "number",
              field: "bottomValue",
              label: "围墙底高（米）",
              value: "",
              change(value) {
                mapWork.txtMinHeight(value)
              }
            },
            {
              type: "number",
              field: "topValue",
              label: "围墙顶高（米）",
              value: "",
              change(value) {
                mapWork.txtMaxHeight(value)
              }
            }
          ]}
        ></MarsGui>

        <Space wrap>
          <MarsButton onClick={() => mapWork.analysisMeasure()}>方量分析</MarsButton>
          <MarsButton onClick={() => mapWork.clear()}>清除</MarsButton>
          <MarsCheckbox
            defaultChecked={isShowSjw}
            onChange={(e) => {
              setIsShowSjw(e.target.checked)
              mapWork.showResult(e.target.checked)
            }}
          >
            显示面内计算的三角网
          </MarsCheckbox>
        </Space>
      </MarsPannel>
    </>
  )
}

export default UIComponent
