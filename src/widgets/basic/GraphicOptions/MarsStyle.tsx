import {
  MarsCollapse,
  MarsInput,
  MarsInputNumber,
  MarsSwitch,
  MarsSlider,
  MarsColor,
  MarsTextArea,
  MarsSelect,
  $message
} from "@mars/components/MarsUI"
import { Row, Col } from "antd"
import styleConfigAll from "./config/style.js"
import materialConfig from "./config/material.js"
import { useEffect, useState, Fragment } from "react"

const components = {
  number: MarsInputNumber,
  radio: MarsSwitch,
  slider: MarsSlider,
  color: MarsColor,
  combobox: MarsSelect,
  textarea: MarsTextArea,
  text: MarsInput
}

function StyleComp({ type, ...props }) {
  if (props.right) {
    return (
      <>
        <Col span={8}> {props.label}</Col>
        <Col span={16}>{props.right}</Col>
      </>
    )
  }
  const Component = components[type]

  function StyleItem() {
    return type === "label" ? <MarsInput readOnly value={props.value || ""} /> : <Component {...props}></Component>
  }

  return (
    <>
      <Col span={8}> {props.label}</Col>
      <Col span={16}>{StyleItem()}</Col>
    </>
  )
}

interface MarsAttrProps {
  style: any
  customType?: string
  graphicType: string
  parentType?: string
  isParent?: boolean
  onChange?: (value?: any, key?: string) => void
}

export default function MarsStyle({ style, customType, graphicType, parentType = null, isParent = false, onChange = () => {} }: MarsAttrProps) {
  // 样式和配置
  const [styleValue, setStyleValue] = useState<any>({}) // 矢量数据样式属性对象
  const [viewStyles, setViewStyles] = useState<any[]>([]) // 当前状态下显示的属性数组

  // 材质 和 子级材质
  const [viewMaterials, setViewMaterials] = useState<any[]>([]) // 当前状态下显示的材质属性数组
  const [nextViewMaterials, setNextViewMaterials] = useState<any[]>([]) // 二级菜单下显示的材质属性数组

  // label配置
  const [viewLabels, setViewLabels] = useState<any[]>([]) // label 注记对象显示的属性数组

  // 类型
  const [styleType, setStyleType] = useState("") // 样式类型

  useEffect(() => {
    // console.log("样式信息更新", graphicType, customType)
    if (!graphicType && !customType) {
      return
    }

    if (parentType) {
      setDefault({ show: !!style, ...style }) // 处理初始化默认值（不做任何修改之前的状态）
    } else if (style) {
      setDefault({ ...style }) // 处理初始化默认值（不做任何修改之前的状态）
    }
  }, [customType, graphicType])

  function getViewShow(config) {
    if (typeof config.show === "function") {
      return config.show
    } else {
      return () => config?.show ?? false
    }
  }

  function getViewDefval(config, styleOptions) {
    if (typeof config.defval === "function") {
      return config.defval(style ?? {}, graphicType)
    } else {
      return config.defval
    }
  }
  function getCollapseName() {
    if (parentType) {
      return `${styleConfigAll[graphicType]?.name}样式`
    }
    return "样式信息"
  }
  function stylePanIsHidden() {
    if (parentType) {
      return styleValue.show ?? !!styleValue
    }
    return !!viewStyles
  }
  // ************************************************ 初始化
  // 设置初始化的默认值
  function setDefault(newStyleValue) {
    const styleOptions = { ...newStyleValue }

    const styleConfig = styleConfigAll[customType] || styleConfigAll[graphicType]
    if (!styleConfig) {
      return
    }

    setStyleType(styleConfig.type)
    setViewStyles([...styleConfig.style])

    let materialTypeOption

    styleConfig.style.forEach((item: any) => {
      item.show = getViewShow(item) // 统一将 show 处理为函数

      if (item.next) {
        if (!styleOptions[item.name]) {
          styleOptions[item.name] = {}
        }
        let val = null
        if (item.contant && newStyleValue[item.contant]) {
          val = newStyleValue[item.contant]
        }
        styleOptions[item.name][item.next] = styleOptions[item.name][item.next] ?? val ?? getViewDefval(item, styleOptions) // 数据中没有的地方使用默认值

        if (item.next === "materialType") {
          const nextViewMaterialsConfig = setMaterial(styleOptions[item.name], item)
          setNextViewMaterials(nextViewMaterialsConfig)
        }
      } else {
        styleOptions[item.name] = styleOptions[item.name] ?? getViewDefval(item, styleOptions) // 数据中没有的地方使用默认值
        if (item.name === "materialType") {
          materialTypeOption = item
        }
      }
    })

    const viewMaterialsConfig = setMaterial(styleOptions, materialTypeOption)
    setViewMaterials(viewMaterialsConfig)

    if (styleOptions?.label) {
      setLabelDefault({ ...styleOptions })
    } else {
      setStyleValue(styleOptions)
    }
  }

  function setLabelDefault(styleOptions) {
    if (styleConfigAll?.label?.style) {
      setViewLabels([...styleConfigAll?.label?.style])
      styleConfigAll?.label?.style.forEach((item: any) => {
        item.show = getViewShow(item) // 统一将 show 处理为函数
        styleOptions.label[item.name] = styleOptions.label[item.name] ?? getViewDefval(item, styleOptions.label) // 数据中没有的地方使用默认值
      })
    }
    setStyleValue(styleOptions)
  }

  function setMaterial(dataRef: any, materialTypeOption: any) {
    /**
     * 设置材质,没有材质但有color值时，默认是Color，都没有值时，默认为null
     * 材质同一类但有多个不同参数设置时，根据-*区分的(如LineFlow-2)，使用workMaterialType记录下，便于业务区分
     */
    function getMaterialType() {
      if (dataRef.workMaterialType) {
        dataRef.materialType = dataRef.workMaterialType
        return dataRef.materialType
      } else if (dataRef.materialType) {
        return dataRef.materialType
      } else {
        return "Color"
      }
    }
    const materialType = getMaterialType()

    if (materialType && materialTypeOption) {
      if (!dataRef.materialOptions) {
        dataRef.materialOptions = {}
      }

      const realyMaterialType = materialType.split("-")[0]
      const materialResult = materialTypeOption.data.find((item) => item.value === realyMaterialType)
      const defval = materialResult?.defval ?? {}
      const viewMaterialsConfig = [...(materialConfig[realyMaterialType] ?? [])]

      viewMaterialsConfig.forEach((p) => {
        const val = dataRef.materialOptions[p.name]
        // 初始化进入默认值的取值顺序 1. 本身属性 2. style中的属性 3. style.js 材质默认值 4. material.js 的默认值
        dataRef.materialOptions[p.name] = val ?? dataRef[p.name] ?? defval[p.name] ?? getViewDefval(p, dataRef.materialOptions)

        // 纯色材质特殊处理下
        if (materialType === "Color") {
          dataRef[p.name] = dataRef.materialOptions[p.name]
        }

        p.show = getViewShow(p)
      })

      return viewMaterialsConfig
    }
    return null
  }
  // ************************************************ 修改、更新
  // 多个类型作为参数
  const changeSwitch = (value) => {
    styleValue.show = value

    changeValue({ show: value })
  }

  // 非材质属性改变
  function unionChange(item: any, value: any, selectOptions?: any[]) {
    const name = item.name

    if (name === "fill" || name === "outline") {
      styleValue[name] = value

      if (styleValue.fill === false && styleValue.outline === false) {
        $message("填充和边框不能同时为否")
        styleValue[name] = true
        return
      }
    }

    if (item.next) {
      styleValue[name][item.next] = value
      if (item.next === "materialType") {
        // 设置材质属性的默认值
        let defval = {}
        if (selectOptions) {
          const mOp = selectOptions.find((item) => item.value === styleValue[name].materialType) // 当前选项的材质属性配置
          if (mOp) {
            defval = mOp.defval ?? {}
          }
          const materialType = styleValue[name]?.materialType?.split("-")[0]

          const materialOptions = {}
          const nextViewMaterialsConfig = [...(materialConfig[materialType] ?? [])]
          nextViewMaterialsConfig.forEach((p) => {
            // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.js 的默认值
            materialOptions[p.name] = defval[p.name] ?? getViewDefval(p, materialOptions)
            p.show = getViewShow(p)
          })

          setNextViewMaterials(nextViewMaterialsConfig)
          styleValue[name].materialOptions = materialOptions
        }
      }
    } else {
      styleValue[name] = value
      // 材质类型 materialType 改变时的特殊处理
      if (name === "materialType") {
        // 设置材质属性的默认值
        let defval = {}
        if (selectOptions) {
          const mOp = selectOptions.find((item) => item.value === styleValue.materialType) // 当前选项的材质属性配置
          if (mOp) {
            defval = mOp.defval ?? {}
          }
        }
        const materialType = styleValue.materialType.split("-")[0]
        const materialOptions = {}
        const viewMaterialsConfig = [...(materialConfig[materialType] ?? [])]
        viewMaterialsConfig.forEach((p) => {
          // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.js 的默认值
          materialOptions[p.name] = defval[p.name] ?? getViewDefval(p, materialOptions)
          p.show = getViewShow(p)
        })

        setViewMaterials(viewMaterialsConfig)
        styleValue.materialOptions = materialOptions
      }
    }
    // 控制图层样式改变
    setTimeout(() => {
      if (item.next) {
        updateNextStyle(item.name, item.next)
        return
      }
      const val = styleValue[item.name]
      const data: Record<string, any> = {
        [item.name]: item.name === "materialType" ? val.split("-")[0] : val
      }

      // 材质类型 materialType 改变时的特殊处理
      if (item.name === "materialType") {
        data.materialOptions = { ...styleValue.materialOptions }
        // 材质同一类但有多个不同参数设置时，根据-*区分的(如LineFlow-2)，使用workMaterialType记录下，便于业务区分
        data.workMaterialType = val
      }

      // console.log("修改了普通参数", data)
      changeValue(data)
    }, 200)
  }

  function materialChange(item, value) {
    // console.log("更换了材质类型", item)

    styleValue.materialOptions[item.name] = value
    setStyleValue({ ...styleValue })

    // 控制图层材质改变
    setTimeout(() => {
      let changeVal = null
      // 纯色样式 - 直接改style内参数，否则面板会以style内color值为主，mars3d的效果以materialOptions内color值为主，导致不一致
      if (!styleValue.materialType || styleValue.materialType === "Color") {
        changeVal = { color: styleValue.materialOptions.color, materialOptions: { ...styleValue.materialOptions } }
      } else {
        changeVal = { materialOptions: { ...styleValue.materialOptions } }
      }
      // console.log("修改了材质 changeVal", changeVal)
      changeValue(changeVal)
    }, 200)
  }
  // ************************************************ 子级参数
  function updateNextStyle(parent: string, param: string) {
    const val = styleValue[parent][param]

    const data: Record<string, any> = {
      [param]: param === "materialType" ? val.split("-")[0] : val
    }

    // 材质类型 materialType 改变时的特殊处理
    if (param === "materialType") {
      data.materialOptions = { ...styleValue[parent].materialOptions }
      // 材质同一类但有多个不同参数设置时，根据-*区分的(如LineFlow-2)，使用workMaterialType记录下，便于业务区分
      data.workMaterialType = val
    }

    // console.log("修改 updateNextStyle 子级普通参数", data)
    changeValue({ [parent]: data }, parent)
  }

  function nextMaterialChange(_material: any, value: any, item: any) {
    // console.log("nextMaterialChange 修改子级材质", item)

    styleValue[item.name].materialOptions[_material.name] = value
    setStyleValue({ ...styleValue })
    // 控制图层材质改变
    setTimeout(() => {
      let changeVal = null
      // 纯色样式 - 直接改style内参数，否则面板会以style内color值为主，mars3d的效果以materialOptions内color值为主，导致不一致
      if (!styleValue[item.name].materialType || styleValue[item.name].materialType === "Color") {
        changeVal = {
          [item.name]: {
            ...styleValue[item.name],
            materialOptions: { ...styleValue[item.name].materialOptions },
            color: styleValue[item.name].materialOptions.color
          }
        }
      } else {
        changeVal = {
          [item.name]: {
            ...styleValue[item.name],
            materialOptions: { ...styleValue[item.name].materialOptions }
          }
        }
      }
      changeValue(changeVal)
    }, 200)
  }
  // ************************************************ label相关处理
  // 更新属性的显示隐藏，通过配置中的show属性来控制
  function labelChange(item: any, value) {
    styleValue.label[item.name] = value
    // console.log("修改了注记参数", styleValue.label)

    setStyleValue({ ...styleValue, label: { ...styleValue.label } })
    // 控制图层样式改变
    setTimeout(() => {
      const label: Record<string, any> = {
        [item.name]: styleValue.label[item.name]
      }
      // console.log("修改了注记参数", label)
      changeValue({ label }, "label")
    }, 200)
  }

  function changeValue(changeVal, key?: string) {
    let obj = changeVal
    let changeKey = key
    if (parentType) {
      obj = { [graphicType]: changeVal }
      changeKey = graphicType
    }

    // console.log("修改的操作", { ...obj }, changeKey)
    onChange(obj, changeKey)
  }

  const items = [
    {
      key: "1",
      label: getCollapseName(),
      showArrow: false,
      children: (
        <Row gutter={[0, 10]}>
          {parentType ? (
            <StyleComp
              label={"是否配置"}
              size="small"
              type=""
              right={
                <MarsSwitch
                  checked={styleValue?.show}
                  onChange={(data) => {
                    changeSwitch(data)
                  }}
                ></MarsSwitch>
              }
            ></StyleComp>
          ) : (
            <>
              <StyleComp label={"标号类型"} size="small" type={"label"} right={<span>{graphicType}</span>}></StyleComp>
              <StyleComp label={"样式类型"} size="small" type={"label"} right={<span>{styleType}</span>}></StyleComp>
            </>
          )}
          {styleValue &&
            stylePanIsHidden() &&
            viewStyles.map((item, i) => (
              <Fragment key={i}>
                {item?.next
                  ? item.show({ style, allStyle: styleValue, graphicType, parentType }) && (
                      <StyleComp
                        label={item.label}
                        size="small"
                        type={item.type}
                        value={styleValue[item.name][item.next]}
                        min={item.min || item.min === 0 ? item.min : -Infinity}
                        max={item.max || item.max === 0 ? item.max : Infinity}
                        step={item.step || 0.1}
                        options={item.data || []}
                        onChange={(e) => {
                          unionChange(item, e instanceof Object ? e.target.value : e, item.data)
                        }}
                        tofixed={item.toFixed}
                      ></StyleComp>
                    )
                  : item.show({ style, allStyle: styleValue, graphicType, parentType }) && (
                      <StyleComp
                        label={item.label}
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
                        tofixed={item.toFixed}
                      ></StyleComp>
                    )}
                {item.name === "materialType" &&
                  viewMaterials &&
                  styleValue.materialOptions &&
                  viewMaterials.map(
                    (material, mi) =>
                      material.show({ allStyle: styleValue, style, graphicType, parentType }) && (
                        <StyleComp
                          label={material.label}
                          size="small"
                          key={mi}
                          type={material.type}
                          value={styleValue.materialOptions[material.name]}
                          min={material.min || material.min === 0 ? material.min : -Infinity}
                          max={material.max || material.max === 0 ? material.max : Infinity}
                          step={material.step || 0.1}
                          options={material.data || []}
                          onChange={(e) => {
                            materialChange(material, e instanceof Object ? e.target.value : e)
                          }}
                        ></StyleComp>
                      )
                  )}

                {/* 下一级中有材质参数的 */}
                {item.next === "materialType" &&
                  nextViewMaterials &&
                  styleValue[item.name].materialOptions &&
                  item.show({ style, allStyle: styleValue, graphicType, parentType }) &&
                  nextViewMaterials.map(
                    (material, mi) =>
                      material.show({ allStyle: styleValue, style, graphicType, parentType }) && (
                        <StyleComp
                          label={material.label}
                          size="small"
                          key={mi}
                          type={material.type}
                          value={styleValue[item.name].materialOptions[material.name]}
                          min={material.min || material.min === 0 ? material.min : -Infinity}
                          max={material.max || material.max === 0 ? material.max : Infinity}
                          step={material.step || 0.1}
                          options={material.data || []}
                          onChange={(e) => {
                            nextMaterialChange(material, e instanceof Object ? e.target.value : e, item)
                          }}
                        ></StyleComp>
                      )
                  )}
              </Fragment>
            ))}
        </Row>
      )
    }
  ]

  function getItems(items) {
    if (styleValue && styleValue.label && !isParent && !parentType) {
      items.push({
        key: "2",
        label: "+ 注记信息",
        showArrow: false,
        children: (
          <Row gutter={[0, 10]}>
            {viewLabels.map(
              (item, i) =>
                item.show({ allStyle: styleValue.label, style: style.label, graphicType: "label" }) && (
                  <StyleComp
                    label={item.label}
                    size="small"
                    key={i}
                    type={item.type}
                    value={styleValue.label[item.name]}
                    min={item.min || item.min === 0 ? item.min : -Infinity}
                    max={item.max || item.max === 0 ? item.max : Infinity}
                    step={item.step || 0.1}
                    options={item.data || []}
                    onChange={(e) => {
                      labelChange(item, e instanceof Object ? e.target.value : e)
                    }}
                    tofixed={item.toFixed}
                  ></StyleComp>
                )
            )}
          </Row>
        )
      })
    }
    return items
  }

  return <MarsCollapse defaultActiveKey={["1", "2"]} items={getItems(items)}></MarsCollapse>
}
