import React from "react"
import { createRoot } from "react-dom/client"
import { getExampleId, getQueryString } from "@mars/utils/mars-util"
import MarsUIInstall from "@mars/components/MarsUI"
import MainOperation from "@mars/components/MarsWork/MainOperation"
import { generateWidgetView } from "@mars/widgets/common/store/widget"
import { Editor as MarsgisEditor } from "@marsgis/editor"
import widgetState from "@mars/widgets/widget-state"
import "@mars/assets/style/index.less"
import "@marsgis/editor/dist/style.css"

const marsEditor = new MarsgisEditor({
  baseUrl: process.env.BASE_URL,
  fullScreen: "1",
  alwaysUseOrigin: process.env.mode === "development",
  configLibs: window.configLibs,
  resourcePublicPath: process.env.EXAMPLE_SOURCE_PATH,
  thumbnailPublicPath: "/config/",
  libPublicPath: "/lib/",
  framework: "react",
  configSourceUrl: `${process.env.BASE_URL}config/example.json`,
  UIFile: "{main}/index.tsx",
  UIFileLanguage: "typescript"
})
let inited = false

let reactApp
marsEditor.on("loaded", (exampleConfig) => {
  if (!reactApp) {
    MarsUIInstall({
      dialog: {
        position: {
          left: 50,
          bottom: 50
        },
        warpper: "mars-main-view"
      }
    })
  }
  if (inited) {
    destoryUI()
  }
  initUI(!exampleConfig.hasPannel)
  inited = true
})

const WidgetView = generateWidgetView(widgetState)

function initUI(simple: boolean) {
  reactApp = createRoot(document.getElementById("mars-ui-root"))
  if (simple) {
    reactApp.render(<div></div>)
  } else {
    reactApp.render(
      <WidgetView>
        <MainOperation
          beforeMounted={() => {
            marsEditor.useLifecycle()
          }}
        ></MainOperation>
      </WidgetView>
    )
  }
}
function destoryUI() {
  reactApp.unmount()
  reactApp = null
}

marsEditor.render(document.getElementById("root"), getExampleId(), getQueryString("name"))
