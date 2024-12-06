import * as mapWork from "./map"
import { withLifeCyle } from "@mars/widgets/common/uses/useLifecycle"
import { MarsDialog, MarsSwitch } from "@mars/components/MarsUI"
import { useEffect, useState } from "react"
import styles from "./index.module.less"
import classNames from "classnames"

function initData(e: any) {
  let activeBaseMap: string
  const baseMapData = e.baseMaps.map((m: any) => {
    if (m.isAdded && m.show) {
      activeBaseMap = m.id
    }
    return {
      name: m.name,
      id: m.id,
      options: m.options
    }
  })

  const chkHasTerrain = e.hasTerrain || false

  return { baseMapData, chkHasTerrain, activeBaseMap }
}

export default withLifeCyle(function (props) {
  // useLifecycle(mapWork)

  const [baseMaps, stateBaseMaps] = useState<any[]>([]) // 底图
  const [terrain, stateTerrain] = useState<boolean>() // 地形
  const [active, stateActive] = useState<string>() // 选中样式

  useEffect(() => {
    const layer = mapWork.getLayers()

    const { baseMapData, chkHasTerrain, activeBaseMap } = initData(layer)

    stateBaseMaps(baseMapData)
    stateTerrain(chkHasTerrain)
    stateActive(activeBaseMap)
  }, [])

  return (
    <MarsDialog
      title="底图"
      footer={
        <>
          <MarsSwitch
            checked={terrain}
            onChange={(value) => {
              stateTerrain(value)
              mapWork.changeTerrain(value)
            }}
          ></MarsSwitch>
          <span className="f-ml">显示地形</span>
        </>
      }
      width={380}
      position={{ top: "auto", bottom: 50, left: 50 }}
      {...props}
    >
      <ul>
        {baseMaps.map((item, i) => (
          <li
            key={i}
            className={classNames({
              [styles.basemapCard]: true,
              [styles.activeCard]: active === item.id
            })}
            onClick={() => {
              stateActive(item.id)
              mapWork.changeBaseMaps(item.id)
            }}
          >
            <img className={styles.icon} src={item.options.icon || "//data.mars3d.cn/img/thumbnail/basemap/bingAerial.png"} alt="" />
            <span className="title">{item.name}</span>
          </li>
        ))}
      </ul>
    </MarsDialog>
  )
}, mapWork)
