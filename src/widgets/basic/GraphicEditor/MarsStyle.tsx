import {
  MarsCollapse,
  MarsCollapsePanel,
  MarsInput,
  MarsInputNumber,
  MarsSwitch,
  MarsSlider,
  MarsColor,
  MarsTextArea,
  MarsSelect,
  $message
} from "@mars/components/MarsUI"
import styleConfig from "./attr.json"
import { useCallback, useEffect, useMemo, useState } from "react"
import { cloneDeep, uniq, isArray } from "lodash"

const components = {
  number: MarsInputNumber,
  radio: MarsSwitch,
  slider: MarsSlider,
  color: MarsColor,
  combobox: MarsSelect,
  textarea: MarsTextArea,
  label: "span",
  text: MarsInput
}

function StyleItem({ type, ...props }) {
  const Component = components[type]
  return <Component {...props}></Component>
}

interface MarsAttrProps {
  style: any
  graphic: any
  onChange?: (value?: any) => void
}

export default function MarsStyle({ style, graphic, onChange = () => {} }: MarsAttrProps) {
  const styleOptions = useMemo(() => {
    const defaultOption = styleConfig[graphic.options.edittype || graphic.type] || {}
    return defaultOption
  }, [graphic])

  const innerStyle = useMemo(() => {
    const newStyle = cloneDeep(style)
    styleOptions.style.forEach((item: any) => {
      if (!newStyle[item.name] && newStyle[item.name] !== 0 && newStyle[item.name] !== false) {
        newStyle[item.name] = item.defval
      }
    })
    return newStyle
  }, [style, styleOptions])

  const showImpacts = useMemo(() => {
    let allImpacts: any[] = []
    if (styleOptions.style) {
      styleOptions.style.forEach((item: any) => {
        if (item.impact && innerStyle[item.name] === true) {
          allImpacts = allImpacts.concat(item.impact)
        }
        if (item.data && isArray(item.data)) {
          item.data.forEach((op: any) => {
            if (op.impact && innerStyle[item.name] === op.value) {
              allImpacts = allImpacts.concat(op.impact)
            }
          })
        }
      })
    }
    return allImpacts
  }, [styleOptions, innerStyle])

  const styleShowIt = useCallback(
    (item: any) => {
      if (item.type === "hidden") {
        return false
      }

      if (item.isImpact && !showImpacts.includes(item.name)) {
        return false
      }

      const attrName = item.name
      // 以下对样式互斥的处理。
      // 贴地对象
      if (innerStyle.clampToGround) {
        if (
          attrName === "fill" || // 不能取消填充。
          attrName === "height" || // 没有高度
          attrName === "outline" ||
          attrName === "outlineWidth" ||
          attrName === "outlineColor" ||
          attrName === "outlineOpacity" ||
          attrName === "hasShadows" ||
          attrName === "diffHeight"
        ) {
          return false
        }
      } else {
        if (attrName === "zIndex") {
          return false
        }
      }

      // 三维立体对象
      if (innerStyle.diffHeight > 0) {
        if (attrName === "clampToGround" || attrName === "outlineWidth") {
          return false
        }
      }

      return true
    },
    [showImpacts, innerStyle]
  )

  const updateStyle = useCallback(
    (item: any, value: any) => {
      innerStyle[item.name] = value

      onChange(innerStyle)
    },
    [innerStyle, onChange]
  )

  const unionChange = useCallback(
    (item: any, value: any) => {
      if (value === false && ((item.name === "fill" && innerStyle.outline === false) || (item.name === "outline" && innerStyle.fill === false))) {
        $message("填充和边框不能同时为否")
        return
      }
      updateStyle(item, value)
    },
    [innerStyle, updateStyle]
  )

  return (
    <MarsCollapse activeKey={["1"]}>
      <MarsCollapsePanel key="1" showArrow={false} header="样式信息">
        <table className="mars-primary-table">
          <tbody>
            <tr>
              <td width={100}>所在图层</td>
              <td>{graphic._layer.name || "默认分组"}</td>
            </tr>
            <tr>
              <td>标号类型</td>
              <td>{graphic.name || styleOptions.name}</td>
            </tr>
            {styleOptions.style
              .filter((item) => styleShowIt(item))
              .map((item, i) => (
                <tr key={i}>
                  <td>{item.label}</td>
                  <td>
                    {item.type === "lable"
                      ? innerStyle[item.name]
                      : item.type !== "hidden" && (
                          <StyleItem
                            type={item.type}
                            value={innerStyle[item.name]}
                            min={item.min || item.min === 0 ? item.min : -Infinity}
                            max={item.max || item.max === 0 ? item.max : Infinity}
                            step={item.step || 0.1}
                            options={item.data || []}
                            onChange={(e) => {
                              unionChange(item, e.target ? e.target.value : e)
                            }}
                          ></StyleItem>
                        )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </MarsCollapsePanel>
    </MarsCollapse>
  )
}
