/**
 * 【自定义线状标号】 曲线 对应的编辑类
 */
class EditCurve extends mars3d.edit.EditBase {
  bindDraggers() {
    const positions = this.positions

    for (let i = 0, len = positions.length; i < len; i++) {
      const position = this.updatePositionsHeightByAttr(positions[i])

      // 各顶点
      const dragger = this.createDragger({
        position,
        onDrag: (dragger, position) => {
          position = this.updatePositionsHeightByAttr(position)
          dragger.position = position
          this.positions[dragger.index] = position
        },
        onDragStart: (dragger, position) => {
          if (this._heightDraggers?.length > 0) {
            for (let i = 0, len = this.draggers.length; i < len; i++) {
              this.draggers[i].show = false
            }
          }
        },
        onDragEnd: (dragger, position) => {
          this.updateDraggers()
        }
      })
      dragger.index = i
      this.draggers.push(dragger)

      // 中间点，拖动后新增点
      if (!this.hasClosure && i < len - 1) {
        const nextIndex = (i + 1) % len
        const nextPosition = positions[nextIndex]
        // 第一个中间点
        let midpoint = mars3d.PointUtil.getMidpoint(position, nextPosition, 0.33)
        midpoint = this.updatePositionsHeightByAttr(midpoint)

        const draggerMid = this.createDragger({
          position: midpoint,
          type: mars3d.EditPointType.AddMidPoint,
          tooltip: this._map.getLangText("_增加点"),
          onDragStart: (dragger, position) => {
            this.positions.splice(dragger.index, 0, position) // 插入点
          },
          onDrag: (dragger, position) => {
            this.positions[dragger.index] = position
          },
          onDragEnd: (dragger, position) => {
            this._fireAddPoint(dragger, position) // 新增点事件
            this.updateDraggers()
          }
        })
        draggerMid.index = nextIndex
        this.draggers.push(draggerMid)

        // 第二个中间点
        let midpoint2 = mars3d.PointUtil.getMidpoint(position, nextPosition, 0.66)
        midpoint2 = this.updatePositionsHeightByAttr(midpoint2)

        const draggerMid2 = this.createDragger({
          position: midpoint2,
          type: mars3d.EditPointType.AddMidPoint,
          tooltip: this._map.getLangText("_增加点"),
          onDragStart: (dragger, position) => {
            this.positions.splice(dragger.index, 0, position) // 插入点
          },
          onDrag: (dragger, position) => {
            this.positions[dragger.index] = position
          },
          onDragEnd: (dragger, position) => {
            this._fireAddPoint(dragger, position) // 新增点事件
            this.updateDraggers()
          }
        })
        draggerMid2.index = nextIndex
        this.draggers.push(draggerMid2)
      }
    }

    // 整体平移移动点
    this._bindMoveAllDragger()
  }

  // 整体平移移动点
  _bindMoveAllDragger() {
    if (!this._graphic._hasMoveEdit) {
      return
    }

    let positionMove = mars3d.PolyUtil.centerOfMass(this.positions)
    if (this.positions.length === 2) {
      const dis = Cesium.Cartesian3.distance(this.positions[0], this.positions[1])
      positionMove = mars3d.PointUtil.getPositionByDirectionAndLen(positionMove, 90, dis * 0.06)
    }
    positionMove = this.updatePositionsHeightByAttr(positionMove)

    const draggerMove = this.createDragger({
      position: positionMove,
      type: mars3d.EditPointType.MoveAll,
      tooltip: this._map.getLangText("_整体平移"),
      onDragStart: (dragger, position) => {
        positionMove = position
      },
      onDrag: (dragger, position) => {
        // 记录差值
        const diff = Cesium.Cartesian3.subtract(position, positionMove, new Cesium.Cartesian3())
        positionMove = position

        this.positions.forEach((pos, index, arr) => {
          const newPos = this.updatePositionsHeightByAttr(Cesium.Cartesian3.add(pos, diff, new Cesium.Cartesian3()))
          this.positions[index] = newPos
        })

        for (let i = 0, len = this.draggers.length; i < len; i++) {
          if (draggerMove !== this.draggers[i]) {
            this.draggers[i].position = this.updatePositionsHeightByAttr(
              Cesium.Cartesian3.add(this.draggers[i].position, diff, new Cesium.Cartesian3())
            )
          }
        }
        this._updateMoveAllHook(position)
      }
    })
    this.draggers.push(draggerMove)
  }

  // 根据属性更新坐标
  updatePositionsHeightByAttr(position) {
    // if (this.clampToGround) {
    //   position = getSurfacePosition(this._map.scene, position, { has3dtiles: true }) // 贴地时求贴模型和贴地的高度
    // }
    return position
  }
}
