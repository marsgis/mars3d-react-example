import { MarsPannel, MarsButton, MarsTree, MarsIcon, MarsTable, MarsForm, MarsFormItem, $message, MarsInputNumber } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space, Upload, Row, Col } from "antd"
import * as mapWork from "./map.js"
import "./index.less"

function UIComponent() {

  const [showAddDataPannel, setShowAddDataPannel] = useState(false)
  const [tableData, setTableData] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [drawGraphicId, setDrawGraphicId] = useState("") // 画出来的数据
  const [currentHouseType, setCurrentHouseType] = useState([]) // 当前操作的房型
  const [hasDraw, setHasDraw] = useState(false) // 已经绘制

  const [dthPara, setDthPara] = useState({
    maxHeight: 0,
    minHeight: 0,
    floorCount: 1,
    positions: []
  })


  // 打开GeoJSON
const onClickOpenJson = (info) => {
  clearData()
  mapWork.openGeoJSON(info.file, openGeoJSONEnd)
}


function openGeoJSONEnd(graphics: any) {
  
  // 查看共所有号房型
  const houseTypeCounts = graphics
    .map((graphic) => {
      return graphic.attr.houseTypeCount
    })
    .reduce((pre, cur) => {
      if (pre.includes(cur)) {
        return pre
      } else {
        return pre.concat(cur)
      }
    }, [])

  const tableDataTemp = []
  houseTypeCounts.forEach((houseType: string) => {
    let dthPara = {
      floorCount: 0,
      generateGraphicIdArr: []
    }
    graphics
      .filter((graphic) => graphic.attr.houseTypeCount === houseType)
      .map((graphic) => {
        dthPara = {
          ...dthPara,
          ...graphic.attr,
          floorCount: graphic.attr.allFloor
        }

        dthPara.generateGraphicIdArr.push(graphic.id)
        return graphic
      })
    
    tableDataTemp.push(dthPara)
    setTableData([...tableDataTemp])
  })

  console.log("tableDataTemp", tableDataTemp)
  
}

  // 清除数据
  const clearData = () => {
    setTableData([])
    mapWork.clearAllData()
    setIsEditing(isEditing)
    setHasDraw(false)
    setShowAddDataPannel(false)
    clearPannelData()
    setDthPara({ ...dthPara, positions: [] })


  }

  // 取消绘制
  const quitDraw = () => {
    if (drawGraphicId) {
      mapWork.quitDraw(drawGraphicId)
      setHasDraw(false)
      setDthPara({ ...dthPara, positions: [] })
    }
  }

  // 拾取底部高度
  const getMinHeight = () => {
    mapWork.getBuildingHeight().then((data) => {
      setDthPara({ ...dthPara, minHeight: data.height })
    })
  }

  const getInt = () => {
    setDthPara({ ...dthPara, floorCount: parseInt(dthPara.floorCount + "") })
    if (dthPara.floorCount * 1 <= 0) {
      $message("层数最少为1层")
      setDthPara({ ...dthPara, floorCount: 1 })
    }
  }

  // 拾取顶部高度
  const getMaxHeight = () => {
    mapWork.getBuildingHeight().then((data) => {
      setDthPara({ ...dthPara, maxHeight: data.height })
    })
  }

  // 根据楼高生成每层
  const produceData = () => {
    if (isEditing) {
      return editProduceData()
    }

    if (!hasDraw && dthPara.positions.length === 0) {
      return $message("请先绘制区域")
    }

    produce()
  }


  const produce = () => {
    console.log("drawGraphicId应该是绘制的值", drawGraphicId)

    const produceObj = mapWork.produceData(drawGraphicId, dthPara)

    setDrawGraphicId("")
    console.log("生成的数据produceObj", produceObj)

    if (produceObj) {
      const tableItem = {
        houseType: produceObj.houseTypeCount + "号户型",
        floorHeight: produceObj.floorHeight,
        generateGraphicIdArr: produceObj.generateGraphicIdArr,
        ...dthPara
      }

      
      setTableData([...tableData, tableItem])
      setHasDraw(false)
      setIsEditing(true)
    }

    console.log("表格数据", tableData)
  }

  // 退出
  const closePanle = () => {
    clearPannelData()
    console.log("退出drawGraphicId", drawGraphicId)
    
    mapWork.quitDraw(drawGraphicId)
    setShowAddDataPannel(false)
    setHasDraw(false)
    setIsEditing(false)
    setDrawGraphicId("")
  }

  // 绘制区域
  const drawArea = () => {
    clearPannelData()
    let pointsArrTemp = []
    mapWork.addData().then((data) => {
      setDrawGraphicId(data.id)
      setDthPara({ ...dthPara, positions: [] })
      data.points.forEach((item) => {
        console.log("[item.lng, item.lat]", [item.lng, item.lat])

        pointsArrTemp = [...pointsArrTemp, [item.lng, item.lat]]
      })
      console.log("bbb", pointsArrTemp)
      setDthPara({ ...dthPara, positions: pointsArrTemp })

      setHasDraw(true)
      setCurrentHouseType(dthPara.positions)

    })
  }

  function clearPannelData() {
    console.log("qing")
    
    setDthPara({
      maxHeight: 0,
      minHeight: 0,
      floorCount: 1,
      positions: []
    })
    console.log("清除之后的数据", dthPara)
    
    setIsEditing(false)
  }

  // 编辑中的生成
  const editProduceData = () => {

    console.log("tableData", tableData)
    console.log("currentHouseType", currentHouseType)
    let tableDataTemp = []
    tableData.forEach((item) => {
      if (item.positions === currentHouseType) {
        const resultData = mapWork.produceData(
          drawGraphicId,
          dthPara,
          item.generateGraphicIdArr
        )
        if (resultData) {
          item.generateGraphicIdArr = resultData.generateGraphicIdArr
          item.floorHeight = resultData.floorHeight
          item.maxHeight = dthPara.maxHeight
          item.minHeight = dthPara.minHeight
          item.floorCount = dthPara.floorCount
        }
      }
    })
    tableDataTemp = [...tableData]
    setTableData([])
    console.log("tableDataTemp", tableDataTemp)
    setTableData(tableDataTemp)
  }

  // 定位房型
  const flyToHouse = (data) => {
    mapWork.map.flyToPositions(data.positions)
  }

  // 删除房型
  const deleteHouseType = (data) => {
    console.log("删除房型", data, tableData)

    // 删除表格中的数据
    const resultTableData = tableData.filter((item) => {
      if (item.positions[0][0] !== data.positions[0][0]) {
        return true
      } else {
        // 删除图层数据
        item.generateGraphicIdArr.forEach((id) => {
          mapWork.quitDraw(id)
        })
        return false
      }
    })

    setTableData(resultTableData)

    if (isEditing) {
      setShowAddDataPannel(false)
      setIsEditing(false)
      clearPannelData()
    }
  }

  // 编辑房型
  const editHouseType = (data) => {
    console.log("data", data)
    
    setIsEditing(true)
    const dthTemp = { maxHeight: data.maxHeight, minHeight: data.minHeight, floorCount: data.floorCount, positions: data.positions }
    setDthPara(dthTemp)
    setShowAddDataPannel(true)
    console.log("dthPara.positions", dthPara)
    setCurrentHouseType(data.positions)
    console.log("currentHouseType", currentHouseType)
  }

  const columns = [
    {
      title: "户型",
      dataIndex: "houseType",
      key: "houseType"
    },
    {
      title: "总层数",
      dataIndex: "floorCount",
      key: "floorCount"
      //   align: "center"
    },
    {
      title: "操作",
      dataIndex: "option",
      key: "option",
      render: (comp: string, record: any) => {
        return (
          <>
            <Space>
              <MarsIcon
                style={{ cursor: "pointer" }}
                icon="aiming"
                color="#f2f2f2"
                onClick={(e) => {
                  e.stopPropagation()
                  flyToHouse(record)
                }}
              />
              <MarsIcon
                style={{ cursor: "pointer" }}
                icon="edit"
                color="#f2f2f2"
                onClick={(e) => {
                  e.stopPropagation()
                  editHouseType(record)
                }}
              />
              <MarsIcon
                style={{ cursor: "pointer" }}
                icon="delete"
                color="#f2f2f2"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteHouseType(record)
                }}
              />
            </Space>
          </>
        )
      }
    }
  ]


  return (
    <>
      <MarsPannel visible={true} right={10} top={30}>
        <div className="f-mb">
          <Space>
            <MarsButton onClick={() => { console.log("数据", dthPara); setShowAddDataPannel(true) }} disabled={showAddDataPannel}>新增</MarsButton>
            <MarsButton onClick={() => { mapWork.saveGeoJSON() }}>导出</MarsButton>
            <Upload
              multiple={false}
              name="file"
              accept="json,geojson,kml,kmz"
              showUploadList={false}
              onChange={onClickOpenJson}
              beforeUpload={() => false}
            >
              <MarsButton>导入</MarsButton>
            </Upload>
            <MarsButton onClick={clearData} disabled={!tableData.length} >清除</MarsButton>
          </Space>
        </div>

        {tableData.length > 0 ? (
          <MarsTable size="small" dataSource={tableData} bordered columns={columns} pagination={{ pageSize: 4 }} rowKey={r => {
            return r.houseType + Date.now()
          }}></MarsTable>
        ) : (
          ""
        )}
      </MarsPannel>

      <MarsPannel visible={showAddDataPannel} right={10} top={400}>
        <MarsForm labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
          <MarsFormItem label="边界">
            <Row gutter={5} align="middle">
              <Col span={8}>
                <span>{dthPara.positions && dthPara.positions.length > 0 ? "已绘制" : "无"}</span>
              </Col>
              <Col span={14}>
                <MarsButton onClick={() => { drawArea() }} disabled={hasDraw || isEditing}>绘制</MarsButton>
                <MarsButton className="quitDraw" disabled={isEditing} onClick={() => { quitDraw() }}>清除</MarsButton>
              </Col>
            </Row>
          </MarsFormItem>
          <MarsFormItem label="最低高" name="minHeight">
            <Row gutter={5}>
              <Col span={15}>
                <MarsInputNumber value={dthPara.minHeight} onClick={(e) => { setDthPara({ ...dthPara, minHeight: Number(e) }) }}></MarsInputNumber>
              </Col>
              <Col span={5}>
                <Space size="small">
                  <MarsButton className="small-btn" onClick={() => { getMinHeight() }}>拾取</MarsButton>
                </Space>
              </Col>
            </Row>
          </MarsFormItem>
          <MarsFormItem label="最高高" name="maxHeight">
            <Row gutter={5}>
              <Col span={15}>
                <MarsInputNumber value={dthPara.maxHeight} onClick={(e) => { setDthPara({ ...dthPara, maxHeight: Number(e) }) }}></MarsInputNumber>
              </Col>
              <Col span={5}>
                <Space size="small">
                  <MarsButton className="small-btn" onClick={(e) => { getMaxHeight() }}>拾取</MarsButton>
                </Space>
              </Col>
            </Row>
          </MarsFormItem>
          <MarsFormItem label="层数" name="floorCount">
            <Row gutter={5}>
              <Col span={15}>
                <MarsInputNumber value={dthPara.floorCount} onChange={(e) => { getInt(); setDthPara({ ...dthPara, floorCount: Number(e) }) }}></MarsInputNumber>
              </Col>
            </Row>
          </MarsFormItem>
          <div className="f-tac">
            <Space>
              <MarsButton onClick={() => { produceData() }}>生成</MarsButton>
              <MarsButton onClick={() => { closePanle() }}>退出</MarsButton>
            </Space>
          </div>
        </MarsForm>
      </MarsPannel>
    </>
  )
}
export default UIComponent
