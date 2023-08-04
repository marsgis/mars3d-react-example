//按mars3d规范，将CesiumVectorTile封装下

// import * as mars3d from "mars3d"

;(function (window) {
  class WeiVectorTileLayer extends mars3d.layer.BaseTileLayer {
    //构建ImageryProvider
    async _createImageryProvider(options) {
      return createImageryProvider(options)
    }
  }
  async function createImageryProvider(options) {
    let provider = new CesiumVectorTile.VectorTileImageryProvider(options) //CesiumVectorTile.js中
    await provider.readyPromise
    return provider
  }
  WeiVectorTileLayer.createImageryProvider = createImageryProvider

  //注册下
  const layerType = "weiVectorTile" //图层类型
  mars3d.LayerUtil.register(layerType, WeiVectorTileLayer)
  mars3d.LayerUtil.registerImageryProvider(layerType, createImageryProvider)

  //对外接口
  mars3d.layer.WeiVectorTileLayer = WeiVectorTileLayer
})(window)

// export { WeiVectorTileLayer }
