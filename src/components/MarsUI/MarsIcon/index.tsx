import { useMemo } from "react"
import _ from "lodash"
import * as svgModule from "@icon-park/svg"
import classnames from "classnames"
import "./index.less"

interface MarsIconProps extends Record<string, any> {
  icon: string
  color?: string
  width?: string | number
  className?: string
}
console.log(svgModule)

export const MarsIcon = ({ icon, color, fill, width = "14", theme = "outline", size, className, ...props }: MarsIconProps) => {
  const iconName = useMemo(() => _.upperFirst(_.camelCase(icon)), [icon])

  const svgComponent = useMemo(
    () =>
      svgModule[iconName]({
        theme,
        fill: fill || color,
        size: size || width,
        ...props
      }),
    [iconName, theme, color, fill, size, width, props]
  )
  const classes = classnames({
    "mars-icon": true,
    [className]: className
  })
  return <span className={classes} dangerouslySetInnerHTML={{ __html: svgComponent }} {...props}></span>
}
