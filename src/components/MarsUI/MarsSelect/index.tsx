import { forwardRef } from "react"
import { Select } from "antd"
import type { SelectProps } from "antd"
import type { BaseSelectRef } from "rc-select"
import "./index.less"

export const MarsSelect = forwardRef<BaseSelectRef, SelectProps>((props, ref) => {
  return <Select className="mars-select" dropdownClassName="mars-select-dropdown" ref={ref} {...props}></Select>
})

export const MarsOption = Select.Option
export const MarsOptGroup = Select.OptGroup
