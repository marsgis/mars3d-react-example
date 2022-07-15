import { MarsPannel, MarsInput, MarsButton, MarsCheckbox, MarsRadio, MarsRadioGroup } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useEffect, useState } from "react"
import * as mapWork from "./map.js"
import "./index.css"

let url = ""
let x = 0
let y = 0
let z = 0
let step = 1

// 改变URL
const urlChange = (e) => {
  url = e.target.value
}

const showModel = () => {
  localStorage.setItem("3dtiles_move", url)
  mapWork.showModel(url)
}

function UIComponent() {
  const [result, setResult] = useState("")

  useEffect(() => {
    // url传入模型地址
    const modelUrl = localStorage.getItem("3dtiles_move")
    if (modelUrl) {
      // 历史记录模型地址
      url = modelUrl
    } else {
      url = "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json"
    }

    mapWork.showModel(url)
  }, [])

  const moveModel = (type: number) => {
    switch (type) {
      case 0:
        x += step
        break
      case 1:
        x -= step
        break
      case 2:
        y += step
        break
      case 3:
        y -= step
        break
      case 4:
        z += step
        break
      case 5:
        z -= step
        break
      default:
    }

    const offset = "x:" + x.toFixed(1) + " y:" + y.toFixed(1) + " z:" + z.toFixed(1)
    setResult(offset)
    mapWork.setTranslation(x, y, z)
  }

  return (
    <MarsPannel visible={true} top={10} right={10} height={210}>
      <div className="f-mb">
        <span>3dtile模型移动(只适合小范围内的偏移 笛卡尔坐标方向，非贴球面)</span>
      </div>

      <div className="f-mb">
        <span className="mars-pannel-item-label">模型URL:</span>
        <Space>
          <MarsInput defaultValue="//data.mars3d.cn/3dtiles/qx-dyt/tileset.json" onChange={urlChange}></MarsInput>
          <MarsButton onClick={showModel}>加载模型</MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <span className="mars-pannel-item-label">设置移动步长:</span>
        <MarsRadioGroup
          onChange={(e) => {
            step = e.target.value
          }}
          defaultValue={1}
        >
          <MarsRadio value={0.1}>0.1</MarsRadio>
          <MarsRadio value={1}>1</MarsRadio>
          <MarsRadio value={10}>10</MarsRadio>
          <MarsRadio value={100}>100</MarsRadio>
        </MarsRadioGroup>
      </div>
      <div className="f-mb">
        <span className="mars-pannel-item-label">按步长移动:</span>
        <Space>
          <MarsButton onClick={() => moveModel(0)}>x+</MarsButton>
          <MarsButton onClick={() => moveModel(1)}>x-</MarsButton>
          <MarsButton onClick={() => moveModel(2)}>y+</MarsButton>
          <MarsButton onClick={() => moveModel(3)}>y-</MarsButton>
          <MarsButton onClick={() => moveModel(4)}>z+</MarsButton>
          <MarsButton onClick={() => moveModel(5)}>z-</MarsButton>
        </Space>
      </div>
      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">当前偏移量:</span>
          <span>{result || "x:0.0 y:0.0 z:0.0"}</span>
        </Space>
      </div>

      <div className="f-tac">
        <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkHasTerrain(e.target.checked)}>
          是否有地形
        </MarsCheckbox>
        <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkTestTerrain(e.target.checked)}>
          是否深度检测
        </MarsCheckbox>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
