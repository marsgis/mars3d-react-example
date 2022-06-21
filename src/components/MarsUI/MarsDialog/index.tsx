import { forwardRef, useRef, useEffect, useCallback, useMemo, ReactElement } from "react"
import { createPortal } from "react-dom"
import { MarsIcon } from "@mars/components/MarsUI"
import { getConfig } from "../index"

import "./index.less"

interface Position {
  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
}

interface Props {
  warpper?: string // 容器id 默认是app，将作为定位的参照元素，一般不需要修改
  title?: string // 弹框标题
  visible?: boolean // 是否显示
  width?: number | string // 初始宽度
  height?: number | string // 初始高度

  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
  position?: Position // 统一设置位置属性，优先级高于 left right top bottom

  handles?: boolean | string // 缩放控制器 默认 [x, y, xy]
  minWidth?: number // 最小宽度
  minHeight?: number // 最小高度
  maxWidth?: number // 最大宽度
  maxHeight?: number // 最大高度
  zIndex?: string // 层级
  customClass?: string // 自定义class

  children?: any
  footer?: ReactElement
  icon?: ReactElement

  onClose?: () => void
}

const defaultHandles = ["x", "y", "xy"]
const DialogElement = forwardRef<any, Props>(
  ({ handles = true, width = 200, minWidth = 100, minHeight = 100, maxWidth = 1000, maxHeight = 1000, icon, ...props }, ref) => {
    const pannelBox = useRef<HTMLDivElement>()
    useEffect(() => {
      const pannelStyle = pannelBox.current.style

      let left = props.left
      let right = props.right
      let top = props.top
      let bottom = props.bottom
      const zIndex = props.zIndex
      if (props.position) {
        left = props.position.left
        right = props.position.right
        top = props.position.top
        bottom = props.position.bottom
      }

      // 层级位置
      pannelStyle.zIndex = zIndex
      // 横向位置初始化
      if (left !== undefined) {
        pannelStyle.left = antoUnit(left)
      } else if (right !== undefined) {
        pannelStyle.right = antoUnit(right)
        pannelStyle.left = "initial"
      }
      // 纵向位置初始化
      if (top !== undefined) {
        pannelStyle.top = antoUnit(top)
      }
      if (bottom !== undefined) {
        pannelStyle.bottom = antoUnit(bottom)
      }
    }, [props.left, props.right, props.top, props.bottom, props.zIndex, props.position])

    useEffect(() => {
      const pannelStyle = pannelBox.current.style
      if (width) {
        pannelStyle.width = antoUnit(width)
      }
      if (!props.top || !props.bottom) {
        if (props.height) {
          pannelStyle.height = antoUnit(props.height)
        }
      }
    }, [width, props.height, props.top, props.bottom])

    const actualHandles = useMemo(() => {
      if (!handles) {
        return []
      }
      if (typeof handles === "string") {
        return handles.split("")
      }
      return defaultHandles
    }, [handles])

    const drag = useCallback(
      (event: any) => {
        const warpper = document.getElementById(props.warpper)
        const pb = pannelBox.current
        const x = event.clientX
        const y = event.clientY
        const bl = pb.offsetLeft
        const bt = pb.offsetTop
        const maxLeft = warpper!.offsetWidth - pb.offsetWidth
        const maxTop = warpper!.offsetHeight - pb.offsetHeight

        pb.style.height = antoUnit(pb.offsetHeight) // 处理没有height的情况

        addEvent(document.documentElement, "mousemove", toPointerPosition)
        addEvent(document.documentElement, "mouseup", handleUp)

        function toPointerPosition(e: any) {
          e.preventDefault()
          const distanceX = e.clientX - x
          const distanceY = e.clientY - y
          const left = bl + distanceX
          const top = bt + distanceY
          if (props.top && props.bottom) {
            pb.style.height = antoUnit(pb.offsetHeight)
            pb.style.bottom = "initial"
          }

          const xPos = Math.min(Math.max(0, left), maxLeft)
          const yPos = Math.min(Math.max(0, top), maxTop)
          pb.style.left = `${xPos}px`
          pb.style.top = `${yPos}px`
        }

        function handleUp(e: any) {
          e.preventDefault()
          removeEvent(document.documentElement, "mousemove", toPointerPosition)
          removeEvent(document.documentElement, "mouseup", handleUp)
        }
      },
      [pannelBox, props.bottom, props.top, props.warpper]
    )

    const setSize = useCallback(
      (handleName: string, event: any) => {
        const x = event.clientX
        const y = event.clientY
        const bw = pannelBox.current!.offsetWidth || 0
        const bh = pannelBox.current!.offsetHeight || 0
        addEvent(document.documentElement, "mousemove", handleMove)
        addEvent(document.documentElement, "mouseup", handleUp)

        function handleMove(e: any) {
          e.preventDefault()
          let width = 0
          let height = 0
          if (handleName.indexOf("x") !== -1) {
            width = Math.min(Math.max(minWidth, bw + e.clientX - x, 0), maxWidth)
            pannelBox.current.style.width = `${width}px`
          }
          if (handleName.indexOf("y") !== -1) {
            height = Math.min(Math.max(minHeight, bh + e.clientY - y, 0), maxHeight)
            pannelBox.current.style.height = `${height}px`
          }
        }

        function handleUp(e: any) {
          e.preventDefault()
          removeEvent(document.documentElement, "mousemove", handleMove)
          removeEvent(document.documentElement, "mouseup", handleUp)
        }
      },
      [pannelBox, minWidth, minHeight, maxWidth, maxHeight]
    )

    useEffect(() => {
      if (props.visible) {
        pannelBox.current.style.display = "block"
      } else {
        pannelBox.current.style.display = "none"
      }
    }, [props.visible])

    const close = useCallback(() => {
      pannelBox.current.style.display = "none"
      props.onClose && props.onClose()
    }, [props])

    return (
      <div className="mars-dialog" ref={pannelBox}>
        <div className="mars-dialog__header" onMouseDown={drag}>
          <span className="icon">{icon && icon}</span>
          <span className="title"> {props.title} </span>
          <MarsIcon icon="close" width="18" className="close-btn" onClick={close}></MarsIcon>
        </div>
        <div className={`mars-dialog__body ${props.footer ? "" : "full-content"}`}>
          <div className="content">{props.children}</div>
          {props.footer && (
            <div className="footer">
              <div className="footer-content">{props.footer}</div>
            </div>
          )}
        </div>
        {actualHandles.map((handle) => (
          <div key={handle} className={`handle handle-${handle}`} onMouseDown={(e) => setSize(handle, e)}></div>
        ))}
      </div>
    )
  }
)

export const MarsDialog = forwardRef<any, Props>(({ warpper = "", ...props }, ref) => {
  const CONFIG = getConfig()
  let newWarpper = warpper

  let globalConfig: Record<string, any> = {}
  if (CONFIG.dialog) {
    globalConfig = CONFIG.dialog
  }
  if (!newWarpper) {
    newWarpper = globalConfig.warpper || "mars-main-view"
  }
  if (newWarpper) {
    const domNode = document.querySelector(`#${newWarpper}`)
    return createPortal(<DialogElement warpper={newWarpper} {...props} ref={ref}></DialogElement>, domNode)
  }
  return <DialogElement warpper="mars-main-view" {...props} ref={ref}></DialogElement>
})

// 处理传入的单位问题
function antoUnit(value: number | string) {
  if (typeof value === "number" || (typeof value === "string" && /^[0-9]*$/.test(value))) {
    return `${value}px`
  } else {
    return value
  }
}

// 事件绑定处理
function addEvent(el: any, event: any, handler: (e: any) => void) {
  if (!el) {
    return
  }
  if (el.attachEvent) {
    el.attachEvent(`on${event}`, handler)
  } else if (el.addEventListener) {
    el.addEventListener(event, handler)
  } else {
    el[`on${event}`] = handler
  }
}
// 事件解除绑定
function removeEvent(el: any, event: any, handler: (e: any) => void) {
  if (!el) {
    return
  }
  if (el.detachEvent) {
    el.detachEvent(`on${event}`, handler)
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler)
  } else {
    el[`on${event}`] = null
  }
}
