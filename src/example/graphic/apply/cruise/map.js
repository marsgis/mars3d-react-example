import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export let circleFixedRoute
export let attackFixedRoute

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 35.685666, lng: 122.660021, alt: 522806.4, heading: 319.6, pitch: -37.6 },
    clock: {
      startTime: "2022/12/23 08:00:00",
      stopTime: "2022/12/23 10:00:00"
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  }
}

const staticResources = [
  {
    position: [116.380748, 39.896113],
    name: "北京",
    title: "首都",
    desc: `<p>首次加载，飞机会比较慢，请耐心等候。</p>
    <p>现在的时间是 12月23号 </p>`
  },
  {
    position: [112.549248, 37.857014],
    name: "山西",
    ellipsoidStyle: {
      minimumClockDegree: -90.0, // 有缺口
      minimumConeDegree: 20, // 有顶口
      scanColor: "rgba(255, 204, 0)", // 扫描面 黄色
      scanOutlineColor: "rgba(255, 204, 0, 0.1)"
    },
    title: "太原会战",
    desc: `<p>太原会战是一个规模宏大的会战，也是国军八年抗战历史上22个战役之一。</p>
    <p>该会战的战场为地方军阀阎锡山控制的山西省境内，会战前后包括5个战役，按照时间顺序依次是：大同战役、平型关战役(非中共打的平型关战斗，
      平型关战斗仅是该战役的一小部分，平型关战役歼敌5000到8000人，其中中共歼敌800多人)、忻口战役、娘子关战役、太原保卫战。</p>
    <p>整个太原会战中，国军前后使用兵力多达8个集团军高达58万之众，日军也前后使用5个师团总兵力超过15万人。</p>
    <p>此次参战的国军中除了中央军几个集团军以外，更有地头蛇晋绥军的2个集团军，以及其他各派系地方军阀部队，甚至还有中共的第18集团军，可谓各派系国军的协同作战。</p>
    <p>而日军更是使用了大量的最精锐部队，参加太原会战的全部是日军战斗力最强的一流部队，也是孤注一掷了。</p>
    <p>最终的结局是日军用尽一切力量，多次增兵，甚至从河北战场调用一个主力师团，最终勉强占领了山西省的的北部，中部和东部，而国军仍然牢牢的控制着地理位置极为重要的山西西部和南部长达8年之久，并且最终接受了日军的投降。</p>`
  },
  {
    position: [113.665412, 34.757975],
    name: "河南",
    ellipsoidStyle: {
      scanColor: "rgba(0, 204, 0, 0.5)", // 绿色
      minimumConeDegree: 20, // 有顶口
      scanOutlineColor: "rgba(255, 204, 0,0.8)" // 黄色
    },
    title: "抗战大省",
    desc: `<p>在整个抗日战争期间，111个县中有109个县曾遭到日军铁蹄的蹂躏，仅有新蔡、沈丘2个县没有沦陷过。1937年10月21日，沦陷的豫北临漳县（今属河北省）是河南省第一个沦陷县城；1945年2月，南阳的淅川县是最后沦落的县城。</p>
    <p>从北面沿平汉铁路往南进军,11月5日，豫北重镇彰德（今安阳市）陷落，之后，河南逐步沦陷。1938年2月6日，，先后占领清丰、濮阳、长垣、封丘等县，往新乡以南进攻
     2月11日至3月中旬，先后占领汤阴、淇县、汲县、辉县、新乡，与前路日军会合。两路日军会合后向西进犯，焦作、济源沦陷后，黄河以北全部沦陷。</p>

    <p>从东面,1938年5月13日，来自徐州方向的日军占领了豫东永城县,28日又占领了商丘。6月1日开始，日军先后占领杞县、通许、尉氏、太康，国民党军队撤退到豫西山区。
    6月6日，日军占领河南省省会开封后，一路向西，侵入中牟，直逼郑州。6月9日，国民政府扒开 <span style="color:red">花园口黄河大堤</span>阻止日军前进的步伐。</p>

    <p>从南面,1938年10月12日,来自皖西方向的日军攻克固始、光山、罗山、商城等县城后，完全控制了整个信阳，将豫东与皖西连成一片，并与其他日军形成合围武汉之势。</p>

    <p>六年后,不死心的日军发动了新的攻势，就是著名的1944年豫湘桂会战，河南战役全面爆发</p>

    <p>然而花园口被炸开的危害影响更大，花园口炸堤酿巨灾</p>
    <p>国民政府在郑州花园口决开黄河堤坝，阻挡日军西进，决堤后形成了黄泛区。泛水倾泻时，“有夜间来水，人在睡梦中淹死的；有搬运屋内东西房塌砸死的；
    有慌忙外逃被急流卷去的；有凫水力竭葬身鱼腹的；有木筏撞散落水溺死的；还有围困水中饿死的；身陷淤泥丧生的。”各种死状惨不忍睹。</p>
    <p>“旱灾、蝗灾、匪灾及黄河泛滥等灾相继而至”，1941~1943年的灾荒是河南近百年历史上最惨烈的灾害,全省嗷嗷待哺的饥民达<span style="color:red">1000万</span>人之多。
    到1943年灾情达到极致，豫西、豫北发生特大蝗灾，春夏之际豫东又两度被水，全省饥民增至3000万，两年中饿死者有<span style="color:red">200多万</span>人。</p>`
  },
  {
    position: [118.792939, 32.06266],
    name: "南京",
    ellipsoidStyle: {
      radius: 200000, // 范围
      scanColor: "rgba(255, 204, 0, 0.9)", // 黄色
      minimumConeDegree: 0, // 无顶口
      scanMinimumConeDegree: -30.0, // 交叉
      scanOutlineColor: "rgba(255, 204, 0, 0.1)"
    },
    title: "南京大屠杀",
    desc: `</p>二战期间的重大惨案之<span style="color:red">一</span>,战后，远东国际军事法庭和中国审判战犯军事法庭对其进行了专案审理，
      虽然松井石根、谷寿夫等战犯受到了惩处，但是小日子过的不错的日本人拒不承认，妄图用时间的流逝让人们忘记他们残忍的本性。</p>
      <p>屠杀地域范围“当时南京市政府管辖城内7个区（含下关，总理陵园区）及浦口中，孝陵卫，燕子矶，上新河，陵园5个郊区。还有南京周围的乌龙山，栖霞山，龙潭，江宁，句容，溧水，淳化，湖熟，秣陵关，牛首山，江浦，六合，汤山，孟塘，江浦等”。</p>
      <p>对处于战争漩涡中的中国而言，日军锋镝所至，生灵涂炭，但很多沦陷区的日军暴行报告多为事后辗转得来，信息相对滞后，有不少语言不详。相比之下，日军在南京的暴行，由于西方主流媒体的广为报道，信息丰富，因而格外引人注目。</p>
      <p>正如汉口《大公报》社评《为匹夫匹妇报仇》中所说：“南京之事，则外侨所传，世界所知，仅此一端，已构成日本帝国主义万劫不复之罪状，何况南京如此，江南各地实际皆然……凡敌军所到，其凶淫惨杀，都是与南京一样。”</p>
      <p>留守南京的一个外国侨民的日记："劫掠、屠杀和奸淫的事情，有增无减。昨日白天和夜间，被强奸的妇女至少有1000人。一个可怜的女人竟被强奸了37次，一个兽兵在强奸时，因为5个月的婴孩哭声不断，便把他活活闷死，反抗的惩罚就是刺刀。医院里挤满了受难者。我们唯一的外科医生威尔逊，忙得无暇休息。"</p>
      <p>“中午，办公处来了一个人，头部是烧焦了，眼睛和耳朵是割去了，鼻子只剩下一半，惨不忍睹。我送他到医院，几小时后，他死了。事情的经过是这样的：日军把几百个人缚在一起，灌浇汽油，用火烧炙。他也是其中的一个，但他缚在外挡，所以汽油仅掠过他的头部，不久医院里收到同样的病人，被炙的伤势更重。
      自然，他也死了。日军似乎曾先用机关枪扫射，但也有人得免于死。第一个没有子弹的创痕，第二人就有。锥天鼓楼的对面，看见另一个死人的头部和臂膀受着同样的火伤，睡在马路的转角。他在未死以前显然挣扎了那么远的一段路。真是令人不能相信的兽行。”</p>
      <p>当时的南京不论是城外还是城内，都有着日军的层层把守，百姓只能任人宰割，特别是惨无人道的“百人斩”比赛，两个日本军官以一瓶红酒作为奖品，看谁率先击杀到100个人，就能的得到一瓶红酒，甚至还对此事大肆登报，惹人愤慨。</p>
      <p>而当时的屠杀指挥者就是日本的松井石根、谷寿夫、朝香宫鸠彦王。</p>
      `
  }
]

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = "蓝色底图"

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  map.clock.multiplier = 50

  staticResources.forEach((item) => {
    if (!item.ellipsoidStyle) {
      addDivgraphic(item.position, { name: item.name, title: item.title, desc: item.desc })
      return
    }
    addEllipsoidGraphics(item)
  })

  addCircleFixRoute()
  addWeixinGraphic()

  map.on(mars3d.EventType.keydown, function (event) {
    // 空格 切换暂停/继续
    if (event.keyCode === 32) {
      // 控制总时间
      if (circleFixedRoute.isPause) {
        circleFixedRoute.proceed()
      } else {
        circleFixedRoute.pause()
      }
    }
    eventTarget.fire("changeFixedRoute")
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let isinShanxi = false
let isinHenan = false
let isinNanjing = false

function addEllipsoidGraphics({ position, name, ellipsoidStyle, title, desc }) {
  const model = new mars3d.graphic.ModelPrimitive({
    name: name + "地面站模型",
    position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(model)

  const ellipsoid = new mars3d.graphic.EllipsoidEntity({
    name: name + "雷达区域",
    position,
    style: {
      radii: ellipsoidStyle.radius || 100000,
      minimumClockDegree: ellipsoidStyle.minimumClockDegree || -180.0,
      maximumClockDegree: 180.0,
      minimumConeDegree: ellipsoidStyle.minimumConeDegree,
      maximumConeDegree: 90.0,
      fill: false,
      outline: true,
      outlineColor: "rgba(0, 204, 0, 0.4)", // 绿色
      stackPartitions: 30, // 竖向
      slicePartitions: 30 // 横向
    },
    // 添加扫描面
    scanPlane: {
      step: 1.0, // 步长
      min: ellipsoidStyle.minimumClockDegree || -180.0,
      max: 180.0,
      style: {
        innerRadii: 1000,
        outline: true,
        color: ellipsoidStyle.scanColor,
        outlineColor: ellipsoidStyle.scanOutlineColor,
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,

        minimumConeDegree: ellipsoidStyle.scanMinimumConeDegree || 20.0,
        maximumConeDegree: 70.0
      }
    },
    attr: { name, desc, title }
  })
  graphicLayer.addGraphic(ellipsoid)
}

function addCircleFixRoute() {
  // 根据中心点计算飞机飞行的圆形路线
  let positionCircle = getCircleOutPositions([117.579907, 35.977162, 197], { radius: 460000, rotation: -80 })
  positionCircle = mars3d.PointUtil.setPositionsHeight(positionCircle, 20000)
  positionCircle.push(positionCircle[0]) // 闭合圆

  attackFixedRoute = addAttackPlane(positionCircle[0])

  circleFixedRoute = new mars3d.graphic.FixedRoute({
    name: "我国巡查机",
    speed: 3000,
    positions: positionCircle,
    autoStop: true, // 到达终点自动停止
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 50
    },
    path: {
      color: "#ffff00",
      opacity: 0.5,
      width: 1,
      leadTime: 0
    }
  })
  graphicLayer.addGraphic(circleFixedRoute)

  const shanxiGraphic = graphicLayer.getGraphicByAttr("山西雷达区域", "name")
  const henanGraphic = graphicLayer.getGraphicByAttr("河南雷达区域", "name")
  const nanjingGraphic = graphicLayer.getGraphicByAttr("南京雷达区域", "name")

  let oneTime = true
  circleFixedRoute.on(mars3d.EventType.change, (event) => {
    if (oneTime) {
      eventTarget.fire("changeFixedRoute")
      addDivgraphic(null)
      oneTime = false

      map.setCameraView({ lat: 19.77607, lng: 130.262434, alt: 1785470.8, heading: 352, pitch: -52.7 })
    }
    if (
      mars3d.PolyUtil.isInPoly(
        event.position,
        getCircleOutPositions([shanxiGraphic.centerPoint.lng, shanxiGraphic.centerPoint.lat], { radius: shanxiGraphic.style.radii })
      )
    ) {
      if (!isinShanxi) {
        shanxiGraphic.setStyle({ outlineColor: "rgba(255, 204, 0, 0.5)" })
        isinShanxi = true
        addDivgraphic(shanxiGraphic.coordinate, shanxiGraphic.attr)
      }
    } else if (
      mars3d.PolyUtil.isInPoly(
        event.position,
        getCircleOutPositions([henanGraphic.centerPoint.lng, henanGraphic.centerPoint.lat], { radius: henanGraphic.style.radii })
      )
    ) {
      if (!isinHenan) {
        henanGraphic.setOptions({
          style: { outlineColor: "rgba(36, 172, 242, 0.5)" },
          scanPlane: {
            style: { outlineColor: "rgba(36, 172, 242, 0.5)" }
          }
        })
        isinHenan = true
        addDivgraphic(henanGraphic.coordinate, henanGraphic.attr)
      }
    } else if (
      mars3d.PolyUtil.isInPoly(
        event.position,
        getCircleOutPositions([nanjingGraphic.centerPoint.lng, nanjingGraphic.centerPoint.lat], { radius: nanjingGraphic.style.radii })
      )
    ) {
      if (!isinNanjing) {
        nanjingGraphic.setStyle({ outlineColor: "rgba(189, 16, 0, 0.5)" })

        isinNanjing = true
        addDivgraphic(nanjingGraphic.coordinate, nanjingGraphic.attr)

        addDivgraphic(attackFixedRoute.position, {
          ...attackFixedRoute.attr,
          id: "attackDiv", // 不能放在添加矢量对象的attr内，会将对象的id替换成该对象
          desc: "我是勘测机，现在的巡查机在南京范围，我来日本逛一逛，我什么都不会干"
        })
      }
    } else {
      stopPlay(false)
    }
  })

  circleFixedRoute.on(mars3d.EventType.end, () => {
    eventTarget.fire("changeFixedRoute")
  })

  // 启动漫游
  circleFixedRoute.start()
  attackFixedRoute.start()
}

// 判断是否离开了雷达范围，回复雷达的样式，删除div描述框
export function stopPlay(isStop) {
  if (isStop) {
    circleFixedRoute.stop()
    attackFixedRoute.stop()
  }

  const shanxiGraphic = graphicLayer.getGraphicByAttr("山西雷达区域", "name")
  const henanGraphic = graphicLayer.getGraphicByAttr("河南雷达区域", "name")
  const nanjingGraphic = graphicLayer.getGraphicByAttr("南京雷达区域", "name")
  if (isinShanxi) {
    shanxiGraphic.setStyle({ outlineColor: "rgba(0, 204, 0, 0.4)" })
    isinShanxi = false
    addDivgraphic(null)
  }
  if (isinHenan) {
    henanGraphic.setOptions({
      style: { outlineColor: "rgba(0, 204, 0, 0.4)" },
      scanPlane: {
        style: { outlineColor: "rgba(255, 204, 0,0.8)" }
      }
    })
    isinHenan = false
    addDivgraphic(null)
  }
  if (isinNanjing) {
    nanjingGraphic.setStyle({ outlineColor: "rgba(0, 204, 0, 0.4)" })
    isinNanjing = false
    addDivgraphic(null) // 清除雷达范围内的div
    addDivgraphic(attackFixedRoute.position, {
      ...attackFixedRoute.attr,
      id: "attackDiv", // 不能放在添加矢量对象的attr内，会将对象的id替换成该对象
      desc: "回去了，回去了"
    }) // 修改勘测机的div
    setTimeout(() => {
      addDivgraphic(null, {
        id: "attackDiv"
      }) // 清除勘测机的div
    }, 2000)
  }
}

// 添加勘测机
function addAttackPlane(startPosition) {
  // 攻击目标位置 - 139.674147, 35.711477, 625.4
  const endPosition = startPosition.clone()
  let positionAttack = [
    startPosition,
    mars3d.LngLatPoint.toCartesian([139.674147, 35.711477, 10000]),
    mars3d.LngLatPoint.toCartesian([132.412501, 34.566365, 10000]),
    endPosition
  ]
  positionAttack = mars3d.PointUtil.setPositionsHeight(positionAttack, 80000)

  const attackPlane = new mars3d.graphic.FixedRoute({
    name: "战机",
    speed: 5000,
    positions: positionAttack,
    autoStop: true, // 到达终点自动停止
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 50
    },
    attr: { name: "勘测机-001号" }
  })
  graphicLayer.addGraphic(attackPlane)

  // 启动漫游
  return attackPlane
}

// 获取圆形范围坐标
function getCircleOutPositions(position, param) {
  return mars3d.PolyUtil.getEllipseOuterPositions({ position, ...param })
}

// 添加div描述框
function addDivgraphic(position, attr) {
  const graphic = graphicLayer.getGraphicById("descPannel")
  if (attr?.id) {
    const attackDiv = graphicLayer.getGraphicById(attr?.id)
    attackDiv && attackDiv.remove()
  } else {
    graphic && graphic.remove()
  }

  if (!position) {
    return
  }

  const descGraphic = new mars3d.graphic.DivGraphic({
    id: attr?.id || "descPannel",
    position,
    pointerEvents: true,
    style: {
      html: `<div class="mars-city">
              <div class="mars-city-desc">
                <div class="mars-city-desc_title">${attr.name} ${attr?.title ? "-" + attr?.title : ""}</div>
                <div class="mars-city-desc_content">
                ${attr.desc}
                </div>
              </div>
              <div class="arrow"></div>
            </div>
          `,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
  })
  graphicLayer.addGraphic(descGraphic)

  // descGraphic.testPoint = true
}

// 添加卫星对象
function addWeixinGraphic() {
  const point = new mars3d.LngLatPoint(116.716398, 39.907914, 100000)

  // 添加卫星
  const modelGraphic = new mars3d.graphic.ModelPrimitive({
    name: "卫星模型",
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 30
    }
  })
  graphicLayer.addGraphic(modelGraphic)

  const pointQY = point.clone()
  pointQY.alt = pointQY.alt / 2

  const graphic = new mars3d.graphic.CylinderEntity({
    position: pointQY,
    style: {
      length: point.alt,
      topRadius: 0.0,
      bottomRadius: 10000,
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "rgba(255, 204, 102 , 0.5)",
        repeat: 30.0,
        thickness: 0.5
      }
    }
  })
  graphicLayer.addGraphic(graphic)
}
