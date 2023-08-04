import { 
  MarsPannel,
  MarsForm,
  MarsFormItem,
  MarsSlider 
} from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10} width={290} height={230}>
        <MarsForm labelCol={{ span: 5 }}>
          <MarsFormItem label="筛选值">
            <MarsSlider min={0.0} max={65.0} step={0.01} defaultValue={65} onChange={(threshold) => {
              mapWork.graphicLayer.graphics[0].threshold = threshold / 255
            }}></MarsSlider>
          </MarsFormItem>
          <MarsFormItem label="精细度">
            <MarsSlider min={300} max={1000.0} step={1} defaultValue={600} onChange={(steps) => {
              mapWork.graphicLayer.graphics[0].steps = steps
            }} ></MarsSlider>
          </MarsFormItem>
          <MarsFormItem label="X">
            <MarsSlider min={-0.5} max={0.5} step={0.01} defaultValue={0} onChange={(xCut) => {
              mapWork.graphicLayer.graphics[0].xCut = xCut
            }} ></MarsSlider>
          </MarsFormItem>
          <MarsFormItem label="Y">
            <MarsSlider min={-0.5} max={0.5} step={0.01} defaultValue={0} onChange={(yCut) => {
              mapWork.graphicLayer.graphics[0].yCut = yCut
            }} ></MarsSlider>
          </MarsFormItem>
          <MarsFormItem label="Z">
            <MarsSlider min={-0.5} max={0.5} step={0.01} defaultValue={0} onChange={(zCut) => {
              mapWork.graphicLayer.graphics[0].zCut = zCut
            }} ></MarsSlider>
          </MarsFormItem>
        </MarsForm>
      </MarsPannel>
    </>
  )
}

export default UIComponent
