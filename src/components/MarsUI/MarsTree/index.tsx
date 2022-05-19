import { forwardRef } from "react"
import { Tree } from "antd"
import "./index.less"
import type { TreeProps, AntdTreeNodeAttribute } from "antd/lib/tree"
import { MarsIcon } from "@mars/components/MarsUI"

interface MarsTreeNodeAttribute extends AntdTreeNodeAttribute {
  data?: any
}

const TreeIcon = ({ expanded, data }: MarsTreeNodeAttribute) => {
  if ((!data.children || data.children.length === 0) && !data.group) {
    return (
      <MarsIcon
        icon="split"
        {...{
          width: "14",
          color: "#79C1F8",
          theme: "multi-color",
          fill: ["#FFF", "#43CCF8", "#43CCF8", "#43CCF8"]
        }}
      ></MarsIcon>
    )
  } else if (!expanded) {
    return (
      <MarsIcon
        icon="folder-close"
        {...{
          width: "14",
          color: "#db9829",
          theme: "filled"
        }}
      ></MarsIcon>
    )
  } else if (expanded) {
    return <MarsIcon icon="folder-open" {...{ width: "14", color: "#db9829", theme: "filled" }}></MarsIcon>
  }
}
export const MarsTree = forwardRef<any, TreeProps>((props, ref) => (
  <Tree
    className="mars-tree"
    ref={ref}
    showLine={true}
    showIcon={true}
    checkable
    icon={(props) => <TreeIcon {...props}></TreeIcon>}
    {...props}
  ></Tree>
))
