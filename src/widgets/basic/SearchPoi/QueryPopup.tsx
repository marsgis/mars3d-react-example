import { useRef } from "react"
import styles from "./index.module.less"

export default function (props) {
  const attr = useRef<any>({ ...props.attr })

  return (
    <div className={"mars3d-popup-content-wrapper mars3d-popup-background"}>
      <span className="mars3d-popup-close-button mars3d-popup-color closeButton"> × </span>

      <div className="mars3d-popup-content-wrapper mars3d-popup-background">
        <div className="mars3d-template-titile">
          <a href={"https://www.amap.com/detail/" + attr.current.id} target="_black">
            {attr.current.name}
          </a>
        </div>
        <div className={`mars3d-template-content ${styles["mars3d-template-content"]}`}>
          {attr.current.tel && attr.current.tel.length ? (
            <div>
              <label>电话:</label> {attr.current.tel}
            </div>
          ) : (
            ""
          )}

          <div>
            {attr.current.address ? (
              <div>
                <label>地址:</label> {attr.current.address}{" "}
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {attr.current.type ? (
              <div>
                <label>类别:</label> {attr.current.type}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
