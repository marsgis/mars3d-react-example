import { forwardRef, useImperativeHandle, useReducer, useMemo, ReactElement } from "react"
import {
  MarsInput,
  MarsTextArea,
  MarsInputNumber,
  MarsSelect,
  MarsCheckboxGroup,
  MarsForm,
  MarsFormItem,
  MarsRadioGroup,
  MarsSlider,
  MarsSwitch,
  MarsColor,
  MarsInputGroup
} from "../index"
import "./index.less"

const components = {
  input: MarsInput,
  color: MarsColor,
  textarea: MarsTextArea,
  number: MarsInputNumber,
  select: MarsSelect,
  radio: MarsRadioGroup,
  slider: MarsSlider,
  switch: MarsSwitch,
  checkbox: MarsCheckboxGroup,
  inputGroup: MarsInputGroup
}

export interface GuiItem {
  type: string
  field?: string
  label?: string
  tooltip?: string
  extra?: any
  extraWidth?: number
  min?: number
  max?: number
  step?: number
  range?: boolean
  placeholder?: string
  options?: any[]
  value?: string | boolean | number | any
  units?: string[]
  show?: boolean | ((data: any) => boolean)
  change?: (value: any, dataObj: any) => any
  element?: ReactElement
}

interface MarsGuiProps {
  options: GuiItem[]
  formProps?: any
  className?: string
}

function ItemComponent({ type, extraWidth = 100, extraContent, onChange, ...props }) {
  const Componnet = components[type]

  const componentStyle = extraContent
    ? {
        width: `calc(100% - ${extraWidth}px)`,
        display: "inline-block",
        marginRight: "10px"
      }
    : {
        display: "inline-block",
        width: "100%"
      }
  return (
    <>
      <div style={componentStyle}>
        <Componnet {...props} onChange={onChange}></Componnet>
      </div>
      {extraContent}
    </>
  )
}

function reducer(state, { type, ...action }): GuiItem[] {
  const newList = [].concat(state)
  switch (type) {
    case "update":
      return action.list
    case "updateItem":
      return newList.map((item, i) => {
        if (item.field === action.field) {
          item = {
            ...item,
            ...action
          }
        }
        return item
      })
    case "insert":
      action.items.forEach((item) => {
        newList.splice(action.index, 0, mergeItemOption(item))
      })
      return newList
    case "delete": {
      let index: number
      const { key } = action
      if (typeof key === "string") {
        newList.forEach((item, i) => {
          if (item.field === key) {
            index = i
          }
        })
      }
      if (typeof key === "number" && key >= 0 && key < state.length) {
        index = key
      }
      if (index !== undefined) {
        newList.splice(index, 1)
      }
      return newList
    }
    case "updateField":
      return newList.map((item) => {
        if (item.field === action.field) {
          item.value = action.value
        }
        return item
      })
    case "updateExtra":
      return newList.map((item) => {
        if (item.field === action.field) {
          item.extra = mergeExtra(action.value)
        }
        return item
      })
    default:
      throw new Error()
  }
}

export const MarsGui = forwardRef<any, MarsGuiProps>(
  (
    {
      options,
      formProps = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 }
      },
      className = ""
    },
    ref
  ) => {
    const [renderOptions, dispatch] = useReducer(
      reducer,
      options.map((item) => mergeItemOption(item))
    )

    const [form] = MarsForm.useForm()

    const originFormData = useMemo(() => {
      const modelValues: Record<string, any> = {}
      options.forEach((item) => {
        if (item.type !== "custom") {
          modelValues[item.field] = item.value
        }
      })
      return modelValues
    }, [options])

    const attrForm = useMemo(() => {
      const modelValues: Record<string, any> = {}
      renderOptions.forEach((item) => {
        if (item.type !== "custom") {
          modelValues[item.field] = item.value
        }
      })
      return modelValues
    }, [renderOptions])

    useImperativeHandle(ref, () => ({
      // 根据字段名或者索引删除一个元素
      delete: (key: string | number) => {
        dispatch({
          type: "delete",
          key
        })
      },
      // 在指定位置插入 一个 或 多个 元素
      insert(index: number, ...items: GuiItem[]) {
        dispatch({
          type: "insert",
          index,
          items
        })
      },
      // 更新字段值
      updateField(field: string, value) {
        form.setFieldsValue({ [field]: value })
        dispatch({
          type: "updateField",
          field,
          value
        })
      },

      updateFields(fieldObj: any) {
        const fieldArr = Object.keys(fieldObj)
        fieldArr.forEach((item) => {
          form.setFieldsValue({ [item]: fieldObj[item] })
          dispatch({
            type: "updateField",
            item,
            value: fieldObj[item]
          })
        })
      },
      // 批量更新

      // 更新额外显示信息
      updateExtra(field: string, value) {
        dispatch({
          type: "updateExtra",
          field,
          value
        })
      },
      reset() {
        dispatch({
          type: "update",
          list: options.map((item) => mergeItemOption(item))
        })
        form.resetFields()
        return { ...originFormData }
      },
      // 获取字段值
      getValue(field: string) {
        return form.getFieldValue(field)
      },
      // 获取全部字段值
      getValues() {
        return form.getFieldsValue(true)
      }
    }))

    return (
      <div className={`mars-gui ${className}`}>
        <MarsForm initialValues={originFormData} {...formProps} form={form}>
          {renderOptions
            .filter((item) => {
              const show = item.show as any
              return show(attrForm)
            })
            .map(({ show, value, label, field, type, change, extra, element, tooltip, ...item }, i) => {
              const extraContent = extra ? extra(attrForm) : ""
              return (
                <MarsFormItem label={label || ""} name={field} tooltip={tooltip} key={i}>
                  {type === "custom" ? (
                    element
                  ) : (
                    <ItemComponent
                      type={type}
                      extraContent={extraContent}
                      {...item}
                      onChange={(data) => {
                        const val = data.target instanceof Object ? data.target.value : data
                        dispatch({
                          type: "updateItem",
                          field,
                          value: val
                        })
                        const newFormData = {
                          ...attrForm,
                          [field]: val
                        }
                        change && change(val, newFormData)
                      }}
                    ></ItemComponent>
                  )}
                </MarsFormItem>
              )
            })}
        </MarsForm>
      </div>
    )
  }
)

function mergeItemOption(item: any) {
  // show字段转为function
  if (typeof item.show !== "function") {
    const show = item.show
    item.show = () => (show === undefined ? true : !!show)
  }

  // extra 字段转为function
  item.extra = mergeExtra(item.extra)
  return item
}

function mergeExtra(extra) {
  let extraNew = extra
  if (typeof extraNew !== "function" && extraNew) {
    extraNew = (data) => {
      if (typeof extra === "string") {
        let str = extra
        const paramsPattern = /[^{\}]+(?=})/g
        const extractParams = str.match(paramsPattern) || []
        extractParams.forEach((key) => {
          str = str.replace(new RegExp(`{${key}}`, "g"), data[key])
        })
        return str
      } else {
        return extra
      }
    }
  }
  return extraNew
}
