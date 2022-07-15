import { MarsButton, MarsDialog, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import { useMemo, useState } from "react"

function UIComponent() {
  const [showLayer, setShowLayer] = useState(false)
  useMemo(() => {
    mapWork.eventTarget.on("showWebsite", function (event: any) {
      setShowLayer(event.showHistoryLayer)
    })
  }, [])
  return (
    <>
      <MarsPannel visible={true} right={10} top={10} width={163}>
        <Space wrap>
          <MarsButton onClick={() => mapWork.bindMapDemo()}>Map上直接弹出</MarsButton>
          <MarsButton onClick={() => mapWork.bindLayerDemo()}>图层上绑定</MarsButton>
          <MarsButton onClick={() => mapWork.bindLayerDemo2()}>图层上预定义配置</MarsButton>
          <MarsButton onClick={() => mapWork.bindLayerTemplateDemo()}>自定义模版</MarsButton>

          <MarsButton onClick={() => mapWork.bindGraphicDemo1()}>Graphic上绑定</MarsButton>
          <MarsButton onClick={() => mapWork.bindGraphicDemo2()}>Graphic上局部刷新</MarsButton>
        </Space>
      </MarsPannel>
      <MarsDialog
        onClose={() => {
          setShowLayer(false)
        }}
        width="calc(100% - 270px)"
        left="100"
        top="80"
        bottom="80"
        title="火星科技"
        visible={showLayer}
      >
        <iframe src="http://marsgis.cn/" title="火星科技" width="100%" height="100%"></iframe>
      </MarsDialog>
    </>
  )
}

export default UIComponent
