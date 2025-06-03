// import * as mars3d from "mars3d"

;(function (window) {
  const BUF = 64
  const tileSize = 256
  const ArcGISPbfImageryProviderRequestTrailer = "/tile/{z}/{y}/{x}.pbf"

  class MarsPoint {
    x
    y
    constructor(x, y) {
      this.x = x
      this.y = y
    }

    clone() {
      return new MarsPoint(this.x, this.y)
    }

    add(p) {
      return this.clone()._add(p)
    }

    sub(p) {
      return this.clone()._sub(p)
    }

    multByPoint(p) {
      return this.clone()._multByPoint(p)
    }

    divByPoint(p) {
      return this.clone()._divByPoint(p)
    }

    mult(k) {
      return this.clone()._mult(k)
    }

    div(k) {
      return this.clone()._div(k)
    }

    rotate(a) {
      return this.clone()._rotate(a)
    }

    rotateAround(a, p) {
      return this.clone()._rotateAround(a, p)
    }

    matMult(m) {
      return this.clone()._matMult(m)
    }

    unit() {
      return this.clone()._unit()
    }

    perp() {
      return this.clone()._perp()
    }

    round() {
      return this.clone()._round()
    }

    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    equals(other) {
      return this.x === other.x && this.y === other.y
    }

    dist(p) {
      return Math.sqrt(this.distSqr(p))
    }

    distSqr(p) {
      var dx = p.x - this.x,
        dy = p.y - this.y
      return dx * dx + dy * dy
    }

    angle() {
      return Math.atan2(this.y, this.x)
    }

    angleTo(b) {
      return Math.atan2(this.y - b.y, this.x - b.x)
    }

    angleWith(b) {
      return this.angleWithSep(b.x, b.y)
    }

    angleWithSep(x, y) {
      return Math.atan2(this.x * y - this.y * x, this.x * x + this.y * y)
    }

    _matMult(m) {
      var x = m[0] * this.x + m[1] * this.y,
        y = m[2] * this.x + m[3] * this.y
      this.x = x
      this.y = y
      return this
    }

    _add(p) {
      this.x += p.x
      this.y += p.y
      return this
    }

    _sub(p) {
      this.x -= p.x
      this.y -= p.y
      return this
    }

    _mult(k) {
      this.x *= k
      this.y *= k
      return this
    }

    _div(k) {
      this.x /= k
      this.y /= k
      return this
    }

    _multByPoint(p) {
      this.x *= p.x
      this.y *= p.y
      return this
    }

    _divByPoint(p) {
      this.x /= p.x
      this.y /= p.y
      return this
    }

    _unit() {
      this._div(this.mag())
      return this
    }

    _perp() {
      var y = this.y
      this.y = this.x
      this.x = -y
      return this
    }

    _rotate(angle) {
      var cos = Math.cos(angle),
        sin = Math.sin(angle),
        x = cos * this.x - sin * this.y,
        y = sin * this.x + cos * this.y
      this.x = x
      this.y = y
      return this
    }

    _rotateAround(angle, p) {
      var cos = Math.cos(angle),
        sin = Math.sin(angle),
        x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y),
        y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y)
      this.x = x
      this.y = y
      return this
    }

    _round() {
      this.x = Math.round(this.x)
      this.y = Math.round(this.y)
      return this
    }

    static convert(a) {
      if (a instanceof MarsPoint) {
        return a
      }
      if (Array.isArray(a)) {
        return new MarsPoint(a[0], a[1])
      }
      return a
    }
  }

  class MarsSheet {
    json
    canvas
    mapping
    missingBox

    constructor(json, canvas) {
      this.json = json
      this.canvas = canvas
      this.mapping = new Map()
      this.missingBox = { x: 0, y: 0, w: 0, h: 0 }
      const scale = window.devicePixelRatio
      // 根据 key 分割精灵图
      for (let i = 0; i < Object.keys(this.json).length; i++) {
        const k = Object.keys(this.json)[i]
        const v = Object.values(this.json)[i]
        this.mapping.set(k, {
          x: v.x,
          y: v.y,
          w: v.width * scale,
          h: v.height * scale
        })
      }
    }

    get(name) {
      let result = this.mapping.get(name)
      if (!result) result = this.missingBox
      return result
    }
  }

  function linebreak(str, maxUnits) {
    if (str.length <= maxUnits) return [str]
    let endIndex = maxUnits - 1
    let space_before = str.lastIndexOf(" ", endIndex)
    let space_after = str.indexOf(" ", endIndex)
    if (space_before == -1 && space_after == -1) {
      return [str]
    }
    let first
    let after
    if (space_after == -1 || (space_before >= 0 && endIndex - space_before < space_after - endIndex)) {
      first = str.substring(0, space_before)
      after = str.substring(space_before + 1, str.length)
    } else {
      first = str.substring(0, space_after)
      after = str.substring(space_after + 1, str.length)
    }
    return [first, ...linebreak(after, maxUnits)]
  }

  class FontAttr {
    family
    size
    weight
    style
    font

    constructor(options) {
      if (options?.font) {
        this.font = options.font
      } else {
        this.family = options?.fontFamily ?? "sans-serif"
        this.size = options?.fontSize ?? 12
        this.weight = options?.fontWeight
        this.style = options?.fontStyle
      }
    }

    get(z, f) {
      if (this.font) {
        if (typeof this.font === "function") {
          return this.font(z, f)
        } else {
          return this.font
        }
      } else {
        let style = ""
        if (this.style) {
          if (typeof this.style === "function") {
            style = this.style(z, f) + " "
          } else {
            style = this.style + " "
          }
        }

        let weight = ""
        if (this.weight) {
          if (typeof this.weight === "function") {
            weight = this.weight(z, f) + " "
          } else {
            weight = this.weight + " "
          }
        }

        let size
        if (typeof this.size === "function") {
          size = this.size(z, f)
        } else {
          size = this.size
        }

        let family
        if (typeof this.family === "function") {
          family = this.family(z, f)
        } else {
          family = this.family
        }

        return `${style}${weight}${size}px ${family}`
      }
    }
  }

  class TextAttr {
    label_props
    textTransform

    constructor(options) {
      this.label_props = options?.label_props ?? ["name"]
      this.textTransform = options?.textTransform
    }

    get(z, f) {
      let retval

      let label_props
      if (typeof this.label_props == "function") {
        label_props = this.label_props(z, f)
      } else {
        label_props = this.label_props
      }
      for (let property of label_props) {
        if (f.props.hasOwnProperty(property) && typeof f.props[property] === "string") {
          retval = f.props[property]
          break
        }
      }
      let transform
      if (typeof this.textTransform === "function") {
        transform = this.textTransform(z, f)
      } else {
        transform = this.textTransform
      }
      if (retval && transform === "uppercase") retval = retval.toUpperCase()
      else if (retval && transform === "lowercase") retval = retval.toLowerCase()
      else if (retval && transform === "capitalize") {
        const wordsArray = retval.toLowerCase().split(" ")
        const capsArray = wordsArray.map((word) => {
          return word[0].toUpperCase() + word.slice(1)
        })
        retval = capsArray.join(" ")
      }
      return retval
    }
  }

  class StringAttr {
    str
    per_feature

    constructor(c, defaultValue) {
      this.str = c ?? defaultValue
      this.per_feature = typeof this.str == "function" && this.str.length == 2
    }

    get(z, f) {
      if (typeof this.str === "function") {
        return this.str(z, f)
      } else {
        return this.str
      }
    }
  }

  class NumberAttr {
    value
    per_feature

    constructor(c, defaultValue = 1) {
      this.value = c ?? defaultValue
      this.per_feature = typeof this.value == "function" && this.value.length == 2
    }

    get(z, f) {
      if (typeof this.value == "function") {
        return this.value(z, f)
      } else {
        return this.value
      }
    }
  }

  // 文本符号化工具
  class TextSymbolizer {
    font
    text
    fillAttr
    strokeAttr
    width
    lineHeight // in ems
    letterSpacing // in px
    maxLineCodeUnits
    justify

    constructor(options) {
      this.font = new FontAttr(options)
      this.text = new TextAttr(options)

      this.fill = new StringAttr(options.fill, "black")
      this.stroke = new StringAttr(options.stroke, "black")
      this.width = new NumberAttr(options.width, 0)
      this.lineHeight = new NumberAttr(options.lineHeight, 1)
      this.letterSpacing = new NumberAttr(options.letterSpacing, 0)
      this.maxLineCodeUnits = new NumberAttr(options.maxLineChars, 15)
      this.justify = options.justify
    }

    place(layout, geom, feature) {
      let property = this.text.get(layout.zoom, feature)
      if (!property) return undefined
      let font = this.font.get(layout.zoom, feature)
      layout.scratch.font = font

      let letterSpacing = this.letterSpacing.get(layout.zoom, feature)

      // line breaking
      let lines = linebreak(property, this.maxLineCodeUnits.get(layout.zoom, feature))
      let longestLine = ""
      let longestLineLen = 0
      for (let line of lines) {
        if (line.length > longestLineLen) {
          longestLineLen = line.length
          longestLine = line
        }
      }

      let metrics = layout.scratch.measureText(longestLine)
      let width = metrics.width + letterSpacing * (longestLineLen - 1)

      let ascent = metrics.actualBoundingBoxAscent
      let descent = metrics.actualBoundingBoxDescent
      let lineHeight = (ascent + descent) * this.lineHeight.get(layout.zoom, feature)

      let a = new MarsPoint(geom[0][0].x, geom[0][0].y)
      let bbox = {
        minX: a.x,
        minY: a.y - ascent,
        maxX: a.x + width,
        maxY: a.y + descent + (lines.length - 1) * lineHeight
      }

      // inside draw, the origin is the anchor
      // and the anchor is the typographic baseline of the first line
      let draw = (ctx, extra) => {
        ctx.globalAlpha = 1
        ctx.font = font
        ctx.fillStyle = this.fill.get(layout.zoom, feature)
        let textStrokeWidth = this.width.get(layout.zoom, feature)

        let y = 0
        for (let line of lines) {
          let startX = 0
          if (this.justify == protomaps.Justify.Center || (extra && extra.justify == protomaps.Justify.Center)) {
            startX = (width - ctx.measureText(line).width) / 2
          } else if (this.justify == protomaps.Justify.Right || (extra && extra.justify == protomaps.Justify.Right)) {
            startX = width - ctx.measureText(line).width
          }
          if (textStrokeWidth) {
            ctx.lineWidth = textStrokeWidth * 2 // centered stroke
            ctx.strokeStyle = this.stroke.get(layout.zoom, feature)
            if (letterSpacing > 0) {
              let xPos = startX
              for (let letter of line) {
                ctx.strokeText(letter, xPos, y)
                xPos += ctx.measureText(letter).width + letterSpacing
              }
            } else {
              ctx.strokeText(line, startX, y)
            }
          }
          if (letterSpacing > 0) {
            let xPos = startX
            for (let letter of line) {
              ctx.fillText(letter, xPos, y)
              xPos += ctx.measureText(letter).width + letterSpacing
            }
          } else {
            ctx.fillText(line, startX, y)
          }
          y += lineHeight
        }
      }
      return [{ anchor: a, bboxes: [bbox], draw: draw }]
    }
  }

  class IconSymbolizer {
    name
    sheet
    dpr
    textSymbolizer

    constructor(options) {
      this.name = options.name
      this.sheet = options.sheet
      this.dpr = window.devicePixelRatio
      this.textSymbolizer = new TextSymbolizer(options)
    }

    place(layout, geom, feature) {
      let pt = geom[0]
      let a = new MarsPoint(geom[0][0].x, geom[0][0].y)
      let loc = this.sheet.get(this.name)
      let width = loc.w / this.dpr
      let height = loc.h / this.dpr

      const text = this.textSymbolizer.place(layout, geom, feature)

      let bbox = {
        minX: a.x - width / 2,
        minY: a.y - height / 2,
        maxX: a.x + width / 2,
        maxY: a.y + height / 2
      }

      let draw = (ctx) => {
        ctx.globalAlpha = 1
        if (text) {
          text[0].draw(ctx)
        }

        ctx.drawImage(this.sheet.canvas, loc.x, loc.y, loc.w, loc.h, -loc.w / 2 / this.dpr, -loc.h / 2 / this.dpr, loc.w / 2, loc.h / 2)
      }
      return [{ anchor: a, bboxes: [bbox], draw: draw }]
    }
  }

  function number(val, defaultValue) {
    return typeof val === "number" ? val : defaultValue
  }

  function filterFn(arr) {
    // hack around "$type"
    if (arr.includes("$type")) {
      return (z) => true
    } else if (arr[0] == "==") {
      return (z, f) => f.props[arr[1]] === arr[2]
    } else if (arr[0] == "!=") {
      return (z, f) => f.props[arr[1]] !== arr[2]
    } else if (arr[0] == "!") {
      let sub = filterFn(arr[1])
      return (z, f) => !sub(z, f)
    } else if (arr[0] === "<") {
      return (z, f) => number(f.props[arr[1]], Infinity) < arr[2]
    } else if (arr[0] === "<=") {
      return (z, f) => number(f.props[arr[1]], Infinity) <= arr[2]
    } else if (arr[0] === ">") {
      return (z, f) => number(f.props[arr[1]], -Infinity) > arr[2]
    } else if (arr[0] === ">=") {
      return (z, f) => number(f.props[arr[1]], -Infinity) >= arr[2]
    } else if (arr[0] === "in") {
      return (z, f) => arr.slice(2, arr.length).includes(f.props[arr[1]])
    } else if (arr[0] === "!in") {
      return (z, f) => !arr.slice(2, arr.length).includes(f.props[arr[1]])
    } else if (arr[0] === "has") {
      return (z, f) => f.props.hasOwnProperty(arr[1])
    } else if (arr[0] === "!has") {
      return (z, f) => !f.props.hasOwnProperty(arr[1])
    } else if (arr[0] === "all") {
      let parts = arr.slice(1, arr.length).map((e) => filterFn(e))
      return (z, f) =>
        parts.every((p) => {
          return p(z, f)
        })
    } else if (arr[0] === "any") {
      let parts = arr.slice(1, arr.length).map((e) => filterFn(e))
      return (z, f) =>
        parts.some((p) => {
          return p(z, f)
        })
    } else {
      console.log("Unimplemented filter: ", arr[0])
      return (f) => false
    }
  }

  function numberFn(obj) {
    if (!obj.base) {
      obj.base = 1
    }
    if (obj.base && obj.stops) {
      return (z) => {
        return protomaps.exp(obj.base, obj.stops)(z - 1)
      }
    } else if (obj[0] == "interpolate" && obj[1][0] == "exponential" && obj[2] == "zoom") {
      let slice = obj.slice(3)
      let stops = []
      for (let i = 0; i < slice.length; i += 2) {
        stops.push([slice[i], slice[i + 1]])
      }
      return (z) => {
        return protomaps.exp(obj[1][1], stops)(z - 1)
      }
    } else if (obj[0] == "step" && obj[1][0] == "get") {
      let slice = obj.slice(2)
      let prop = obj[1][1]
      return (z, f) => {
        let val = f?.props[prop]
        if (typeof val === "number") {
          if (val < slice[1]) return slice[0]
          for (let i = 1; i < slice.length; i += 2) {
            if (val <= slice[i]) return slice[i + 1]
          }
        }
        return slice[slice.length - 1]
      }
    } else {
      console.log("Unimplemented numeric fn: ", obj)
      return (z) => 1
    }
  }

  function numberOrFn(obj, defaultValue = 0) {
    if (!obj) return defaultValue
    if (typeof obj == "number") {
      return obj
    }
    // If feature f is defined, use numberFn, otherwise use defaultValue
    return (z, f) => (f ? numberFn(obj)(z, f) : defaultValue)
  }

  function widthFn(width_obj, gap_obj) {
    let w = numberOrFn(width_obj, 1)
    let g = numberOrFn(gap_obj)
    return (z, f) => {
      let tmp = typeof w == "number" ? w : w(z, f)
      if (g) {
        return tmp + (typeof g == "number" ? g : g(z, f))
      }
      return tmp
    }
  }

  function getFont(obj) {
    let fontfaces = []
    if (obj["text-font"]) {
      for (let wanted_face of obj["text-font"]) {
        fontfaces.push({ face: wanted_face })
      }
    }
    if (fontfaces.length === 0) fontfaces.push({ face: "sans-serif" })

    const text_size = obj["text-size"]

    if (text_size) {
      if (typeof text_size == "number") {
        return (z) => `${text_size}px ${fontfaces.map((f) => f.face).join(", ")}`
      } else if (text_size.stops) {
        let base = 1.4
        if (text_size.base) base = text_size.base
        else text_size.base = base
        let t = numberFn(text_size)
        return (z, f) => {
          return `${t(z, f)}px ${fontfaces.map((f) => f.face).join(", ")}`
        }
      } else if (text_size[0] == "step") {
        let t = numberFn(text_size)
        return (z, f) => {
          return `${t(z, f)}px ${fontfaces.map((f) => f.face).join(", ")}`
        }
      }
    }

    return (z) => "12px Arial Bold"
  }

  //样式解析规则方法【重要】
  function json_style(obj, sheet) {
    let paint_rules = []
    let label_rules = []
    let refs = new Map()

    for (let layer of obj.layers) {
      refs.set(layer.id, layer)

      if (layer.layout && layer.layout.visibility == "none") {
        continue
      }

      if (layer.ref) {
        let referenced = refs.get(layer.ref)
        layer.type = referenced.type
        layer.filter = referenced.filter
        layer.source = referenced["source"]
        layer["source-layer"] = referenced["source-layer"]
      }

      let sourceLayer = layer["source-layer"]

      let filter = undefined
      if (layer.filter) {
        filter = filterFn(layer.filter)
      }

      // ignore background-color?
      if (layer.type == "fill") {
        const fillPattern = layer.paint["fill-pattern"]
        const fill = layer.paint["fill-color"]
        const opacity = layer.paint["fill-opacity"]
        let pattern
        if (fillPattern) {
          const patternInfor = sheet.get(fillPattern)
          const canvas = document.createElement("canvas")
          canvas.width = patternInfor.w
          canvas.height = patternInfor.h
          const ctx = canvas.getContext("2d")
          ctx.drawImage(sheet.canvas, patternInfor.x, patternInfor.y, patternInfor.w, patternInfor.h)
          pattern = canvas
        }
        // 填充面
        paint_rules.push({
          dataLayer: layer["source-layer"],
          filter: filter,
          symbolizer: new protomaps.PolygonSymbolizer({
            pattern,
            fill,
            opacity
          })
        })
      } else if (layer.type == "fill-extrusion") {
        // 用不同的填充来绘制填充挤出
        // simulate fill-extrusion with plain fill
        paint_rules.push({
          dataLayer: layer["source-layer"],
          filter: filter,
          symbolizer: new protomaps.PolygonSymbolizer({
            fill: layer.paint["fill-extrusion-color"],
            opacity: layer.paint["fill-extrusion-opacity"]
          })
        })
      } else if (layer.type == "line") {
        const lineColorInfor = layer.paint["line-color"]
        let lineColor
        if (lineColorInfor.stops) {
          lineColor = function (z, f) {
            const stops = lineColorInfor.stops
            const length = stops.length
            for (let i = length - 1; i >= 0; i--) {
              if (z < stops[i][0]) {
                return stops[i][1]
              }
            }
            return stops[length - 1][1]
          }
        } else {
          lineColor = lineColorInfor
        }
        // 线
        // simulate gap-width
        if (layer.paint["line-dasharray"]) {
          paint_rules.push({
            dataLayer: layer["source-layer"],
            filter: filter,
            symbolizer: new protomaps.LineSymbolizer({
              width: widthFn(layer.paint["line-width"], layer.paint["line-gap-width"]),
              dash: layer.paint["line-dasharray"],
              dashColor: lineColor
            })
          })
        } else {
          paint_rules.push({
            dataLayer: layer["source-layer"],
            filter: filter,
            symbolizer: new protomaps.LineSymbolizer({
              color: lineColor,
              width: widthFn(layer.paint["line-width"], layer.paint["line-gap-width"])
            })
          })
        }
      } else if (layer.type == "symbol") {
        let textField = layer.layout["text-field"]
        if (textField) {
          textField = textField.replace("{", "")
          textField = textField.replace("}", "")
        }
        if (layer.layout["symbol-placement"] == "line") {
          label_rules.push({
            dataLayer: layer["source-layer"],
            filter: filter,
            symbolizer: new protomaps.LineLabelSymbolizer({
              font: getFont(layer.layout),
              fill: layer.paint["text-color"],
              width: layer.paint["text-halo-width"],
              stroke: layer.paint["text-halo-color"],
              textTransform: layer.layout["text-transform"],
              label_props: textField ? [textField] : undefined
            })
          })
        } else if (layer.layout["icon-image"]) {
          label_rules.push({
            dataLayer: layer["source-layer"],
            filter: filter,
            symbolizer: new IconSymbolizer({
              name: layer.layout["icon-image"],
              sheet: sheet,
              fill: layer.paint["text-color"],
              stroke: layer.paint["text-halo-color"],
              width: layer.paint["text-halo-width"],
              label_props: textField ? [textField] : undefined
            })
          })
        } else {
          const textAnchor = layer.layout["text-anchor"]
          let justify
          switch (textAnchor) {
            case "left":
              justify = protomaps.Justify.Left
              break
            case "right":
              justify = protomaps.Justify.Right
              break
            case "center":
              justify = protomaps.Justify.Center
              break
          }
          label_rules.push({
            dataLayer: layer["source-layer"],
            filter: filter,
            symbolizer: new TextSymbolizer({
              font: getFont(layer.layout),
              fill: layer.paint["text-color"],
              stroke: layer.paint["text-halo-color"],
              width: layer.paint["text-halo-width"],
              textTransform: layer.layout["text-transform"],
              justify: justify,
              label_props: textField ? [textField] : undefined
            })
          })
        }
      } else if (layer.type == "circle") {
        // 圆
        paint_rules.push({
          dataLayer: layer["source-layer"],
          filter: filter,
          symbolizer: new protomaps.CircleSymbolizer({
            radius: layer.paint["circle-radius"],
            fill: layer.paint["circle-color"],
            stroke: layer.paint["circle-stroke-color"],
            width: layer.paint["circle-stroke-width"]
          })
        })
      }
    }

    label_rules.reverse()
    return { paint_rules: paint_rules, label_rules: label_rules, tasks: [] }
  }

  class ArcGISPbfImageryProvider {
    /**
     * ArcGIS矢量切片图层加载器
     * @constructor
     * @alias ArcGISPbfImageryProvider
     *
     * @param {Object} options 具有以下参数的对象
     * @param {string} options.url ArcGIS矢量切片图层服务地址
     * @param {string} options.styleUrl ArcGIS矢量切片图层服务样式地址
     * @param {number} [options.minimumLevel=0] 最小显示层级
     * @param {number} [options.maximumLevel=26] 最大显示层级
     * @param {number} [options.maximumNativeLevel=26] 矢量切片的最大切片层级
     * @param {Cesium.Rectangle} [options.rectangle] 显示范围
     */
    constructor(options) {
      options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT)

      this._url = options.url

      this._tileWidth = tileSize
      this._tileHeight = tileSize
      this._minimumLevel = Cesium.defaultValue(options.minimumLevel, 0)
      this._maximumLevel = Cesium.defaultValue(options.maximumLevel, 26)
      this._maximumNativeLevel = Cesium.defaultValue(options.maximumNativeLevel, this._maximumLevel)

      this._tilingScheme = options.tilingScheme || new Cesium.WebMercatorTilingScheme()

      this._rectangle = Cesium.defaultValue(options.rectangle, this._tilingScheme.rectangle)

      this._ready = false
      this._readyPromise = Cesium.defer()

      const labelersCanvasContext = document.createElement("canvas").getContext("2d")

      this._paintRules = []
      this._labelRules = []

      // 加载style文件
      const styleResource = new Cesium.Resource(options.styleUrl)
      styleResource.fetchJson()?.then((styleJson) => {
        if (styleJson?.sources?.esri?.url) {
          this._url = styleJson.sources.esri.url
        }

        // 如果存在范围，则设置范围
        const bounds = styleJson.sources?.esri?.bounds
        if (bounds && !Cesium.defined(options.rectangle)) {
          // 如果服务中存在 rectangle 但是没传入 rectangle 则使用服务中定义的
          this._rectangle = Cesium.Rectangle.fromDegrees(bounds[0], bounds[1], bounds[2], bounds[3])
        }

        const spritePNGResource = styleResource.getDerivedResource({
          url: `${styleJson.sprite}.png`
        })

        const spriteJsonResource = styleResource.getDerivedResource({
          url: `${styleJson.sprite}.json`
        })

        const image = new Image()
        image.crossOrigin = "Anonymous"
        image.onload = () => {
          // 加载精灵图
          const spriteCanvas = document.createElement("canvas")
          spriteCanvas.width = image.width
          spriteCanvas.height = image.height
          const spriteCtx = spriteCanvas.getContext("2d")
          spriteCtx.drawImage(image, 0, 0, image.width, image.height)

          spriteJsonResource.fetchJson()?.then((spriteIndex) => {
            const sheet = new MarsSheet(spriteIndex, spriteCanvas)
            this._ready = true
            const rules = json_style(styleJson, sheet)
            this._labelRules = rules.label_rules
            this._paintRules = rules.paint_rules
            this._labelers = new protomaps.Labelers(labelersCanvasContext, this._labelRules, 32, () => undefined)
          })
        }
        image.src = spritePNGResource.url
      })

      this._source = new protomaps.ZxySource(this._url + ArcGISPbfImageryProviderRequestTrailer, false)
      let cache = new protomaps.TileCache(this._source, 1024)
      this._view = new protomaps.View(cache, this._maximumNativeLevel, 2)

      this.pickFeaturesEvent = new Cesium.Event()
    }

    /**
     * 图层服务的url
     * @type {String}
     * @readonly
     */
    get url() {
      return this._url
    }

    /**
     * 单块瓦片的宽度
     * @type {Number}
     * @readonly
     */
    get tileWidth() {
      return this._tileWidth
    }

    /**
     * 单块瓦片的高度
     * @type {Number}
     * @readonly
     */
    get tileHeight() {
      return this._tileHeight
    }

    /**
     * 最大显示层级
     * @type {Number}
     * @readonly
     */
    get maximumLevel() {
      return this._maximumLevel
    }

    /**
     * 最小显示层级
     * @type {Number}
     * @readonly
     */
    get minimumLevel() {
      return this._minimumLevel
    }

    /**
     * 矢量切片的最大加载层级
     * @type {Number}
     * @readonly
     */
    get maximumNativeLevel() {
      return this._maximumNativeLevel
    }

    /**
     * 当前使用的切片方案
     * @type {Cesium.GeographicTilingScheme}
     * @readonly
     */
    get tilingScheme() {
      return this._tilingScheme
    }

    /**
     * 显示范围
     * @type {Cesium.Rectangle}
     * @readonly
     */
    get rectangle() {
      return this._rectangle
    }

    /**
     * 是否准备完成
     * @type {Boolean}
     * @readonly
     */
    get ready() {
      return this._ready
    }

    get readyPromise() {
      return this._readyPromise.promise
    }

    get hasAlphaChannel() {
      return true
    }

    get credit() {
      return this._credit
    }

    /**
     * Requests the image for a given tile.  This function should
     * not be called before {@link ArcGISPbfImageryProvider#ready} returns true.
     *
     * @param {Number} x The tile X coordinate.
     * @param {Number} y The tile Y coordinate.
     * @param {Number} level The tile level.
     * @returns {Promise.<ImageryTypes>|undefined} A promise for the image that will resolve when the image is available, or
     *          undefined if there are too many active requests to the server, and the request should be retried later.
     *
     * @exception {DeveloperError} <code>requestImage</code> must not be called before the imagery provider is ready.
     */
    requestImage(x, y, level) {
      const canvas = document.createElement("canvas")
      canvas.width = this.tileWidth
      canvas.height = this.tileHeight
      try {
        return this._renderTile({ x, y, z: level }, canvas)
      } catch (e) {
        return Promise.resolve(canvas)
      }
    }

    _renderTile(coords, canvas) {
      return this._view.getDisplayTile(coords).then((tile) => {
        const tileMap = new Map().set("", [tile])

        this._labelers.add(coords.z, tileMap)

        let labelData = this._labelers.getIndex(tile.z)

        const bbox = {
          minX: 256 * coords.x - BUF,
          minY: 256 * coords.y - BUF,
          maxX: 256 * (coords.x + 1) + BUF,
          maxY: 256 * (coords.y + 1) + BUF
        }
        const origin = new MarsPoint(256 * coords.x, 256 * coords.y)

        const ctx = canvas.getContext("2d")
        ctx.setTransform(this._tileWidth / 256, 0, 0, this._tileWidth / 256, 0, 0)
        ctx.clearRect(0, 0, 256, 256)

        if (labelData) {
          protomaps.painter(ctx, coords.z, tileMap, labelData, this._paintRules, bbox, origin, false, "")
        }
        return canvas
      })
    }

    pickFeatures(x, y, zoom, longitude, latitude) {
      //目前不支持鼠标单击拾取，如果需要，需要此处加解析代码
    }
  }

  class ArcGISPbfLayer extends mars3d.layer.BaseTileLayer {
    //构建ImageryProvider
    async _createImageryProvider(options) {
      return createImageryProvider(options)
    }
  }

  async function createImageryProvider(options) {
    return new ArcGISPbfImageryProvider(options)
  }
  ArcGISPbfLayer.createImageryProvider = createImageryProvider

  //注册下
  const layerType = "arcgis-pbf" //图层类型
  mars3d.LayerUtil.register(layerType, ArcGISPbfLayer)
  mars3d.LayerUtil.registerImageryProvider(layerType, createImageryProvider)

  //对外接口
  window.ArcGISPbfImageryProvider = ArcGISPbfImageryProvider
  window.ArcGISPbfLayer = ArcGISPbfLayer
})(window)

//  { ArcGISPbfLayer }
