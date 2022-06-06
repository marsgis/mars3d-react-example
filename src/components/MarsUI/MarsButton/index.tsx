import { Button } from "antd"
import type { ButtonProps } from "antd/lib/button"
import "./index.less"

export const MarsButton = ({ className, ...props }: ButtonProps & { className?: string }) => {
  return <Button className={["mars-button", className].join(" ")} {...props}></Button>
}

export const MarsButtonGroup = Button.Group
