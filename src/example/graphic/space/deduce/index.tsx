import { MarsButton, MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { useMemo, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"


const treeNodes: any[] = [
    {
        title: "卫星推演",
        key: 1,
        children: [
            {
                title: "初始化场景",
                key: "01-01",
                message: "正在初始化推演场景",
                times: 2,
                widget() {
                    mapWork.initScene()
                }
            },
            {
                title: "需求受理",
                key: "01-02",
                times: 8,
                message: "中国资源卫星应用中心接收到需求，开始受理需求",
                widget() {
                    mapWork.acceptance()
                }
            },
            {
                title: "任务编排",
                key: "01-03",
                times: 7,
                message: "中国资源卫星应用中心正在对任务进行编排",
                widget() {
                    mapWork.task()
                }
            },
            {
                title: "任务上注",
                key: "01-04",
                times: 10,
                message: "中国资源卫星应用中心正在对任务进行上注处理",
                widget() {
                    mapWork.startTask()
                }
            },
            {
                title: "卫星观测",
                key: "01-05",
                message: "通过卫星观测,返回观测数据",
                times: 15,
                widget() {
                    mapWork.satelliteLook()
                }
            },
            {
                title: "数据接收",
                key: "01-06",
                times: 10,
                message: "接收到卫星返回的观测数据",
                widget() {
                    mapWork.sendDataAction()
                }
            },
            {
                title: "数据传输",
                key: "01-07",
                message: "开始传输数据",
                times: 10,
                widget() {
                    mapWork.transferringData()
                }
            },
            {
                title: "产品生产",
                key: "01-08",
                message: "开始生产产品",
                times: 5,
                widget() {
                    mapWork.production()
                }
            },
            {
                title: "产品分发",
                key: "01-09",
                message: "对产品进行分发",
                times: 5,
                widget() {
                    mapWork.distribution()
                }
            }
        ]
    }
]

let stopTimer: any
let timer: any // 定时器
let currentIndex = 0
let animations: any[] = []

function UIComponent() {

    useMemo(() => {
        let i = 0
        let time = 0
        treeNodes.forEach((item) => {
            animations = animations.concat(
                item.children.map((it: any) => {
                    time += it.times
                    it.index = i
                    i++
                    return it
                })
            )
        })

    }, [])

    const [selectKey, setSelectKey] = useState<string>()
    const [selectedKeys, setSelectKeys] = useState<any>()
    const [isPlay, setIsPlay] = useState(false)
    let [isPause, setIsPause] = useState(false)

    // 开始推演
    const startPlay = async () => {
        setIsPlay(true)
        if (timer) {
            clearTimeout(timer) // 清除定时器
        }

        if (currentIndex < animations.length) {
            const animate: any = animations[currentIndex]
            setSelectKey(animate.key)
            setSelectKeys([animate.key])
            await animate.widget() // 执行map.js中的方法
            currentIndex++
            timer = setTimeout(() => {
                startPlay()
            }, animate.times * 1000)

            if (currentIndex === 9) {
                stopTimer = setTimeout(() => {
                    stopPlay()
                }, 10000)
            }
        }
    }


    //  停止推演
    const stopPlay = () => {
        setIsPlay(false)
        setIsPause(false)

        mapWork.clearAll()
        clearTimeout(timer)
        clearTimeout(stopTimer)
        setSelectKey("")
        currentIndex = 0
    }


    // 暂停推演 
    const pausePlay = () => {
        isPause = !isPause
        setIsPause(isPause)
        if (isPause) {
            clearTimeout(timer)
            clearTimeout(stopTimer)
        } else {
            startPlay()
        }
    }

    const renderNode = (node: any) => {
        return (
            <>
                {node.key === selectKey ? <span className="runing-item" style={{ background: "rgba(0, 138, 255, 0.5)" }}>{node.title} </span> : <span>{node.title}</span>
    }
            </>
        )
}

return (
    <MarsPannel visible={true} right={10} top={10}>
        {
            isPlay ? (
                <Space>
                    <MarsButton onClick={stopPlay}>停止推演</MarsButton>
                    <MarsButton onClick={pausePlay}>{isPause ? "继续" : "暂停"}</MarsButton>
                </Space>
            ) : (<MarsButton onClick={startPlay}>开始推演</MarsButton>)
        }
        <MarsTree treeData={treeNodes} defaultExpandAll checkable={false} selectedKeys={selectedKeys} titleRender={renderNode}>

        </MarsTree>
    </MarsPannel>
)
}

export default UIComponent
