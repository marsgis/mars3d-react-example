declare module "@mars/widgets/common/store/widget" {
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

  export const connectWidget: (ele) => any

  export const disable: (widget: string | string[]) => any

  export const activate: (widget: Widget | string, reload?: boolean) => any

  export const disableAll: (force?: boolean) => any

  export const updateWidget: (widget: string, data: any) => void

  export const isActive: (widget: string) => any

  export const WidgetView: (state: WidgetState) => any

  export const generateWidgetView: (options: WidgetState) => any
}
