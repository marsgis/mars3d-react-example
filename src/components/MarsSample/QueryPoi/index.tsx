import { MarsIcon, MarsPannel } from "@mars/components/MarsUI"
import { isLonLat } from "@mars/utils/mars-util"
import { useState } from "react"
import { Input, AutoComplete, List } from "antd"
import { SelectProps } from "antd/es/select"
import { ListProps } from "antd/es/list"
import { PaginationConfig } from "antd/es/pagination"
import * as mapWork from "./map"
import "./index.less"

mapWork.onMounted(window._mapInstance)

/**
 * value 是点击下拉框展示在input中的数值 -- 必须
 * label 是下拉框的数据 -- 必须
 *
 * @param {*} query 搜索到的数据
 * @return {SelectProps} 下拉框展示的数据
 */
const searchResult = (query: any) => {
  return query.map((item: any) => {
    return {
      key: item.id,
      value: item.name,
      label: item.name
    }
  })
}

export const QueryPoi = () => {
  const [textValue, setTextValue] = useState("")
  const [tipOptions, setOptions] = useState<SelectProps<object>["options"]>([]) // 下拉列表提示数据
  const [listDataSource, setListData] = useState<ListProps<object>["dataSource"]>([]) // 查询关键字返回展示的列表
  const [pagination, setPagination] = useState<PaginationConfig>() // 分页的动态数据
  const [openAutoCompleteMenu, setOpenValue] = useState(false) // 是否展示下拉菜单
  const [allcount, setAllCount] = useState<number>(0) // 加载总条数

  let num: any

  // 当input中改变值时触发
  const handleSearch = (value: string) => {
    if (!value) {
      mapWork.clearLayers()
      setListData([])
      return
    }
    if (isLonLat(value)) {
      mapWork.centerAtLonLat(value)
      return
    }
    setOpenValue(true) // 输入数据时展示下拉框
    setTextValue(value) // 同步更改input中的值，方便后面查询

    mapWork.queryData(value).then((result: any) => {
      setOptions(result ? searchResult(result) : [])
    })
  }

  // 点击下方列表项
  const onSelect = (value: string) => {
    clearTimeout(num)
    setOpenValue(false) // 点击选项隐藏下拉菜单
    setTextValue(value) // 同步更改input中的值，方便后面查询
    getQueryTextData(value)
  }

  function getQueryTextData(text: string, page: number = 1) {
    mapWork.queryTextData(text, page).then((result: any) => {
      if (!result) {
        return
      }
      console.log("查询返回的数据，便于测试", result)
      setListData(result.list) // 列表数据
      mapWork.addQueryGraphic(result.list) // 在地图上加载矢量数据

      setAllCount(result.allcount) // 加载总条数
      setPagination({
        total: result.allcount || 0, // 总页数
        current: page // 当前页
      })
    })
  }

  return (
    <MarsPannel customClass="query-poi-pannel" visible={true} left={10} top={10} width={300}>
      <AutoComplete
        style={{ width: 300 }}
        open={openAutoCompleteMenu}
        options={tipOptions}
        onSelect={onSelect}
        onSearch={handleSearch}
        onBlur={() => setOpenValue(false)}
      >
        <Input.Search
          size="large"
          value={textValue}
          placeholder="搜索 地点"
          // 回车方法
          onPressEnter={() => {
            if (textValue) {
              // 在下拉菜单列表中选中回车会触发onPressEnter方法和onSelect方法
              num = setTimeout(() => {
                setOpenValue(false) // 右键开始搜索隐藏下拉菜单
                getQueryTextData(textValue)
              }, 100)
            }
          }}
          enterButton={
            <MarsIcon
              icon="search"
              width="20"
              color="#fff"
              // 搜索按钮
              onClick={() => {
                if (textValue) {
                  setOpenValue(false) // 点击搜索按钮开始搜索隐藏下拉菜单
                  getQueryTextData(textValue)
                }
              }}
            ></MarsIcon>
          }
        />
      </AutoComplete>
      <List
        style={{ display: listDataSource.length ? "block" : "none" }}
        grid={{ gutter: 16, column: 1 }}
        dataSource={listDataSource}
        pagination={{
          onChange: (page: number) => {
            getQueryTextData(textValue, page)
          },
          showTitle: true,
          showTotal: (total, range) => {
            console.log("total", total)

            return <p>total</p>
          },
          pageSize: 6, // 每页列表数
          simple: true,
          current: 1,
          ...pagination
        }}
        renderItem={(item: any, index: number) => (
          <List.Item>
            <List.Item.Meta
              key={item.id}
              title={
                <div style={{ display: "flex" }}>
                  {index + 1}、
                  <p className="query-site-title" onClick={() => mapWork.flyToGraphic(item._graphic)}>
                    {item.name}
                  </p>
                  <a className="query-site-more" href={"//www.amap.com/detail/" + item.id} target="_blank" rel="noreferrer">
                    更多 &gt;
                  </a>
                </div>
              }
              description={item.type}
            />
          </List.Item>
        )}
      />
      <span style={{ display: listDataSource.length ? "block" : "none" }} className="query-site-allcount">
        共{allcount}条结果
      </span>
    </MarsPannel>
  )
}
