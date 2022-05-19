import { MarsPannel, MarsIcon } from "@mars/components/MarsUI"
import * as echarts from "echarts"
import { useEffect } from "react"
import "./index.less"

// 实有人口
function initRealPopulation(dom: any) {
  const realEcharts = echarts.init(dom)
  const realPopulationOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      top: "30%",
      left: "3%",
      right: "4%",
      bottom: "-10%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.5],
      show: false
    },
    yAxis: {
      type: "category",
      data: ["常住人口", "流动人口"],
      axisLabel: {
        show: true,
        color: "#fff" // 坐标轴文字颜色}
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          color: "#fff",
          fontSize: 10
        },
        data: [130365, 52729],
        itemStyle: {
          borderRadius: [15, 15, 15, 15],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#4d68ee" // 0%处的颜色
            },
            {
              offset: 0.6,
              color: "#25b1f5" // 50%处的颜色
            },
            {
              offset: 1,
              color: "#01f5ff" // 100%处的颜色
            }
          ])
        }
      }
    ]
  }
  realEcharts.setOption(realPopulationOption)

  window.addEventListener("resize", function () {
    realEcharts.resize()
  })
}
// 人口结构
function initPopulationStructure(dom: any) {
  const structureEcharts = echarts.init(dom)
  const structureOption = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      textStyle: {
        color: "#fff"
      },

      top: "8%",
      left: "center",
      icon: "circle",
      itemWidth: 10
    },
    color: ["#a20bd1", "#b2ba00", "#49ad00", "#03dfa7", "#8185b3", "#4c67eb", "#ab7900"],
    series: [
      {
        name: "男性",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["25%", "65%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
          fontSize: 10
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "10",
            fontWeight: "bold",
            color: "#fff"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: "0-0.6" },
          { value: 735, name: "0.6-2" },
          { value: 580, name: "3-6" },
          { value: 484, name: "7-14" },
          { value: 300, name: "15-35" },
          { value: 300, name: "36-60" },
          { value: 300, name: "61以上" }
        ]
      },
      {
        name: "女性",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["75%", "65%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
          fontSize: 10
        },
        data: [
          { value: 148, name: "0-0.6" },
          { value: 735, name: "0.6-2" },
          { value: 580, name: "3-6" },
          { value: 484, name: "7-14" },
          { value: 300, name: "15-35" },
          { value: 300, name: "36-60" },
          { value: 300, name: "61以上" }
        ]
      }
    ]
  }
  structureEcharts.setOption(structureOption)

  window.addEventListener("resize", function () {
    structureEcharts.resize()
  })
}

// 人口老龄化分析
function initAging(dom: any) {
  const agingEcharts = echarts.init(dom)
  const agingOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params: any) {
        return "女性：" + params[0].value + "<br/>男性：" + Math.abs(params[1].value)
      }
    },
    color: ["#c145c5", "#21b8f6"],
    grid: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      top: "10%",
      left: "10%",
      containLabel: true
    },
    xAxis: [
      {
        type: "value",
        axisTick: {
          show: false
        },
        show: false
      }
    ],
    yAxis: [
      {
        type: "category",
        data: ["60-65岁", "65-70岁", "70-75岁", "75-80岁", "80岁以上"],
        axisLabel: {
          color: "#fff" // 坐标轴文字颜色
        }
      }
    ],

    series: [
      {
        type: "bar",
        stack: "总量",
        label: {
          show: false
        },
        emphasis: {
          focus: "series"
        },

        data: [700, 300, 330, 160, 70],
        barCategoryGap: "50%",
        itemStyle: {
          borderRadius: [15, 15, 15, 15]
        }
      },
      {
        type: "bar",
        stack: "总量",
        label: {
          show: false,
          position: "left"
        },
        emphasis: {
          focus: "series"
        },
        data: [-800, -400, -350, -200, -100],
        itemStyle: {
          borderRadius: [15, 15, 15, 15]
        }
      }
    ]
  }
  agingEcharts.setOption(agingOption)

  window.addEventListener("resize", function () {
    agingEcharts.resize()
  })
}

function UIComponent() {
  useEffect(() => {
    const realPopulationDom = document.getElementById("population")
    const populationStructureDom = document.getElementById("structure")
    const agingDom = document.getElementById("agingAnalysis")

    initRealPopulation(realPopulationDom)
    initPopulationStructure(populationStructureDom)
    initAging(agingDom)
  })

  return (
    <MarsPannel visible={true} top={10} right={10} bottom={"auto"} width={386}>
      <div className="populationView">
        {/* 实有人口 */}
        <div className="realPopulation">
          <div className="populationView_text">
            <span className="firstBox text_population">实有人口</span>
            <span className="firstBox text_icon">
              /&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/
            </span>
          </div>

          <div className="container">
            <div className="comment populationNumber">
              <span className="columnar"></span>
              <span className="number">250685</span>
              <p className="text-num">实有人口（人）</p>
            </div>

            <div className="comment birthRate">
              <span className="columnar"></span>
              <span className="number">12.6%</span>
              <p className="text-num">人口出生率</p>
            </div>

            <div className="comment deathRate">
              <span className="columnar"></span>
              <span className="number">57.0%</span>
              <p className="text-num">人口死亡率</p>
            </div>
          </div>
          <div id="population" className="population"></div>
        </div>

        {/* 人口结构 */}
        <div className="populationStructure">
          <div className="populationView_text">
            <span className="firstBox text_population">人口结构</span>
            <span className="firstBox text_icon">
              /&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/
            </span>
          </div>
          <div className="male">
            <MarsIcon icon="boy-two" width="35" color="#00f6ff" />
            <span>男性</span>
          </div>
          <div className="female">
            <MarsIcon icon="girl" width="35" color="#ff6ac4" />
            <span>女性</span>
          </div>
          <div id="structure" className="structure"></div>
        </div>

        {/* 老龄化分析 */}
        <div className="aging">
          <div className="populationView_text">
            <span className="firstBox text_population">老龄化分析</span>
            <span className="firstBox text_icon">
              /&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/
            </span>
          </div>
          <span className="man_icon">
            <MarsIcon icon="boy-two" width="35" color="#00f6ff" />
          </span>
          <span className="woman_icon">
            <MarsIcon icon="girl" width="35" color="#ff6ac4" />
          </span>
          <div className="man_display">
            <MarsIcon icon="boy-two" color="#00f6ff" />
            <span>38.53%</span>
          </div>
          <div className="woman_display">
            <MarsIcon icon="girl" color="#ff6ac4" />
            <span>61.49%</span>
          </div>

          <div id="agingAnalysis" className="agingAnalysis"></div>
        </div>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
