import { MarsDialog, MarsTree, MarsSlider, MarsMenu } from "@mars/components/MarsUI"
import { activate, disable } from "@mars/widgets/common/store/widget"
import { useEffect, useRef, useState } from "react"
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

  const [checked, setChecked] = useState(true) // 树节点是否被选中

  const layersObj = useRef({})
  const opacityObj = useRef({})

  useEffect(() => {
    initTree()
  }, [])

  function initTree() {
    const newTreeData = []

    const layers = mapWork.getLayers()
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i] // 创建图层
      if (layer.isPrivate) {
        continue
      }

      if (!layer._hasMapInit && layer.pid === -1 && layer.id !== 99) {
        layer.pid = 99 // 示例中创建的图层都放到99分组下面
      }

      layersObj.current[layer.id] = layers

      if (layer && layer.pid === -1) {
        const node: any = {
          index: i,
          title: layer.name || `未命名(${layer.type})`,
          key: layer.id,
          id: layer.id,
          pId: layer.pid,
          hasZIndex: layer.hasZIndex,
          hasOpacity: layer.hasOpacity,
          opacity: 100 * (layer.opacity || 0),
          group: layer.type === "group"
        }
        if (layer.hasOpacity) {
          opacityObj.current[layer.id] = 100 * (layer.opacity || 0)
        }
        node.children = findChild(node, layers)
        newTreeData.push(node)
      }
    }

    newTreeData.forEach((data: any) => {
      data.children.forEach((item: any) => {
        if (item.children) {
          item.children.forEach((chil: any) => {
            if (layersObj.current[chil.key].options.radio) {
              chil.parent.disabled = true
            }
          })
        }
      })
    })

    setTreeData(newTreeData)
    setCheckedKeys(checkedKeys)
  }

  function findChild(parent: any, list: any[]) {
    return list
      .filter((item: any) => item.pid === parent.id)
      .reverse()
      .map((item: any, i: number) => {
        const node: any = {
          index: i,
          title: item.name || `未命名(${item.type})`,
          key: item.id,
          id: item.id,
          pId: item.pid,
          hasZIndex: item.hasZIndex,
          hasOpacity: item.hasOpacity,
          opacity: 100 * (item.opacity || 0),
          parent,
          group: item.type === "group"
        }

        if (item.hasOpacity) {
          opacityObj.current[item.id] = 100 * (item.opacity || 0)
        }
        layersObj.current[item.id] = item

        node.children = findChild(node, list)

        if (item.isAdded && item.show) {
          checkedKeys.push(node.key)
        }
        return node
      })
  }

  const lastWidget = useRef("")

  function checkedChange(keys: string[], e: any) {
    const layer = layersObj.current[e.node.id]
    setChecked(e.checked)
    // console.log("点击的矢量图层", layer)
    if (layer) {
      if (layer.isAdded === false) {
        mapWork.addLayer(layer)
      }

      // 特殊处理同目录下的单选的互斥的节点，可在config对应图层节点中配置"radio":true即可
      if (layer.options && layer.options.radio && e.checked) {
        // 循环所有的图层
        for (const i in layersObj.current) {
          const item = layersObj.current[i]
          // 循环所有的打开的图层
          keys.forEach((key, index) => {
            // 在所有图层中筛选与打开图层对应key值的图层 以及 与当前操作的图层的pid相同的图层
            if (item === layersObj.current[key] && layer.pid === layersObj.current[key].pid) {
              // 筛选出不是当前的其他图层进行图层隐藏以及移除
              if (item !== layer) {
                keys.splice(index, 1)
                item.show = false
              }
            }
          })
        }
      }

      // 处理图层的关联事件
      if (layer.options && layer.options.onWidget) {
        if (e.checked) {
          if (lastWidget.current) {
            disable(lastWidget.current)
          }
          activate({
            name: layer.options.onWidget
          })
          lastWidget.current = layer.options.onWidget
        } else {
          disable(layer.options.onWidget)
          // 防止在取消勾选时(将map变为null)，导致再次勾选时没有map无法调用方法
          setTimeout(() => {
            activate({
              name: layer.options.onWidget
            })
          }, 100)
        }
      }

      // 处理子节点
      if (e.node.children && e.node.children.length) {
        renderChildNode(keys, e.node.children)
      }
      if (keys.indexOf(e.node.id) !== -1) {
        layer.show = true
        layer.readyPromise &&
          layer.readyPromise.then(function (layer) {
            layer.flyTo({ scale: 2 })
          })
      } else {
        layer.show = false
      }

      // 处理图层构件树控件
      if (layer.options && layer.options.scenetree) {
        initLayerTree(layer)
      }
    }

    setCheckedKeys(keys)
  }

  function renderChildNode(keys: string[], children: any[]) {
    children.forEach((child) => {
      const layer = layersObj.current[child.id]
      if (layer) {
        if (!layer.isAdded) {
          mapWork.addLayer(layer)
        }
        if (keys.indexOf(child.id) !== -1) {
          layer.show = true
        } else {
          layer.show = false
        }
        if (child.children) {
          renderChildNode(keys, child.children)
        }
        if (layer.options.scenetree) {
          initLayerTree(layer)
        }
      }
    })
  }

  const lastBindClickLayer = useRef<any>()
  function initLayerTree(layer: any) {
    disable("layerComponent")

    if (lastBindClickLayer.current) {
      lastBindClickLayer.current.off("click", onClickBimLayer)
      lastBindClickLayer.current = null
    }

    // 处理图层构件树控件
    if (layer.options.scenetree) {
      layer.on("click", onClickBimLayer)
      lastBindClickLayer.current = layer
    }
  }
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
    if (checked) {
      const layer = layersObj.current[item.id]
      layer.flyTo()
    }
  }

  const opcityChange = (node: any, val: number) => {
    const id = node.id
    const layer = layersObj.current[id]

    if (layer) {
      layer.opacity = val / 100
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
            <MarsSlider
              defaultValue={opacityObj.current[node.id]}
              min={0}
              max={100}
              step={1}
              onChange={(val: number) => opcityChange(node, val)}
            ></MarsSlider>{" "}
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
