import { MarsButton, MarsCheckbox, MarsForm, MarsFormItem, MarsInput, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect, useState } from "react"
import { Space, Upload } from "antd"
import { disable, activate, isActive, updateWidget } from "@mars/widgets/common/store/widget"

// *****************************属性面板***************************//

function UIComponent() {
  const [isProxy, setIsProxy] = useState(false)
  const [modelUrl, setModelUrl] = useState("https://data.mars3d.cn/gltf/mars/feiji.glb")

  useEffect(() => {
    // ************************属性面板************************/
    mapWork.eventTarget.on("updateGraphicOptionsWidget", (event) => {
      if (event.disable) {
        disable("graphic-options")
      } else {
        const data = { layerId: event.layerId, graphicId: event.graphicId }
        if (!isActive("graphic-options")) {
          activate({ name: "graphic-options", data })
        } else {
          updateWidget("graphic-options", data)
        }
      }
    })
  }, [])

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem label="模型URL地址:">
          <MarsCheckbox onChange={(e) => setIsProxy(e.target.checked)}>使用代理</MarsCheckbox>
        </MarsFormItem>
        <MarsFormItem>
          <MarsInput onChange={(e) => setModelUrl(e + "")} defaultValue={"https://data.mars3d.cn/gltf/mars/feiji.glb"}></MarsInput>
        </MarsFormItem>
        <MarsFormItem>
          <Space>
            <MarsButton onClick={() => mapWork.startDrawModel(modelUrl, isProxy)}>标绘</MarsButton>
            <MarsButton onClick={() => mapWork.graphicLayer.clear()}>清除</MarsButton>
            <MarsButton onClick={() => mapWork.saveGeoJSON()}>保存</MarsButton>
            <Upload
              onChange={(e) => mapWork.openGeoJSON(e.file.originFileObj)}
              multiple={false}
              name={"file"}
              accept={"json,geojson"}
              showUploadList={false}
            >
              <MarsButton>打开...</MarsButton>
            </Upload>
          </Space>
        </MarsFormItem>
        <MarsFormItem>
          <MarsCheckbox onChange={(e) => mapWork.chkTestTerrain(e.target.checked)}>深度检测</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.onlyVertexPosition(e.target.checked)}>开启顶点吸附</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.chkHasTerrain(e.target.checked)} defaultChecked={true}>
            地形
          </MarsCheckbox>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
