import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import "./index.less"
import { useMemo, useState } from "react"
function UIComponent() {
  const [openVideo, setOpenVideo] = useState(false)
  const [openPannel, setOpenPannel] = useState(true)
  useMemo(() => {
    mapWork.eventTarget.on("video", (item: any) => {
      setOpenVideo(item.openVideo)
    })
  }, [])

  const closePannel = () => {
    setOpenPannel(false)
  }

  const openPanel = () => {
    setOpenPannel(true)
  }

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <Space>
          <MarsButton onClick={() => mapWork.drawRectangle()}>框选</MarsButton>
          <MarsButton onClick={() => mapWork.drawCircle()}>圆形</MarsButton>
          <MarsButton onClick={() => mapWork.drawPolygon()}>多边形</MarsButton>
          <MarsButton>清除</MarsButton>
        </Space>
      </MarsPannel>

      {openVideo ? (
        <div className="videoWrap">
          {openPannel ? (
            <div className="openPanel">
              <div className="closeAction" onClick={closePannel}>
                收缩&gt;
              </div>
              <video width="420" muted={true}>
                <source src="//data.mars3d.cn/file/video/lukou.mp4" type="video/mp4" />
              </video>
            </div>
          ) : (
            ""
          )}

          <div>
            <MarsButton onClick={openPanel}>查看视频</MarsButton>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}
export default UIComponent
