import { MarsInput, MarsInputNumber, MarsSwitch, MarsSlider, MarsColor, MarsTextArea, MarsSelect } from "@mars/components/MarsUI"
import { Fragment, useState, useEffect } from "react"
import baseConfig from "./config/base-info.js"

interface MarsAttrProps {
  data: any
  graphicType: string
  onChange?: (value?: any) => void
}

const components = {
  number: MarsInputNumber,
  input: MarsInput,
  radio: MarsSwitch,
  slider: MarsSlider,
  color: MarsColor,
  combobox: MarsSelect,
  textarea: MarsTextArea,
  label: "span"
}
function StyleItem({ type, ...props }) {
  const Component = components[type]
  return type === "label" ? <span className="attr-editor-label">{props.value || ""}</span> : <Component {...props}></Component>
}

export default function MarsAvailability({ data, graphicType, onChange = () => {} }: MarsAttrProps) {
  const [baseValue, setBaseValue] = useState({})

  useEffect(() => {
    if (!graphicType) {
      return
    }
    const value = {}
    baseConfig.forEach((item: any) => {
      value[item.name] = data[item.name] ?? getViewDefval(item, data) // 数据中没有的地方使用默认值
    })

    setBaseValue({ ...value })
  }, [graphicType])

  function getViewDefval(config, styleOptions) {
    if (typeof config.defval === "function") {
      return config.defval(styleOptions)
    } else {
      return config.defval
    }
  }

  function change(item, value) {
    onChange({ [item.name]: value })

    baseValue[item.name] = value
    setBaseValue({ ...baseValue })
  }

  return (
    <div className="baseinfo-pannel">
      <table className="mars-primary-table">
        <tbody>
          {baseValue &&
            baseConfig?.map((item, i) => (
              <Fragment key={i}>
                <tr>
                  <td>{item.label}</td>
                  <td>
                    {
                      <StyleItem
                        size="small"
                        type={item.type}
                        value={baseValue[item.name]}
                        min={item.min || item.min === 0 ? item.min : -Infinity}
                        max={item.max || item.max === 0 ? item.max : Infinity}
                        step={item.step || 0.1}
                        options={item.data || []}
                        onChange={(e) => {
                          change(item, e instanceof Object ? e.target.value : e)
                        }}
                      ></StyleItem>
                    }
                  </td>
                </tr>
              </Fragment>
            ))}
        </tbody>
      </table>
    </div>
  )
}
