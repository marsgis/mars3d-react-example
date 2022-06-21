import type { WidgetState } from "@mars/widgets/common/store/widget"
import { lazy } from "react"

const widgetState: WidgetState = {
  widgets: [
    {
      component: lazy(() => import("@mars/widgets/basic/GraphicEditor")),
      name: "GraphicEditor"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/SearchPoi")),
      name: "SearchPoi"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/ManageBasemap")),
      name: "manage-basemap",
      group: "manage"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/Layer")),
      name: "layers",
      group: "manage"
    },
    {
      component: lazy(() => import("@mars/widgets/basic/ToolButton")),
      name: "tools-button",
      disableOther: false,
      autoDisable: false
    }
  ],
  openAtStart: ["tools-button"]
}

export default widgetState
