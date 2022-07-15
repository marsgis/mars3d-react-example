import { forwardRef, useCallback, useEffect, useState } from "react"
import { Input, Space } from "antd"
import type { PasswordProps, SearchProps, InputProps, InputRef } from "antd/lib/input"
import type { TextAreaRef, TextAreaProps } from "antd/lib/input/TextArea"
import classNames from "classnames"
import "./index.less"

export const MarsInput = forwardRef<InputRef, InputProps & { className?: string }>(({ className, ...props }, ref) => {
  return (
    <Input
      className={classNames({
        "mars-input": true,
        [className]: className
      })}
      ref={ref}
      {...props}
    ></Input>
  )
})

interface MarsInputGroupProps {
  value: string[]
  units: string[]
  onChange?: (v: any) => void
}
export const MarsInputGroup = forwardRef<any, MarsInputGroupProps>(({ value = [], units = [], onChange }, ref) => {
  const [values, setValues] = useState(() => value)

  useEffect(() => {
    setValues(value)
  }, [value])

  const itemChange = useCallback(
    (v) => {
      setValues(v)
      onChange && onChange(v)
    },
    [onChange]
  )

  return (
    <Space>
      {values.map((item, i) => (
        <MarsInput
          value={item}
          key={i}
          suffix={units[i]}
          onChange={(e) => {
            values[i] = e.target.value
            itemChange(values)
          }}
        ></MarsInput>
      ))}
    </Space>
  )
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
