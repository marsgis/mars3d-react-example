import * as mapWork from "./map.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { MarsButton, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "input",
      field: "url",
      label: "图层URL",
      value: "//data.mars3d.cn/tile/dizhiChina/{z}/{x}/{y}.png",
      change(data) {
        onCheckedoutUrl(data)
        dataUpdate()
      }
    },
    {
      type: "select",
      field: "type",
      label: "类型",
      value: "xyz",
      options: [
        {
          value: "xyz",
          label: "标准金字塔地图"
        },
        {
          value: "wms",
          label: "WMS标准服务"
        },
        {
          value: "wmts",
          label: "WMTS标准服务"
        },
        {
          value: "arcgis",
          label: "ArcGIS标准服务"
        },
        {
          value: "arcgis_cache",
          label: "ArcGIS切片"
        },
        {
          value: "image",
          label: "单张图片"
        }
      ],
      change(data) {
        guiRef.current.updateField("type", data)
        dataUpdate()
      }
    },
    {
      type: "input",
      field: "txtLayer",
      label: "图层名",
      value: "",
      change(data) {
        guiRef.current.updateField("txtLayer", data)
        dataUpdate()
      },
      show(data) {
        return data.type === "wms" || data.type === "wmts"
      }
    },
    {
      type: "select",
      field: "txtTileFormat",
      label: "瓦片格式",
      value: "png",
      change(data) {
        guiRef.current.updateField("txtLayer", data)
        dataUpdate()
      },
      show(data) {
        return data.type === "wms" || data.type === "wmts"
      },
      options: [
        {
          value: "image/png",
          label: "png"
        },
        {
          value: "image/jpeg",
          label: "jpeg"
        }
      ]
    },
    {
      type: "select",
      field: "CRS",
      label: "坐标系",
      value: "",
      change(data) {
        guiRef.current.updateField("CRS", data)
        dataUpdate()
      },
      options: [
        {
          value: "",
          label: "默认"
        },
        {
          value: "EPSG:3857",
          label: "EPSG:3857"
        },
        {
          value: "EPSG:4326",
          label: "EPSG:4326"
        },
        {
          value: "EPSG:4490",
          label: "EPSG:4490"
        }
      ]
    },
    {
      type: "select",
      field: "chinaCRS",
      label: "国内坐标系",
      value: "WGS84",
      change(data) {
        guiRef.current.updateField("chinaCRS", data)
        dataUpdate()
      },
      options: [
        {
          value: "WGS84",
          label: "标准无偏"
        },
        {
          value: "GCJ02",
          label: "国测局偏移"
        },
        {
          value: "BAIDU",
          label: "百度偏移"
        }
      ]
    },
    {
      type: "slider",
      field: "loadLevel",
      label: "加载层级",
      step: 1,
      range: true,
      min: 0,
      max: 21,
      value: [0, 21],
      change(data) {
        guiRef.current.updateField("loadLevel", data)
        dataUpdate()
      }
    },
    {
      type: "slider",
      field: "showLevel",
      label: "显示层级",
      step: 1,
      range: true,
      min: 0,
      max: 21,
      value: [0, 21],
      change(data) {
        guiRef.current.updateField("showLevel", data)
        dataUpdate()
      }
    },
    {
      type: "input",
      field: "rectangle",
      label: "输入框",
      value: "",
      change(data) {
        if (data === "") {
          mapWork.btnClearExtent()
        }
        guiRef.current.updateField("rectangle", data)
        dataUpdate()
      }
    },
    {
      type: "slider",
      field: "opacity",
      label: "透明度",
      step: 0.01,
      min: 0,
      max: 1,
      value: 1,
      change(data) {
        guiRef.current.updateField("opacity", data)
        mapWork.changeOpacity(data)
      }
    },
    {
      type: "slider",
      field: "brightness",
      label: "亮度",
      step: 0.01,
      min: 0,
      max: 1,
      value: 1,
      change(data) {
        guiRef.current.updateField("brightness", data)
        mapWork.changeBrightness(data)
      }
    },
    {
      type: "switch",
      field: "agent",
      label: "使用代理",
      value: false,
      change(data) {
        guiRef.current.updateField("chkProxy", data)
        dataUpdate()
      }
    }
  ]

  const guiRef = useRef<any>()
  const [updateValue, setUpdateValue] = useState({})

  useEffect(() => {
    mapWork.eventTarget.on("rectangle", (e: any) => {
      guiRef.current.updateField("rectangle", e.rectangle)
    })
  }, [])

  const onCheckedoutUrl = useCallback((data) => {
    const url = data.toLowerCase()
    if (url.indexOf("wms") !== -1) {
      guiRef.current.updateField("url", "wms")
    } else if (url.indexOf("wmts") !== -1) {
      guiRef.current.updateField("url", "wmts")
    } else if (url.indexOf("_alllayers") !== -1) {
      guiRef.current.updateField("url", "arcgis_cache")
    } else if (url.indexOf("arcgis") !== -1) {
      guiRef.current.updateField("url", "arcgis")
    } else if (url.indexOf("{x}") !== -1 && url.indexOf("{z}") !== -1) {
      guiRef.current.updateField("url", "xyz")
    }
  }, [])

  const loadCoverage = useCallback(async () => {
    // 加载图层
    try {
      console.log("表单验证通过")
      mapWork.createTileLayer(updateValue)
    } catch (err) {
      console.log("表单验证失败")
    }
  }, [updateValue])
  const reset = useCallback(() => {
    // 重置参数
    guiRef.current.reset()

    // 清除绘制区域和移除加载的矢量数据
    mapWork.btnClearExtent()
    mapWork.removeLayer()
  }, [])

  // 当参数改变时，修改加载图层的部分参数
  const dataUpdate = useCallback(() => {
    const data = guiRef.current.getValues()

    const value = {
      url: data.url,
      type: data.type,
      txtLayer: data.txtLayer,
      txtTileFormat: data.txtTileFormat,
      CRS: data.CRS,
      chinaCRS: data.chinaCRS,
      minLoadLevel: data.loadLevel[0],
      maxLoadLevel: data.loadLevel[1],
      minShowLevel: data.showLevel[0],
      maxShowLevel: data.showLevel[1],
      rectangle: data.rectangle,
      opacity: data.opacity,
      brightness: data.brightness,
      chkProxy: data.chkProxy
    }

    setUpdateValue(value)
    mapWork.dataUpdate(value)
  }, [])

  // 绘制和清除区域
  const btnDrawExtent = useCallback(() => {
    mapWork.btnDrawExtent(updateValue)
    dataUpdate()
  }, [updateValue, dataUpdate])

  useEffect(() => {
    dataUpdate()
  }, [dataUpdate])

  return (
    <MarsPannel visible={true} width="400" right="10" top="10">
      <MarsGui options={options} formProps={{ labelCol: { span: 7 } }} ref={guiRef}></MarsGui>
      <div className="f-tac">
        <Space>
          <MarsButton size="middle" onClick={() => loadCoverage()}>
            加载图层
          </MarsButton>
          <MarsButton size="middle" onClick={() => reset()}>
            重置参数
          </MarsButton>
          <MarsButton size="middle" onClick={() => btnDrawExtent()}>
            绘制
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
