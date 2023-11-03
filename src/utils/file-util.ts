/**
 * 文件处理相关 静态Util方法
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"

export const downloadFile = (fileName: string, string: string) => {
  const blob = new Blob([string])
  const aLink = document.createElement("a")
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}

/**
 * react 组件示例化为Popup的DOM
 *
 * @param {*} comp 传入的 react 组件
 * @return {*}  HTMLElement
 */
export function initReactPopup(comp) {
  const vNodeDom = document.createElement("div")
  const vNode = createRoot(vNodeDom)
  flushSync(() => {
    vNode.render(comp)
  })

  return vNodeDom
}
