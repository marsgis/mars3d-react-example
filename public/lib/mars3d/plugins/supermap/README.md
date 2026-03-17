# mars3d-plugin-supermap

Mars3D平台插件, 结合supermap超图库使用的功能插件
  

## mars3d与超图的融合有2个方式

### 方式1：原生Cesium库+s3m插件
 mars3d(含Cesium) + s3m独立插件 + mars3d-supermap，需要引入的资源为：
```js
"mars3d": [
  "Cesium/Widgets/widgets.css", //原生Cesium
  "Cesium/Cesium.js",
  "turf/turf.min.js",
  "mars3d/mars3d.css", //mars3d
  "mars3d/mars3d.js",
  "mars3d/plugins/supermap/SuperMap3D.js", //s3m支持原生cesium的独立插件，参考 https://github.com/SuperMap/iClient3D-for-WebGL
  "mars3d/plugins/supermap/mars3d-supermap.js",//mars3d-supermap简化调用封装
],
```
更多参考mars3d功能示例中[S3M图层示例](https://mars3d.cn/editor-vue.html?id=layer-other/s3m/basis)

#### 此方式的特别说明
经过测试，[SuperMap3D](https://github.com/SuperMap/iClient3D-for-WebGL/tree/main/Cesium_S3MLayer_Plugins/S3MTilesLayer)插件代码不是最新的，超图官网API很多在此插件中都没有。



### 方式2：需要替换Cesium库
超图版本Cesium + mars3d + mars3d-supermap ，需要引入的资源为：
```js
"mars3d": [
  "Cesium-supermap/Widgets/widgets.css", //超图版本Cesium 
  "Cesium-supermap/Cesium.js",
  "mars3d/plugins/compatible/cesium-version.js", //cesium版本兼容处理
  "turf/turf.min.js",
  "mars3d/mars3d.css", //mars3d
  "mars3d/mars3d.js",
  "mars3d/plugins/supermap/mars3d-supermap.js",//mars3d-supermap简化调用封装
],
```
相关示例和项目可以访问：[https://github.com/marsgis/mars3d-link-supermap](https://github.com/marsgis/mars3d-link-supermap/)
 
 
#### 此方式的特别说明
 不是所有功能都可以正常用，因为：

- 使用的是超图版Cesium，所以mars3d-cesium的所有修改都无效，影响到wfs、模型编辑、地形编辑等功能(可以用超图的相关API来替代实现)
- 超图Cesium修改了地球的默认参数，造成3dtiles加载位置偏差很大。




 
## 相关依赖 
 超图版Cesium、mars3d
 
## 查看源码
  https://github.com/marsgis/mars3d-plugin/
 


## Mars3D 是什么 
>  `Mars3D三维地球平台软件` 是一款基于 WebGL 技术实现的三维客户端开发平台，基于[Cesium](https://cesium.com/cesiumjs/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。


## 相关网站 

- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- GitHub地址：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
