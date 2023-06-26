import { MarsCheckbox, MarsButton, MarsPannel } from "@mars/components/MarsUI"
import "./canvas.css"
import { Space } from "antd"
import * as mapWork from "./map.js"
import * as canvasWork from "./CanvasEdit.js"
import { useState, useEffect } from "react"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"

let drawVideoCanvas
function UIComponent() {
  const [uVList, setUVList] = useState([])

  useEffect(() => {
    if (uVList.length >= 3) {
      mapWork.updateROI(uVList)
    }
  }, [uVList.length])

  useEffect(() => {
    const drawVideo = document.getElementById("drawVideo")
    drawVideoCanvas = new canvasWork.CanvasEdit(drawVideo)
    drawVideo.addEventListener("mousemove", () => {
      setUVList(canvasWork.uvList)
    })
  }, [])

  const [isDrawing, setIsDrawing] = useState(false)
  function draw() {
    if (isDrawing) {
      // 处于绘制状态，将要停止绘制
      drawVideoCanvas.edit(isEdit)
    } else {
      // 处于停止绘制状态，将要开始绘制
      clear()
      drawVideoCanvas.draw()
    }

    const newDrawing = !isDrawing
    console.log("newDrawing", newDrawing)
    setIsDrawing(newDrawing)
    console.log("isDrawing", isDrawing)
  }

  function clear() {
    drawVideoCanvas.clear()
    mapWork.clearROI()
    setUVList([])
  }

  const [isEdit, setIsEdit] = useState(true)
  function chooseEdit(e: any) {
    setIsEdit(e.target.checked)
    drawVideoCanvas.edit(e.target.checked)
  }

  const [isChoosePoint, setIsChoosePoint] = useState(false)
  function choosePoint(e: any) {
    setIsChoosePoint(e.target.checked)
    mapWork.choosePoint(e.target.checked)
  }

  return (
    <MarsPannel visible={true} right="10" top="10">
      <GraphicLayerState defaultCount={10} />

      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">编辑Canvas:</span>

          <MarsButton onClick={draw}>{isDrawing ? "停止绘制" : "开始绘制"}</MarsButton>
          <MarsButton onClick={clear}>清除</MarsButton>

          <MarsCheckbox checked={isEdit} onChange={chooseEdit}>
            编辑点
          </MarsCheckbox>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">编辑矢量面:</span>

          <MarsCheckbox checked={isChoosePoint} onChange={choosePoint}>
            编辑网格点
          </MarsCheckbox>
        </Space>
      </div>

      <div className="canvas-container">
        <canvas className="drawCanvas" width="360" height="202" id="drawVideo">
          不支持canvas
        </canvas>
        <video muted className="video_test" autoPlay loop width="360" height="202" id="videotest" src="//data.mars3d.cn/file/video/lukou.mp4"></video>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
