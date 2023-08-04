import { 
    MarsPannel,
    MarsButton
  } from "@mars/components/MarsUI"
  import { Space } from "antd"
  import * as mapWork from "./map.js"
  import "./index.css"
  let canClick = true
  function clickStartController() {
    setTimeout(() => {
      canClick = true
    }, 500)
    if (canClick) {
      mapWork.startController()
      canClick = false
    }
  }
  
  function UIComponent() {
    return (
      <>
        <MarsPannel visible={true} top={10} right={10}>
            <div className="f-mb roleControllerLineHeight">
            提示： <br />
            1）点击开启角色控制，在地图上左键点击初始化模型位置<br />
            2）通过W/S/A/D和鼠标控制人物移动和视角<br />
            </div>
            <Space>
                <MarsButton onClick={() => clickStartController()}>开启角色控制</MarsButton>
                <MarsButton onClick={() => mapWork.stopController()}>关闭角色控制</MarsButton>
            </Space>
        </MarsPannel>
      </>
    )
  }
  
  export default UIComponent
