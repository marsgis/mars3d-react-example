import { MarsCheckbox, MarsForm, MarsFormItem, MarsIcon, MarsOption, MarsPannel, MarsSelect } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useState, useCallback, useEffect } from "react"
import { Space, Upload } from "antd"
import { activate, disable, updateWidget, isActive } from "@mars/widgets/common/store/widget"
import "./index.less"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"

let plotDataJSON: any
function UIComponent() {
  const [value1, setValue1] = useState("车辆")
  const [selectOptions, setSelectOptions] = useState([])
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    mapWork.eventTarget.on("loadModelList", function (event: any) {
      let jsonData = event.data
      // 替换路径JSON内的mars3d_data路径
      jsonData = JSON.parse(JSON.stringify(jsonData).replaceAll("{mars3d_data}", `//data.mars3d.cn`))

      const arrNewGroup = []
      plotDataJSON = {}

      // 下拉框数据
      for (let i = 0; i < jsonData.length; i++) {
        const item1 = jsonData[i]
        const arrNew = item1.children
        if (arrNew.length === 0) {
          continue
        }

        const name = `${item1.name}`
        arrNewGroup.push({
          value: name,
          label: name + "(" + arrNew.length + ")"
        })
        plotDataJSON[name] = arrNew
      }

      setSelectOptions(arrNewGroup)
      handleChange(null)
    })
  }, [])

  useEffect(() => {
    // ************************属性面板************************/
    mapWork.eventTarget.on("updateGraphicOptionsWidget", (event) => {
      if (event.disable) {
        disable("graphic-options")
      } else {
        const data = { layerId: event.layerId, graphicId: event.graphicId }
        if (!isActive("graphic-options")) {
          activate({ name: "graphic-options", data })
        } else {
          updateWidget("graphic-options", data)
        }
      }
    })
  }, [])

  // 下拉框改变
  const handleChange = useCallback(
    (e: any) => {
      const dataList = plotDataJSON[e ?? value1]

      setValue1(e)
      setDataList(dataList)
    },
    [value1]
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
    <>
      <MarsPannel visible={true} right={10} top={10} bottom={120} width="272">
        <MarsForm>
          <MarsFormItem label="模型列表">
            <Space style={{ cursor: "pointer" }}>
              <Upload {...props}>
                <MarsIcon icon="folder-upload" width="19" color="#fff"></MarsIcon>
              </Upload>
              <MarsIcon onClick={() => mapWork.saveGeoJSON()} icon="disk" width="17" color="#f2f2f2"></MarsIcon>
              <MarsIcon onClick={() => mapWork.deleteAll()} icon="delete" width="17" color="#f2f2f2"></MarsIcon>
            </Space>
          </MarsFormItem>
          <MarsFormItem>
            <MarsCheckbox onChange={(e) => mapWork.chkTestTerrain(e.target.checked)}>深度检测</MarsCheckbox>
            <MarsCheckbox onChange={(e) => mapWork.onlyVertexPosition(e.target.checked)}>开启顶点吸附</MarsCheckbox>
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
                    src={item.icon}
                    alt=""
                  ></img>
                </li>
              ))}
            </div>
          </MarsFormItem>
        </MarsForm>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
