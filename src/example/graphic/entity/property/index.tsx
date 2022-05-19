import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

const demoSampleProperty = () => {
  mapWork.demoSampleProperty()
}
const demoTimeIntervalCollectionProperty = () => {
  mapWork.demoTimeIntervalCollectionProperty()
}
const demoConstantProperty = () => {
  mapWork.demoConstantProperty()
}
const demoCompositeProperty = () => {
  mapWork.demoCompositeProperty()
}
const demoSampledPositionProperty = () => {
  mapWork.demoSampledPositionProperty()
}
const demoColorMaterialProperty = () => {
  mapWork.demoColorMaterialProperty()
}
const demoColorMaterialProperty2 = () => {
  mapWork.demoColorMaterialProperty2()
}
const demoCallbackProperty = () => {
  mapWork.demoCallbackProperty()
}
const demoReferenceProperty = () => {
  mapWork.demoReferenceProperty()
}
const demoPropertyBag = () => {
  mapWork.demoPropertyBag()
}
const demoVelocityVectorProperty = () => {
  mapWork.demoVelocityVectorProperty()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space direction="vertical">
        <span>属性机制演示</span>
        <MarsButton onClick={demoSampleProperty}>SampleProperty</MarsButton>
        <MarsButton onClick={demoTimeIntervalCollectionProperty}>TimeIntervalCollectionProperty</MarsButton>
        <MarsButton onClick={demoConstantProperty}>ConstantProperty</MarsButton>
        <MarsButton onClick={demoCompositeProperty}>CompositeProperty</MarsButton>
        <MarsButton onClick={demoSampledPositionProperty}>SampledPositionProperty</MarsButton>
        <MarsButton onClick={demoColorMaterialProperty}>ColorMaterialProperty</MarsButton>
        <MarsButton onClick={demoColorMaterialProperty2}>ColorMaterialProperty2</MarsButton>
        <MarsButton onClick={demoCallbackProperty}>CallbackProperty</MarsButton>
        <MarsButton onClick={demoReferenceProperty}>ReferenceProperty</MarsButton>
        <MarsButton onClick={demoPropertyBag}>PropertyBag</MarsButton>
        <MarsButton onClick={demoVelocityVectorProperty}>VelocityVectorProperty</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
