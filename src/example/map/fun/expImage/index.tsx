import { useState } from "react"
import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [showImage, setShowImageValue] = useState(false)
  const [imges, setImageValue] = useState("")

  return (
    <>
      <MarsPannel visible={true} right="10" top="10">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.showMapImg().then((image) => {
                setImageValue(image)
                setShowImageValue(true)
              })
            }}
          >
            查看场景出图
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
              mapWork.downLoadDiv()
            }}
          >
            下载场景出图(含DIV部分)
          </MarsButton>
        </Space>
      </MarsPannel>

      <MarsPannel visible={showImage} left="25%" top="30%" width="50%" closeable>
        <img alt="查看场景出图" src={imges} style={{ width: "100%", height: "90%" }} />
      </MarsPannel>
    </>
  )
}

export default UIComponent
