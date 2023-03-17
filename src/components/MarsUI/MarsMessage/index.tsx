import { message } from "antd"
import "./index.less"

/**
 * message 信息弹窗
 * @export
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-01
 * @returns {void}
 */

message.config({
  top: 100
})

export const $message = (msg: string, type: keyof typeof message = "info") => {
  if (message[type] && typeof message[type] === "function") {
    const func = message[type] as (a: any) => Promise<any>
    return func({
      className: "mars-message",
      content: msg
    })
  } else {
    return Promise!.reject()
  }
}
