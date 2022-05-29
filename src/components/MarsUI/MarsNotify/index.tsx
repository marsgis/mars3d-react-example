import { notification } from "antd"
import "./index.less"

/**
 * 消息提醒
 * @export
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-01-01
 * @returns { void }
 */
export const $notify = (message: any, description: any, options: any = {}, type: keyof typeof notification = "info") => {
  if (notification[type] && typeof notification[type] === "function") {
    return new Promise((resolve) => {
      notification.config({
        placement: "bottomRight",
        right: 20,
        ...options
      })
      const func = notification[type] as (a: any) => any
      func({
        message,
        description,
        icon: <></>,
        className: "mars-notify-message",
        onClose() {
          resolve(true)
        }
      })
    })
  } else {
    return Promise!.reject()
  }
}
