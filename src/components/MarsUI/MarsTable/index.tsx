import { Table, ConfigProvider } from "antd"
import { forwardRef } from "react"
import type { TableProps } from "antd/lib/table"
import zhCN from "antd/es/locale/zh_CN"
import "./index.less"
export const MarsTable = forwardRef<HTMLDivElement, TableProps<any>>((props, ref) => {
  return (
    <ConfigProvider locale={zhCN}>
      <Table className="mars-table" {...props} ref={ref}></Table>
    </ConfigProvider>
  )
})
