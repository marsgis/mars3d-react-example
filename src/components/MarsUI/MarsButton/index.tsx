import { Button } from "antd"
import type { ButtonProps } from "antd/lib/button"
import classNames from "classnames"
import "./index.less"

export const MarsButton = ({ className, ...props }: ButtonProps & { className?: string }) => {
  return (
    <Button
      className={classNames({
        "mars-button": true,
        [className]: className
      })}
      {...props}
    ></Button>
  )
}

export const MarsButtonGroup = Button.Group
