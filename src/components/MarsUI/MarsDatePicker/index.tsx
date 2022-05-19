import type { DatePickerProps } from "antd/lib/date-picker"
import { DatePicker } from "antd"
import moment from "moment"
import "./index.less"

export const MarsDatePicker = (props: DatePickerProps) => {
  return <DatePicker className="mars-date-picker" defaultValue={moment(new Date(), "YYYY-MM-DD")} {...props} />
}
