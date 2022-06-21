import { Component, ReactNode } from "react"
import { withLifeCyle } from "@mars/widgets/common/uses/useLifecycle"
import { isActive, activate, disable } from "@mars/widgets/common/store/widget"
import * as mapWork from "./map"

class ToolButton extends Component {
  constructor(props) {
    super(props)

    mapWork.eventTarget.on("openManageLayer", () => {
      if (!isActive("layers")) {
        activate("layers")
      } else {
        disable("layers")
      }
    })
    mapWork.eventTarget.on("openManageBasemaps", () => {
      if (!isActive("manage-basemap")) {
        activate("manage-basemap")
      } else {
        disable("manage-basemap")
      }
    })
  }

  render(): ReactNode {
    return <></>
  }
}

export default withLifeCyle(ToolButton, mapWork)
