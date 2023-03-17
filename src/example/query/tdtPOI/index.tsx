import { MarsButton, MarsInput, MarsPannel, MarsRadio, MarsRadioGroup, MarsTable, $message } from "@mars/components/MarsUI"
import { Space, Cascader } from "antd"
import { useMemo, useState, useEffect, useCallback } from "react"
import axios from "axios"
import * as mapWork from "./map.js"
import "./index.less"

const columns = [
  {
    title: "序号",
    dataIndex: "key",
    key: "key"
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "地址",
    dataIndex: "address",
    key: "address"
  }
]

let resultData = []
let keyWords: string // 关键词

const onChangeKeyWords = (e: any) => {
  keyWords = e.target.value
}

// 点击行触发
const customRow = (record: any) => {
  return {
    onClick: () => {
      if (record.graphic == null) {
        $message(record.name + " 无经纬度坐标信息！")
      }
      mapWork.flyToGraphic(record.graphic)
    }
  }
}

function UIComponent() {
  const [rangeVal, setRange] = useState("1")

  const [city, setCity] = useState([])
  const [citySheng, setCitySheng] = useState("安徽省")
  const [cityShi, setCityShi] = useState("合肥市")
  const [cityShiVal, setCityShiVal] = useState("340100")
  const [tableData, setTableData] = useState([])

  // 获取数据
  useEffect(() => {
    axios.get(`//data.mars3d.cn/file/geojson/areas/config.json`).then((result) => {
      setCity(result.data)
    })
  }, [])

  useMemo(() => {
    mapWork.eventTarget.on("tableData", (e: any) => {
      resultData = []
      e.data.forEach((item: any, index: number) => {
        resultData.push({ key: index, name: item.name, type: item.type, address: item.address, graphic: item.graphic })
      })
      setTableData(resultData)
    })
  }, [])

  // 范围选择
  const selectRange = useCallback((val: any) => {
    removeAll()
    setRange(val.target.value)
  }, [])

  // 地区选择
  const selectCity = useCallback((value: string, selectedOptions: any) => {
    setCitySheng(selectedOptions[0].label)
    setCityShi(selectedOptions[1].label)

    setCityShiVal(selectedOptions[1].value)
  }, [])

  // 查询数据
  const query = useCallback(() => {
    mapWork.clearAll(true)
    console.log("aaa---", rangeVal, cityShiVal, keyWords)
    
    mapWork.query(rangeVal, cityShiVal, keyWords)
  }, [rangeVal, cityShiVal])

  // 清除数据
  const removeAll = useCallback(() => {
    resultData = []
    setTableData([])
    mapWork.clearAll()
  }, [])

  return (
    <MarsPannel visible={true} right={10} top={10} width={360}>
      <div className="f-mb">
        <Space>
          <span>范围:</span>
          <MarsRadioGroup onChange={selectRange} value={rangeVal}>
            <MarsRadio value="1">指定城市</MarsRadio>
            <MarsRadio value="2">当前视域</MarsRadio>
            <MarsRadio value="3">指定范围</MarsRadio>
          </MarsRadioGroup>
        </Space>
      </div>

      {rangeVal === "1" ? (
        <div className="f-mb">
          <Space>
            <span>城市:</span>
            {/* @ts-ignore */}
            <Cascader bordered={false} options={city} onChange={selectCity}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#">
                {citySheng}/{cityShi}
              </a>
            </Cascader>
          </Space>
        </div>
      ) : (
        ""
      )}

      <div className="f-mb">
        <Space>
          <span>关键词:</span>
          <MarsInput placeholder="查询名称和地址" onChange={onChangeKeyWords}></MarsInput>
        </Space>
      </div>

      {rangeVal === "3" ? (
        <div className="f-mb">
          <Space>
            <span>框选:</span>
            <MarsButton onClick={() => mapWork.drawRectangle()}>框选范围</MarsButton>
            <MarsButton onClick={() => mapWork.drawCircle()}>圆形范围</MarsButton>
            <MarsButton onClick={() => mapWork.drawPolygon()}>多边形范围</MarsButton>
          </Space>
        </div>
      ) : (
        ""
      )}

      <div className="f-mb f-tac">
        <Space>
          <MarsButton onClick={query}>查询</MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      </div>

      {tableData.length > 0 ? (
        <MarsTable columns={columns} size="small" dataSource={tableData} bordered scroll={{ y: 400 }} onRow={customRow}></MarsTable>
      ) : (
        ""
      )}
    </MarsPannel>
  )
}

export default UIComponent
