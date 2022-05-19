import { MarsButton, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"
import "./index.less"
import { useMemo, useState, useRef } from "react"

let satelliteParams = {
  name: "",
  selXiLie: "",
  selCountry: "",
  selType: "",
  selGuidao: "",
  sliRcs: [0, 1000],
  sliLaunchdate: [1950, 2022],
  sliPeriod: [0, 60000],
  sliInclination: [0, 150],
  sliApogee: [0, 600000],
  sliPerigee: [0, 500000]
}
const LOW_ORBIT = 2000
const GEOSYNCHRONOUS_ORBIT = 35786

function UIComponent() {
  const guiRef = useRef<any>()

  const selectSatellites = (satelliteParams: any) => {
    switch (satelliteParams.selGuidao) {
      case "low":
        satelliteParams.sliApogee = [0, LOW_ORBIT]
        satelliteParams.sliPerigee = [0, LOW_ORBIT]
        break
      case "medium":
        satelliteParams.sliApogee = [LOW_ORBIT, GEOSYNCHRONOUS_ORBIT]
        satelliteParams.sliPerigee = [LOW_ORBIT, GEOSYNCHRONOUS_ORBIT]
        break
      case "geosynchronous":
        satelliteParams.sliApogee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
        satelliteParams.sliPerigee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
        break
      case "geostationary":
        satelliteParams.sliApogee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
        satelliteParams.sliPerigee = [GEOSYNCHRONOUS_ORBIT * 0.98, GEOSYNCHRONOUS_ORBIT * 1.02]
        satelliteParams.sliInclination = [0, 1]
        break
      case "high":
        satelliteParams.sliApogee = [GEOSYNCHRONOUS_ORBIT * 1.02, 600000]
        satelliteParams.sliPerigee = [GEOSYNCHRONOUS_ORBIT * 1.02, 500000]
        break
      default:
        break
    }
    mapWork.selectSatellites(satelliteParams)
  }

  let num: any
  // 滑动条改变事件
  const changeSlider = (satelliteParams) => {
    clearTimeout(num)
    num = setTimeout(() => {
      mapWork.selectSatellites(satelliteParams)
    }, 500)
  }

  const options: GuiItem[] = [
    {
      type: "input",
      field: "name",
      label: "名称",
      value: "",
      change(data) {
        satelliteParams.name = data
        selectSatellites(satelliteParams)
      }
    },
    {
      type: "select",
      field: "selXiLie",
      label: "系列卫星",
      value: "",
      options: [
        {
          value: "",
          label: "无"
        },
        {
          value: "gps",
          label: "美国GPS系统"
        },
        {
          value: "bd",
          label: "中国 北斗卫星系统"
        },
        {
          value: "glonass",
          label: "俄罗斯 格洛纳斯系统"
        },
        {
          value: "inmarsat",
          label: "国际海事卫星(Inmarsat)"
        },
        {
          value: "landsat",
          label: "地球资源卫星(Landsat)"
        },
        {
          value: "digitalglobe",
          label: "数位全球(DigitalGlobe)"
        }
      ],
      change(data) {
        satelliteParams.selXiLie = data
        selectSatellites(satelliteParams)
      }
    },
    {
      type: "select",
      field: "selCountry",
      label: "所属国家",
      value: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "US",
          label: "美国"
        },
        {
          value: "CIS",
          label: "俄罗斯"
        },
        {
          value: "PRC",
          label: "中国"
        },
        {
          value: "UK",
          label: "英国"
        },
        {
          value: "FR",
          label: "法国"
        },
        {
          value: "CA",
          label: "加拿大"
        },
        {
          value: "AUS",
          label: "澳大利亚"
        },
        {
          value: "JPN",
          label: "日本"
        },
        {
          value: "IND",
          label: "印度"
        }
      ],
      change(data) {
        satelliteParams.selCountry = data
        selectSatellites(satelliteParams)
      }
    },
    {
      type: "select",
      field: "selType",
      label: "对象类型",
      value: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "satellite",
          label: "普通卫星"
        },
        {
          value: "junk",
          label: "垃圾(卫星碎片、火箭和助推器)"
        }
      ],
      change(data) {
        satelliteParams.selType = data
        selectSatellites(satelliteParams)
      }
    },
    {
      type: "slider",
      field: "sliRcs",
      label: "雷达截面",
      step: 1,
      range: true,
      min: 0,
      max: 1000,
      value: [0, 1000],
      change(data) {
        satelliteParams.sliRcs = data
        changeSlider(satelliteParams)
      }
    },
    {
      type: "slider",
      field: "sliLaunchdate",
      label: "发射日期",
      step: 1,
      range: true,
      min: 1950,
      max: 2022,
      value: [1950, 2022],
      change(data) {
        satelliteParams.sliLaunchdate = data
        changeSlider(satelliteParams)
      }
    },
    {
      type: "slider",
      field: "sliPeriod",
      label: "轨道周期",
      step: 1,
      range: true,
      min: 0,
      max: 60000,
      value: [0, 60000],
      change(data) {
        satelliteParams.sliPeriod = data
        changeSlider(satelliteParams)
      }
    },
    {
      type: "select",
      field: "selGuidao",
      label: "轨道类型",
      value: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "low",
          label: "低地球轨道"
        },
        {
          value: "medium",
          label: "中地球轨道"
        },
        {
          value: "geosynchronous",
          label: "地球同步轨道"
        },
        {
          value: "geostationary",
          label: "地球静止轨道"
        },
        {
          value: "high",
          label: "高地球轨道"
        }
      ]
    },
    {
      type: "slider",
      field: "sliInclination",
      label: "倾斜角度",
      step: 1,
      range: true,
      min: 0,
      max: 150,
      value: [0, 150],
      change(data) {
        satelliteParams.sliInclination = data
        changeSlider(satelliteParams)
      }
    },
    {
      type: "slider",
      field: "sliApogee",
      label: "远地点高度",
      step: 1,
      range: true,
      min: 0,
      max: 600000,
      value: [0, 600000],
      change(data) {
        satelliteParams.sliApogee = data
        changeSlider(satelliteParams)
      }
    },
    {
      type: "slider",
      field: "sliPerigee",
      label: "近地点高度",
      step: 1000,
      range: true,
      min: 0,
      max: 500000,
      value: [0, 500000],
      change(data) {
        satelliteParams.sliPerigee = data
        changeSlider(satelliteParams)
      }
    }
  ]

  // 卫星详情面板
  const weixinNameList = [
    "名称",
    "目录号",
    "国际代号",
    "对象类型",
    "操作状态",
    "所有者/国家",
    "发射日期",
    "发射地点",
    "轨道周期（分钟）",
    "倾角（度）",
    "远地点高度（公里）",
    "近地点高度（公里）",
    "雷达截面",
    "轨道中心",
    "轨道类型",
    "更多资料"
  ]

  const [dataList, setDataList] = useState([]) // 数据

  const [viewContorUi, setViewContorUi] = useState(true)

  const [pointInfo, setPointInfo] = useState(false)

  useMemo(() => {
    mapWork.eventTarget.on("clickWeixin", function (event: any) {
      setViewContorUi(false)
      setPointInfo(true)
      setDataList(event.weixinList)
    })

    // 单击地图空白处
    mapWork.eventTarget.on("clickMap", function () {
      setViewContorUi(true)
      setPointInfo(false)
    })
  }, [])

  // 重置参数
  const reset = () => {
    satelliteParams = {
      name: "",
      selXiLie: "",
      selCountry: "",
      selType: "",
      selGuidao: "",
      sliRcs: [0, 1000],
      sliLaunchdate: [1950, 2022],
      sliPeriod: [0, 60000],
      sliInclination: [0, 150],
      sliApogee: [0, 600000],
      sliPerigee: [0, 500000]
    }

    guiRef.current.reset() // 重置
    mapWork.resetUI()
  }

  const highlightSatellite = () => {
    setViewContorUi(true)
    setPointInfo(false)
    // 重置上次选中的轨道样式
    mapWork.highlightSatellite()
  }

  return (
    <>
      <MarsPannel visible={viewContorUi} top={10} right={10} width={360}>
        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }} ref={guiRef}></MarsGui>
        <div className="f-tac">
          <MarsButton onClick={reset}>重置</MarsButton>
        </div>
      </MarsPannel>

      <MarsPannel visible={pointInfo} top={10} right={10} width={400} height={548}>
        <MarsButton onClick={highlightSatellite}>返回</MarsButton>
        <table className="mars-table tb-border">
          {weixinNameList.map((item, index) => {
            return (
              <tbody key={item}>
                <tr>
                  <td className="nametd">{item}</td>
                  <td>{dataList[index]}</td>
                </tr>
              </tbody>
            )
          })}
        </table>
      </MarsPannel>
    </>
  )
}
export default UIComponent
