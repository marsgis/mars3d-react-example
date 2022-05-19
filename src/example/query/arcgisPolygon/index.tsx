import { MarsGui, MarsPannel, MarsButton, MarsTabs, MarsTabPane, MarsTable } from "@mars/components/MarsUI"
import { setAutoHeight } from "@mars/utils/mars-util"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import * as mapWork from "./map.js"

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index"
  },
  {
    title: "类别",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "数量",
    dataIndex: "num",
    key: "num"
  },
  {
    title: "面积（亩）",
    dataIndex: "area",
    key: "area"
  }
]

let arrPie = [] // 饼状图:名称+面积
let arrTable = [] // 表格: 名称+面积+数量
let arrType = [] // 柱状图:名称
let arrArea = [] // 柱状图:面积

let keyWords: string = ""
function UIComponent() {
  const guiRef = useRef<any>()
  const options: GuiItem[] = [
    {
      type: "input",
      field: "context",
      label: "名称",
      value: "",
      change(data) {
        console.log("数据change变化", data)
        keyWords = data
      }
    },
    {
      type: "custom",
      label: "范围",
      element: (
        <Space>
          <MarsButton onClick={() => mapWork.drawRectangle()}>框选范围</MarsButton>
          <MarsButton onClick={() => mapWork.drawCircle()}>圆形范围</MarsButton>
          <MarsButton onClick={() => mapWork.drawPolygon()}>多边形范围</MarsButton>
        </Space>
      )
    },
    {
      type: "custom",
      label: "操作",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              stateDataSource([])
              mapWork.queryData(keyWords)
            }}
          >
            查询
          </MarsButton>
          <MarsButton
            onClick={() => {
              stateDataSource([])
              mapWork.clearAll()
            }}
          >
            清除
          </MarsButton>
        </Space>
      )
    }
  ]

  // 自适应高度
  const tableScrollHeight = useRef(0)
  setAutoHeight((height) => {
    tableScrollHeight.current = height
  }, 400)

  const [dataSource, stateDataSource] = useState([])
  useEffect(() => {
    mapWork.eventTarget.on("tableData", (event: any) => {
      arrPie = [] // 饼状图:名称+面积
      arrTable = [] // 表格: 名称+面积+数量
      arrType = [] // 柱状图:名称
      arrArea = [] // 柱状图:面积
      event.list.forEach((item: any, index: any) => {
        arrType.push(item.type)
        arrArea.push(item.area)
        arrPie.push({ name: item.type, value: item.area })
        arrTable.push({ key: index, index: index + 1, type: item.type, num: item.count, area: item.area })
      })

      // 表格数据
      stateDataSource(arrTable)

      // echarts图表
      // setTimeout(() => {
      //   createTabsEchartsData(arrType, arrArea, arrPie)
      // })
    })
  }, [])

  return (
    <MarsPannel visible={true} width={330} top={10} right={10}>
      <MarsGui
        ref={guiRef}
        options={options}
        formProps={{
          labelCol: { span: 3 }
        }}
      ></MarsGui>

      <div className="f-tac" style={{ display: dataSource.length ? "block" : "none" }}>
        <MarsTabs
          defaultActiveKey="1"
          onChange={(e) => {
            setTimeout(() => {
              createTabsEchartsData(arrType, arrArea, arrPie, e)
            })
          }}
          {...{ centered: true, tabBarGutter: 55 }}
        >
          <MarsTabPane key="1" tab="表格">
            <MarsTable columns={columns} dataSource={dataSource} {...{ scroll: { y: tableScrollHeight.current }, bordered: true, size: "small" }} />
          </MarsTabPane>
          <MarsTabPane key="2" tab="饼状图">
            <div id="pieChart" className="chart" style={{ width: "300px", height: "250px" }}></div>
          </MarsTabPane>
          <MarsTabPane tab="柱状图" key="3" forceRender={true}>
            <div id="histogram" style={{ width: "300px", height: "400px" }}></div>
          </MarsTabPane>
        </MarsTabs>
      </div>
    </MarsPannel>
  )
}

export default UIComponent

function createTabsEchartsData(arrType: any, arrArea: any, arrPie: any, e) {
  // echarts饼状图
  const pieEchartsOption = {
    title: {
      text: "饼状图",
      left: "center",
      textStyle: {
        color: "#ffffff"
      }
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} 亩</br>占比 : {d}%",
      backgroundColor: "rgba(63, 72, 84, 0.7)",
      textStyle: {
        color: "#ffffff"
      }
    },
    series: [
      {
        name: "用地面积",
        type: "pie",
        radius: "50%",
        data: arrPie,
        textStyle: {
          color: "#ffffff"
        },
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

  // echarts柱状图
  const histogramOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(63, 72, 84, 0.7)",
      formatter: "{b}: {c} 亩",
      textStyle: {
        color: "#ffffff"
      }
    },
    title: {
      text: "柱状图",
      left: "center",
      textStyle: {
        color: "#ffffff"
      }
    },
    grid: {
      left: "3%",
      right: "15%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      show: false
    },
    yAxis: {
      type: "category",
      data: arrType,
      axisLabel: {
        textStyle: {
          color: " #ffffff"
        }
      }
    },
    series: [
      {
        type: "bar",
        data: arrArea,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "#ffffff"
              }
            }
          }
        }
      }
    ]
  }

  if (e === "2") {
    // 饼状图数据
    const pieDom: any = document.getElementById("pieChart")
    const pieEcharts = echarts.init(pieDom)
    pieEcharts.setOption(pieEchartsOption)
  } else if (e === "3") {
    // 柱状图数据
    const histogramDom: any = document.getElementById("histogram")
    const histogramECharts = echarts.init(histogramDom)
    histogramECharts.setOption(histogramOption)
  }
}
