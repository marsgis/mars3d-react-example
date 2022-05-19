import { MarsPannel } from "@mars/components/MarsUI"
import * as echarts from "echarts"
import { useMemo } from "react"
import * as mapWork from "./map.js"

// 获取的dom元素
function drawHeightToDistanceEcharts(heightArry: any[], heightTDArray: any[], distanceArray: any[]) {
  const myChart = echarts.init(document.getElementById("section")!, "dark")

  const option = {
    title: {
      text: "断面图",
      left: 25
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    toolbox: {
      show: false,
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      data: ["地形高程", "电线高程"]
    },
    grid: {
      left: 50,
      width: 425,
      top: 50,
      bottom: 30
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: distanceArray
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} 米"
      },
      axisPointer: {
        snap: true
      }
    },
    dataZoom: {
      start: 80,
      type: "inside"
    },
    series: [
      {
        name: "地形高程",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "rgb(255, 255, 0)"
          }
        },
        data: heightTDArray
      },
      {
        name: "电线高程",
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "rgb(255, 70, 131)"
          }
        },
        data: heightArry
      }
    ]
  }
  myChart.setOption(option, true)
}

function UIComponent() {
  useMemo(() => {
    mapWork.echartTarget.on("addEchart", function (event: any) {
      drawHeightToDistanceEcharts(event.heightArry, event.heightTDArray, event.distanceArray)
    })
  }, [])

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div id="section" style={{ width: " 500px", height: "200px" }}></div>
    </MarsPannel>
  )
}

export default UIComponent
