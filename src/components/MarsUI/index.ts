import "./function.less"
import { $message as MarsMessage } from "./MarsMessage"
import { $alert as MarsAlert } from "./MarsAlert"
import { $notify as MarsNotify } from "./MarsNotify"
import { $hideLoading as MarsHideLoading, $showLoading as MarsShowLoading } from "./MarsLoading"

export * from "./MarsInput"
export * from "./MarsColor"
export * from "./MarsInputNumber"
export * from "./MarsCheckBox"
export * from "./MarsRadio"
export * from "./MarsSelect"
export * from "./MarsSlider"
export * from "./MarsSwitch"
export * from "./MarsPannel"
export * from "./MarsGui"
export * from "./MarsIcon"
export * from "./MarsForm"
export * from "./MarsButton"
export * from "./MarsTree"
export * from "./MarsDialog"
export * from "./MarsDatePicker"
export * from "./MarsTabs"
export * from "./MarsCollapse"
export * from "./MarsTable"
export * from "./MarsDrowdown"
export * from "./MarsPagination"

export const $alert = MarsAlert
export const $notify = MarsNotify
export const $message = MarsMessage
export const $showLoading = MarsShowLoading
export const $hideLoading = MarsHideLoading

let marsUIConfig: Record<string, any> = {}

export const setConfig = (config) => {
  marsUIConfig = config
}

export const getConfig = () => {
  return marsUIConfig || {}
}

export default (config?: any) => {
  setConfig(config || {})
  window.$alert = MarsAlert
  window.$notify = MarsNotify
  window.$message = MarsMessage
  window.$showLoading = MarsShowLoading
  window.$hideLoading = MarsHideLoading
}
