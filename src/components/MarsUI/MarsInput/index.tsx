import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react"
import { Input, Space } from "antd"
import type { PasswordProps, SearchProps, InputProps, InputRef } from "antd/lib/input"
import type { TextAreaRef, TextAreaProps } from "antd/lib/input/TextArea"
import "./index.less"

export const MarsInput = forwardRef<InputRef, InputProps>((props, ref) => {
  return <Input className="mars-input" ref={ref} {...props}></Input>
})

interface MarsInputGroupProps {
  value: string[]
  units: string[]
  onChange?: (v: any) => void
}
export const MarsInputGroup = forwardRef<any, MarsInputGroupProps>(({ value = [], units = [], onChange }, ref) => {
  const values = useRef(value)

  useEffect(() => {
    values.current = value
  }, [value])

  const itemChange = useCallback((v, i) => {
    values.current[i] = v
    onChange && onChange(values.current)
  }, [onChange])

  return (
    <Space>
      {values.current.map((item, i) => (
        <MarsInput defaultValue={item} key={i} suffix={units[i]} onChange={(e) => itemChange(e.target.value, i)}></MarsInput>
      ))}
    </Space>
  )
})

export const MarsColor = forwardRef<InputRef, InputProps>((props, ref) => {
  return <Input className="mars-input-color" ref={ref} {...props} type="color"></Input>
})

export const MarsTextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  return <Input.TextArea className="mars-textarea" ref={ref} {...props}></Input.TextArea>
})

export const MarsInputPassWord = forwardRef<InputRef, PasswordProps>((props, ref) => {
  return <Input.Password className="mars-input-password" ref={ref} {...props}></Input.Password>
})

export const MarsInputSearch = forwardRef<InputRef, SearchProps>((props, ref) => {
  return <Input.Search className="mars-input-search" ref={ref} {...props}></Input.Search>
})
