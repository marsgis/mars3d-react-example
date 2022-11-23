import { MarsButton, MarsIcon, MarsPannel } from "@mars/components/MarsUI"
import { useState } from "react"
import * as echarts from "echarts"
import * as mapWork from "./map.js"
import "./index.less"

function UIComponent() {

  let route = [] // 国内机场航线数据
  let flight = []

  const airData = mapWork.getAirData()

  const guonei = airData.guonei
  const guoji = airData.guoji

  route = airData.route
  flight = airData.flight

  setTimeout(() => {
    initCharts_Two()
    initCharts_Three()
  }, 300)

  function initCharts_Two() {
  const GNHX = document.getElementById("ul_GNHX")
    const airportData = [] // 机场数据
    route.forEach((item) => {
      airportData.push({
        name: item.airport,
        value: item.routeNum
      })
    })
    console.log("aaa", echarts)
    
    const myChart = echarts.init(GNHX)
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "机场名：{b}<br/> 航线：{c}"
      },
      // legend: {
      //   orient: "horizontal",
      //   top: "0.1%",
      //   textStyle: {
      //     color: "#ffffff"
      //   }
      // },
      series: [
        {
          type: "pie",
          radius: "50%",
          label: {
            show: true
          },
  
          data: airportData
        }
      ]
    }
    myChart.setOption(option)
  }
  
  function initCharts_Three() {
    
  const HBTJ = document.getElementById("ul_HBTJ")
    const year = []
    const domestic = [] // 国内航班
    const international = [] // 国际航班
  
    flight.forEach((item) => {
      year.push(item.year)
      domestic.push(item.domestic)
      international.push(item.international)
    })
  
    const myChart = echarts.init(HBTJ)
  
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "8%",
        right: "0%",
        bottom: "6%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: year,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "国内航班",
          type: "bar",
          barWidth: "30%",
          data: domestic
        },
        {
          name: "国际航班",
          type: "bar",
          barWidth: "30%",
          data: international
        }
      ]
    }
  
    myChart.setOption(option)
  
    window.addEventListener("resize", function () {
      myChart.resize()
    })
  }

  return (
    <>
      <MarsPannel visible={true} top={10} right={10} width={340} height={787}>
      <div className="chartOne" id="chartOne">
      <h6>航线条数</h6>

      <div className="hx">
        <div className="_item_row _item_full_box_width justify-between">
          <MarsIcon icon="airplane" width="30" className="icon" />
          <div className="row1_right">
            <div className="right_title">{ guonei }(条)</div>
            <div className="right_sub_title">国内航班</div>
          </div>

          <MarsIcon icon="take-off" width="35" className="icon" />
          {/* <airplane theme="outline" size="43" fill="#333" /> */}
          <div className="row1_right">
            <div className="right_title">{ guoji }(条)</div>
            <div className="right_sub_title">国际航班</div>
          </div>
        </div>
      </div>
    </div>

    <div className="chartTwo" id="chartTwo">
      <h6>国内机场航线数</h6>
      <div id="ul_GNHX" className="chartTwo_ulgnhx"></div>
    </div>
    <div className="chartThree" id="chartThree">
      <h6>年度航班统计</h6>
      <div id="ul_HBTJ" className="chartThree_ulhbtj"></div>
    </div>
      </MarsPannel>
    </>
  )
}

export default UIComponent
