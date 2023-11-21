import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect } from "react"
import * as echarts from "echarts"
import "./index.less"

const chartsData = {
  fltj: [
    { name: "公共文化", xms: 160, zds: 10, zjl: 645 },
    { name: "公共教育", xms: 848, zds: 580, zjl: 10 },
    { name: "医疗卫生", xms: 370, zds: 10, zjl: 150560 },
    { name: "公共体育", xms: 91, zds: 0, zjl: 182 },
    { name: "社会保障", xms: 233, zds: 10, zjl: 808 },
    { name: "基层公共服务", xms: 20, zds: 10, zjl: 10 }
  ],
  zjly: [
    { name: "省级", value: 88 },
    { name: "市级", value: 127 },
    { name: "区县级", value: 175 },
    { name: "街道级", value: 270 },
    { name: "社会资本", value: 42 }
  ],
  ndtj: {
    xms: [
      { name: "2013", value: 1 },
      { name: "2014", value: 2 },
      { name: "2015", value: 6 },
      { name: "2016", value: 36 },
      { name: "2017", value: 85 },
      { name: "2018", value: 10 },
      { name: "2019年", value: 17 }
    ],
    zds: [
      { name: "2013", value: 10 },
      { name: "2014", value: 20 },
      { name: "2015", value: 30 },
      { name: "2016", value: 40 },
      { name: "2017", value: 50 },
      { name: "2018", value: 60 }
    ],
    zjl: [
      { name: "2013", value: 55600 },
      { name: "2014", value: 95600 },
      { name: "2015", value: 162896 },
      { name: "2016", value: 195761 },
      { name: "2017", value: 87068 },
      { name: "2018", value: 68393 }
    ]
  }
}
function UIComponent() {
  useEffect(() => {
    // 分资金来源统计
    initCharts_Two(chartsData.zjly, document.getElementById("ul_ZJLY"))
    // 分年度统计
    histogram(chartsData.ndtj.xms, "个")
  }, [])

  return (
    <>
      <div className="divPanel">
        <img src="/img/legend/heatmap.png" alt="" />
      </div>
      <MarsPannel visible={true} left={10} top={10} width="100">
        <MarsButton onClick={() => mapWork.btnUpdate()}>更新数据</MarsButton>
      </MarsPannel>
      {/* <!-- echarts图表 --> */}
      <div className="chart">
        <div className="chartOne">
          <h6>分类统计</h6>
          <ul className="chartList">
            {chartsData.fltj.map((item, index) => (
              <li key={index}>
                <div className="title">{item.name}</div>
                <div className="conter">
                  <span>{item.xms}</span>个， 投资<span>{item.zds}</span>亿，占地<span>{item.zjl}</span>亩
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chartTwo" id="chartTwo">
          <h6>分资金来源统计</h6>
          <div id="ul_ZJLY" className="chartTwo_ulzjly"></div>
        </div>

        <div className="chartThree" id="chartThree">
          <h6>分年度统计</h6>
          <button
            onClick={() => {
              refreshData(chartsData.ndtj.xms, "个")
            }}
          >
            项目数
          </button>
          <button
            onClick={() => {
              refreshData(chartsData.ndtj.zds, "亩")
            }}
          >
            占地数
          </button>
          <button
            onClick={() => {
              refreshData(chartsData.ndtj.zjl, "亿")
            }}
          >
            资金量
          </button>
          <div id="ul_NDTJ" className="chartThree_ulndtj"></div>
        </div>
      </div>
    </>
  )
}

// chartTwo  Echart圆形  分类资金来源
function initCharts_Two(arr: any, ZJLY: any) {
  const data = []
  for (let i = 0; i < arr.length; i++) {
    const object: any = {}
    object.name = arr[i].name
    object.value = arr[i].value
    data[i] = object
  }

  const myChart = echarts.init(ZJLY)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}"
    },
    // 图例 的相关设置
    legend: {
      orient: "vertical",
      left: "right",
      textStyle: {
        color: "#fff"
      }
    },
    // 图形的设置
    series: [
      {
        // name: '访问来源',
        type: "pie",
        radius: "80%",
        right: "20%",
        // 图形上文本标签的样式设置
        label: {
          show: false
        },
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF"
        ],
        center: ["45%", "55%"],
        data, // 使用for循环添加
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener("resize", function () {
    myChart.resize()
  })
}
// 项目、占地、资金    按钮点击切换
function histogram(arr: any, Word: string) {
  const arrName = []
  const arrValue = []
  for (let i = 0; i < arr.length; i++) {
    arrName[i] = arr[i].name
    arrValue[i] = arr[i].value
  }

  const myChart = echarts.init(document.getElementById("ul_NDTJ"))
  const option = {
    // xAxis和yAxis的nameTextStyle不起作用
    // 因此设置了字体的全局样式
    textStyle: {
      color: "#ccc"
    },
    title: {
      text: "单位:" + Word,
      // 全局样式对此不生效，
      textStyle: {
        color: "#fff"
      }
    },
    // 移入柱子时的阴影
    tooltip: {
      trigger: "axis",
      formatter: "{b}<br/>{c}" + Word,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "5px",
      right: "0",
      bottom: "5px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: arrName
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        // 柱子的相关设置
        itemStyle: {
          color: "rgb(0, 174, 255)"
        },
        barWidth: "20px",
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: arrValue
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener("resize", function () {
    myChart.resize()
  })
}

function refreshData(arr, word) {
  const arrName = []
  const arrValue = []
  for (let i = 0; i < arr.length; i++) {
    arrName[i] = arr[i].name
    arrValue[i] = arr[i].value
  }

  // 刷新数据
  const chart = echarts.getInstanceByDom(document.getElementById("ul_NDTJ"))
  const option = chart.getOption()
  option.title = {
    text: "单位:" + word,
    textStyle: {
      color: "#ccc"
    }
  }
  option.xAxis = {
    type: "category",
    data: arrName
  }
  option.series[0].data = arrValue
  chart.setOption(option)
}

export default UIComponent
