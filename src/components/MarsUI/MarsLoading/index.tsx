import nprogress from "nprogress"
import "nprogress/nprogress.css"

/**
 * loading组件
 * @export
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-02-19
 * @returns { void }
 */
let loadingNum = 0
export const $showLoading = () => {
  loadingNum++
  nprogress.start()
  const interval = setInterval(() => {
    if (nprogress.isStarted() && nprogress.status < 0.8) {
      nprogress.set(nprogress.status + 0.1)
    } else {
      clearInterval(interval)
    }
  }, 500)
}
export const $hideLoading = () => {
  loadingNum = Math.max(0, --loadingNum)
  if (loadingNum === 0) {
    nprogress.done()
  }
}
