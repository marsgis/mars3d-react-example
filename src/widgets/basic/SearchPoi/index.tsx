import { MarsPannel, MarsIcon, MarsInput, MarsButton, MarsPagination, $showLoading, $hideLoading, $message, $alert } from "@mars/components/MarsUI"
import { useEffect, useRef, useState } from "react"
import { isLonLat } from "@mars/utils/mars-util"
import * as mapWork from "./map"
import { useLifecycle } from "@mars/widgets/common/uses/useLifecycle"
import styles from "./index.module.less"

const storageName = "mars3d_queryGaodePOI"
const url = "//www.amap.com/detail/"

export default function (props) {
  useLifecycle(mapWork)

  const [searchTxt, setSearchTxt] = useState("")
  const [allCount, setAllCount] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [siteSource, setSiteSource] = useState([])
  const [searchListShow, setSearchListShow] = useState(false)
  const [siteListShow, setSiteListShow] = useState(false)

  useEffect(() => {
    if (searchTxt === "") {
      setSearchListShow(false)
    }
  })

  let timer = useRef<any>()

  const startCloseSearch = () => {
    timer.current = setTimeout(() => {
      setSearchListShow(false)
      clearTimeout(timer.current)
      timer = null
    }, 500)
  }

  // 搜寻输入框数据之前的提示数据 以及搜寻过的历史数据  通过列表展现
  const handleSearch = async (val: string) => {
    if (val === "") {
      showHistoryList()
      mapWork.clearLayers()
      return
    }

    if (isLonLat(val)) {
      mapWork.centerAtLonLat(val)
      return
    }
    setSiteListShow(false)

    const result = await mapWork.queryData(val)
    const list: { value: string }[] = []
    result.list.forEach((item: any) => {
      if (list.every((l) => l.value !== item.name)) {
        list.push({
          value: item.name
        })
      }
    })

    setDataSource(list)
    setSearchListShow(true)
  }

  // 展示搜寻过的历史数据
  const showHistoryList = () => {
    if (searchTxt) {
      return
    }
    const historys = JSON.parse(localStorage.getItem(storageName)!)
    if (historys) {
      setDataSource((historys || []).map((item: any) => ({ value: item })))
      setSearchListShow(true)
    }
    if (timer) {
      clearTimeout(timer.current)
    }
    setSiteListShow(false)
  }

  // 开始查询并加载数据
  const selectPoint = async (value: any) => {
    // if (!searchTxt) {
    setSearchTxt(value)
    // }
    $showLoading()
    addHistory(value)
    await querySiteList(value, 1)
    $hideLoading()
    setSiteListShow(true)
    setSearchListShow(false)
  }

  async function querySiteList(text: string, page: number) {
    const result = await mapWork.querySiteList(text, page)

    if (!result.list || result.list.length <= 0) {
      $message("暂无数据")
    }

    setSiteSource(result.list || [])

    setAllCount(result.allcount)

    mapWork.showPOIArr(result.list || [])

    return result
  }

  /**
   * 将需要搜查的关键字记录进历史数据中
   * @param {any} data 输入框输入的关键字
   * @returns {void} 无
   */
  function addHistory(data: any) {
    try {
      const arrHistory = JSON.parse(localStorage.getItem(storageName)!) || []
      if (!arrHistory.includes(data)) {
        arrHistory.unshift(data)
      }
      localStorage.setItem(storageName, JSON.stringify(arrHistory.slice(0, 10)))
    } catch (err: any) {
      throw new Error(err)
    }
  }

  // 定位至矢量图层
  function flyTo(item: any) {
    const graphic = item._graphic
    if (graphic === null) {
      return $alert(item.name + " 无经纬度坐标信息！")
    }

    mapWork.flyToGraphic(graphic, { radius: 2000 })
  }

  return (
    <MarsPannel left={10} top={10} customClass={styles["query-poi-pannel"]} {...props}>
      <div className={styles["query-poi"]}>
        <div className={styles["query-poi__search"]}>
          <MarsInput
            placeholder="搜索 地点"
            value={searchTxt}
            className={styles["search-input"]}
            onBlur={startCloseSearch}
            onFocus={showHistoryList}
            allowClear
            onChange={(e) => {
              setSiteListShow(false)
              setSearchTxt(e.target.value)
              handleSearch(e.target.value)
            }}
          ></MarsInput>
          <MarsButton className={styles["search-button"]}>
            <MarsIcon icon="search" width="20" color="#fff" onClick={() => selectPoint(searchTxt)}></MarsIcon>
          </MarsButton>
        </div>

        {searchListShow && (
          <ul className={styles["search-list"]}>
            {dataSource.map((item, i) => (
              <li key={i} className={styles["search-list__item"]} onClick={() => selectPoint(item.value)}>
                {item.value}
              </li>
            ))}
          </ul>
        )}

        {siteListShow && (
          <div className={styles["query-site"]}>
            {siteSource && siteSource.length && (
              <>
                <ul>
                  {siteSource.map((item, i) => (
                    <li key={i} className={styles["query-site__item"]} onClick={() => flyTo(item)}>
                      <div className={styles["query-site__context"]}>
                        <p className={`${styles["query-site-text"]} f-toe`} title={item.name}>
                          <span className={styles["query-site-text_num"]}>{i + 1}</span>
                          {item.name}
                        </p>
                        <p className={`${styles["query-site-sub"]} f-toe`}>{item.type}</p>
                      </div>
                      <a href={url + item.id} rel="noreferrer" target="_blank" className={styles["query-site__more"]}>
                        <MarsIcon icon="double-right" width="20"></MarsIcon>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className={styles["query-site__page"]}>
                  <p className={styles["query-site-allcount"]}>共{allCount}条结果</p>

                  <MarsPagination
                    onChange={(page: number) => querySiteList(searchTxt, page)}
                    size="small"
                    total={allCount}
                    pageSize={6}
                    simple={true}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </MarsPannel>
  )
}
