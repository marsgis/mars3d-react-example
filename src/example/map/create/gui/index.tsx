import { MarsGui, MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import type { GuiItem } from "@mars/components/MarsUI"
import { useRef } from "react"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "inputGroup",
      field: "dufenmiao",
      tooltip: "测试",
      label: "度分秒",
      extra: "{type}-{dufenmiao}",
      value: [1, 2, 3],
      units: ["度", "分", "秒"],
      change(value, data) {
        console.log("数据change变化", value, data)
      }
    },
    {
      type: "custom",
      label: "按钮",
      element: (
        <Space>
          <MarsButton>测试</MarsButton>
          <MarsButton>测试1</MarsButton>
        </Space>
      )
    },
    {
      type: "radio",
      field: "type",
      label: "单选",
      value: "1",
      // 显示过滤器 可以直接传递boolean
      show(data) {
        return data.speed !== "2"
      },
      options: [
        {
          label: "十进制",
          value: "1"
        },
        {
          label: "度分秒",
          value: "2"
        },
        {
          label: "平面坐标",
          value: "3"
        }
      ],
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "checkbox",
      field: "type2",
      label: "多选",
      value: ["1"],
      options: [
        {
          label: "十进制",
          value: "1"
        },
        {
          label: "度分秒",
          value: "2"
        },
        {
          label: "平面坐标",
          value: "3"
        }
      ],
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "select",
      field: "speed",
      label: "速度",
      value: "1",
      options: [
        {
          label: "1",
          value: "1"
        },
        {
          label: "2",
          value: "2"
        },
        {
          label: "3",
          value: "3"
        }
      ]
    },
    {
      type: "input",
      field: "jingdu",
      label: "经度",
      value: "122.234324",
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "color",
      field: "color",
      label: "颜色",
      value: "#842e2e",
      change(value, data) {
        console.log("数据change变化", value, data)
      }
    },
    {
      type: "textarea",
      field: "remark",
      label: "备注",
      value: "测试",
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "switch",
      field: "opener",
      label: "开关",
      value: false,
      change(value, data) {
        console.log("数据change变化", value, data.opener)
      }
    },
    {
      type: "number",
      field: "count",
      label: "数字",
      step: 0.1,
      min: -10,
      max: 100,
      value: 0.3,
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "slider",
      field: "opcity",
      label: "滑动输入",
      extra: "{opcity}",
      step: 0.1,
      min: -10,
      max: 100,
      value: 0.3,
      change(data) {
        console.log("数据change变化", data)
      }
    },
    {
      type: "slider",
      field: "range",
      label: "双向滑动",
      step: 0.1,
      range: true,
      min: -10,
      max: 100,
      value: [1, 50],
      extra: "{range}",
      change(data) {
        console.log("数据change变化", data)
      }
    }
  ]

  const guiRef = useRef<any>()

  return (
    <MarsPannel visible={true} width={400} right={10} top={10} bottom="50">
      <MarsGui ref={guiRef} options={options}></MarsGui>
      <Space wrap>
        <MarsButton
          onClick={() => {
            guiRef.current.updateField("speed", "3")
          }}
        >
          改变值
        </MarsButton>
        <MarsButton
          onClick={() => {
            guiRef.current.delete("dufenmiao")
          }}
        >
          删除
        </MarsButton>
        <MarsButton
          onClick={() => {
            guiRef.current.reset()
          }}
        >
          重置
        </MarsButton>

        <MarsButton
          onClick={() => {
            guiRef.current.updateFields({
              opcity: 0.8,
              remark: "胡歌"
            })
          }}
        >
          批量更新
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
