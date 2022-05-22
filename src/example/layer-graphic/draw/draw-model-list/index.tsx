import { MarsCheckbox, MarsForm, MarsFormItem, MarsIcon, MarsOption, MarsPannel, MarsSelect } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useState, useCallback, useEffect } from "react"
import { Space, Upload } from "antd"
import "./index.less"
function UIComponent() {
  const [modelData, setmodelData] = useState([])
  const [selectOptions, setSelectOptions] = useState([])
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    mapWork.eventTarget.on("loadModelList", function (event: any) {
      const modelData = event.data

      setmodelData(modelData)
      const options = []
      // 下拉框数据
      Object.keys(modelData).forEach((k) => {
        options.push({
          value: k,
          lable: k
        })
      })
      setSelectOptions(options)

      const defauList = modelData["车辆"]
      for (let i = 0; i < defauList.length; i++) {
        const item = defauList[i]
        item.image = mapWork.changeItemImage(item)
        item.style.url = mapWork.changeItemUrl(item)
        defauList[i] = item
      }
      setDataList(defauList)
    })
  }, [])

  // 下拉框改变
  const handleChange = useCallback(
    (e: any) => {
      const dataList = modelData[e]
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i]
        item.image = mapWork.changeItemImage(item)
        item.style.url = mapWork.changeItemUrl(item)
        dataList[i] = item
      }
      setDataList(dataList)
    },
    [modelData]
  )

  const props = {
    name: "file",
    accept: "json,geojson", // 接受文件类型
    multiple: false, // 不支持多选
    showUploadList: false,
    beforeUpload() {
      return false
    },
    onChange(info: any) {
      const item = info.file
      const fileName = item.name
      const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
      if (fileType !== "json") {
        alert("文件类型不合法,请选择json格式标注文件！")
      }
      mapWork.openGeoJSON(item)
    }
  }

  return (
    <MarsPannel visible={true} right={10} top={10} width="270">
      <MarsForm>
        <MarsFormItem label="模型列表">
          <Space style={{ cursor: "pointer" }}>
            <Upload {...props}>
              <MarsIcon icon="folder-upload" width="19"></MarsIcon>
            </Upload>
            <MarsIcon onClick={() => mapWork.saveGeoJSON()} icon="disk" width="17" color="#f2f2f2"></MarsIcon>
          </Space>
        </MarsFormItem>
        <MarsFormItem>
          <MarsCheckbox onChange={(e) => mapWork.chkTestTerrain(e.target.checked)}>深度检测</MarsCheckbox>
          <MarsCheckbox onChange={(e) => mapWork.onlyPickModelPosition(e.target.checked)}>仅在3dtiles上标绘</MarsCheckbox>
        </MarsFormItem>
        <MarsFormItem>
          <MarsSelect onChange={(e) => handleChange(e)} defaultValue={"车辆"}>
            {selectOptions.map((item, index) => (
              <MarsOption value={item.value} key={index}>
                {item.value}
              </MarsOption>
            ))}
          </MarsSelect>
        </MarsFormItem>
        <MarsFormItem>
          <div className="gltfImg">
            {dataList.map((item, index) => (
              <li key={index}>
                <img
                  onClick={() => {
                    mapWork.startDrawModel(item.style)
                  }}
                  src={item.image}
                  alt=""
                ></img>
              </li>
            ))}
          </div>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
