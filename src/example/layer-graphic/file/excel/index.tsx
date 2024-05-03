import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space, Upload } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} right={10} top={10} width={250}>
        <div className="f-mb">
          <Space>
            <MarsButton onClick={mapWork.downloadCsvModel}>下载CSV模版</MarsButton>
            <MarsButton onClick={mapWork.downloadExcelModel}>下载Excel模版</MarsButton>
          </Space>
        </div>
        <div className="f-mb">
          <Space>
            <Upload
              onChange={(e) => mapWork.openFile(e.file.originFileObj)}
              multiple={false}
              name={"file"}
              accept={"json,geojson"}
              showUploadList={false}
            >
              <MarsButton>打开...</MarsButton>
            </Upload>

            <MarsButton onClick={mapWork.startDrawGraphic}>标绘</MarsButton>
            <MarsButton onClick={mapWork.clearData}>清除</MarsButton>
          </Space>
        </div>
        <div className="f-mb">
          <Space>
            <MarsButton onClick={mapWork.downloadCsvData}>导出CSV</MarsButton>
            <MarsButton onClick={mapWork.downloadExcelData}>导出Excel</MarsButton>
          </Space>
        </div>
      </MarsPannel>
    </>
  )
}
export default UIComponent
