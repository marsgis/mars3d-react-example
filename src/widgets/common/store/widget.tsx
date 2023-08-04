/**
 * store 状态管理
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import { Suspense } from "react"
import { v4 as uuidV4 } from "uuid"
import { createStore } from "redux"
import { connect, Provider } from "react-redux"

// 为 store state 声明类型
export interface DefaultOption {
  autoDisable?: boolean
  disableOther?: boolean | string[]
  group?: string // group相同的widget一定是互斥的
  meta?: any // 额外参数 不会在每次关闭后清除
}

export interface Widget {
  name: string // 唯一标识
  key?: string // 作为组件 diff 环节的key，用于控制组件重载
  component?: any // widget关联的异步组件
  autoDisable?: boolean // 是否能够被自动关闭
  disableOther?: boolean | string[] // 是否自动关闭其他widget,或通过数组指定需要被关闭的widget
  group?: string // group相同的widget一定是互斥的
  visible?: boolean // 显示隐藏
  data?: any // 额外传参 会在每次关闭后清除
  meta?: any // 额外参数 不会在每次关闭后清除
}

export interface WidgetState {
  widgets?: Widget[]

  openAtStart?: string[]

  defaultOption?: DefaultOption
}

const getWidgetAttr = (widget: Widget) => {
  let attr = {}
  if (widget.meta && widget.meta.props) {
    attr = {
      ...attr,
      ...widget.meta.props
    }
  }
  if (widget.data && widget.data.props) {
    attr = {
      ...attr,
      ...widget.data.props
    }
  }
  return attr
}

let store = null

export const connectWidget = (ele) => {
  return connect((state: WidgetState) => ({
    widgets: state.widgets
  }))(ele)
}

export const disable = (widget: string | string[]) => {
  store.dispatch({
    type: "disable",
    widget
  })
}

export const activate = (widget: Widget | string) => {
  store.dispatch({
    type: "activate",
    widget
  })
}

export const disableAll = (force = false) => {
  store.dispatch({
    type: "disableAll",
    force
  })
}

export const updateWidget = (widget: string, data: any) => {
  store.dispatch({
    type: "update",
    widget,
    data
  })
}

export const isActive = (widget: string) => {
  const widgets = store.getState().widgets || []

  const thisWidget = widgets.find((w) => w.name === widget)
  return thisWidget && thisWidget.visible
}

const WidgetView = connect((state: WidgetState) => ({
  widgets: state.widgets
}))((props: WidgetState) => {
  console.log("数据更新")

  return (
    <>
      {props.widgets
        .filter((widget) => widget.visible)
        .map((widget) => {
          const WidgetComponent = widget.component
          return (
            <Suspense fallback={<div></div>} key={widget.key}>
              <WidgetComponent
                {...getWidgetAttr(widget)}
                visible={widget.visible}
                onClose={() => disable(widget.name)}
                currentWidget={{ ...widget }}
              />
            </Suspense>
          )
        })}
    </>
  )
})

export const generateWidgetView = (options: WidgetState) => {
  if (!options) {
    throw new Error("generateWidgetView参数不能为空")
  }

  const defaultOption = {
    autoDisable: true,
    disableOther: false,
    ...options.defaultOption
  }
  const openAtStart = options.openAtStart || []

  const widgets = options.widgets.map((item) => {
    return {
      visible: openAtStart.includes(item.name),
      ...defaultOption,
      ...item,
      meta: {
        ...defaultOption.meta,
        ...item.meta
      },
      key: uuidV4()
    }
  })

  store = createStore<any, any, any, any>(function (state = { widgets }, action) {
    switch (action.type) {
      case "disable": {
        const widgets = state.widgets
        let widget = action.widget

        if (typeof widget === "string") {
          widget = [widget]
        }

        return {
          widgets: widgets.map((item) => {
            if (widget.indexOf(item.name) !== -1) {
              delete item.data
              item.visible = false
            }
            return item
          })
        }
      }
      case "activate": {
        const widgets = state.widgets
        const { widget } = action
        const value = typeof widget === "string" ? widget : widget.name

        const pannel = widgets.find((item) => item.name === value)

        if (!pannel) {
          console.log("widget不存在", widget)
          return state
        }

        return {
          widgets: widgets.map((item) => {
            if (item.name === value) {
              // if (item.visible && reload) {
              //   // 会导致报错，无法进行重载操作
              //   item.key = uuidV4()
              // }

              // 处理data参数传递
              if (typeof widget === "object" && widget !== null && widget.data) {
                item.data = widget.data
              }

              item.visible = true
            } else {
              // 默认关闭同组
              if (pannel.group && item.group === pannel.group) {
                item.visible = false
              }
              // 关闭非同组需要关闭的面板
              if (Array.isArray(pannel.disableOther) && pannel.disableOther.includes(item.name)) {
                // 处理数组
                item.visible = false
              }
              if (pannel.disableOther === true && item.autoDisable === true) {
                item.visible = false
              }
            }
            return item
          })
        }
      }
      case "disableAll": {
        const { force } = action
        return {
          widgets: state.widgets.map((item: Widget) => {
            if (item.visible && (force || item.autoDisable)) {
              item.visible = false
            }
            return item
          })
        }
      }
      case "update": {
        const { widget, data } = action
        return {
          widgets: state.widgets.map((item) => {
            if (widget.indexOf(item.name) !== -1) {
              return {
                ...item,
                data
              }
            }
            return item
          })
        }
      }
      default:
        return state
    }
  })
  return ({ children }: any) => {
    return (
      <Provider store={store}>
        <WidgetView />
        {children}
      </Provider>
    )
  }
}
