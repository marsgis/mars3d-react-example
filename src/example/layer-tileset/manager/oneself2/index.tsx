import { useState, useEffect } from "react"
import * as mapWork from "./map.js"
import { MarsPannel, MarsButton, MarsFormItem, MarsInput } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [layerUrl, setLayerUrl] = useState("//data.mars3d.cn/3dtiles/qx-simiao/tileset.json")

  useEffect(() => {
    // // 历史记录模型地址
    const modelUrl = localStorage.getItem("onlyModel2")
    if (modelUrl) {
      setLayerUrl(modelUrl)
    }

    setTimeout(() => {
      mapWork.showModel(modelUrl || layerUrl)
    }, 500)
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="图层URL">
        <MarsInput
          value={layerUrl}
          onChange={(data) => {
            setLayerUrl(data.target.value)
          }}
        ></MarsInput>
      </MarsFormItem>
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.showModel(layerUrl)
            localStorage.setItem("onlyModel2", layerUrl)
          }}
        >
          加载模型
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.flyTo()
          }}
        >
          视角复位
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
