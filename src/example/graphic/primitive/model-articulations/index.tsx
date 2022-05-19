import { MarsForm, MarsFormItem, MarsOption, MarsPannel, MarsSelect, MarsSlider } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect, useState, useCallback } from "react"

function UIComponent() {
  const [selectOptions, setSelectOptions] = useState([])
  const [dataList, setDataList] = useState([])
  const [groupName, setGroupName] = useState(["LaunchVehicle"])
  const [currStates, setCurrStates] = useState([])

  useEffect(() => {
    mapWork.eventTarget.on("loadGltfModel", function (event: any) {
      const modelData = event.articulations
      setDataList(modelData)
      const groups = []
      for (let i = 0; i < modelData.length; i++) {
        const data = modelData[i]
        groups.push({
          value: data.name_cn,
          name: data.name,
          states: data.stages
        })
      }
      setSelectOptions(groups)

      // 初始化
      setCurrStates(modelData[0].stages)
    })
  }, [dataList])

  // 下拉列表切换，更新参数输入面板
  const searchItem = useCallback(
    (e: any) => {
      const states = dataList.filter((item: any) => item.name_cn === e)
      console.log(states[0].name)
      setCurrStates(states[0].stages)
      setGroupName(states[0].name)
    },
    [dataList]
  )
  return (
    <MarsPannel visible={true} right={10} top={10} width="220px">
      <MarsForm>
        <MarsFormItem>
          <MarsSelect onChange={(e) => searchItem(e)} defaultValue="火箭整体">
            {selectOptions.map((item, index) => (
              <MarsOption value={item.value} key={index}>
                {item.value}
              </MarsOption>
            ))}
          </MarsSelect>
        </MarsFormItem>
        {currStates.map((item, index) => (
          <MarsFormItem label={item.name_cn} key={index}>
            <MarsSlider
              max={item.maximum}
              min={item.miniMum}
              step={0.1}
              defaultValue={item.current}
              onChange={(e) => mapWork.setArticulationStage(groupName, item.name, e)}
            ></MarsSlider>
          </MarsFormItem>
        ))}
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
