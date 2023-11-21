/**
 *  【自定义线状标号】 曲线
 *
 * @param {object} options 参数对象，包括以下：
 * @param {LngLatPoint[]|Cesium.Cartesian3[]|Cesium.PositionProperty|Array} options.positions 坐标位置
 * @param {PolylineEntity.StyleOptions} options.style 样式信息
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
 * @class CurveEntity
 * @extends {PolylineEntity}
 * @see [支持的事件类型]{@link BaseGraphic.EventType}
 */
class CurveEntity extends mars3d.graphic.PolylineEntity {
  constructor(options = {}) {
    super(options)

    // this._minPointNum = 2 // 至少需要点的个数
    // this._maxPointNum = 999 // 最多允许点的个数
  }

  /**
   * 编辑处理类
   * @readonly
   */
  get EditClass() {
    // eslint-disable-next-line no-undef
    return EditCurve
  }

  getShowPositions(positions) {
    if (!positions || positions.length < 2) {
      return positions
    }
    return getBezierCurvePoints(positions, this.style)
  }
}

// 注册下, 可以再graphicLayer.startDraw中使用
mars3d.GraphicUtil.register("curveEntity", CurveEntity)

//= =========================== 闭合曲面 主要算法============================
function getBezierCurvePoints(positions, options) {
  if (!positions || positions.length < 3) {
    return positions
  }

  const coordinates = mars3d.LngLatArray.toArray(positions)
  if (options?.closure) {
    coordinates.push(coordinates[0]) // 闭合曲线
  }
  const defHeight = coordinates[coordinates.length - 1][2]

  const curved = turf.bezierSpline(
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates
      }
    },
    {
      resolution: options?.resolution ?? 10000,
      sharpness: options?.sharpness ?? 0.85
    }
  )
  const result = mars3d.PointTrans.lonlats2cartesians(curved.geometry.coordinates, defHeight)
  if (options?.closure) {
    result.push(result[0])
  }
  return result
}
