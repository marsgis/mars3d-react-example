import { Table, ConfigProvider } from "antd"
import { forwardRef } from "react"
import type { TableProps } from "antd/lib/table"
import zhCN from "antd/es/locale/zh_CN"
import "./index.less"
export const MarsTable = forwardRef<HTMLDivElement & { className?: string }, TableProps<any>>(({ className, ...props }, ref) => {
  return (
    <ConfigProvider locale={zhCN}>
      <Table className={["mars-table", className].join(" ")} {...props} ref={ref} size="small"></Table>
    </ConfigProvider>
  )
})
