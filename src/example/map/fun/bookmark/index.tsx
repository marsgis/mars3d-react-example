import { MarsPannel, MarsIcon, $message } from "@mars/components/MarsUI"
import { Input } from "antd"
import { useState, useMemo, useEffect } from "react"
import * as mapWork from "./map.js"
import "./index.less"

// 触发添加按钮点击事件和回车事件
function addNewItem(data: any, name: string) {
  if (!name) {
    $message("请输入名称!")
    return
  }
  // 不能使用相同名称
  if (data.some((item) => item.name === name)) {
    $message(name + " 已存在，请更换名称!")
    return
  }
  // 获取当前地图的图片和视角
  mapWork.butAddTxtName(name)
}

let newData = []

function UIComponent(props) {
  const [viewName, changeViewName] = useState("") // input名称
  const [viewData, changeViewData] = useState([{ name: "没有匹配的值", img: "", center: "" }]) // 数据

  useMemo(() => {
    mapWork.eventTarget.on("addImgObject", (data) => {
      // 在react看来viewData没有被改变不会再次渲染，浅拷贝赋值会重新渲染
      newData.push(data.item)

      changeViewData(newData) // changeViewName会导致react重新渲染，不需要浅拷贝赋值
      changeViewName("") // 清空input框

      // 记录到历史
      localStorage.setItem("bookmark", JSON.stringify(newData))
    })
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookmark"))
    if (data && data.length > 0) {
      newData = data
      changeViewData(newData)
    }
  }, [])

  const deletedViewItem = (index: number) => {
    // 在react看来viewData没有被改变不会再次渲染，浅拷贝赋值会重新渲染
    newData.splice(index, 1)
    changeViewData([...newData])

    if (newData.length === 0) {
      changeViewData([{ name: "没有匹配的值", img: "", center: "" }])
      localStorage.removeItem("bookmark")
      return
    }

    // 记录到历史
    localStorage.setItem("bookmark", JSON.stringify(newData))
  }

  return (
    <MarsPannel visible={true} right="10" top="10" bottom="40">
      <Input.Search
        size="large"
        value={viewName}
        placeholder="输入 名称"
        onChange={(data) => {
          // 与value搭配使用，否则input中无法输入其他数值
          changeViewName(data.target.value)
        }}
        // 回车方法
        onPressEnter={(data: any) => addNewItem(viewData, data.target.value)}
        enterButton={"添加"}
        //   点击按钮方法
        onSearch={(name: string) => addNewItem(viewData, name)}
      />
      <div className="bookmarkView">
        {viewData.map((item, index) => {
          return (
            <div className={item.img ? "addNewImg" : "addNewImg1"} key={item.name + index}>
              {item.img ? <img className="markImg" alt="" src={item.img} onClick={() => mapWork.flytoView(item.center)} /> : null}
              <p className="textItem" title={item.name}>
                {item.name}
              </p>
              {item.img ? <MarsIcon icon="delete" className="deleteItem" color="#f2f2f2" onClick={() => deletedViewItem(index)} /> : null}
            </div>
          )
        })}
      </div>
    </MarsPannel>
  )
}

export default UIComponent
