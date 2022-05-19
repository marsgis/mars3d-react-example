import { forwardRef } from "react"
import { InputNumber } from "antd"
import type { InputNumberProps } from "antd/lib/input-number"
import "./index.less"

export const MarsInputNumber = forwardRef<HTMLInputElement, InputNumberProps>((props, ref) => {
  return <InputNumber className="mars-input-number" ref={ref} {...props}></InputNumber>
})
