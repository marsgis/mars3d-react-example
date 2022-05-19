import { forwardRef } from "react"
import { Switch } from "antd"
import type { SwitchProps } from "antd"
import "./index.less"

interface MarsSwitchProps extends SwitchProps {
  value?: boolean
}

export const MarsSwitch = forwardRef<HTMLElement, MarsSwitchProps>(({ value, ...props }, ref) => {
  if (typeof value === "boolean") {
    props.checked = value
  }
  return <Switch className="mars-switch" ref={ref} {...props}></Switch>
})
