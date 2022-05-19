import { Collapse } from "antd"
import type { CollapseProps, CollapsePanelProps } from "antd/lib/collapse"
import "./index.less"

export const MarsCollapse = (props: CollapseProps) => {
  return <Collapse className="mars-collapse" {...props}></Collapse>
}

export const MarsCollapsePanel = (props: CollapsePanelProps) => {
  return <Collapse.Panel className="mars-collapse-panel" {...props}></Collapse.Panel>
}
