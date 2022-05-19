import React from "react"
import { createRoot } from "react-dom/client"
import { getQueryString } from "@mars/utils/mars-util"
import MarsUIInstall from "@mars/components/MarsUI"
import MainOperation from "@mars/components/MarsWork/MainOperation"
import { Editor as MarsgisEditor } from "@marsgis/editor"

import "@mars/assets/style/index.less"
import "@marsgis/editor/dist/style.css"

const marsEditor = new MarsgisEditor({
  baseUrl: process.env.BASE_URL,
  code: getQueryString("code"),
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
    MarsUIInstall()
  }
  if (inited) {
    destoryUI()
  }
  initUI(!exampleConfig.hasPannel)
  inited = true
})

function initUI(simple: boolean) {
  reactApp = createRoot(document.getElementById("mars-main-view"))
  if (simple) {
    reactApp.render(<div></div>)
  } else {
    reactApp.render(
      <MainOperation
        beforeMounted={() => {
          marsEditor.useLifecycle()
        }}
      ></MainOperation>
    )
  }
}
function destoryUI() {
  reactApp.unmount()
  reactApp = null
}

marsEditor.render(document.getElementById("root"), getQueryString("id"), getQueryString("name"))
