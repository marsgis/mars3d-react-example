import { MarsButton, MarsIcon, MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useMemo, useRef, useState } from "react"
import * as mapWork from "./map.js"
import "./index.less"

let timer: any = null
let interval: any = null
let currentIndex = 0
let animations: any[] = []

let step = 0

function UIComponent() {
  const treeData: any[] = [
    {
      title: "特征点",
      key: "01",
      children: [
        {
          title: "山顶点",
          key: "01-01",
          times: 6,
          index: 0,
          widget() {
            mapWork.workPoint1Sdd()
          }
        },
        {
          title: "鞍部点",
          key: "01-02",
          times: 10,
          index: 1,
          widget() {
            mapWork.workPoint2Abd()
          }
        },
        {
          title: "坡度变换点",
          key: "01-03",
          times: 6,
          index: 2,
          widget() {
            mapWork.workPoint3Pdbhd()
          }
        },
        {
          title: "山脚点",
          key: "01-04",
          times: 6,
          index: 3,
          widget() {
            mapWork.workPoint4Sjd()
          }
        },
        {
          title: "山脚坡度变换点",
          key: "01-05",
          times: 6,
          index: 4,
          widget() {
            mapWork.workPoint5Sjpdbhd()
          }
        },
        {
          title: "倾斜变换点",
          key: "01-06",
          times: 6,
          index: 5,
          widget() {
            mapWork.workPoint6Qxbhd()
          }
        }
      ]
    },
    {
      title: "特征线",
      key: "02",
      children: [
        {
          title: "山脊线",
          key: "02-01",
          times: 6,
          index: 6,
          widget() {
            mapWork.workLine1Sjx()
          }
        },
        {
          title: "山谷线",
          key: "02-02",
          times: 8,
          index: 7,
          widget() {
            mapWork.workLine2Sgx()
          }
        },
        {
          title: "俯瞰",
          key: "02-03",
          times: 5,
          index: 8,
          widget() {
            mapWork.workLine3Fk()
          }
        }
      ]
    },
    {
      title: "绘制过程",
      key: "03",
      children: [
        {
          title: "计算通过点",
          key: "03-01",
          times: 6,
          index: 9,
          widget() {
            mapWork.workDgx1Point()
          }
        },
        {
          title: "等高线绘制",
          key: "03-02",
          times: 10,
          widget() {
            mapWork.workDgx2Line()
          }
        },
        {
          title: "等高线结果",
          key: "03-03",
          times: 11,
          widget() {
            mapWork.workDgx3End()
          }
        }
      ]
    }
  ]

  const [selectedKeys, setSelectedKeys] = useState<any[]>([]) // 选中的节点

  const [isPause, setIsPause] = useState(false)
  const [isPlay, setIsPlay] = useState(false)

  const [totalTimes, setTotalTimes] = useState<any>() // 总时间

  const [currentWork, setCurrentWork] = useState<any>()

  const [counter, setCount] = useState<number>(0)
  // const counter = useRef<number>(0)
  // let counter = 0

  useMemo(() => {
    let i = 0
    let time = 0
    treeData.forEach((item) => {
      animations = animations.concat(
        item.children.map((it: any) => {
          time += it.times
          it.index = i
          i++
          return it
        })
      )
    })
    const allTime = `${Math.floor(time / 60)}分${time % 60}秒`
    setTotalTimes(allTime)
  }, [])

  // 开始播放
  const play = () => {
    setIsPlay(true)
    setIsPause(false)
    start()
  }

  const start = () => {
    if (timer) {
      clearTimeout(timer)
    }
    if (interval) {
      clearInterval(interval)
    }
    if (currentIndex < animations.length) {
      const animate = animations[currentIndex]
      setSelectedKeys([animate.key])
      const current = `${animate.title}(${animate.times}秒)`
      setCurrentWork(current)
      step = animate.times
      setCount(step)
      countOn()
      animate.widget()
      currentIndex++
      timer = setTimeout(() => {
        start()
      }, animate.times * 1000)
    } else {
      stop()
    }
  }

  //   暂停
  const pause = () => {
    clearTimeout(timer)
    currentIndex--
    mapWork.cancelFlight()
    mapWork.stopRotatePoint()
    setIsPause(true)
  }

  // 停止
  const stop = () => {
    setIsPlay(false)
    setIsPause(false)
    currentIndex = 0
    mapWork.cancelFlight()
    mapWork.stopRotatePoint()
    mapWork.clear()
    clearTimeout(timer)
    clearInterval(interval)
  }

  function countOn() {
    interval = setInterval(() => {
      step--
      setCount(step)
      if (step <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  // 点击子节点
  const onSelect = (selectedKeys: any, selectedNode: any) => {
    currentIndex = selectedNode.node.index
    play()
  }

  // 自定义渲染节点
  const renderNode = (node: any) => {
    return (
      <>
        {node.times ? (
          <span>
            {node.title} ({node.times}秒)
          </span>
        ) : (
          <span>{node.title}</span>
        )}
      </>
    )
  }

  return (
    <MarsPannel visible={true} top={10} right={10} width={230}>
      <div className="f-mb">
        <Space>
          {!isPlay || isPause ? (
            <MarsButton onClick={play}>
              <Space>
                <MarsIcon icon="handle-triangle" className="icon-vertical-a"></MarsIcon>
                <span>{isPause ? "继续" : "开始"}</span>
              </Space>
            </MarsButton>
          ) : (
            ""
          )}

          {isPlay && !isPause ? (
            <MarsButton onClick={pause}>
              <MarsIcon icon="handle-triangle" className="icon-vertical-a"></MarsIcon>
              <span>暂停</span>
            </MarsButton>
          ) : (
            ""
          )}

          {isPlay ? (
            <MarsButton onClick={stop}>
              <MarsIcon icon="power" className="icon-vertical-a"></MarsIcon>
              <span>停止</span>
            </MarsButton>
          ) : (
            ""
          )}
        </Space>
      </div>

      <div className="f-mb">
        <MarsTree
          treeData={treeData}
          selectedKeys={selectedKeys}
          defaultExpandAll={true}
          checkable={false}
          selectable={true}
          onSelect={onSelect}
          titleRender={renderNode}
        ></MarsTree>
      </div>

      {isPlay ? (
        <div>
          <h3 className="f-mb show-time">总时长：{totalTimes}</h3>
          <h3 className="f-mb show-time">
            当前: {currentWork}&nbsp;{counter}秒
          </h3>
        </div>
      ) : (
        ""
      )}
    </MarsPannel>
  )
}

export default UIComponent
