import { Tabs } from "antd"
import type { TabsProps, TabPaneProps } from "antd/lib/tabs"
import "./index.less"

export const MarsTabs = (props: TabsProps) => {
  return <Tabs className="mars-tabs" {...props} centered></Tabs>
}

export const MarsTabPane = (props: TabPaneProps) => {
  return <Tabs.TabPane {...props}></Tabs.TabPane>
}
