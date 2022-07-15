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
        const result = mapWork.calculation(params[0])

        inhtml = `当前位置<br />
                        距起点：${result.len}<br />
                        海拔：<span style='color:${params[0].color};'>${result.hbgdStr}</span><br />
                        经度：${point.lng}<br />
                        纬度：${point.lat}`

        mapWork.showTipMarker(point, hbgd, inhtml)

        return inhtml
      }
    },
    xAxis: [
      {
        name: "行程",
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
        min: getMinZ(arrPoint),
        axisLabel: {
          formatter: "{value} 米",
          color: "#fff"
        }
      }
    ],
    series: [
      {
        name: "高程值",
        type: "line",
        smooth: true,
        symbol: "none",
        sampling: "average",
        itemStyle: {
          normal: {
            color: "rgb(255, 70, 131)"
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)"
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)"
              }
            ])
          }
        },
        data: data.arrHB
      }
    ]
  }

  myChart1.setOption(option)
  myChart1.resize()
}

function getMinZ(arr: any) {
  let minz = "dataMin"
  if (arr == null || arr.length === 0) {
    return minz
  }

  minz = arr[0].alt
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].alt < minz) {
      minz = arr[i].alt
    }
  }
  return minz
}
