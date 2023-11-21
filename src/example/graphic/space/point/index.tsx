import { MarsButton, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"
import "./index.less"
import * as echarts from "echarts"
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
    mapWork.resetGraphic()
  }

  const highlightSatellite = () => {
    setViewContorUi(true)
    setPointInfo(false)
    // 重置上次选中的轨道样式
    mapWork.highlightSatellite()
  }

  let allCount: number
  let firstEcharts: any //
  let secondEcharts: any
  const colorList = ["#6648FE", "#18AF92", "#0A7CE5", "#22CEEA", "#F35267", "#F68048"]

  mapWork.eventTarget.on("loadEchartsData", (item) => {
    allCount = item.allCount
  
    // 饼状图
    const topDom = document.getElementById("echartViewLeft_top")
    firstChart(item.countryNumber, topDom)
  
    // 柱状图
    const bottomDom = document.getElementById("echartViewLeft_bottom")
    secondChart(item.yearNumber, bottomDom)
  })

  // 配置第一个图表的数据(圆环)
function firstChart(data, dom) {
  const arrData = []
  // ts中遍历对象，将对象中的数据，拆分成name和value对，放入数组中
  for (const [key, val] of Object.entries(data)) {
    const itemObj: any = {}
    itemObj.name = key
    itemObj.value = val
    arrData.push(itemObj)
  }

  // 初始化echarts
  firstEcharts = echarts.init(dom)

  // 进行相关的配置
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>共{c}个&nbsp;({d}%)"
    },
    title: [
      {
        text: "总数",
        left: "49%",
        top: "44%",
        textAlign: "center",
        textBaseline: "middle",
        textStyle: {
          color: "#A4D5FF",
          fontWeight: "normal",
          fontSize: 15
        }
      },
      {
        text: allCount,
        left: "49%",
        top: "55%",
        textAlign: "center",
        textBaseline: "middle",
        textStyle: {
          color: "#FFFFFF",
          fontWeight: "normal",
          fontSize: 25
        }
      }
    ],
    series: [
      {
        name: "pie",
        type: "pie",
        radius: ["40%", "50%"],
        selectedMode: "single",
        selectedOffset: 16, // 选中是扇区偏移量
        clockwise: true,
        startAngle: 90,
        color: colorList,
        emphasis: {
          borderWidth: 0,
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.2)",
          scale: false, // 设置饼图默认的展开样式
          itemStyle: {
            borderWidth: 3,
            borderColor: "#ffffff"
          }
        },
        data: arrData,
        label: {
          overflow: "none",
          ellipsis: "...",
          minMargin: 10,
          alignTo: "none"
        }
      }
    ]
  }

  firstEcharts.setOption(option)
}


// 配置第二个图表的数据(柱状图)
function secondChart(data, dom) {
  // 年份的数组
  const yearData = []
  // 对应的卫星数组
  const weiXinData = []
  // ts中遍历对象，将对象中的数据，拆分成name和value对，放入数组中
  for (const [key, val] of Object.entries(data)) {
    yearData.push(key)
    weiXinData.push(val)
  }

  // 过滤数据，将数据中年份为NaN的数据去除
  const indexArr = yearData.filter((item) => !isNaN(item))
  // 初始化echarts
  secondEcharts = echarts.init(dom)

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params: any) {
        let inhtml = ""
        for (const i in params) {
          const item = params[i]
          inhtml += "<label>卫星" + item.value + "</label>&nbsp;个"
        }
        return inhtml
      },
      textStyle: {
        color: "#cacaca"
      }
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: 2,
      containLabel: true
    },
    xAxis: {
      type: "value",
      axisLabel: {
        show: false
      }
    },
    yAxis: {
      type: "category",
      data: indexArr,
      axisLabel: {
        color: "#FFFFFF" // 字体颜色
      }
    },
    dataZoom: [
      {
        type: "inside",
        start: Math.ceil(((yearData.length - 12) * 100) / yearData.length), // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
        // start: 80,
        end: 100, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
        yAxisIndex: 0
      },
      {
        type: "slider",
        fillerColor: "#134875",
        yAxisIndex: 0,
        width: 10,
        height: "40%",
        right: 0
      }
    ],
    series: [
      {
        name,
        type: "bar",
        data: weiXinData,
        barWidth: "50%",
        itemStyle: {
          color: {
            type: "linear",
            x: 1, // 右
            y: 0, // 下
            x2: 0, // 左
            y2: 0, // 上
            colorStops: [
              {
                offset: 0,
                color: "#18AF92" // 0% 处的颜色
              },
              {
                offset: 0.9,
                color: "#7ceef9" // 90% 处的颜色
              }
            ]
          }
        }
      }
    ]
  }

  secondEcharts.setOption(option)
}

const [showPannel, setShowPannel] = useState(true)
const showPannelFun = () => {
  setShowPannel(!showPannel) 
}

  return (
    <>
      <MarsPannel visible={viewContorUi} top={10} right={10} width={360}>
        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }} ref={guiRef}></MarsGui>
        <div className="f-tac">
          <MarsButton onClick={reset}>重置</MarsButton>
        </div>
      </MarsPannel>

      {/* <MarsPannel visible={pointInfo} top={10} right={10} width={400} height={548}>
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
      </MarsPannel> */}
      <MarsPannel visible={true} top={10} left={10} width={ showPannel ? 340 : 100} height={showPannel ? 857 : 55}>
        <MarsButton onClick={showPannelFun}>显示隐藏</MarsButton>
        <div style={{ display: showPannel ? "block" : "none" }} id="echartViewLeft_top" className="viewLeft_top"></div>
        <p style={{ display: showPannel ? "block" : "none" }} className="echarts-title">卫星数统计</p>
        <div style={{ display: showPannel ? "block" : "none" }} id="echartViewLeft_bottom" className="viewLeft_bottom"></div>
      </MarsPannel>
    </>
  )
}
export default UIComponent
