import { MarsButton, MarsForm, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent () {
    return <MarsPannel visible={true} right={10} top={10} >
        <MarsForm>
            <MarsFormItem><MarsButton onClick={() => mapWork.showFenliDemo()}>风力发电机</MarsButton></MarsFormItem>
            <MarsFormItem><MarsButton onClick={() => mapWork.showShanghaiDemo()}>上海浦东</MarsButton></MarsFormItem>
            <MarsFormItem><MarsButton onClick={() => mapWork.showDonghuaDemo()}>动画模型</MarsButton></MarsFormItem>
            <MarsFormItem><MarsButton onClick={() => mapWork.showGuangfu()}>光伏电场</MarsButton></MarsFormItem>
            <MarsFormItem><MarsButton onClick={() => mapWork.removeLayer()}>清除</MarsButton></MarsFormItem>
        </MarsForm>
    </MarsPannel>
}

export default UIComponent
