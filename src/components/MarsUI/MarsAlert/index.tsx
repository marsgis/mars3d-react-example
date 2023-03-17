import { Modal } from "antd"
import "./index.less"

/**
 * alert 弹出框
 * @export
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-01
 * @returns {void}
 */

export const $alert = (content: any, title = "提示", type: keyof typeof Modal = "info") => {
  if (Modal[type] && typeof Modal[type] === "function") {
    return new Promise((resolve, reject) => {
      const func = Modal[type] as (a: any) => any
      func({
        title,
        content,
        okType: "default",
        okText: "确定",
        icon: null,
        className: "mars-global-alert",
        onOk() {
          resolve(true)
        },
        onCancel() {
          reject(new Error("用户取消"))
        }
      })
    })
  } else {
    return Promise!.reject()
  }
}
