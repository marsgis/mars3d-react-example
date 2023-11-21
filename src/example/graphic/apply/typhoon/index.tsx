import { MarsPannel, MarsTable, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useEffect, useState } from "react"
import { setAutoHeight } from "@mars/utils/mars-util"
import axios from "axios"
import * as mapWork from "./map.js"
import "./index.less"

// 不同等级的台风对应不同的颜色
function getColor(level) {
  switch (level) {
    case "TD": // 热带低压
      return "rgb(238,209,57)"
    case "TS": // 热带风暴
      return "rgb(0,0,255)"
    case "STS": // 强热带风暴
      return "rgb(15,128,0)"
    case "TY": // 台风
      return "rgb(254,156,69)"
    case "STY": // 强台风
      return "rgb(254,0,254)"
    case "SuperTY": // 超强台风
      return "rgb(254,0,0)"
    default:
  }
}

function getLevelStr(value) {
  switch (value) {
    case "TD":
      return "热带低压"
    case "TS":
      return "热带风暴"
    case "STS":
      return "强热带风暴"
    case "TY":
      return "台风"
    case "STY":
      return "强台风"
    case "SuperTY":
      return "超强台风"
    default:
  }
}

function getMoveToStr(value) {
  switch (value) {
    case "N":
      return "北"
    case "NNE":
      return "北东北"
    case "NE":
      return "东北"
    case "ENE":
      return "东东北"
    case "E":
      return "东"
    case "ESE":
      return "东东南"
    case "ES":
      return "东南"
    case "SSE":
      return "南东南"
    case "S":
      return "南"
    case "SSW":
      return "南西南"
    case "SW":
      return "西南"
    case "WSW":
      return "西西南"
    case "W":
      return "西"
    case "WNW":
      return "西北西"
    case "NW":
      return "北西"
    case "NNW":
      return "北西北"
    default:
  }
}

function UIComponent() {
  const [typhoonList, setTyphoonList] = useState([]) // 台风数据
  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项

  const [path, setPath] = useState([]) // 台风路径信息

  const [tableScrollHeight, setHeight] = useState(80) // 路径表格高度自适应

  const [select, setSelect] = useState({
    // 勾选的台风
    name_en: "",
    name_cn: "",
    path: [],
    show: false,
    play: false
  })
  // 高度自适应
  useEffect(() => {
    // 访问后端接口，取台风列表数据
    // url: "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_default", //在线实时接口
    const url = "//data.mars3d.cn/file/apidemo/typhoon/list_2020.json"
    axios.get(url).then(function (res: any) {
      const data = res.data
      const resultData = data.typhoonList.map((item: any) => ({
        key: item[0],
        id: item[0],
        name_en: item[1],
        name_cn: item[2],
        typnumber: item[3],
        state: item[7]
      }))
      setTyphoonList(resultData)
    })

    setAutoHeight((height) => {
      setHeight(height - 50)
    }, 420)
  }, [])

  const rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: string[]) => {
      // 使得点击之后选项改变
      setSelectRow(selectedRowKeys)
    },
    onSelect: (selectedRowKeys: any, selected: boolean) => {
      selectedRowKeys.show = selected
      if (selected) {
        if (!selectedRowKeys.path) {
          getPath(selectedRowKeys.id).then(function (res: any) {
            selectedRowKeys.path = res.path
            selectOneTyphoon(selectedRowKeys)
          })
        } else {
          selectOneTyphoon(selectedRowKeys)
        }
      } else {
        setSelect({
          name_en: "",
          name_cn: "",
          path: [],
          show: false,
          play: false
        })
        mapWork.unSelectOneTyphoon(selectedRowKeys.id)
      }
    }
  }

  // 选择了单个台风
  function selectOneTyphoon(item: any) {
    setSelect({
      name_en: item.name_en,
      name_cn: item.name_cn,
      path: item.path,
      show: true,
      play: false
    })
    setPath(item.path)
    mapWork.selectOneTyphoon(item)
  }

  const columns = [
    {
      title: "台风编号",
      dataIndex: "typnumber",
      key: "typnumber"
    },
    {
      title: "台风名(中文)",
      dataIndex: "name_cn"
    },
    {
      title: "台风名(英文)",
      dataIndex: "name_en"
    }
  ]

  const columnsPath = [
    {
      title: "时间",
      dataIndex: "time_str",
      width: 110,
      ellipsis: true
    },

    {
      title: "风速",
      dataIndex: "centerSpeed",
      width: 46
    },
    {
      title: "移向",
      dataIndex: "moveTo_str"
    },
    {
      title: "强度",
      dataIndex: "level_str"
    }
  ]

  // 访问后端接口，取单个台风轨迹数据
  function getPath(id) {
    // url: "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_" + id, //在线实时接口
    const url = "http://data.mars3d.cn/file/apidemo/typhoon/view_" + id + ".json"
    return axios.get(url).then(function (res: any) {
      const newData = conversionPathData(res.data.typhoon) // 在Typhoon.js中
      return newData
    })
  }

  const startPlay = () => {
    mapWork.startPlay()
    setSelect({ ...select, play: true })
  }

  const stopPlay = () => {
    mapWork.stopPlay()
    setSelect({ ...select, play: false })
  }

  // 转换数据,将后端接口数据转换为需要的格式
  function conversionPathData(oldData) {
    const path = []
    oldData[8].forEach((message) => {
      let circle7
      let circle10
      let circle12
      message[10].forEach((level) => {
        const radiusObj = {
          speed: level[0],
          radius1: level[1],
          radius2: level[2],
          radius3: level[3],
          radius4: level[4]
        }

        if (level[0] === "30KTS") {
          circle7 = radiusObj
        } else if (level[0] === "50KTS") {
          circle10 = radiusObj
        } else if (level[0] === "64KTS") {
          circle12 = radiusObj
        } else {
          console.log("未处理风圈", radiusObj)
        }
      })

      // 预测路径
      const babj = message[11]?.BABJ
      let arrForecast
      if (babj) {
        arrForecast = []
        babj.forEach((element) => {
          const newArr = {
            time: element[0], // 几小时预报
            time_str: element[1],
            lon: element[2], // 预报经度
            lat: element[3], // 预报纬度
            strength: element[4], // 中心气压
            centerSpeed: element[5], // 最大风速  m/s
            level: element[7], // 预报台风等级, 代码
            color: getColor(element[7]) // 对应等级的颜色
          }
          arrForecast.push(newArr)
        })
      }

      const time = mapWork.formatDate(new Date(message[2]), "yyyy-M-d HH:mm") // 时间

      path.push({
        id: message[0], // 唯一标识
        key: message[0],
        time: new Date(message[2]), // 时间
        time_str: time, // 时间格式化字符串
        level: message[3], // 台风等级, 代码
        level_str: getLevelStr(message[3]),
        color: getColor(message[3]), // 对应等级的颜色
        lon: message[4], // 经度
        lat: message[5], // 纬度
        strength: message[6], // 中心气压,百帕
        centerSpeed: message[7], // 最大风速,米/秒
        moveTo: message[8], // 移动方向, 代码
        moveTo_str: getMoveToStr(message[8]),
        windSpeed: message[9], // 移动速度,公里/小时

        circle7, // 7级风圈, 对象
        circle10, // 10级风圈, 对象
        circle12, // 12级风圈, 对象
        forecast: arrForecast // 预测路径, 数组
      })
    })

    return {
      // id: oldData[0],
      // name_en: oldData[1], // 台风名字,英文
      // name_cn: oldData[2], // 台风名字
      // typnumber: oldData[3], // 台风编号
      // state: oldData[7],
      path
    }
  }

  return (
    <>
      <MarsPannel visible={true} right={10} top={10} width={338}>
        <MarsTable
          size="small"
          dataSource={typhoonList}
          columns={columns}
          bordered
          pagination={{ pageSize: 5 }}
          rowSelection={rowSelection}
        ></MarsTable>

        {select.show ? (
          <>
            <div className="playBtn">
              <Space>
                {!select.play ? <MarsButton onClick={startPlay}>播放</MarsButton> : <MarsButton onClick={stopPlay}>停止</MarsButton>}
                已选择：{select.name_cn}
              </Space>
            </div>

            <MarsTable
              size="small"
              bordered
              onRow={(recode: any) => {
                return {
                  onClick: () => {
                    mapWork.clickPathRow(recode)
                  }
                }
              }}
              pagination={false}
              columns={columnsPath}
              dataSource={path}
              scroll={{ y: tableScrollHeight }}
            ></MarsTable>
          </>
        ) : (
          ""
        )}
      </MarsPannel>

      <div className="legendContent">
        <ul>
          <li>
            <span className="round" style={{ backgroundColor: "#eed139" }}></span>热带低压
          </li>
          <li>
            <span className="round" style={{ backgroundColor: "#0000ff" }}></span>热带风暴
          </li>
          <li>
            <span className="round" style={{ backgroundColor: "#0f8000" }}></span>强热带风暴
          </li>
          <li>
            <span className="round" style={{ backgroundColor: "#fe9c45" }}></span>台风
          </li>
          <li>
            <span className="round" style={{ backgroundColor: "#fe00fe" }}></span>强台风
          </li>
          <li>
            <span className="round" style={{ backgroundColor: "#fe0000" }}></span>超强台风
          </li>
        </ul>
      </div>
    </>
  )
}

export default UIComponent
