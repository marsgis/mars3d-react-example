import { MarsPannel } from "@mars/components/MarsUI"
import "./index.less"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <p className="mars-load-head">One Belt One Road 图例</p>
      <ul className="mars-load-introduce">
        <li>
          <span className="mars-load-introduce-dai">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <div className="mars-load-info">
            <p>丝绸之路经济带</p>
            <p>Silk Road Economic Belt</p>
          </div>
        </li>
        <li>
          <span className="mars-load-introduce-lu">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <div className="mars-load-info">
            <p>21世纪海上丝绸之路</p>
            <p>21st century Maritime Silk Road</p>
          </div>
        </li>
      </ul>
    </MarsPannel>
  )
}

export default UIComponent
