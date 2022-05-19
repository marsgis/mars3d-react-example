import { useCallback, useState, useRef, useMemo, useEffect } from "react"
import * as mapWork from "./map.js"
import { MarsPannel, MarsButton, MarsSlider, MarsFormItem, MarsGui } from "@mars/components/MarsUI"
import { Space } from "antd"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const marsGuiRef = useRef<any>()
  const options: GuiItem[] = [
    {
      type: "number",
      field: "lng",
      label: "经度:",
      step: 0.000001,
      value: 117.251283,
      change(data) {
        marsGuiRef.current.updateField("lng", data)
        onChangePosition()
      }
    },
    {
      type: "number",
      field: "lat",
      label: "纬度:",
      step: 0.000001,
      value: 31.843707,
      change(data) {
        marsGuiRef.current.updateField("lat", data)
        onChangePosition()
      }
    },
    {
      type: "number",
      field: "alt",
      label: "高度:",
      step: 0.1,
      value: 43.7,
      change(data) {
        marsGuiRef.current.updateField("alt", data)
        onChangePosition()
      }
    },
    {
      type: "slider",
      field: "lengthX",
      label: "盒子X长度:",
      step: 1,
      min: 0,
      max: 100,
      value: 20,
      change(data) {
        mapWork.onChangeDimensionsX(data)
      }
    },
    {
      type: "slider",
      field: "lengthY",
      label: "盒子Y长度:",
      step: 1,
      min: 0,
      max: 100,
      value: 10,
      change(data) {
        mapWork.onChangeDimensionsY(data)
      }
    },
    {
      type: "slider",
      field: "lengthZ",
      label: "盒子Z长度:",
      step: 1,
      min: 0,
      max: 100,
      value: 15,
      change(data) {
        mapWork.onChangeDimensionsZ(data)
      }
    },
    {
      type: "switch",
      field: "isShowBox",
      label: "盒子:",
      value: true,
      change(data) {
        mapWork.showModelMatrix(data)
      }
    }
  ]

  const getPoint = useCallback(() => {
    const data = marsGuiRef.current.getValues()
    const point = {
      lng: data.lng,
      lat: data.lat,
      alt: data.alt
    }
    return point
  }, [])

  const onChangePosition = useCallback(() => {
    mapWork.onChangePosition(getPoint())
  }, [getPoint])

  useMemo(() => {
    // 监听到事件
    mapWork.eventTarget.on("hasDraw", (item: any) => {
      marsGuiRef.current.updateField("lng", item.point.lng)
      marsGuiRef.current.updateField("lat", item.point.lat)
      marsGuiRef.current.updateField("alt", item.point.alt)
    })
  }, [])

  useEffect(() => {
    mapWork.tilesetBoxClipDemo(getPoint())
  }, [getPoint])

  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsGui options={options} formProps={{ labelCol: { span: 7 } }} ref={marsGuiRef}></MarsGui>
      <div className="f-tac">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.drawExtent()
            }}
          >
            绘制Box
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.clear()
            }}
          >
            清除
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
