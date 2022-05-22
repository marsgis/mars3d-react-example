import type { WidgetState } from "@mars/widgets/common/store/widget"
import { lazy } from "react"

const widgetState: WidgetState = {
  widgets: [
    {
      component: lazy(() => import("@mars/widgets/basic/GraphicEditor")),
      name: "GraphicEditor"
    }
  ],
  openAtStart: []
}

export default widgetState
