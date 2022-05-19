import { MarsButton, MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useCallback, useEffect, useMemo, useRef } from "react"

function UIComponent() {
  const marsGuiRef = useRef<any>()

  const options: GuiItem[] = [
    {
      type: "radio",
      field: "type",
      label: "类型",
      value: "1",
      options: [
        {
          label: "十进制",
          value: "1"
        },
        {
          label: "度分秒",
          value: "2"
        },
        {
          label: "平面坐标",
          value: "3"
        }
      ]
    },
    {
      type: "input",
      field: "lng",
      label: "经度",
      value: 117.270617,
      show(data) {
        return data.type === "1"
      },
      change(value, data) {
        console.log(data)

        changeDmsGk(data)
      }
    },
    {
      type: "input",
      field: "lat",
      label: "纬度",
      value: 31.815012,
      show(data) {
        return data.type === "1"
      },
      change(value, data) {
        changeDmsGk(data)
      }
    },
    {
      type: "input",
      field: "alt",
      label: "高程",
      value: 0,
      show(data) {
        return data.type === "1"
      },
      change(value, data) {
        changeDmsGk(data)
      }
    },
    {
      type: "inputGroup",
      field: "lngDMS",
      label: "经度",
      value: [117, 16, 14],
      units: ["度", "分", "秒"],
      show(data) {
        return data.type === "2"
      },
      change(value, data) {
        changeGk(data)
      }
    },
    {
      type: "inputGroup",
      field: "latDMS",
      label: "纬度",
      value: [31, 48, 54],
      units: ["度", "分", "秒"],
      show(data) {
        return data.type === "2"
      },
      change(value, data) {
        changeGk(data)
      }
    },
    {
      type: "input",
      field: "altDMS",
      label: "高程",
      value: 0,
      show(data) {
        return data.type === "2"
      },
      change(value, data) {
        changeGk(data)
      }
    },
    {
      type: "radio",
      field: "radioFendai",
      label: "分带",
      value: "1",
      options: [
        {
          label: "三度带",
          value: "1"
        },
        {
          label: "六度带",
          value: "2"
        }
      ],
      change(value, data) {
        changeValue(data)
      },
      show(data) {
        return data.type === "3"
      }
    },
    {
      type: "input",
      field: "gk6X",
      label: "纵坐标",
      value: 39525622.7,
      show(data) {
        return data.type === "3"
      },
      change(value, data) {
        changeDms(data)
      }
    },
    {
      type: "input",
      field: "gk6Y",
      label: "横坐标",
      value: 3521371.9,
      show(data) {
        return data.type === "3"
      },
      change(value, data) {
        changeDms(data)
      }
    },
    {
      type: "input",
      field: "gkAlt",
      label: "高度值",
      value: 0,
      show(data) {
        return data.type === "3"
      },
      change(value, data) {
        changeDms(data)
      }
    }
  ]

  // 十进制转2000平面三分度六分度
  const changeValue = useCallback((data) => {
    marsZONEtoCRS(data)
    marsProj4Trans(data)
  }, [])

  // 界面一
  const changeDmsGk = useCallback((data) => {
    marsPointTrans(data)
    marsProj4Trans(data)
  }, [])

  // 界面二
  const changeGk = useCallback((data) => {
    marsGuiRef.current.updateField(
      "lng",
      mapWork.marsDms2degree(
        mapWork.marsUtilFormtNum(data.lngDMS[0], 6),
        mapWork.marsUtilFormtNum(data.lngDMS[1], 6),
        mapWork.marsUtilFormtNum(data.lngDMS[2], 6)
      )
    )
    marsGuiRef.current.updateField(
      "lat",
      mapWork.marsDms2degree(
        mapWork.marsUtilFormtNum(data.latDMS[0], 6),
        mapWork.marsUtilFormtNum(data.latDMS[1], 6),
        mapWork.marsUtilFormtNum(data.latDMS[2], 6)
      )
    )
    marsGuiRef.current.updateField("alt", data.altDMS)

    marsProj4Trans(data)
  }, [])

  // 界面三
  const changeDms = useCallback((data) => {
    marsZONEtoCRS(data)
    marsPointTrans(data)
  }, [])

  // 更新度分秒
  const marsUpdataPosition = useCallback((data) => {
    marsGuiRef.current.updateField("lng", mapWork.marsUtilFormtNum(data.lng, 6))
    marsGuiRef.current.updateField("lat", mapWork.marsUtilFormtNum(data.lat, 6))
    marsGuiRef.current.updateField("alt", mapWork.marsUtilFormtNum(data.alt, 6))
  }, [])

  // 平面坐标转经纬度并更新
  const marsZONEtoCRS = useCallback((data) => {
    const zone = mapWork.marsZONEtoCRS(Number(data.gk6X), Number(data.gk6Y), data.radioFendai)
    marsGuiRef.current.updateField("lng", mapWork.marsUtilFormtNum(zone[0], 6))
    marsGuiRef.current.updateField("lat", mapWork.marsUtilFormtNum(zone[1], 6))
    marsGuiRef.current.updateField("alt", data.gkAlt)
  }, [])

  // 经纬度转平面坐标并更新
  const marsProj4Trans = useCallback((data) => {
    console.log(data)

    const zone = mapWork.marsProj4Trans(
      mapWork.marsUtilFormtNum(data.lng, 6),
      mapWork.marsUtilFormtNum(data.lat, 6),
      marsGuiRef.current.getValue("radioFendai")
    )
    marsGuiRef.current.updateField("gk6X", mapWork.marsUtilFormtNum(zone[0], 1))
    marsGuiRef.current.updateField("gk6Y", mapWork.marsUtilFormtNum(zone[1], 1))
    marsGuiRef.current.updateField("gkAlt", mapWork.marsUtilFormtNum(data.alt, 6))
  }, [])

  // 经纬度转度分秒并更新
  const marsPointTrans = useCallback((data) => {
    const lngDMS = [mapWork.marsPointTrans(data.lng).degree, mapWork.marsPointTrans(data.lng).minute, mapWork.marsPointTrans(data.lng).second]
    const latDMS = [mapWork.marsPointTrans(data.lat).degree, mapWork.marsPointTrans(data.lat).minute, mapWork.marsPointTrans(data.lat).second]
    marsGuiRef.current.updateField("lngDMS", lngDMS)
    marsGuiRef.current.updateField("latDMS", latDMS)
    marsGuiRef.current.updateField("altDMS", mapWork.marsUtilFormtNum(data.alt, 6))
  }, [])

  // 坐标定位
  const submitCenter = useCallback(() => {
    const data = marsGuiRef.current.getValues()
    mapWork.updateMarker(true, data.lng, data.lat, data.alt)
  }, [])

  useMemo(() => {
    // 图上拾取的坐标
    mapWork.eventTarget.on("clickMap", (event: any) => {
      const data = {
        lng: event.point.lng,
        lat: event.point.lat,
        alt: event.point.alt
      }

      marsUpdataPosition(data)
      marsPointTrans(data)
      marsProj4Trans(data)
      // 更新面板
      mapWork.updateMarker(false, data.lng, data.lat, data.alt)
    })
  }, [])

  useEffect(() => {
    const defaultPoitn = mapWork.defultPoint()

    marsUpdataPosition(defaultPoitn)

    marsPointTrans(defaultPoitn)

    marsProj4Trans(defaultPoitn)
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10" width="300">
      <MarsGui options={options} formProps={{ labelCol: { span: 4 } }} ref={marsGuiRef}></MarsGui>

      <div className="f-tac">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.bindMourseClick()
            }}
          >
            图上拾取
          </MarsButton>
          <MarsButton
            onClick={() => {
              submitCenter()
            }}
          >
            坐标定位
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
