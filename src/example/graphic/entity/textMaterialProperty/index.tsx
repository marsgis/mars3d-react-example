import { MarsPannel, MarsButton, MarsSlider, MarsInput } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import "./index.less"
import { useWidget } from "@mars/common/store/widget"
import { useMemo, useState, useCallback } from "react"

const onClickDrawWall = () => {
  mapWork.onClickDrawWall()
}

const onClickDrawRectangle = () => {
  mapWork.onClickDrawRectangle()
}

const onClickDrawPoint = () => {
  mapWork.onClickDrawPoint()
}

const removeAll = () => {
  mapWork.removeAll()
}

function UIComponent() {
  const [angle, setAngle] = useState(0)

  const [text, setText] = useState("Mars3D 火星科技 2017")

  const { disable, activate, setWidgetData } = useWidget()
  const showEditor = useCallback(
    (e: any) => {
      activate({
        name: "GraphicEditor",
        data: { graphic: e.graphic }
      })
    },
    [activate]
  )

  useMemo(() => {
    mapWork.eventTarget.on("graphicEditor-start", async (e: any) => {
      showEditor(e)
    })
    // 编辑修改了模型
    mapWork.eventTarget.on("graphicEditor-update", async (e: any) => {
      setWidgetData("graphic-editor", {
        data: { graphic: e.graphic }
      })
      showEditor(e)
    })

    // 停止编辑修改模型
    mapWork.eventTarget.on("graphicEditor-stop", async (e: any) => {
      disable("graphic-editor")
    })
  }, [])

  // 改变方向
  const onChangeDirection = (angle: number) => {
    setAngle(angle)
    mapWork.onChangeSlider(angle)
  }

  // 文字改变
  const onChangeText = (value: any) => {
    setText(value.target.value)
  }

  const onClickSure = () => {
    mapWork.onClickSure(text)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={onClickDrawWall}>竖立墙</MarsButton>
        <MarsButton onClick={onClickDrawRectangle}>贴地矩形</MarsButton>

        <MarsButton onClick={onClickDrawPoint} title="根据中心点和长宽来计算矩形">
          贴地矩形2
        </MarsButton>
        <MarsButton onClick={removeAll}>清除</MarsButton>
      </Space>

      <div className="f-pt">
        <Space>
          <span>方向</span>
          <MarsSlider value={angle} min={0} max={360} step={1} onChange={onChangeDirection}></MarsSlider>
        </Space>
      </div>

      <div className="f-pt">
        <Space>
          <span>文字</span>
          <MarsInput value={text} onChange={onChangeText}></MarsInput>
          <MarsButton onClick={onClickSure}>确定</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
