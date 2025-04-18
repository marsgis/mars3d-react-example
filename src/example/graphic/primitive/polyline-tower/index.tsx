import { MarsPannel, MarsFormItem, MarsButton } from "@mars/components/MarsUI"
import * as echarts from "echarts"
import { useMemo } from "react"
import * as mapWork from "./map.js"
import { Space } from "antd"

// 获取的dom元素
function drawHeightToDistanceEcharts(heightArry: any[], heightTDArray: any[], distanceArray: any[]) {
  const myChart = echarts.init(document.getElementById("section")!)

  const option = {
    title: {
      text: "断面图",
      left: 25,
      textStyle: {
        fontSize: 18,
        color: "#ffaf15" // 主标题文字颜色
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      lineStyle: {
        color: "#fff"
      }
    },
    toolbox: {
      show: false,
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      data: ["地形高程", "电线高程"],
      textStyle: {
        color: "#fff"
      }
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
      data: distanceArray,
      axisLabel: {
        show: true,
        lineStyle: {
          color: "#86b96f" // 更改坐标轴颜色
        },
        textStyle: {
          color: "#86b96f" // 更改坐标轴文字颜色
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#86b96f"
        }
      },
      splitLine: {
        // 修改背景线条样式
        show: true, // 是否展示
        lineStyle: {
          color: "#555"
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#86b96f"
        }
      }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} 米",
        show: true,
        lineStyle: {
          color: "#86b96f" // 更改坐标轴颜色
        },
        textStyle: {
          color: "#fff" // 更改坐标轴文字颜色
        }
      },
      axisPointer: {
        snap: true
      },
      splitLine: {
        // 修改背景线条样式
        show: true, // 是否展示
        lineStyle: {
          color: "#555"
        }
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
      <MarsFormItem label="最近点计算">
        <Space>
          <MarsButton onClick={mapWork.drawPoint}>绘制点</MarsButton>
          <MarsButton onClick={() => mapWork.testGraphicLayer.clear()}>清除</MarsButton>
          <MarsButton onClick={mapWork.batchComputing}>批量计算(与树求交)</MarsButton>
        </Space>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
