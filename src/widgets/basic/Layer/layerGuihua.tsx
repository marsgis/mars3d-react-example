import * as mapWork from "./map"
import { useLifecycle } from "@mars/widgets/common/uses/useLifecycle"
import styles from "./index.module.less"
import image from "./img/guihua.jpg"

export default function (props) {
  useLifecycle(mapWork)

  return (
    <div className={`${styles["layer-pictrue"]}`}>
      <img className={`${styles["layer-picture_img"]}`} alt="" src={image} />
    </div>
  )
}
