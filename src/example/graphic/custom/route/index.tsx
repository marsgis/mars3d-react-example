import { MarsPannel, MarsTable } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useMemo, useState } from "react"

const columns = [
  {
    title: "序号",
    dataIndex: "num",
    key: "num"
  },
  {
    title: "车牌号",
    dataIndex: "carNumber",
    key: "carNumber"
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type"
  }
]
const resultData = []
const selectKeys = []
const msg = []
function UIComponent() {
  const [carList, setCarList] = useState([]) // 表格数据
  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项

  const [path, setPath] = useState([])

  useMemo(() => {
    mapWork.eventTarget.on("carList", function (event: any) {
      event.tableData.forEach((item: any, index: number) => {
        resultData.push({
          key: item.id,
          num: index + 1,
          carNumber: item.name,
          type: item.type === "1" ? "土方车" : "挖掘机"
        })
        selectKeys.push(item.id)
      })
      setCarList(resultData)
      setSelectRow(selectKeys)
    })

    mapWork.eventTarget.on("showPath", function (event: any) {
      msg.push(event.path)
      setPath([...msg])
    })
  }, [])

  const rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: string[]) => {
      // 使得点击之后选项改变
      setSelectRow(selectedRowKeys)
    },
    onSelect: (record: any, selected: boolean) => {
      // 对车子进行的操作
      mapWork.onSelect(record, selected)
    }
  }

  return (
    <>
      <MarsPannel visible={true} width={360} right={10} top={10}>
        <MarsTable
          columns={columns}
          onRow={(recode: any) => {
            return {
              onClick: () => {
                mapWork.flyToModel(recode.key)
              }
            }
          }}
          dataSource={carList}
          rowSelection={rowSelection}
          pagination={false}
          bordered
        ></MarsTable>
      </MarsPannel>
      <MarsPannel visible={true} width={360} right={10} top={310}>
        {path.map((item, index) => {
          return <p key={index}>{item}</p>
        })}
      </MarsPannel>
    </>
  )
}

export default UIComponent
