import { MarsPannel, MarsButton, MarsTree } from "@mars/components/MarsUI"
import { useMemo, useState } from "react"
import { Space } from "antd"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"
import { getQueryString } from "@mars/utils/mars-util"

const layersObj: any = {}
function UIComponent() {
  const [treeData, setTree] = useState<any[]>([
    {
      title: "全部",
      key: "0",
      id: -1,
      children: []
    }
  ])

  const [showBtn, setShowBtn] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useMemo(() => {
    mapWork.eventTarget.on("loadGraphicLayer", function (event: any) {
      initTree(event.data.list)
    })

    // 隐藏button
    const isUrl = getQueryString("data") === ("CZML" || null)
    setShowBtn(isUrl)
  }, [])

  // 初始化树
  function initTree(modelList) {
    const children: any[] = []
    const dataKeys: any = []

    for (let i = 0; i < modelList.length; i++) {
      const node = modelList[i]._entity

      if (node) {
        const nodeList: any = {
          title: node.name,
          name: node.name,
          key: node.id
        }
        children.push(nodeList)
        dataKeys.push(nodeList.key)
        layersObj[nodeList.key] = node
      }
    }
    setTree([{ ...treeData[0], children: children }])
    setCheckedKeys(dataKeys)
  }

  const checkedChange = (keys: any, item: any) => {
    setCheckedKeys(keys)

    const node = item.node
    if (!node.children) {
      if (!node.checked) {
        layersObj[node.key].show = true
      } else {
        layersObj[node.key].show = false
      }
    } else {
      if (!node.checked) {
        node.children.forEach((element: any) => {
          layersObj[element.key].show = true
        })
      } else {
        node.children.forEach((element: any) => {
          layersObj[element.key].show = false
        })
      }
    }
  }

  return (
    <>
      <MarsPannel visible={true} right={10} top={10}>
        {showBtn ? (
          <div className="f-mb">
            <Space>
              <MarsButton onClick={() => mapWork.showAircraft()}>飞机</MarsButton>
              <MarsButton onClick={() => mapWork.showShip()}>船舶</MarsButton>
              <MarsButton onClick={() => mapWork.showCar()}>汽车</MarsButton>
              <MarsButton onClick={() => mapWork.showSatellite()}>卫星</MarsButton>
              <MarsButton onClick={() => mapWork.showBDSatellite()}>北斗卫星</MarsButton>
              <MarsButton onClick={() => mapWork.showRocket()}>火箭发射</MarsButton>
              <MarsButton onClick={() => mapWork.showFireDrill()}>消防演练</MarsButton>
            </Space>
          </div>
        ) : (
          ""
        )}

        <LayerState direction="horizontal"/>
      </MarsPannel>

      <MarsPannel visible={true} right={10} top={100} width={220}>
        <MarsTree treeData={treeData} checkedKeys={checkedKeys} defaultExpandAll={true} onCheck={checkedChange}></MarsTree>
      </MarsPannel>
    </>
  )
}
export default UIComponent
