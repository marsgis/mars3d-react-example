import { useEffect, useRef, useState } from "react"
import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import "./index.less"

function UIComponent(props) {
  return (
    <>
      <MarsPannel visible={true} right="10" top="10">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.startRotate()
            }}
          >
            重新播放
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.stopRotate()
            }}
          >
            停止动画
          </MarsButton>
        </Space>
      </MarsPannel>

      <div className="infoview-js">
        <div className="infoview_panel">
          <div className="infoview_panel_scroll">
            <div className="title">合肥火星科技有限公司</div>
            <div>
              <label>公司简介:</label>
              <span>
                合肥火星科技有限公司（简称：火星科技），于2017年在安徽合肥成立，自成立以来，公司致力于三维可视化技术和GIS地理信息技术的研究与探索，公司耕耘在军工、航天、仿真、智慧城市等行业领域，主营业务模式围绕Mars2D、Mars3D系列平台级产品展开，持续为客户提供着自主可控、专业高效、具备可视化行业前沿科技的产品解决方案与服务。
              </span>
            </div>
            <div>
              <label>公司资质:</label>
              <span>
                公司围绕三维可视化领域已取得软件著作权和专利30多项，属于国家高新技术企业、“双软”认定企业、合肥市大数据企业、中国软件协会认定的AAA
                信用企业、已通过ISO9001质量管理体系认证。
              </span>
            </div>
            <div>
              <label>主要产品:</label>
              <span>
                Mars3D是火星科技研发的一款基于 WebGL
                技术实现的三维客户端开发平台，基于Cesium优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="btnBar">
        <MarsButton className="btnbar_item" href="http://marsgis.cn/about.html?index=0" target="_blank">
          公司简介
        </MarsButton>
        <MarsButton className="btnbar_item" href="http://mars3d.cn/template.html" target="_blank">
          公司项目
        </MarsButton>
        <MarsButton className="btnbar_item" href="http://mars3d.cn/example.html" target="_blank">
          主要产品
        </MarsButton>
      </div>
    </>
  )
}

export default UIComponent
