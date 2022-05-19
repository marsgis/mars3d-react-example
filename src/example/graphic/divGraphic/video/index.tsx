import { MarsButton, MarsPannel } from "@mars/components/MarsUI"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsButton href="editor-react.html?id=graphic/divGraphic/video-hls" target="_blank">
        加载HLS视频
      </MarsButton>
    </MarsPannel>
  )
}

export default UIComponent
