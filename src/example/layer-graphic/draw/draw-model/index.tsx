import { MarsButton, MarsCheckbox, MarsForm, MarsFormItem, MarsInput, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useMemo, useState, useCallback } from "react"
import { Space, Upload } from "antd"
import { disable, activate, isActive, updateWidget } from "@mars/widgets/common/store/widget"

// *****************************属性面板***************************//

function UIComponent() {
  const [isProxy, setIsProxy] = useState(false)
  const [modelUrl, setModelUrl] = useState("//data.mars3d.cn/gltf/mars/feiji.glb")
 

  const showEditor = useCallback(
    (e: any) => {
      activate({
        name: "GraphicEditor",
        data: { graphic: e.graphic }
      })
    },
    [activate]
  )
  useMemo(() => {
    mapWork.eventTarget.on("graphicEditor-start", async (e: any) => {
      showEditor(e)
    })
    // 编辑修改了模型
    mapWork.eventTarget.on("graphicEditor-update", async (e: any) => {
      updateWidget("graphic-editor", {
        data: { graphic: e.graphic }
      })
      showEditor(e)
    })

    // 停止编辑修改模型
    mapWork.eventTarget.on("graphicEditor-stop", async (e: any) => {
      disable("graphic-editor")
    })
  }, [])
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem label="模型URL地址:">
          <MarsCheckbox onChange={(e) => setIsProxy(e.target.checked)}>使用代理</MarsCheckbox>
        </MarsFormItem>
        <MarsFormItem>
          <MarsInput onChange={(e) => setModelUrl(e + "")} defaultValue={"//data.mars3d.cn/gltf/mars/feiji.glb"}></MarsInput>
        </MarsFormItem>
        <MarsFormItem>
          <Space>
            <MarsButton onClick={() => mapWork.startDrawModel(modelUrl, isProxy)}>标绘</MarsButton>
            <MarsButton onClick={() => mapWork.graphicLayer.clear()}>清除</MarsButton>
            <MarsButton onClick={() => mapWork.saveGeoJSON()}>保存</MarsButton>
            <Upload onChange={(e) => mapWork.openGeoJSON(e.file)} multiple={false} name={"file"} accept={"json,geojson"} showUploadList={false}>
              <MarsButton>打开...</MarsButton>
            </Upload>
          </Space>
        </MarsFormItem>
        <MarsFormItem>
          <MarsCheckbox onChange={(e) => mapWork.chkTestTerrain(e.target.checked)}>深度检测</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.onlyPickModelPosition(e.target.checked)}>仅在3dtiles上标绘</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.chkHasTerrain(e.target.checked)} defaultChecked={true}>
            地形
          </MarsCheckbox>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
