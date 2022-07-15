import { MarsPannel, MarsButton, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space } from "antd"
import "./index.less"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"
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

  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useMemo(() => {
    mapWork.treeEvent.on("tree", function (event: any) {
      initTree(event.treeData)
    })
  }, [])

  // 初始化树控件
  const initTree = useCallback(
    (event: any) => {
      const modelList = event

      const tree = []
      const selects: string[] = []
      for (let i = 0; i < modelList.length; i++) {
        const node = modelList[i].graphic

        if (node) {
          const nodeList: any = {
            title: node.name || "未命名",
            key: node.id
          }
          tree.push(nodeList)
          selects.push(nodeList.key)
          layersObj[nodeList.key] = node
        }
      }

      setTree([{ ...treeData[0], children: tree }])

      setCheckedKeys(selects)
    },
    [treeData]
  )

  const checkedChange = useCallback((keys: any, item: any) => {
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
  }, [])

  return (
    <>
      <MarsPannel visible={true} right={10} top={10} width={524}>
        <div className="f-mb">
          <Space>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.shoRailway()
              }}
            >
              铁路
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showExpressway()
              }}
            >
              高速公路
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showMeteorological()
              }}
            >
              气象等值面
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showGDP()
              }}
            >
              国家GDP数据
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showSafetyNotice()
              }}
            >
              海上安全通告
            </MarsButton>
          </Space>
        </div>
        <LayerState direction="horizontal"/>
      </MarsPannel>

      <MarsPannel visible={true} right={10} top={100}>
        <div className="pannel">
          <MarsTree treeData={treeData} checkedKeys={checkedKeys} defaultExpandAll onCheck={checkedChange}></MarsTree>
        </div>
      </MarsPannel>
    </>
  )
}
export default UIComponent
