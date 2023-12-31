import { MarsPannel } from "@mars/components/MarsUI"
import { Row, Col, Form, Progress } from "antd"
import { useEffect, useMemo, useState } from "react"
import "./index.less"
const mapWork = window.mapWork

export const FixedRouteInfo = () => {
  const [roamLineData, setRoamLineData] = useState({
    td_alllength: 0,
    td_length: 0,
    td_alltimes: 0,
    td_times: 0,
    td_jd: 0,
    td_wd: 0,
    td_gd: 0,
    percent: 0
  })

  useEffect(() => {
    if (mapWork.fixedRoute?.info) {
      showInfo(mapWork.fixedRoute.info)
    }
    mapWork.eventTarget.on("roamLineChange", (roamLineData: any) => {
      showInfo(roamLineData)
    })
  }, [])

  const showInfo = (item: any) => {
    let val = Math.ceil((item.second * 100) / item.second_all)
    if (val < 1) {
      // 原本是1 ，但是这个示例graphic/custom/fixedRoute-walk需要为0 
      val = 0
    }
    if (val > 100) {
      val = 100
    }

    setRoamLineData({
      percent: val,
      td_jd: item.point?.lng,
      td_wd: item.point?.lat,
      td_gd: mapWork.formatDistance(item.point?.alt),
      td_times: mapWork.formatTime(item.second),
      td_alltimes: mapWork.formatTime(item.second_all),
      td_length: mapWork.formatDistance(item.distance) || "0米",
      td_alllength: mapWork.formatDistance(item.distance_all)
    })
  }

  return (
    <MarsPannel visible={true} right={10} bottom={60} width={220}>
      <Form>
        <Row gutter={[0, 8]}>
          <Col span={12}> 总长度:</Col>
          <Col span={12}>{roamLineData.td_alllength}</Col>

          <Col span={12}>已漫游长度:</Col>
          <Col span={12}>{roamLineData.td_length}</Col>

          <Col span={12}>总时长:</Col>
          <Col span={12}>{roamLineData.td_alltimes}</Col>

          <Col span={12}>已漫游时间</Col>
          <Col span={12}>{roamLineData.td_times}</Col>

          <Col span={12}>经度</Col>
          <Col span={12}>{roamLineData.td_jd}</Col>

          <Col span={12}>纬度</Col>
          <Col span={12}>{roamLineData.td_wd}</Col>

          <Col span={12}>漫游高程</Col>
          <Col span={12}>{roamLineData.td_gd}</Col>

          <Progress percent={roamLineData.percent} size="small"></Progress>
        </Row>
      </Form>
    </MarsPannel>
  )
}
