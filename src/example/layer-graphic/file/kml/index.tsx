import { MarsPannel, MarsButton, MarsTree } from "@mars/components/MarsUI"
import { useMemo, useState } from "react"
import { Space } from "antd"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"
import "./index.less"
let layersObj: any = {}

const shoRailway = () => {
  mapWork.shoRailway()
}

const showExpressway = () => {
  mapWork.showExpressway()
}

const showMeteorological = () => {
  mapWork.showMeteorological()
}

const showGDP = () => {
  mapWork.showGDP()
}

const showSafetyNotice = () => {
  mapWork.showSafetyNotice()
}

function UIComponent() {
  const [treeData, setTree] = useState<any[]>([
    {
      title: "全部",
      key: "0",
      id: -1,
      children: []
    }
  ])

  const [expandedKeys, setExpandedKeys] = useState<any[]>(["0"]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useMemo(() => {
    mapWork.eventTarget.on("tree", function (event: any) {
      initTree(event.treeData)
    })
  }, [])

  function initTree(dataItems) {
    layersObj = {}

    const children: any = []
    const dataKeys: any = []
    for (let i = 0; i < dataItems.length; i++) {
      const layer = dataItems[i]
      if (layer) {
        const key = "01-" + Math.random()
        children.push({
          title: layer.name || "未命名",
          key,
          id: layer._entity._id
        })

        if (layer._entity.show) {
          dataKeys.push(key)
        }
        layersObj[layer._entity._id] = layer._entity
      }
    }

    setTree([{ ...treeData[0], children }])
    setCheckedKeys(dataKeys)
  }

  const checkedChange = (keys: string[], checkedNodes: any) => {
    setCheckedKeys(keys)

    const show = checkedNodes.checked
    const entity = layersObj[checkedNodes.node.id]

    if (checkedNodes.node.id === -1) {
      Object.keys(layersObj).forEach((k) => {
        const layer = layersObj[k]
        layer.show = show
        if (layer._labelEx) {
          layer._labelEx.show = show
        }
      })
      return
    }

    // 处理图层显示隐藏
    entity.show = show
    if (entity._labelEx) {
      entity._labelEx.show = show
    }
    if (entity == null) {
      return
    }
    mapWork.flyToEntity()
  }

  const onExpand = (expandedKeysValue: any) => {
    setExpandedKeys(expandedKeysValue)
  }

  return (
    <>
      <MarsPannel visible={true} right={10} top={10} width={508}>
        <div className="f-mb">
          <Space>
            <MarsButton onClick={shoRailway}>铁路</MarsButton>
            <MarsButton onClick={showExpressway}>高速公路线</MarsButton>
            <MarsButton onClick={showMeteorological}>气象等值面</MarsButton>
            <MarsButton onClick={showGDP}>国家GDP数据</MarsButton>
            <MarsButton onClick={showSafetyNotice}>海上安全通告</MarsButton>
          </Space>
        </div>
        <LayerState direction="horizontal" />
      </MarsPannel>

      <MarsPannel visible={true} right={10} top={100} customClass="pannel">
        <MarsTree treeData={treeData} onExpand={onExpand} checkedKeys={checkedKeys} expandedKeys={expandedKeys} onCheck={checkedChange}></MarsTree>
      </MarsPannel>
    </>
  )
}
export default UIComponent
