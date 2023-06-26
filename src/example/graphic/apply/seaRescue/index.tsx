import { MarsButton, MarsPannel, MarsTree, MarsIcon } from "@mars/components/MarsUI"
import { useEffect, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"

const treeData: any[] = [
  {
    title: "发送信号",
    key: "01",
    times: 4,
    widget() {
      mapWork.firstStep()
    }
  },
  {
    title: "传送信号",
    key: "02",
    times: 4,
    widget() {
      mapWork.secondStep()
    }
  },
  {
    title: "下达指令",
    key: "03",
    times: 4,
    widget() {
      mapWork.thirdStep()
    }
  },
  {
    title: "准备出发",
    key: "04",
    times: 4,
    widget() {
      mapWork.forthStep()
    }
  },
  {
    title: "出发",
    key: "05",
    times: 6,
    widget() {
      mapWork.fifthStep()
    }
  },
  {
    title: "处理泄露",
    key: "06",
    times: 4,
    widget() {
      mapWork.sixthStep()
    }
  },
  {
    title: "完成营救",
    key: "07",
    times: 4,
    widget() {
      mapWork.seventhStep()
    }
  }
]

let interval: any
let timer: any // 定时器
let currentIndex = 0
const animations: any[] = []

function UIComponent() {
  const [totalTimes, setTotalTimes] = useState<string>() // 总时长
  const [currentWork, setCurrentWork] = useState<string>()
  const [selectedKeys, setSelectedKeys] = useState<any>()
  let [counter, setCounter] = useState<any>()

  const [isPlay, setIsPlay] = useState(false)
  const [isPause, setIsPause] = useState(false)

  useEffect(() => {
    let i = 0
    let time = 0
    treeData.forEach((item) => {
      const animationItem = item
      animationItem.index = i
      time += item.times
      i++
      animations.push(animationItem)
    })
    mapWork.addGraphics()
    setTotalTimes(`${Math.floor(time / 60)}分${time % 60}秒`)
  }, [])

  function play() {
    setIsPlay(true)
    setIsPause(false)
    start()
  }

  function pause() {
    clearTimeout(timer)
    currentIndex--
    setIsPause(true)
  }

  function stop() {
    setIsPlay(false)
    setIsPause(false)
    if (timer) {
      clearTimeout(timer)
    }
    if (interval) {
      clearInterval(interval)
    }

    setCounter(0)
    currentIndex = 0
    timer = null
    interval = null
    setCurrentWork("")
    mapWork.stop()
  }

  const startBegin = (item: any) => {
    currentIndex = item.index
    play()
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
      setCurrentWork(`${animate.title}(${animate.times}秒)`)
      setCounter(animate.times)
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

  const countOn = () => {
    interval = setInterval(() => {
      counter--
      setCounter(counter)
      if (counter <= 0) {
        clearInterval(interval)
      }
    }, 1000)
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
    <MarsPannel visible={true} right={10} top={10} width={200}>
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
            <Space>
              <MarsIcon icon="pause-one" className="icon-vertical-a"></MarsIcon>
              <span>暂停</span>
            </Space>
          </MarsButton>
        ) : (
          ""
        )}

        {isPlay ? (
          <MarsButton onClick={stop}>
            <Space>
              <MarsIcon icon="power" className="icon-vertical-a"></MarsIcon>
              <span>停止</span>
            </Space>
          </MarsButton>
        ) : (
          ""
        )}
      </Space>

      <MarsTree treeData={treeData} defaultExpandAll checkable={false} selectedKeys={selectedKeys} titleRender={renderNode} onSelect={startBegin}>
        {" "}
      </MarsTree>
      {isPlay ? (
        <>
          <h3 className="f-mb show-time">总时长：{totalTimes}</h3>
          <h3 className="f-mb show-time">
            当前: {currentWork}&nbsp;{counter}秒
          </h3>
        </>
      ) : (
        ""
      )}
    </MarsPannel>
  )
}

export default UIComponent
