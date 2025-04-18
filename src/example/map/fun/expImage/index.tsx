import { useState } from "react"
import * as mapWork from "./map.js"
import { MarsButton, MarsPannel, MarsDialog } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [showImage, setShowImageValue] = useState(false)
  const [imges, setImageValue] = useState("")

  return (
    <>
      <MarsPannel visible={true} right="10" top="10" width={200}>
        <Space wrap>
          <MarsButton
            onClick={() => {
              mapWork.showMapImg().then((image) => {
                setImageValue(image)
                setShowImageValue(true)
              })
            }}
          >
            查看场景出图(弹窗)
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.downLoad()
            }}
          >
            下载场景出图
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.downLoad2()
            }}
          >
            下载场景缩略图
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.showMapImg().then((image) => {
                setImageValue(image)
              })
            }}
          >
            截缩略图
          </MarsButton>

          {imges.length ? <img className="f-mb" alt="截缩略图" src={imges} style={{ width: "100%", height: "100%" }} /> : ""}
        </Space>
      </MarsPannel>

      <MarsDialog visible={showImage} onClose={() => setShowImageValue(false)} left="25%" top="30%" width="50%" title="查看场景出图">
        <img alt="查看场景出图" src={imges} style={{ width: "100%", height: "100%" }} />
      </MarsDialog>
    </>
  )
}

export default UIComponent
