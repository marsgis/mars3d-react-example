import { forwardRef, useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { MarsIcon } from "@mars/components/MarsUI"

import "./index.less"

interface Position {
  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
}

interface Props {
  warpper?: string // 容器id 默认是app，将作为定位的参照元素，一般不需要修改
  visible?: boolean // 是否显示

  width?: number | string // 初始宽度
  height?: number | string // 初始高度
  maxHeight?: number | string // 最大高度
  left?: number | string // 定位 left值
  right?: number | string // 定位right值
  position?: Position

  top?: number | string // 定位top值
  bottom?: number | string // 定位bottom值
  zIndex?: number // 层级
  customClass?: string // 自定义class
  closeable?: boolean
  children?: any
  onClose?: () => void
  beforeClose?: () => Promise<any> | boolean | void
}

const PannelElement = forwardRef<any, Props>(({ beforeClose, onClose, ...props }, ref) => {
  const pannelBox = useRef<any>()
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
    if (props.width) {
      pannelStyle.width = antoUnit(props.width)
    }
    if (!props.top || !props.bottom) {
      if (props.height) {
        pannelStyle.height = antoUnit(props.height)
      }
      if (props.maxHeight) {
        pannelStyle.maxHeight = antoUnit(props.maxHeight)
      }
    }
  }, [props.width, props.height, props.top, props.bottom])

  const close = useCallback(() => {
    pannelBox.current.style.display = "none"
    onClose && onClose()
  }, [pannelBox, onClose])

  const closeModel = useCallback(async () => {
    if (beforeClose && typeof beforeClose === "function") {
      const result = beforeClose()

      if (result instanceof Promise) {
        try {
          await result
          close()
        } catch (err) {
          console.log("取消关闭")
        }
      } else if (result !== false) {
        close()
      }
    } else {
      close()
    }
  }, [beforeClose, close])

  useEffect(() => {
    if (props.visible) {
      pannelBox.current.style.display = "block"
    } else {
      pannelBox.current.style.display = "none"
    }
  }, [props.visible])

  return (
    <div className={`mars-pannel ${props.customClass || ""}`} ref={pannelBox}>
      <div className="pannel-content" style={{ overflowY: props.height ? "auto" : "visible" }}>
        {props.children}
      </div>
      {props.closeable && (
        <div className="pannel-close-icon" onClick={closeModel}>
          <MarsIcon icon="close-one" width="20"></MarsIcon>
        </div>
      )}
    </div>
  )
})

export const MarsPannel = forwardRef<any, Props>(({ warpper, ...props }, ref) => {
  if (warpper) {
    const domNode = document.querySelector(warpper)
    return createPortal(<PannelElement {...props} ref={ref}></PannelElement>, domNode)
  }
  return <PannelElement {...props} ref={ref}></PannelElement>
})

// 处理传入的单位问题
function antoUnit(value: number | string) {
  if (typeof value === "number" || (typeof value === "string" && /^[0-9]*$/.test(value))) {
    return `${value}px`
  } else {
    return value
  }
}
