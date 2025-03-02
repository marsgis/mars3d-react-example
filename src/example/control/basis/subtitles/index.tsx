import { useState, useMemo } from "react"
import { MarsPannel, MarsButton, MarsTable } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import "./index.less"

const UIComponent = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [allDuration, setAllDuration] = useState(0) // 总时长

  useMemo(() => {
    mapWork.eventTarget.on("getTableData", (event) => {
      const list = event.list
      setAllDuration(event.allDuration)

      const newList = list.map((item, index) => {
        return { key: index + 1, text: item.options.text, startstop: item.start + "-" + item.stop, duration: item.duration }
      })
      setDataSource([...newList])
    })

    mapWork.eventTarget.on("changeIndex", (event) => {
      setActiveIndex(event.index)
    })
  }, [])

  function startPlay() {
    mapWork.startPlay()
    setShouldAnimate(true)
  }

  function ztPlay() {
    mapWork.updateShouldAnimate(false)
    setShouldAnimate(false)
  }

  function jxPlay() {
    mapWork.updateShouldAnimate(true)
    setShouldAnimate(true)
  }

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <div className="f-mb">
        <Space>
          <MarsButton
            onClick={() => {
              startPlay()
            }}
          >
            重新开始
          </MarsButton>
          {shouldAnimate ? <MarsButton onClick={() => ztPlay()}>暂停</MarsButton> : <MarsButton onClick={() => jxPlay()}>继续</MarsButton>}
        </Space>
      </div>

      <MarsTable
        size="small"
        dataSource={dataSource}
        columns={graphicColumns}
        bordered
        pagination={false}
        onRow={(_record, index) => {
          return index === activeIndex ? { className: "active-row" } : { className: "" }
        }}
      ></MarsTable>

      <div className="f-mt">
        总时长{allDuration}秒，共{dataSource.length}任务，当前正在执行第{activeIndex + 1}个
      </div>
    </MarsPannel>
  )
}
export default UIComponent

// 列表名称
const graphicColumns = [
  {
    title: "序号",
    dataIndex: "key",
    key: "key"
  },
  {
    title: "内容",
    dataIndex: "text",
    key: "text",
    width: 140
  },
  {
    title: "时间范围",
    dataIndex: "startstop",
    key: "startstop"
  },
  {
    title: "时长",
    dataIndex: "duration",
    key: "duration"
  }
]
