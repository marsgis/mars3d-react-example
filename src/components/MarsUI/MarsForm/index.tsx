import { Form } from "antd"
import type { FormItemProps } from "antd/lib/form"
import "./index.less"

export const MarsForm = Form

export const MarsFormItem = (props: FormItemProps) => {
  return <Form.Item className="mars-form-item" {...props}></Form.Item>
}
