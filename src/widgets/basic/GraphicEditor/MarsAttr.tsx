import {
  MarsCollapse,
  MarsCollapsePanel,
  MarsInput,
  MarsInputNumber,
  MarsSwitch,
  MarsSlider,
  MarsColor,
  MarsTextArea,
  MarsSelect
} from "@mars/components/MarsUI"
import { isBoolean, isNumber } from "lodash"
import { useMemo } from "react"

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

function AttrItem({ type, ...props }) {
  const Component = components[type]
  return <Component {...props}></Component>
}

interface MarsAttrProps {
  attrs: any
  onChange?: (value?: any) => void
}

export default function MarsAttr({ attrs, onChange = () => {} }: MarsAttrProps) {
  const attrComps = useMemo(() => {
    const ac: any[] = Object.keys(attrs)
      .filter((k) => !["id", "name", "remark"].includes(k))
      .map((k) => {
        let type = "text"
        if (isBoolean(attrs[k])) {
          type = "radio"
        }
        if (isNumber(attrs[k])) {
          type = "number"
        }
        return { name: k, label: k, type }
      })
    console.log("ac", ac)
    return [
      { name: "id", label: "主键", type: "label", defval: "" },
      { name: "name", label: "名称", type: "text", defval: "" },
      { name: "remark", label: "备注", type: "textarea", defval: "" }
    ].concat(ac)
  }, [attrs])
  return (
    <MarsCollapse activeKey={["1"]}>
      <MarsCollapsePanel key="1" showArrow={false} header="属性信息">
        <table className="mars-primary-table">
          <tbody>
            {attrComps.map((item, i) => (
              <tr key={i}>
                <td>{item.label}</td>
                <td>
                  {item.type === "lable" ? (
                    attrs[item.name]
                  ) : (
                    <AttrItem
                      type={item.type}
                      value={attrs[item.name]}
                      onChange={(data) => {
                        onChange({
                          [item.name]: data.target ? data.target.value : data
                        })
                      }}
                    ></AttrItem>
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
