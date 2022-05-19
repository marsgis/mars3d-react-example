import { useMemo } from "react"
import _ from "lodash"
import Icon from "@icon-park/react/es/all"
import type { IconType } from "@icon-park/react/es/all"
import "./index.less"

interface MarsIconProps extends Record<string, any> {
  icon: IconType | string
  color?: string
  width?: string | number
}

export const MarsIcon = ({ icon, color = "#fff", width = "14", ...props }: MarsIconProps) => {
  const iconName = useMemo(() => _.upperFirst(_.camelCase(icon)), [icon])
  return <Icon className="mars-icon" type={iconName} theme="outline" fill={color} size={width} {...props} />
}
