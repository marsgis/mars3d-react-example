import { MarsPannel } from "@mars/components/MarsUI"
import { Row, Col, Form, Progress } from "antd"
import { useMemo, useState } from "react"
import "./index.less"
const mapWork = window.mapWork

export const RoamLine = () => {
  const [roamLineData, setRoamLineData] = useState({
    td_alllength: 0,
    td_length: 0,
    td_alltimes: 0,
    td_times: 0,
    td_jd: 0,
    td_wd: 0,
    td_gd: 0,
    td_dmhb: 0,
    td_ldgd: 0,
    percent: 0
  })

  useMemo(() => {
    mapWork.eventTarget.on("roamLineChange", (roamLineData: any) => {
      setRoamLineData(roamLineData)
    })
  }, [])

  return (
    <MarsPannel visible={true} height={320} right={10} bottom={60} width={220}>
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

          <Col span={12}>地面高程</Col>
          <Col span={12}>{roamLineData.td_dmhb}</Col>

          <Col span={12}>离地距离</Col>
          <Col span={12}>{roamLineData.td_ldgd}</Col>

          <Progress percent={roamLineData.percent} size="small"></Progress>
        </Row>
      </Form>
    </MarsPannel>
  )
}
