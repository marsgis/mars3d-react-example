import { Form } from "antd"
import type { FormItemProps } from "antd/lib/form"
import "./index.less"

export const MarsForm = Form

export const MarsFormItem = ({ className, ...props }: FormItemProps & { className?: string }) => {
  return <Form.Item className={["mars-form-item", className].join(" ")} {...props}></Form.Item>
}
