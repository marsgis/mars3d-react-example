import { useEffect, useState } from "react"
import { SketchPicker } from "react-color"
import { MarsButton } from "../MarsButton"
import { Space, Popover } from "antd"
import "./index.less"

export const MarsColor = ({ value = "#FFFFFF", ...props }) => {
  /** 支持16进制颜色和rgb哦 */
  const [color, setColor] = useState(value) // 最终确定的颜色
  const [selColor, setSelColor] = useState({ value }) // value是rgba格式，hex是十进制格式
  const [pickerVisible, setPickerVisible] = useState(false) // 结果关键词颜色选择器可见性

  // colorObj属性如下
  // hex: "#ffffff"
  // hsl: {h: 0, s: 0, l: 1, a: 1}
  // hsv: {h: 0, s: 0, v: 1, a: 1}
  // oldHue: 0
  // rgb: {r: 255, g: 255, b: 255, a: 1}
  // source: "hex"

  useEffect(() => {
    setColor(value)
    setSelColor({
      value
    })
  }, [value])

  const onChangeCompeleteColor = (colorObj) => {
    const data = {
      value: `rgba(${colorObj.rgb.r},${colorObj.rgb.g},${colorObj.rgb.b},${colorObj.rgb.a})`, // 默认rgba格式
      hex: colorObj.hex
    }
    setSelColor(data)
  }

  return (
    <>
      <Popover
        trigger="click"
        placement={props.placement || "right"}
        open={pickerVisible}
        onOpenChange={(newVisible: boolean) => {
          setPickerVisible(newVisible)
        }}
        content={
          <>
            <SketchPicker color={selColor.value} onChangeComplete={onChangeCompeleteColor} />
            <div className="f-tac">
              <Space>
                <MarsButton
                  onClick={() => {
                    setPickerVisible(false)
                    setColor(selColor.value)

                    props.onChange(selColor.value, selColor)
                  }}
                >
                  确定
                </MarsButton>
                <MarsButton
                  onClick={() => {
                    setPickerVisible(false)
                  }}
                >
                  取消
                </MarsButton>
              </Space>
            </div>
          </>
        }
      >
        <div
          className="color-pannel"
          style={{ background: color }}
          onClick={() => {
            setPickerVisible(true)
          }}
        ></div>
      </Popover>
    </>
  )
}
