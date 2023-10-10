/**
 * 【自定义面状标号】 闭合曲面
 * @param {object} options 参数对象，包括以下：
 * @param {LngLatPoint[]|Cesium.Cartesian3[]|Cesium.PositionProperty|Array} options.positions 坐标位置
 * @param {PolygonEntity.StyleOptions} options.style 样式信息
 * @param {object} [options.attr] 附件的属性信息，可以任意附加属性，导出geojson或json时会自动处理导出。
 *
 * @param {number} [options.minPointNum=2] 绘制时，至少需要点的个数
 * @param {number} [options.maxPointNum=9999] 绘制时，最多允许点的个数
 * @param {function} [options.validDrawPosition] 绘制时，外部自定义校验坐标,比如判断限定在指定区域内绘制。
 * @param {boolean} [options.hasEdit=true] 是否允许编辑
 * @param {boolean} [options.hasEditContextMenu=true] 编辑时，是否绑定右键编辑菜单
 * @param {boolean} [options.hasMoveEdit=true] 编辑时，是否可以整体平移
 * @param {boolean} [options.hasHeightEdit=true] 编辑时，当有diffHeight时，是否可以编辑高度
 *
 * @param {string|Array|Function} [options.popup] 绑定的popup弹窗值，也可以bindPopup方法绑定
 * @param {Popup.StyleOptions} [options.popupOptions] popup弹窗时的配置参数，也支持如pointerEvents等{@link Popup}构造参数
 * @param {string|Array|Function} [options.tooltip]  绑定的tooltip弹窗值，也可以bindTooltip方法绑
 * @param {Tooltip.StyleOptions} [options.tooltipOptions] tooltip弹窗时的配置参数，也支持如pointerEvents等{@link Tooltip}构造参数
 * @param {object} [options.contextmenuItems] 当矢量数据支持右键菜单时，也可以bindContextMenu方法绑定
 *
 * @param {string|number} [options.id = createGuid()] 矢量数据id标识
 * @param {string} [options.name = ''] 矢量数据名称
 * @param {boolean} [options.show = true] 矢量数据是否显示
 * @param {BaseClass|boolean} [options.eventParent]  指定的事件冒泡对象，默认为所加入的图层对象，false时不冒泡事件
 * @param {boolean|Function} [options.allowDrillPick]  是否允许鼠标穿透拾取
 * @param {boolean} [options.flyTo] 加载完成数据后是否自动飞行定位到数据所在的区域。
 * @param {object} [options.flyToOptions] 加载完成数据后是否自动飞行定位到数据所在的区域的对应 {@link BaseGraphic#flyTo}方法参数。
 *
 * @class CloseVurveEntity
 * @extends {PolygonEntity}
 */
class CloseVurveEntity extends mars3d.graphic.PolygonEntity {
  constructor(options = {}) {
    super(options)

    // this._minPointNum = 3 // 至少需要点的个数
    // this._maxPointNum = 999 // 最多允许点的个数
  }

  // 是否首尾相连闭合（线不闭合，面闭合），用于处理中间点
  // get hasClosure() {
  //   return true
  // }

  getShowPositions(positions) {
    if (!positions || positions.length < 2) {
      return positions
    }
    return getCloseCurvePoints(positions, this.style) // 调用算法
  }

  //= =================静态方法=================

  // /**
  //  * 计算当前军标对象的边界坐标点
  //  * @static
  //  * @param {LngLatPoint[]|Cesium.Cartesian3[]|Cesium.PositionProperty|Array} positions 坐标位置
  //  * @param {object} [options] 控制参数(预留)
  //  * @return {Cesium.Cartesian3[]} 边界坐标点
  //  */
  // static getOutlinePositions(positions, options) {
  //   if (!positions || positions.length < 2) {
  //     return positions
  //   }
  //   positions = mars3d.LngLatArray.toCartesians(positions)
  //   return getCloseCurvePoints(positions, options) // 调用算法
  // }
}

// 注册下, 可以再graphicLayer.startDraw中使用
mars3d.GraphicUtil.register("closeVurveEntity", CloseVurveEntity)

//= =========================== 闭合曲面 主要算法============================
function getCloseCurvePoints(positions, options) {
  if (!positions || positions.length === 0) {
    return positions
  }

  const pnts = mars3d.PointTrans.cartesians2mercators(positions) // 笛卡尔坐标 转 墨卡托投影坐标
  const maxHeight = getMaxHeight(pnts)
  pnts.push(pnts[0], pnts[1])

  let normals = []
  const pList = []
  for (let i = 0; i < pnts.length - 2; i++) {
    const normalPoints = getBisectorNormals(0.3, pnts[i], pnts[i + 1], pnts[i + 2])
    normals = normals.concat(normalPoints)
  }
  const count = normals.length
  normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
  for (let _i = 0; _i < pnts.length - 2; _i++) {
    const pnt1 = pnts[_i]
    const pnt2 = pnts[_i + 1]
    pList.push(pnt1)
    for (let t = 0; t <= 100; t++) {
      const pnt = getCubicValue(t / 100, pnt1, normals[_i * 2], normals[_i * 2 + 1], pnt2)
      pList.push(pnt)
    }
    pList.push(pnt2)
  }

  const returnArr = mars3d.PointTrans.mercators2cartesians(pList, maxHeight) // 墨卡托投影坐标 转  笛卡尔坐标
  return returnArr
}

function getMaxHeight(pnts) {
  let maxHeight = pnts[0][2] || 0
  for (let i = 0; i < pnts.length; i++) {
    if (pnts[2] > maxHeight) {
      maxHeight = pnts[2]
    }
  }
  return maxHeight
}

function getBisectorNormals(t, pnt1, pnt2, pnt3) {
  const normal = getNormal(pnt1, pnt2, pnt3)
  let bisectorNormalRight = null
  let bisectorNormalLeft = null
  let dt = null
  let x = null
  let y = null

  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  const uX = normal[0] / dist
  const uY = normal[1] / dist
  const d1 = MathDistance(pnt1, pnt2)
  const d2 = MathDistance(pnt2, pnt3)
  if (dist > 0.0001) {
    if (isClockWise(pnt1, pnt2, pnt3)) {
      dt = t * d1
      x = pnt2[0] - dt * uY
      y = pnt2[1] + dt * uX
      bisectorNormalRight = [x, y]
      dt = t * d2
      x = pnt2[0] + dt * uY
      y = pnt2[1] - dt * uX
      bisectorNormalLeft = [x, y]
    } else {
      dt = t * d1
      x = pnt2[0] + dt * uY
      y = pnt2[1] - dt * uX
      bisectorNormalRight = [x, y]
      dt = t * d2
      x = pnt2[0] - dt * uY
      y = pnt2[1] + dt * uX
      bisectorNormalLeft = [x, y]
    }
  } else {
    x = pnt2[0] + t * (pnt1[0] - pnt2[0])
    y = pnt2[1] + t * (pnt1[1] - pnt2[1])
    bisectorNormalRight = [x, y]
    x = pnt2[0] + t * (pnt3[0] - pnt2[0])
    y = pnt2[1] + t * (pnt3[1] - pnt2[1])
    bisectorNormalLeft = [x, y]
  }
  return [bisectorNormalRight, bisectorNormalLeft]
}

function getNormal(pnt1, pnt2, pnt3) {
  let dX1 = pnt1[0] - pnt2[0]
  let dY1 = pnt1[1] - pnt2[1]
  const d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1)
  dX1 /= d1
  dY1 /= d1
  let dX2 = pnt3[0] - pnt2[0]
  let dY2 = pnt3[1] - pnt2[1]
  const d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2)
  dX2 /= d2
  dY2 /= d2
  const uX = dX1 + dX2
  const uY = dY1 + dY2
  return [uX, uY]
}

function MathDistance(pnt1, pnt2) {
  return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2))
}

// 计算闭合曲面上的点
function isClockWise(pnt1, pnt2, pnt3) {
  if (!pnt3) {
    return false
  }
  return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0])
}

function getCubicValue(t, startPnt, cPnt1, cPnt2, endPnt) {
  t = Math.max(Math.min(t, 1), 0)
  const tp = 1 - t
  const t2 = t * t

  const t3 = t2 * t
  const tp2 = tp * tp
  const tp3 = tp2 * tp
  const x = tp3 * startPnt[0] + 3 * tp2 * t * cPnt1[0] + 3 * tp * t2 * cPnt2[0] + t3 * endPnt[0]
  const y = tp3 * startPnt[1] + 3 * tp2 * t * cPnt1[1] + 3 * tp * t2 * cPnt2[1] + t3 * endPnt[1]
  return [x, y]
}
