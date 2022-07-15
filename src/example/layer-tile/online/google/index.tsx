import { MarsPannel, $notify } from "@mars/components/MarsUI"
import { TileLayerState } from "@mars/components/MarsSample/TileLayerState"
import { activate } from "@mars/widgets/common/store/widget"
import { useEffect } from "react"

function UIComponent() {
  useEffect(() => {
    $notify(
      "已知问题：",
      `(1)按国家测绘主管部门的通知,
    目前国家相关部门对未经审核批准的谷歌等地图做了封锁及下架，
    目前谷歌地图服务暂不可用`,
      { duration: null }
    )
    
    activate("SearchPoi")
  }, [])
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <TileLayerState /> 
    </MarsPannel>
  )
}

export default UIComponent

