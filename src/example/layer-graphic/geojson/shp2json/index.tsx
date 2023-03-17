import { MarsPannel, MarsButton, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space } from "antd"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"

function UIComponent() {
   

    return (
      <>
        <MarsPannel visible={true} right={10} top={30}>
            <div className="f-mb">
            <Space>
                <MarsButton
                onClick={() => {
                    mapWork.shoXZM()
                }}
                >
                乡镇面
                </MarsButton>
                <MarsButton
                onClick={() => {
                    mapWork.shoGCD()
                }}
                >
                高程点
                </MarsButton>
            </Space>
            </div>
            <LayerState direction="horizontal"/>
        </MarsPannel>
      </>
    )
  }
  export default UIComponent
