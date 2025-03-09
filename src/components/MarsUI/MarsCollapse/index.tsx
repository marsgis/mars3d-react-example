import { Collapse } from "antd"
import type { CollapseProps, CollapsePanelProps } from "antd/lib/collapse"
import "./index.less"

export const MarsCollapse = (props: CollapseProps) => {
  return <Collapse className="mars-collapse" {...props}></Collapse>
}
