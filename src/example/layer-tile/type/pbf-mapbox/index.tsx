import { activate } from "@mars/widgets/common/store/widget"
import { useEffect } from "react"

function UIComponent() {
  useEffect(() => {
    activate("SearchPoi")
  }, [])
  return null
}

export default UIComponent
