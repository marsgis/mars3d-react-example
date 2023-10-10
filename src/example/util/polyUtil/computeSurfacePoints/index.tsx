import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { useEffect, useMemo, useState } from "react"
import * as mapWork from "./map.js"
import * as echarts from "echarts"

let myChart1: echarts.ECharts

function UIComponent() {
  const [showEcharts, stateEchartShow] = useState(false)

  useMemo(() => {
    mapWork.eventTarget.on("measureEnd", function (event: any) {
      stateEchartShow(true)

      setTimeout(() => {
        setEchartsData(event) // 加载图表
      }, 100)
    })

    mapWork.eventTarget.on("measureClick", function (event: any) {
      if (event) {
        setEchartsData(event.value)
      }
    })
  }, [])

  useEffect(() => {
    myChart1 = echarts.init(document.getElementById("echartsView1"))
    // 图表自适应
    window.addEventListener("resize", function () {
      myChart1.resize()
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <Space>
          <MarsButton onClick={() => mapWork.measureSection()}>绘制线</MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeAll()
              myChart1.clear()

              stateEchartShow(false)
            }}
          >
            清除
          </MarsButton>
        </Space>
      </MarsPannel>
      <MarsPannel visible={showEcharts} left={56} width={"calc(100% - 280px)"} height={260} bottom={40}>
        <div id="echartsView1" style={{ width: "100%", height: "100%" }}></div>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent

function setEchartsData(data: any) {
  if (data == null || data.arrPoint == null) {
    return
  }
  const arrPoint = data.arrPoint
  let inhtml = ""

  const option = {
    grid: {
      left: 10,
      right: 40,
      bottom: 10,
      top: 40,
      containLabel: true
    },
    dataZoom: [
      {
        type: "inside",
        throttle: 50
      }
    ],
    tooltip: {
      trigger: "axis",
      // position: function (point, params, dom, rect, size) {
      //    return [10, 20];
      // },
      formatter: (params: any) => {
        if (params.length === 0) {
          mapWork.hideTipMarker()
          return inhtml
        }

        const hbgd = params[0].value // 海拔高度
        const point = arrPoint[params[0].dataIndex] // 所在经纬度
        const len = mapWork.formatDistance(Number(params[0].axisValue))
        const hbgdStr1 = mapWork.formatDistance(Number(params[0].value)) || "无"
        const hbgdStr2 = mapWork.formatDistance(Number(params[1].value)) || "无"
        const hbgdStr3 = mapWork.formatDistance(Number(params[2].value)) || "无"

        inhtml = `当前位置<br />
        距起点：${len}<br />
        C1高度：<span style='color:${params[0].color};'>${hbgdStr1}</span><br />
        C2高度：<span style='color:${params[1].color};'>${hbgdStr2}</span><br />
        C3高度：<span style='color:${params[2].color};'>${hbgdStr3}</span><br />
        经度：${point.lng}<br />
        纬度：${point.lat}`

        mapWork.showTipMarker(point, hbgd, inhtml)

        return inhtml
      }
    },
    xAxis: [
      {
        name: "长度",
        type: "category",
        nameTextStyle: { color: "rgb(255, 70, 131)" },
        boundaryGap: false,
        axisLine: {
          show: true
        },
        axisLabel: {
          show: true,
          formatter: "{value} 米",
          color: "#fff"
        },
        data: data.arrLen
      }
    ],
    yAxis: [
      {
        name: "高程",
        nameTextStyle: { color: "rgb(255, 70, 131)" },
        type: "value",
        min: 0, // getMinZ(arrPoint),
        axisLabel: {
          formatter: "{value} 米",
          color: "#fff"
        }
      }
    ],
    series: [
      {
        name: "C1高度",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "#698d29"
          }
        },
        data: data.arrHB1
      },
      {
        name: "C2高度",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "#782b71"
          }
        },
        data: data.arrHB2
      },
      {
        name: "C3高度",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "#332d91"
          }
        },
        data: data.arrHB3
      }
    ]
  }

  myChart1.setOption(option)
  myChart1.resize()
}
 
