import { forwardRef } from "react"
import { Checkbox } from "antd"
import type { CheckboxProps, CheckboxGroupProps } from "antd/lib/checkbox"
import "./index.less"

export const MarsCheckbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  return <Checkbox className="mars-checkbox" ref={ref} {...props}></Checkbox>
})

export const MarsCheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
  return <Checkbox.Group className="mars-checkbox-group" ref={ref} {...props}></Checkbox.Group>
})
