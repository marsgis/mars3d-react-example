import { MarsDialog, MarsTree, MarsSlider, MarsMenu } from "@mars/components/MarsUI"
import { activate, disable } from "@mars/widgets/common/store/widget"
import { useEffect, useState } from "react"
import * as mapWork from "./map"
import { useLifecycle } from "@mars/widgets/common/uses/useLifecycle"
import styles from "./index.module.less"
import { createRoot } from "react-dom/client"

let cmContainer = null // 右键菜单元素
let menueOffsetHeight = null //  右键菜单的高度

export default function (props) {
  useLifecycle(mapWork)
  const [treeData, setTreeData] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])

  useEffect(() => {
    initTree()
  }, [])

  function initTree() {
    const showIds = [] // 是显示状态的图层id集合
    const openIds = [] // 展开的树节点id集合（如果不想展开，对应图层配置open:false）

    const result = mapWork.getLayrsTree({
      basemaps: true, // 是否取config.json中的basempas
      filter: function (layer) {
        if (!layer.name) {
          // logInfo("未命名图层不加入图层管理", layer)
          return false // 未命名图层不在管理器展示
        }
        return true
      },
      forEach: function (item, layer) {
        item.key = item.id // 树控件api需要的唯一标识
        item.title = item.name || `未命名(${layer.type})` // 树控件api需要的显示文本字段

        item.hasZIndex = layer.hasZIndex // 当前vue绑定使用的属性
        item.hasOpacity = layer.hasOpacity
        item.opacity = layer.opacity ?? 1
        // 记录在item中，会导致卡顿
        // opacityValue[item.id] = layer.opacity ?? 1
        if (item.show) {
          showIds.push(item.id)
        }
        if (item.group && item.open !== false) {
          openIds.push(item.id)
        }
      }
    })

    // 赋予树控件
    setTreeData(result.tree)
    setCheckedKeys(showIds)
  }

  let lastWidget: any

  function checkedChange(keys: string[], e: any) {
    setCheckedKeys(keys)

    const layer = mapWork.getLayerById(e?.node?.key)

    if (layer) {
      const show = keys.indexOf(e.node.key) !== -1
      mapWork.updateLayerShow(layer, show)

      // 特殊处理同目录下的单选的互斥的节点，可在config对应图层节点中配置"radio":true即可
      if (layer.options?.radio && e.checked) {
        // 循环所有的图层
        const layersM = mapWork.getLayerByAttr(layer.pid, "pid") // 与当前操作的图层的pid相同的图层
        for (let index = 0; index < layersM.length; index++) {
          const layerTemp = layersM[index]
          checkedKeys.forEach((key, index) => {
            if (layerTemp === key && layerTemp !== layer) {
              checkedKeys.splice(index, 1)
              layerTemp.show = false
            }
          })
        }
      }

      // 处理图层的关联事件
      if (layer.options?.onWidget) {
        if (e.checked) {
          if (lastWidget) {
            disable(lastWidget)
          }
          activate({
            name: layer.options.onWidget
          })
          lastWidget = layer.options.onWidget
        } else {
          disable(layer.options.onWidget)
        }
      }

      // 处理图层构件树控件
      if (layer.options?.scenetree) {
        initSceneTree(layer)
      }

      // 处理子节点
      if (e.node.children && e.node.children.length) {
        e.node.children.forEach((child) => {
          checkedChange(keys, { node: child })
        })
      }
    }
  }

  function initSceneTree(layer: any) {
    disable("layerComponent")

    if (lastBindClickLayer) {
      lastBindClickLayer.off("click", onClickBimLayer)
      lastBindClickLayer = null
    }

    // 处理图层构件树控件
    if (layer.options.scenetree) {
      layer.on("click", onClickBimLayer)
      lastBindClickLayer = layer
    }
  }

  let lastBindClickLayer: any

  function onClickBimLayer(event: any) {
    const layer = event.layer
    const url = layer.options.url
    const id = layer.id
    activate({
      name: "layerComponent",
      data: { url, id }
    })
  }

  const flyTo = (item: any) => {
    if (checkedKeys.includes(item.key)) {
      const layer = mapWork.getLayerById(item.id)
      layer.flyTo()
    }
  }

  const opcityChange = (node: any, val: number) => {
    const layer = mapWork.getLayerById(node.id)
    if (layer) {
      layer.opacity = val
    }
  }
  const renderNode = (node: any) => {
    const checkedNode = checkedKeys.includes(node.id)
    return (
      <>
        <span onDoubleClick={() => flyTo(node)}>{node.title}</span>
        {node.hasOpacity && checkedNode ? (
          <span className={`${styles["tree-slider"]}`}>
            {" "}
            <MarsSlider defaultValue={node.opacity} min={0} max={1} step={0.1} onChange={(val: number) => opcityChange(node, val)}></MarsSlider>{" "}
          </span>
        ) : (
          ""
        )}
      </>
    )
  }

  // 右键显示菜单
  const handleContextMenu = (event: any, node: any) => {
    if (node.hasZIndex) {
      // 父节点
      const contextMenu = (
        <MarsMenu
          onMouseLeave={() => {
            cmContainer.style.display = "none"
          }}
          onClick={(e) => onContextMenuClick(node, e.key)}
        >
          <MarsMenu.Item key="1">图层置为顶层</MarsMenu.Item>
          <MarsMenu.Item key="2">图层上移一层</MarsMenu.Item>
          <MarsMenu.Item key="3">图层下移一层</MarsMenu.Item>
          <MarsMenu.Item key="4">图层置为底层</MarsMenu.Item>
        </MarsMenu>
      )
      renderCm(event, contextMenu)
    }
  }

  const renderCm = (info, dom) => {
    if (!cmContainer) {
      getContainer(dom)
    }

    // 设置右键菜单的样式
    setTimeout(() => {
      // 当cmContainer的高度不改变时，cmContainer.offsetHeight就会是0
      if (!menueOffsetHeight || cmContainer.offsetHeight !== 0) {
        menueOffsetHeight = cmContainer.offsetHeight
      }
      if (info.pageY + menueOffsetHeight > document.body.offsetHeight) {
        Object.assign(cmContainer.style, {
          position: "absolute",
          left: `${info.pageX - 5}px`,
          top: null,
          bottom: `${document.body.offsetHeight - info.pageY - 5}px`,
          display: "block",
          zIndex: 9999
        })
      } else {
        Object.assign(cmContainer.style, {
          position: "absolute",
          left: `${info.pageX - 5}px`,
          top: `${info.pageY - 5}px`,
          bottom: null,
          display: "block",
          zIndex: 9999
        })
      }
    }, 50)
  }

  const getContainer = (dom) => {
    cmContainer = document.createElement("div")
    cmContainer.className = styles["mars-menucontent"]
    document.body.appendChild(cmContainer)

    const rederDom = createRoot(cmContainer)
    rederDom.render(dom)
  }

  const onContextMenuClick = (node: any, type: string) => {
    const parent = node.parent
    const index = node.index
    switch (type) {
      case "1": {
        if (index !== 0) {
          parent.children[0].index = index
          parent.children[index].index = 0
        }
        break
      }
      case "2": {
        parent.children[index - 1].index = index
        parent.children[index].index = index - 1
        break
      }
      case "3": {
        parent.children[index + 1].index = index
        parent.children[index].index = index + 1
        break
      }
      case "4": {
        parent.children[parent.children.length - 1].index = index
        parent.children[index].index = parent.children.length - 1
        break
      }
    }

    parent.children = parent.children.sort((a: any, b: any) => a.index - b.index)
  }

  return (
    <MarsDialog title="图层" width={300} right={10} top={60} bottom={40} {...props}>
      {treeData.length && (
        <MarsTree
          checkable
          treeData={treeData}
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={checkedChange}
          titleRender={(node) => renderNode(node)}
          onRightClick={({ event, node }: any) => {
            handleContextMenu(event, node)
          }}
        ></MarsTree>
      )}
    </MarsDialog>
  )
}
