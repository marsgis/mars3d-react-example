import type { DatePickerProps } from "antd/lib/date-picker"
import { DatePicker, ConfigProvider } from "antd"

// import zhCN from "antd/lib/date-picker/locale/zh_CN"
// import locale from "antd/lib/locale/zh_CN"
import zh_CN from "antd/lib/locale-provider/zh_CN"
import "./index.less"

import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")

export const MarsDatePicker = (props: DatePickerProps) => {
  return (
    <ConfigProvider locale={zh_CN}>
      <DatePicker
        // locale={zhCN}
        className="mars-date-picker"
        dropdownClassName="mars-datepicker-dropdown"
        defaultValue={moment(new Date(), "YYYY-MM-DD")}
        {...props}
      />
    </ConfigProvider>
  )
}
