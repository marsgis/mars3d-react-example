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
import styleConfigAll from "./config/style.js"
import materialConfig from "./config/material.js"
import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from "react"
import { cloneDeep, isArray } from "lodash"

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
  return type === "label" ? <span className="attr-editor-label">{props.value || ""}</span> : <Component {...props}></Component>
}

interface MarsAttrProps {
  style: any
  graphic: any
  layerName: string
  customType: string
  graphicType: string
  onChange?: (value?: any) => void
}
let newViewMaterials: any[] = []
export default function MarsStyle({ style, layerName, customType, graphicType, onChange = () => { } }: MarsAttrProps) {
  const originStyles = useRef([]) // 完整的属性数据
  const [styleValue, setStyleValue] = useState<any>(null) // 矢量数据样式属性对象
  const [viewStyles, setViewStyles] = useState<any[]>([]) // 当前状态下显示的属性数组
  const [viewMaterials, setViewMaterials] = useState<any[]>([]) // 当前状态下显示的材质属性数组
  const [styleType, setStyleType] = useState("") // 样式类型

  const originLabels = useRef([]) // 注记完整的属性数据
  const [viewLabels, setViewLabels] = useState<any[]>([]) // label 注记对象显示的属性数组

  useEffect(() => {
    return () => {
      newViewMaterials = []
    }
  }, [])

  useEffect(() => {
    setDefault()
  }, [style, layerName, customType, graphicType])

  // styleValue 属性发生变化
  useEffect(() => {
    updateViewStyles()
  }, [styleValue])

  // 设置初始化的默认值
  function setDefault() {
    const newStyleValue = cloneDeep(style)
    const styleConfig = styleConfigAll[customType] || styleConfigAll[graphicType]
    if (!styleConfig) {
      return
    }

    setStyleType(styleConfig.type)

    originStyles.current = cloneDeep(styleConfig.style)

    let materialTypeOption

    const materialType = newStyleValue.materialType

    originStyles.current.forEach((item: any) => {
      newStyleValue[item.name] = newStyleValue[item.name] ?? getViewDefval(item, newStyleValue) // 数据中没有的地方使用默认值
      if (item.name === "materialType") {
        materialTypeOption = item
      }
    })

    if (materialType && materialTypeOption) {
      if (!newStyleValue.materialOptions) {
        newStyleValue.materialOptions = {}
      }
      materialTypeOption.data.forEach((m) => {
        const value = m.value
        if (value === materialType) {
          const defval = m.defval || {}
          materialConfig[materialType].forEach((p) => {
            const val = newStyleValue.materialOptions[p.name]
            // 初始化进入默认值的取值顺序 1. 本身属性 2. style中的属性 3. style.js 材质默认值 4. material.js 的默认值
            newStyleValue.materialOptions[p.name] = val ?? newStyleValue[p.name] ?? defval[p.name] ?? getViewDefval(p, newStyleValue.materialOptions)
          })
        }
      })
    }

    if (newStyleValue.label) {
      setLabelDefault(newStyleValue) // 处理label数据
    }

    setStyleValue(newStyleValue)
  }

  function setLabelDefault(newStyleValue) {
    originLabels.current = cloneDeep(styleConfigAll.label.style)
    if (originLabels.current) {
      originLabels.current.forEach((item: any) => {
        newStyleValue.label[item.name] = newStyleValue.label[item.name] ?? getViewDefval(item, newStyleValue.label) // 数据中没有的地方使用默认值
      })
    }
  }
  // 更新属性的显示隐藏，通过配置中的show属性来控制
  function updateViewLabels(newStyleValue) {
    const newViewLabels = originLabels.current.filter((item) => {
      return getViewShow(item, newStyleValue.label)
    })
    setViewLabels(newViewLabels)
  }

  // 更新属性的显示隐藏，通过配置中的show属性来控制
  function updateViewStyles() {
    if (!styleValue) {
      return
    }
    const newViewStyles = originStyles.current.filter((item) => {
      const isShow = getViewShow(item, styleValue)

      if (item.name === "materialType" && isShow) {
        // 处理材质相关属性的现实隐藏
        updateMaterialViewStyles()
      }
      return isShow
    })

    if (styleValue.label) {
      updateViewLabels(styleValue) // 处理label数据
    }
    setViewStyles(newViewStyles)
  }

  // 处理材质相关属性的现实隐藏，通过配置中的show属性来控制
  function updateMaterialViewStyles() {
    const materialType = styleValue.materialType.split("-")[0]
    const defaultTypes = materialConfig[materialType] || []

    newViewMaterials = defaultTypes.filter((item) => {
      return getViewShow(item, styleValue.materialOptions)
    })

    setViewMaterials(newViewMaterials)
  }

  function getViewShow(config, styleOptions) {
    if (typeof config.show === "function") {
      return config.show(styleOptions, styleValue, graphicType)
    }
    return true
  }

  function getViewDefval(config, styleOptions) {
    if (typeof config.defval === "function") {
      return config.defval(styleOptions, styleValue, graphicType)
    } else {
      return config.defval
    }
  }

  // 非材质属性改变
  function unionChange(item: any, value: any, selectOptions?: any[]) {
    const name = item.name
    if (name === "fill" || name === "outline") {
      styleValue[item.name] = value

      if (styleValue.fill === false && styleValue.outline === false) {
        $message("填充和边框不能同时为否")
        styleValue[item.name] = true
        return
      }
    }
    styleValue[item.name] = value
    // 材质类型 materialType 改变时的特殊处理
    if (name === "materialType") {
      // 设置材质属性的默认值
      let defval = {}
      if (selectOptions) {
        const mOp = selectOptions.find((item) => item.value === styleValue.materialType) // 当前选项的材质属性配置
        if (mOp) {
          defval = mOp.defval || {}
        }
      }
      const materialType = styleValue.materialType.split("-")[0]
      const materialOptions = {}
      materialConfig[materialType].forEach((p) => {
        // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.js 的默认值
        materialOptions[p.name] = defval[p.name] ?? getViewDefval(p, materialOptions)
      })
      styleValue.materialOptions = materialOptions
    }

    // 处理属性控件的显示隐藏
    console.log("styleValue改变", styleValue)

    setStyleValue(cloneDeep(styleValue))

    // 控制图层样式改变
    setTimeout(() => {
      updateStyle(item)
    }, 200)
  }

  function materialChange(item, value) {
    // console.log("更换了材质类型", item)

    styleValue.materialOptions[item.name] = value
    setStyleValue(cloneDeep(styleValue))

    // 控制图层材质改变
    setTimeout(() => {
      updateMaterials()
    }, 200)
  }

  function updateStyle(item: any) {
    const val = styleValue[item.name]
    const data: Record<string, any> = {
      [item.name]: item.name === "materialType" ? val.split("-")[0] : val
    }

    // 材质类型 materialType 改变时的特殊处理
    if (item.name === "materialType") {
      data.materialOptions = styleValue.materialOptions
    }
    onChange(data)
  }

  function updateMaterials() {
    const materialOptions: Record<string, any> = {}

    newViewMaterials.forEach((item) => {
      materialOptions[item.name] = styleValue.materialOptions[item.name] ?? getViewDefval(item, styleValue.materialOptions)
    })

    console.log("修改了材质", materialOptions)

    onChange({
      materialOptions
    })
  }

  function labelChange(item: any, value) {
    styleValue.label[item.name] = value
    setStyleValue(cloneDeep(styleValue))
    // 控制图层样式改变
    setTimeout(() => {
      updateLabel(item.name)
    }, 200)
  }

  function updateLabel(name) {
    const label: Record<string, any> = {
      [name]: styleValue.label[name]
    }
    onChange({
      label
    })
  }

  return (
    <MarsCollapse defaultActiveKey={["1", "2"]}>
      <MarsCollapsePanel key="1" showArrow={false} header="样式信息">
        <table className="mars-primary-table">
          <tbody>
            <tr>
              <td>所在图层</td>
              <td>{layerName || "默认分组"}</td>
            </tr>
            <tr>
              <td>标号类型</td>
              <td>{graphicType}</td>
            </tr>
            <tr>
              <td>样式类型</td>
              <td>{styleType}</td>
            </tr>
            {styleValue &&
              viewStyles.map((item, i) => (
                <Fragment key={i}>
                  <tr>
                    <td>{item.label}</td>
                    <td>
                      {
                        <StyleItem
                          size="small"
                          type={item.type}
                          value={styleValue[item.name]}
                          min={item.min || item.min === 0 ? item.min : -Infinity}
                          max={item.max || item.max === 0 ? item.max : Infinity}
                          step={item.step || 0.1}
                          options={item.data || []}
                          onChange={(e) => {
                            unionChange(item, e instanceof Object ? e.target.value : e, item.data)
                          }}
                        ></StyleItem>
                      }
                    </td>
                  </tr>
                  {item.name === "materialType" &&
                    viewMaterials &&
                    styleValue.materialOptions &&
                    viewMaterials.map((material, mi) => (
                      <tr key={mi}>
                        <td>{material.label}</td>
                        <td>
                          <StyleItem
                            size="small"
                            type={material.type}
                            value={styleValue.materialOptions[material.name]}
                            min={material.min || material.min === 0 ? material.min : -Infinity}
                            max={material.max || material.max === 0 ? material.max : Infinity}
                            step={material.step || 0.1}
                            options={material.data || []}
                            onChange={(e) => {
                              materialChange(material, e instanceof Object ? e.target.value : e)
                            }}
                          ></StyleItem>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ))}
          </tbody>
        </table>
      </MarsCollapsePanel>
      {styleValue && styleValue.label && (
        <MarsCollapsePanel key="2" showArrow={false} header="+ 注记信息">
          <table className="mars-primary-table">
            <tbody>
              {viewLabels.map((item, i) => (
                <tr key={i}>
                  <td>{item.label}</td>
                  <td>
                    {
                      <StyleItem
                        size="small"
                        type={item.type}
                        value={styleValue.label[item.name]}
                        min={item.min || item.min === 0 ? item.min : -Infinity}
                        max={item.max || item.max === 0 ? item.max : Infinity}
                        step={item.step || 0.1}
                        options={item.data || []}
                        onChange={(e) => {
                          // if (e) {
                          labelChange(item, e instanceof Object ? e.target.value : e)
                          // }
                        }}
                      ></StyleItem>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </MarsCollapsePanel>
      )}
    </MarsCollapse>
  )
}
