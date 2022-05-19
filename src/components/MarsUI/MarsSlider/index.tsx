import { forwardRef } from "react"
import { Slider } from "antd"
import type { SliderSingleProps, InputRef } from "antd"
import "./index.less"

export const MarsSlider = forwardRef<InputRef, SliderSingleProps>((props, ref) => {
  return <Slider className="mars-slider" ref={ref} {...props}></Slider>
})
