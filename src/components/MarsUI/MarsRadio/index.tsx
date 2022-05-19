import { forwardRef } from "react"
import { Radio } from "antd"
import type { RadioProps, RadioGroupProps } from "antd/lib/radio"
import type { RadioButtonProps } from "antd/lib/radio/radioButton"
import "./index.less"

export const MarsRadio = forwardRef<HTMLElement, RadioProps>((props, ref) => {
  return <Radio className="mars-radio" ref={ref} {...props}></Radio>
})

export const MarsRadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  return <Radio.Group className="mars-radio-group" ref={ref} {...props}></Radio.Group>
})

export const MarsRadioButton = forwardRef<any, RadioButtonProps>((props, ref) => {
  return <Radio.Button className="mars-radio-button" ref={ref} {...props}></Radio.Button>
})
