import { MarsButton, MarsCheckbox, MarsForm, MarsFormItem, MarsInput, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect, useState, useCallback } from "react"
import { Space, Upload } from "antd"
import { disable, activate, isActive, updateWidget } from "@mars/widgets/common/store/widget"

// *****************************属性面板***************************//

function UIComponent() {
  const [isProxy, setIsProxy] = useState(false)
  const [modelUrl, setModelUrl] = useState("//data.mars3d.cn/gltf/mars/feiji.glb")

  const showEditor = useCallback(
    (e: any) => {
      const graphic = e.graphic
      if (!graphic._conventStyleJson) {
        graphic.options.style = graphic.toJSON().style // 因为示例中的样式可能有复杂对象，需要转为单个json简单对象
        graphic._conventStyleJson = true // 只处理一次
      }

      activate({
        name: "GraphicEditor",
        data: { graphic: e.graphic }
      })
    },
    [activate]
  )
  useEffect(() => {
    const mars3d = window.mapWork.mars3d
    // 矢量数据创建完成
    mapWork.graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
      // if (formState.hasEdit) {
      showEditor(e)
      // }
    })
    // 修改了矢量数据
    mapWork.graphicLayer.on(
      [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
      function (e) {
        showEditor(e)
      }
    )
    // 停止编辑
    mapWork.graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
      setTimeout(() => {
        if (!mapWork.graphicLayer.isEditing) {
          disable("GraphicEditor")
        }
      }, 100)
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
            <Upload onChange={(e) => mapWork.openGeoJSON(e.file.originFileObj)} multiple={false} name={"file"} accept={"json,geojson"} showUploadList={false}>
              <MarsButton>打开...</MarsButton>
            </Upload>
          </Space>
        </MarsFormItem>
        <MarsFormItem>
          <MarsCheckbox onChange={(e) => mapWork.chkTestTerrain(e.target.checked)}>深度检测</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.onlyPickModelPosition(e.target.checked)}>仅在模型或矢量上拾取</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.chkHasTerrain(e.target.checked)} defaultChecked={true}>
            地形
          </MarsCheckbox>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
