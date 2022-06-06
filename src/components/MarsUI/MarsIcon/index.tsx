import { useEffect, useMemo } from "react"
import _ from "lodash"
import * as svgModule from "@icon-park/svg"
import "./index.less"

interface MarsIconProps extends Record<string, any> {
  icon: string
  color?: string
  width?: string | number
}
console.log(svgModule)

export const MarsIcon = ({ icon, color, fill, width = "14", theme = "outline", size, ...props }: MarsIconProps) => {
  const iconName = useMemo(() => _.upperFirst(_.camelCase(icon)), [icon])

  const svgComponent = useMemo(
    () =>
      svgModule[iconName]({
        theme,
        fill: fill || color,
        size: size || width,
        ...props
      }),
    [iconName]
  )

  return <span className="mars-icon" dangerouslySetInnerHTML={{ __html: svgComponent }} {...props}></span>
}
