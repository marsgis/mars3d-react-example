import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function Traffic() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.addGaodeLayer()
          }}
        >
          {"高德交通态势图"}
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.addBaiduLayer()
          }}
        >
          {"百度交通态势图"}
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default Traffic
