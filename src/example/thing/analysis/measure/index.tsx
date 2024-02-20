import { MarsPannel, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import { LocationTo } from "@mars/components/MarsSample/LocationTo.jsx"
import { Space, Upload } from "antd"
import { useCallback, useState } from "react"
import * as mapWork from "./map.js"

interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}
function UIComponent() {
  const [pickModel, setValue] = useState(false)

  const isChecked = useCallback((e: any) => {
    setValue(e.target.checked)
    mapWork.onlyVertexPosition(e.target.checked)
  }, [])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <div className="f-mb">
          <Space>
            <MarsButton onClick={clear}>清除</MarsButton>
            <MarsButton onClick={saveGeoJSON}>保存Json</MarsButton>
            <Upload multiple={false} name="file" accept="json,geojson" showUploadList={false} onChange={onClickOpenJson} beforeUpload={() => false}>
              <MarsButton>打开Json</MarsButton>
            </Upload>
            <MarsCheckbox checked={pickModel} onChange={isChecked}>
              开启顶点吸附
            </MarsCheckbox>
          </Space>
        </div>

        <div className="f-mb">
          <Space>
            <MarsButton onClick={measureLength}>空间距离</MarsButton>
            <MarsButton onClick={measureArea}>水平面积</MarsButton>
            <MarsButton onClick={measureHeight}>高度差</MarsButton>
            <MarsButton onClick={measurePoint}>坐标测量</MarsButton>
          </Space>
        </div>

        <div>
          <Space>
            <MarsButton onClick={measureSurfaceLength}>贴地距离</MarsButton>
            <MarsButton onClick={measureSurfaceeArea}>贴地面积</MarsButton>
            <MarsButton onClick={measureTriangleHeight}>三角测量</MarsButton>
            <MarsButton onClick={measureAngle}>方位角</MarsButton>
          </Space>
        </div>
      </MarsPannel>

      <LocationTo></LocationTo>
    </>
  )
}

// 空间距离
const measureLength = () => {
  mapWork.measureLength()
}
// 水平面积
const measureArea = () => {
  mapWork.measureArea()
}

// 高度差
const measureHeight = () => {
  mapWork.measureHeight()
}

// 坐标测量
const measurePoint = () => {
  mapWork.measurePoint()
}

// 贴地距离
const measureSurfaceLength = () => {
  mapWork.measureSurfaceLength()
}

// 贴地面积
const measureSurfaceeArea = () => {
  mapWork.measureSurfaceeArea()
}

// 三角测量
const measureTriangleHeight = () => {
  mapWork.measureTriangleHeight()
}
// 方位角
const measureAngle = () => {
  mapWork.measureAngle()
}

const clear = () => {
  mapWork.removeAll()
}

// 点击保存GeoJSON
const saveGeoJSON = () => {
  mapWork.saveJSON()
}

// 打开GeoJSON
function onClickOpenJson(info: FileInfo) {
  mapWork.openJSON(info.file)
}
export default UIComponent
