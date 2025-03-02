import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10} height={160} width={346}>
      <Space wrap>
        提示：该示例目的演示交付的离线数据的效果
        <br />
        1、 包括全国12.5米地形(当前页面效果)
        <br />
        2、 包括0-12级影像底图(当前页面效果)
        <br />
        <div>
          3、 包括所有模型数据：
          <MarsButton href="editor-react.html?id=layer-tileset/type/list" target="_blank">
            3dtiles模型
          </MarsButton>
          <MarsButton href="editor-react.html?id=layer-graphic/draw/draw-model-list" target="_blank">
            gltf模型
          </MarsButton>
        </div>
        <br />
        4、 包括其他所有示例的json等文件
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
