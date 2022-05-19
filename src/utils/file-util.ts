/**
 * 文件处理相关 静态Util方法
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */

export const downloadFile = (fileName: string, string: string) => {
  const blob = new Blob([string])
  const aLink = document.createElement("a")
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}
