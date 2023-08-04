import { 
    MarsPannel,
    MarsButton
  } from "@mars/components/MarsUI"
  import { Space } from "antd"
  import * as mapWork from "./map.js"
  
  function UIComponent() {
    return (
      <>
        <MarsPannel visible={true} top={10} right={10}>
            <Space>
                <MarsButton onClick={() => mapWork.addGraphic()}>添加</MarsButton>
                <MarsButton onClick={() => mapWork.clear()}>清除</MarsButton>
            </Space>
        </MarsPannel>
      </>
    )
  }
  
  export default UIComponent
