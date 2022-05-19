import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <>
      <MarsPannel visible={true} right="10" top="10">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.splitScreen()
            }}
          >
            分屏
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.streetscape()
            }}
          >
            仅街景
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.viewTo3d()
            }}
          >
            仅3D
          </MarsButton>
        </Space>
      </MarsPannel>
      <MarsPannel visible={true} left="10" top="10">
        <MarsButton
          type="link"
          onClick={() => {
            mapWork.chooseStree()
          }}
        >
          <img src="/img/marker/street.png" alt="" />
        </MarsButton>
      </MarsPannel>
    </>
  )
}

export default UIComponent
