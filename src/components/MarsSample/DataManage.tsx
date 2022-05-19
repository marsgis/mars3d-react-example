import { MarsButton, MarsIcon, $message } from "@mars/components/MarsUI"
import { Space, Upload } from "antd"

const mapWork = window.mapWork
const mars3d = mapWork.mars3d

//  清除数据
const onClickClear = () => {
  mapWork.graphicLayer.clear()
}

// 保存geojson
const onClickExpFile = () => {
  const graphicLayer = mapWork.graphicLayer

  if (graphicLayer.length === 0) {
    $message("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("我的标注.json", JSON.stringify(geojson))
}

export const DataManage = () => {
  const props = {
    name: "file",
    accept: "json,geojson", // 接受文件类型
    multiple: false, // 不支持多选
    showUploadList: false,
    beforeUpload() {
      return false
    },
    onChange(info: any) {
      // 上传文件
      const graphicLayer = mapWork.graphicLayer

      const item = info.file
      const fileName = item.name
      const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

      if (fileType === "json" || fileType === "geojson") {
        const reader = new FileReader()
        reader.readAsText(item, "UTF-8")
        reader.onloadend = function (e) {
          const json = this.result
          graphicLayer.loadGeoJSON(json, {
            flyTo: true
          })
        }
      } else if (fileType === "kml") {
        const reader = new FileReader()
        reader.readAsText(item, "UTF-8")
        reader.onloadend = function (e) {
          const strkml = this.result

          mapWork.kgUtil.toGeoJSON(strkml).then((geojson) => {
            console.log("kml2geojson转换结果为", geojson)
            graphicLayer.loadGeoJSON(geojson, {
              flyTo: true
            })
          })
        }
      } else if (fileType === "kmz") {
        // 加载input文件控件的二进制流

        mapWork.kgUtil.toGeoJSON(item).then((geojson) => {
          console.log("kmz2geojson", geojson)

          graphicLayer.loadGeoJSON(geojson, {
            flyTo: true
          })
        })
      } else {
        $message("暂不支持 " + fileType + " 文件类型的数据！")
      }
    }
  }

  return (
    <Space>
      <span className="mars-pannel-item-label">数据管理:</span>
      <MarsButton onClick={onClickClear}>清除</MarsButton>
      <MarsButton onClick={onClickExpFile} title={"保存GeoJSON"}>
        <MarsIcon icon="save" />
        保存
      </MarsButton>

      <Upload {...props}>
        <MarsButton title={"打开GeoJSON"}>
          <MarsIcon icon="upload-one" />
          打开
        </MarsButton>
      </Upload>
    </Space>
  )
}
