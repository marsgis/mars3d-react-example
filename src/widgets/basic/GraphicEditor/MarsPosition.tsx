import { MarsCollapse, MarsCollapsePanel, MarsIcon, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import { Fragment, useCallback, useEffect, useRef } from "react"
import { cloneDeep } from "lodash"

interface MarsAttrProps {
  positions: any
  onChange?: (value?: any) => void
  graphic: any
}

function PointPosition({ value = [], onChange }) {
  const values = useRef(value)

  useEffect(() => {
    values.current = value
  }, [value])

  const itemChange = useCallback(
    (v, i) => {
      values.current[i] = v
      onChange && onChange(values.current)
    },
    [values, onChange]
  )

  return (
    <table className="mars-primary-table">
      <tbody>
        <tr>
          <td width="80">经度</td>
          <td>
            <MarsInputNumber size="small" value={value[0]} step="0.000001" onChange={(value) => itemChange(value, 0)}></MarsInputNumber>
          </td>
        </tr>
        <tr>
          <td>纬度</td>
          <td>
            <MarsInputNumber size="small" value={value[1]} step="0.000001" onChange={(value) => itemChange(value, 1)}></MarsInputNumber>
          </td>
        </tr>
        <tr>
          <td>高程</td>
          <td>
            <MarsInputNumber size="small" value={value[2]} step="0.1" onChange={(value) => itemChange(value, 2)}></MarsInputNumber>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default function MarsPosition({ positions, graphic, onChange = () => {} }: MarsAttrProps) {
  const minNum = getMinPointNum(graphic)
  const maxNum = getMaxPointNum(graphic)
  const pointChange = useCallback((value, i) => {
    positions[i] = value
    onChange(positions)
  }, [])
  return (
    <MarsCollapse activeKey={["1", "2"]}>
      <MarsCollapsePanel key="1" showArrow={false} header="属性信息">
        <table className="mars-primary-table">
          <tbody>
            <tr>
              <td width="100">在原值上增加</td>
              <td>
                <MarsInputNumber
                  size="small"
                  step="1"
                  onChange={(value) => {
                    onChange(
                      positions.map((p) => {
                        p[2] = p[2] + value
                        return p
                      })
                    )
                  }}
                ></MarsInputNumber>
              </td>
            </tr>
            <tr>
              <td>全部修改为</td>
              <td>
                <MarsInputNumber
                  size="small"
                  step="1"
                  onChange={(value) => {
                    onChange(
                      positions.map((p) => {
                        p[2] = value
                        return p
                      })
                    )
                  }}
                ></MarsInputNumber>
              </td>
            </tr>
          </tbody>
        </table>
      </MarsCollapsePanel>
      <MarsCollapsePanel key="2" showArrow={false} header="坐标列表">
        {positions.map((item, i) => (
          <Fragment key={i}>
            <div className="position-title">
              <span>第 {i + 1} 点</span>
              <Space className="position-title__subfix">
                {positions.length < maxNum && (
                  <MarsIcon
                    icon="add-one"
                    width="16"
                    onClick={() => {
                      const lonlats = cloneDeep(positions)
                      lonlats.splice(i, 0, cloneDeep(item))
                      onChange(lonlats)
                    }}
                  ></MarsIcon>
                )}
                {positions.length > minNum && (
                  <MarsIcon
                    icon="delete"
                    width="16"
                    onClick={() => {
                      const lonlats = cloneDeep(positions)
                      lonlats.splice(i, 1)
                      onChange(lonlats)
                    }}
                  ></MarsIcon>
                )}
              </Space>
            </div>
            <PointPosition value={item} onChange={(value) => pointChange(value, i)}></PointPosition>
          </Fragment>
        ))}
      </MarsCollapsePanel>
    </MarsCollapse>
  )
}

function getMaxPointNum(gp: any): number {
  if (gp && gp._maxPointNum) {
    return gp._maxPointNum
  }
  return 999
}

function getMinPointNum(gp: any): number {
  if (gp && gp._minPointNum) {
    return gp._minPointNum
  }
  return 3
}
