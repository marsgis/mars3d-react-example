import { Button } from "antd"
import type { ButtonProps } from "antd/lib/button"
import "./index.less"

export const MarsButton = (props: ButtonProps) => {
  return <Button className="mars-button" {...props}></Button>
}

export const MarsButtonGroup = Button.Group
