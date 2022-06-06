import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import MarsExampleList from "@mars/components/MarsEditor/MarsExampleList"
import { Editor as MarsgisEditor, Util } from "@marsgis/editor"
import "@mars/assets/style/index.less"
import "./index.less"

const jumpUrl = (item: any) => {
  let url = process.env.BASE_URL
  if (process.env.EDITOR_MODE) {
    url += "editor-react.html"
  } else {
    url += "read-react.html"
  }

  // 处理参数
  url += "?id=" + encodeURI(item.main)
  if (item.params) {
    url += `&${item.params}&name=${item.fullName}`
  }
  window.open(url, "_blank")
}

const marsEditor = new MarsgisEditor({
  baseUrl: process.env.BASE_URL,
  thumbnailPublicPath: "/config/thumbnail/",
  configSourceUrl: `${process.env.BASE_URL}config/example.json`
})

const ListRenderer = () => {
  const [list, setlist] = useState([])
  useEffect(() => {
    ;(async () => {
      const exampleList = await Util.getExampleList()
      setlist(exampleList)
    })()
  }, [])
  return <MarsExampleList exampleList={list} jump={jumpUrl} packageName={Util.apiConf.packageName} totalCount={Util.totalCount}></MarsExampleList>
}

const reactApp = createRoot(document.getElementById("root"))
reactApp.render(
  <React.StrictMode>
    <ListRenderer />
  </React.StrictMode>
)
