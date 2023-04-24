import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
    scene: {
        fxaa: true,
        center: { lat: 32.576038, lng: 118.586631, alt: 2296055.4, heading: 357.1, pitch: -88.5 }
    }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
    map = mapInstance // 记录map

    map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

    // 创建矢量数据图层
    graphicLayer = new mars3d.layer.GraphicLayer()
    map.addLayer(graphicLayer)

    // 在layer上绑定监听事件
    graphicLayer.on(mars3d.EventType.click, function (event) {
        console.log("监听layer，单击了矢量对象", event)
    })
    bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
    bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

    mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/ais.json" }).then(function (json) {
        const arr = []
        for (let i = 0; i < json.points.length; i++) {
            const item = json.points[i]
            if (item.lon < 90 || item.lon > 160 || item.lat < 0 || item.lat > 50) {
                continue
            }
            arr.push(item)
        }
        console.log("加载AIS数据", arr)

        addDemoGraphics(arr)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
    map = null
}

export function addDemoGraphics(points) {
    for (let i = 0; i < points.length; i++) {
        const item = points[i]
        const graphic = new mars3d.graphic.Route({
            point: {
                color: "#ff0000",
                pixelSize: 5,
                distanceDisplayCondition: true,
                distanceDisplayCondition_far: Number.MAX_VALUE,
                distanceDisplayCondition_near: 100000
            },
            model: {
                url: "//data.mars3d.cn/gltf/mars/ship/ship09.glb",
                minimumPixelSize: 40,
                distanceDisplayCondition: true,
                distanceDisplayCondition_far: 100000
            },
            attr: item
        })
        graphicLayer.addGraphic(graphic)

        const point = new mars3d.LngLatPoint(item.lon, item.lat)
        graphic.addDynamicPosition(point, 0)
    }

    // 定时更新动态位置（setInterval为演示）
    const interval = 3
    changePosition(interval)
    setInterval(() => {
        changePosition(interval)
    }, interval * 1000)
}

let offset = 0
// 改变位置
function changePosition(time) {
    offset += 0.02
    graphicLayer.eachGraphic((graphic) => {
        if (graphic.isPrivate) {
            return
        }

        const item = graphic.attr
        const point = new mars3d.LngLatPoint(item.lon + offset, item.lat + offset)
        graphic.addDynamicPosition(point, time)
    })
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
    graphicLayer.bindPopup(function (event) {
        const attr = event.graphic.attr || {}
        attr["类型"] = event.graphic.type
        attr["来源"] = "我是layer上绑定的Popup"
        attr["备注"] = "我支持鼠标交互"

        return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
    })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
    graphicLayer.bindContextMenu([
        {
            text: "删除对象",
            icon: "fa fa-trash-o",
            show: (event) => {
                const graphic = event.graphic
                if (!graphic || graphic.isDestroy) {
                    return false
                } else {
                    return true
                }
            },
            callback: (e) => {
                const graphic = e.graphic
                if (!graphic) {
                    return
                }
                const parent = graphic.parent // 右击是编辑点时
                graphicLayer.removeGraphic(graphic)
                if (parent) {
                    graphicLayer.removeGraphic(parent)
                }
            }
        }
    ])
}

export function clearGraphic() {
    graphicLayer.clear(true)
}
