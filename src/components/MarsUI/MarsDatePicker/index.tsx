import type { DatePickerProps } from "antd/lib/date-picker"
import { DatePicker } from "antd"
import moment from "moment"
import "./index.less"
import "dayjs/locale/zh-cn"
import locale from "antd/es/date-picker/locale/zh_CN"

export const MarsDatePicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      locale={locale}
      className="mars-date-picker"
      dropdownClassName="mars-datepicker-dropdown"
      defaultValue={moment(new Date(), "YYYY-MM-DD")}
      {...props}
    />
  )
}
