!function(f, F) {
  'object' == typeof exports && 'object' == typeof module ? module['exports'] = F(require('@quickearth/core'), require('cesium')) : 'function' == typeof define && define['amd'] ? define(['@quickearth/core', 'cesium'], F) : 'object' == typeof exports ? exports['QEC'] = F(require('@quickearth/core'), require('cesium')) : f['QEC'] = F(f['QE'], f['Cesium']);
}(self, (f,F)=>(()=>{
  'use strict';
  var d = {
      0x38d: v=>{
          v['exports'] = F;
      }
      ,
      0x1e9: v=>{
          v['exports'] = f;
      }
  }
    , b = {};
  function w(v) {
      var K = b[v];
      if (undefined !== K)
          return K['exports'];
      var J = b[v] = {
          'exports': {}
      };
      return d[v](J, J['exports'], w),
      J['exports'];
  }
  w['d'] = (v,K)=>{
      for (var J in K)
          w['o'](K, J) && !w['o'](v, J) && Object['defineProperty'](v, J, {
              'enumerable': true,
              'get': K[J]
          });
  }
  ,
  w['o'] = (v,K)=>Object['prototype']['hasOwnProperty']['call'](v, K),
  w['r'] = v=>{
      'undefined' != typeof Symbol && Symbol['toStringTag'] && Object['defineProperty'](v, Symbol['toStringTag'], {
          'value': 'Module'
      }),
      Object['defineProperty'](v, '__esModule', {
          'value': true
      });
  }
  ;
  var Q = {};
  return (()=>{
      w['r'](Q),
      w['d'](Q, {
          'CCSLayer': ()=>CCSLayer,
          'CFixedPlane': ()=>CFixedPlane,
          'CGeoJSONLayer': ()=>CGeoJSONLayer,
          'CGeometryLayer': ()=>CGeometryLayer,
          'CGroundLayer': ()=>CGroundLayer,
          'CPixelLayer': ()=>CPixelLayer,
          'CPointImageLayer': ()=>CPointImageLayer,
          'CSectionLayer': ()=>CSectionLayer,
          'CTracingService': ()=>CTracingService,
          'CView': ()=>CView,
          'CVolumeLayer': ()=>CVolumeLayer,
          'CWindArrowLayer': ()=>CWindArrowLayer,
          'CWindLayer': ()=>CWindLayer,
          'cColor': ()=>cColor,
          'createCTileLayer': ()=>createCTileLayer,
          'mcbGeometryLayerCreator': ()=>mcbGeometryLayerCreator,
          'mcbLayerCreator': ()=>mcbLayerCreator
      });
      var K = w(0x1e9)
        , J = w(0x38d);
      class CView extends J['Viewer'] {
          constructor(fp, fR) {
              const fm = (0x0,
              K['setOptions'])({}, fR, CView['DefaultOptions']);
              true !== K['consts']['useWebGL2'] && (fm['contextOptions'] = fm['contextOptions'] || {},
              fm['contextOptions']['requestWebgl1'] = true),
              fm['defaultRect'] && (J['Camera']['DEFAULT_VIEW_RECTANGLE'] = J['Rectangle']['fromDegrees'](fm['defaultRect']['west'], fm['defaultRect']['south'], fm['defaultRect']['east'], fm['defaultRect']['north'])),
              fm['betterStars'] && (fm['skyBox'] = new J['SkyBox']({
                  'sources': {
                      'positiveX': K['consts']['resourcePath'] + '/libs/cesium/skybox_px.webp',
                      'negativeX': K['consts']['resourcePath'] + '/libs/cesium/skybox_mx.webp',
                      'positiveY': K['consts']['resourcePath'] + '/libs/cesium/skybox_py.webp',
                      'negativeY': K['consts']['resourcePath'] + '/libs/cesium/skybox_my.webp',
                      'positiveZ': K['consts']['resourcePath'] + '/libs/cesium/skybox_pz.webp',
                      'negativeZ': K['consts']['resourcePath'] + '/libs/cesium/skybox_mz.webp'
                  }
              })),
              fm['scene3DOnly'] = true,
              'zkxt' === fm['defaultTerrain'] ? J['CesiumTerrainProvider']['fromUrl']('https://tiles1.geovisearth.com/base/v1/terrain?token=' + K['preDeinfedImageTileTokens']['zkxt'])['then'](fe=>{
                  this['terrainProvider'] = fe;
              }
              ) : 'cesium' === fm['defaultTerrain'] && (0x0,
              J['createWorldTerrainAsync'])()['then'](fe=>{
                  this['terrainProvider'] = fe;
              }
              ),
              super(fp, fm);
              const fH = this['scene']['pick']['bind'](this['scene']);
              this['scene']['pick'] = (...fe)=>{
                  try {
                      return fH(...fe);
                  } catch (fA) {}
              }
              ,
              this['options'] = fm,
              this['toolService'] = new K['MapToolService'](this),
              this['cameraHeightChanged'] = new J['Event'](),
              this['setTouchHandler'](),
              this['addInitialPrimitiveLayers'](),
              this['setInitialTileLayers'](),
              this['options']['showGroundAtmosphere'] || (this['scene']['globe']['showGroundAtmosphere'] = false),
              this['handleCameraChange'](),
              this['scene']['viewer'] = this;
          }
          ['lookAt'](fp, fR, fm, fH) {
              var fe, fA;
              this['camera']['lookAt'](J['Cartesian3']['fromDegrees'](fp, fR), {
                  'heading': J['Math']['toRadians'](null !== (fe = null == fH ? undefined : fH['heading']) && undefined !== fe ? fe : 0x0),
                  'pitch': J['Math']['toRadians'](null !== (fA = null == fH ? undefined : fH['pitch']) && undefined !== fA ? fA : 0x0),
                  'range': null != fm ? fm : 0x0
              });
          }
          ['goto'](fp, fR, fm, fH) {
              return fe = this,
              fA = undefined,
              fx = function*() {
                  return new Promise((fB,fM)=>{
                      var fl, fX;
                      this['camera']['flyToBoundingSphere'](new J['BoundingSphere'](J['Cartesian3']['fromDegrees'](fp, fR)), {
                          'offset': {
                              'heading': J['Math']['toRadians'](null !== (fl = null == fH ? undefined : fH['heading']) && undefined !== fl ? fl : 0x0),
                              'pitch': J['Math']['toRadians'](null !== (fX = null == fH ? undefined : fH['pitch']) && undefined !== fX ? fX : -0x5a),
                              'range': fm
                          },
                          'complete': ()=>{
                              fB();
                          }
                          ,
                          'duration': null == fH ? undefined : fH['duration'],
                          'easingFunction': null == fH ? undefined : fH['easing']
                      });
                  }
                  );
              }
              ,
              new ((fI = undefined) || (fI = Promise))(function(fB, fM) {
                  function fl(fO) {
                      try {
                          fE(fx['next'](fO));
                      } catch (F0) {
                          fM(F0);
                      }
                  }
                  function fX(fO) {
                      try {
                          fE(fx['throw'](fO));
                      } catch (F0) {
                          fM(F0);
                      }
                  }
                  function fE(fO) {
                      var F0;
                      fO['done'] ? fB(fO['value']) : (F0 = fO['value'],
                      F0 instanceof fI ? F0 : new fI(function(F1) {
                          F1(F0);
                      }
                      ))['then'](fl, fX);
                  }
                  fE((fx = fx['apply'](fe, fA || []))['next']());
              }
              );
              var fe, fA, fI, fx;
          }
          ['getCameraHeight']() {
              const fp = this['scene']['camera']['positionWC']
                , fR = this['scene']['globe']['ellipsoid']['scaleToGeodeticSurface'](fp);
              return J['Cartesian3']['magnitude'](J['Cartesian3']['subtract'](fp, fR, new J['Cartesian3']()));
          }
          get['cameraHeight']() {
              return J['Cartographic']['fromCartesian'](this['camera']['position'])['height'];
          }
          ['setView'](fp, fR, fm, fH, fe, fA) {
              this['camera']['cancelFlight'](),
              fp = J['Math']['toRadians'](fp),
              fR = J['Math']['toRadians'](fR),
              (0x0,
              J['defined'])(fm) && (fH = this['calcAltitudeForZoom'](this['canvas'], this['camera']['frustum']['fovy'], fm, fp));
              var fI = null != fH ? fH : this['getPos']()[0x2]
                , fx = null != fe ? fe : this['getHeading']()
                , fB = null != fA ? fA : this['getTilt']();
              this['setPosHeadingAndTilt'](fp, fR, fI, fx, fB);
          }
          ['getZoom']() {
              var fp = this['getPos']();
              return this['calcZoomForAltitude'](this['canvas'], this['camera']['frustum']['fovy'], fp[0x2], fp[0x0]);
          }
          ['getCenterLonLat']() {
              const fp = this['getPos']();
              return [J['Math']['toDegrees'](fp[0x1]), J['Math']['toDegrees'](fp[0x0])];
          }
          ['calcAltitudeForZoom'](fp, fR, fm, fH) {
              var fe = 0.7 * fp['height'] / 0x100
                , fA = 0x2 * Math['cos'](Math['abs'](fH)) * Math['PI'] / Math['pow'](0x2, fm) * fe;
              return 0x1 / Math['tan'](fR / 0x2) * (fA / 0x2) * 0x615299;
          }
          ['calcZoomForAltitude'](fp, fR, fm, fH) {
              var fe = 0.7 * fp['height'] / 0x100
                , fA = fm / 0x615299 * 0x2 * Math['tan'](fR / 0x2) / fe
                , fI = 0x2 * Math['cos'](Math['abs'](fH)) * Math['PI'];
              return Math['log'](fI / fA) / Math['LN2'];
          }
          ['getTilt']() {
              var fp = this['camera']
                , fR = fp['positionWC'];
              return -Math['acos'](J['Cartesian3']['dot'](fp['up'], J['Cartesian3']['normalize'](fR, new J['Cartesian3']()))) + Math['PI'] / 0x2;
          }
          ['getPos']() {
              var fp = new J['Cartographic'](0x0,0x0,0x0);
              return J['Cartographic']['fromCartesian'](this['camera']['position'], undefined, fp),
              [fp['latitude'], fp['longitude'], fp['height']];
          }
          ['getHeading']() {
              var fp = this['camera']
                , fR = fp['positionWC']
                , fm = new J['Cartesian3'](-fR['y'],fR['x'],0x0)
                , fH = J['Cartesian3']['angleBetween'](fp['right'], fm);
              return J['Cartesian3']['cross'](fR, fp['up'], new J['Cartesian3']())['z'] < 0x0 ? fH : -fH;
          }
          ['setPosHeadingAndTilt'](fp, fR, fm, fH, fe) {
              var fA = J['Cartesian3']['fromRadians'](fR, fp, fm);
              this['camera']['setView']({
                  'destination': fA,
                  'orientation': {
                      'heading': 0x0,
                      'pitch': -Math['PI'] / 0x2,
                      'roll': 0x0
                  }
              }),
              this['camera']['twistLeft'](fH),
              this['camera']['lookUp'](fe);
          }
          ['handleCameraChange']() {
              if (!this['options']['handleCameraChange'])
                  return;
              let fp, fR;
              this['scene']['camera']['moveStart']['addEventListener'](()=>{
                  this['_moving'] = true;
              }
              ),
              this['scene']['camera']['moveEnd']['addEventListener'](()=>{
                  this['_moving'] = false,
                  this['_heightChanged'] > -0x1 && (this['cameraHeightChanged']['raiseEvent'](this['_heightChanged']),
                  this['_heightChanged'] = -0x1);
              }
              ),
              this['scene']['camera']['changed']['addEventListener'](()=>{
                  fR || (fR = this['getCameraHeight']()),
                  fp && clearTimeout(fp),
                  fp = setTimeout(()=>{
                      const fm = this['getCameraHeight']()
                        , fH = Math['abs'](fm - fR);
                      if (fH > 0x1388) {
                          if (this['_moving'])
                              return void (this['_heightChanged'] = fm);
                          this['cameraHeightChanged']['raiseEvent'](fm),
                          K['logger']['debug']('height\x20changed:' + fH);
                      }
                      fR = undefined,
                      fp = undefined;
                  }
                  , 0x12c);
              }
              );
          }
          ['addInitialPrimitiveLayers']() {
              this['scene']['primitives']['add'](this['baseMapLayers'] = new J['PrimitiveCollection']()),
              this['scene']['primitives']['add'](this['gridLayers'] = new J['PrimitiveCollection']()),
              this['scene']['primitives']['add'](this['contourLayers'] = new J['PrimitiveCollection']()),
              this['scene']['primitives']['add'](this['topMapLayers'] = new J['PrimitiveCollection']()),
              this['scene']['primitives']['add'](this['featureLayers'] = new J['PrimitiveCollection']()),
              this['scene']['primitives']['add'](this['markerLayers'] = new J['PrimitiveCollection']()),
              this['scene']['primitives']['add'](this['topMostLayers'] = new J['PrimitiveCollection']()),
              this['scene']['groundPrimitives']['add'](this['groundLayers'] = new J['PrimitiveCollection']());
          }
          ['setInitialTileLayers']() {
              if (this['options']['defaultTiles'] && 0x0 !== this['options']['defaultTiles']['length']) {
                  this['scene']['imageryLayers']['removeAll']();
                  for (const fp of this['options']['defaultTiles']) {
                      let fR = fp;
                      'string' == typeof fp && (fR = (0x0,
                      K['getImageTileUrls'])(fp));
                      const fm = new J['UrlTemplateImageryProvider'](fR);
                      this['scene']['imageryLayers']['addImageryProvider'](fm);
                  }
              }
          }
          ['setTouchHandler']() {
              const fp = this['scene']['screenSpaceCameraController']
                , fR = fp['tiltEventTypes']['indexOf'](J['CameraEventType']['MIDDLE_DRAG']);
              fp['tiltEventTypes']['splice'](fR, 0x1),
              fp['tiltEventTypes']['push'](J['CameraEventType']['RIGHT_DRAG']);
              const fm = fp['zoomEventTypes']['indexOf'](J['CameraEventType']['RIGHT_DRAG']);
              fp['zoomEventTypes']['splice'](fm, 0x1);
          }
          ['addLayerByConfig'](fp) {
              throw new Error('Method\x20not\x20implemented.');
          }
      }
      CView['DefaultOptions'] = {
          'baseLayerPicker': false,
          'timeline': false,
          'navigationHelpButton': false,
          'infoBox': false,
          'creditContainer': 'credit',
          'geocoder': false,
          'fullscreenButton': false,
          'selectionIndicator': false,
          'navigationInstructionsInitiallyVisible': false,
          'animation': false,
          'defaultRect': {
              'west': 0x46,
              'east': 0x8c,
              'south': 0xf,
              'north': 0x37
          },
          'defaultTiles': [K['predefinedImageTiles']['tdtSatellite']],
          'showGroundAtmosphere': false,
          'handleCameraChange': true
      };
      var f1 = 6371008.8
        , f2 = {
          'centimeters': 0x25f96350,
          'centimetres': 0x25f96350,
          'degrees': 57.22891354143274,
          'feet': 20902260.511392,
          'inches': 39.37 * f1,
          'kilometers': 6371.0088,
          'kilometres': 6371.0088,
          'meters': f1,
          'metres': f1,
          'miles': 3958.761333810546,
          'millimeters': 0x17bbde120,
          'millimetres': 0x17bbde120,
          'nauticalmiles': f1 / 0x73c,
          'radians': 0x1,
          'yards': 6967335.223679999
      };
      function f3(fp, fR, fm) {
          undefined === fm && (fm = {});
          var fH = {
              'type': 'Feature'
          };
          return (0x0 === fm['id'] || fm['id']) && (fH['id'] = fm['id']),
          fm['bbox'] && (fH['bbox'] = fm['bbox']),
          fH['properties'] = fR || {},
          fH['geometry'] = fp,
          fH;
      }
      function f4(fp, fR, fm) {
          if (undefined === fm && (fm = {}),
          !fp)
              throw new Error('coordinates\x20is\x20required');
          if (!Array['isArray'](fp))
              throw new Error('coordinates\x20must\x20be\x20an\x20Array');
          if (fp['length'] < 0x2)
              throw new Error('coordinates\x20must\x20be\x20at\x20least\x202\x20numbers\x20long');
          if (!f8(fp[0x0]) || !f8(fp[0x1]))
              throw new Error('coordinates\x20must\x20contain\x20numbers');
          return f3({
              'type': 'Point',
              'coordinates': fp
          }, fR, fm);
      }
      function f5(fp, fR, fm) {
          if (undefined === fm && (fm = {}),
          fp['length'] < 0x2)
              throw new Error('coordinates\x20must\x20be\x20an\x20array\x20of\x20two\x20or\x20more\x20positions');
          return f3({
              'type': 'LineString',
              'coordinates': fp
          }, fR, fm);
      }
      function f6(fp) {
          return fp % (0x2 * Math['PI']) * 0xb4 / Math['PI'];
      }
      function f7(fp) {
          return fp % 0x168 * Math['PI'] / 0xb4;
      }
      function f8(fp) {
          return !isNaN(fp) && null !== fp && !Array['isArray'](fp);
      }
      function f9(fp) {
          return !!fp && fp['constructor'] === Object;
      }
      function ff(fp, fR, fm) {
          if (null !== fp)
              for (var fH, fe, fA, fI, fx, fB, fM, fl, fX = 0x0, fE = 0x0, fO = fp['type'], F0 = 'FeatureCollection' === fO, F1 = 'Feature' === fO, F2 = F0 ? fp['features']['length'] : 0x1, F3 = 0x0; F3 < F2; F3++) {
                  fx = (fl = !!(fM = F0 ? fp['features'][F3]['geometry'] : F1 ? fp['geometry'] : fp) && 'GeometryCollection' === fM['type']) ? fM['geometries']['length'] : 0x1;
                  for (var F4 = 0x0; F4 < fx; F4++) {
                      var F5 = 0x0
                        , F6 = 0x0;
                      if (null !== (fI = fl ? fM['geometries'][F4] : fM)) {
                          fB = fI['coordinates'];
                          var F7 = fI['type'];
                          switch (fX = !fm || 'Polygon' !== F7 && 'MultiPolygon' !== F7 ? 0x0 : 0x1,
                          F7) {
                          case null:
                              break;
                          case 'Point':
                              if (false === fR(fB, fE, F3, F5, F6))
                                  return false;
                              fE++,
                              F5++;
                              break;
                          case 'LineString':
                          case 'MultiPoint':
                              for (fH = 0x0; fH < fB['length']; fH++) {
                                  if (false === fR(fB[fH], fE, F3, F5, F6))
                                      return false;
                                  fE++,
                                  'MultiPoint' === F7 && F5++;
                              }
                              'LineString' === F7 && F5++;
                              break;
                          case 'Polygon':
                          case 'MultiLineString':
                              for (fH = 0x0; fH < fB['length']; fH++) {
                                  for (fe = 0x0; fe < fB[fH]['length'] - fX; fe++) {
                                      if (false === fR(fB[fH][fe], fE, F3, F5, F6))
                                          return false;
                                      fE++;
                                  }
                                  'MultiLineString' === F7 && F5++,
                                  'Polygon' === F7 && F6++;
                              }
                              'Polygon' === F7 && F5++;
                              break;
                          case 'MultiPolygon':
                              for (fH = 0x0; fH < fB['length']; fH++) {
                                  for (F6 = 0x0,
                                  fe = 0x0; fe < fB[fH]['length']; fe++) {
                                      for (fA = 0x0; fA < fB[fH][fe]['length'] - fX; fA++) {
                                          if (false === fR(fB[fH][fe][fA], fE, F3, F5, F6))
                                              return false;
                                          fE++;
                                      }
                                      F6++;
                                  }
                                  F5++;
                              }
                              break;
                          case 'GeometryCollection':
                              for (fH = 0x0; fH < fI['geometries']['length']; fH++)
                                  if (false === ff(fI['geometries'][fH], fR, fm))
                                      return false;
                              break;
                          default:
                              throw new Error('Unknown\x20Geometry\x20Type');
                          }
                      }
                  }
              }
      }
      function fF(fp, fR) {
          !function(fm, fH) {
              var fe, fA, fI, fx, fB, fM, fl, fX, fE, fO, F0 = 0x0, F1 = 'FeatureCollection' === fm['type'], F2 = 'Feature' === fm['type'], F3 = F1 ? fm['features']['length'] : 0x1;
              for (fe = 0x0; fe < F3; fe++) {
                  for (fM = F1 ? fm['features'][fe]['geometry'] : F2 ? fm['geometry'] : fm,
                  fX = F1 ? fm['features'][fe]['properties'] : F2 ? fm['properties'] : {},
                  fE = F1 ? fm['features'][fe]['bbox'] : F2 ? fm['bbox'] : undefined,
                  fO = F1 ? fm['features'][fe]['id'] : F2 ? fm['id'] : undefined,
                  fB = (fl = !!fM && 'GeometryCollection' === fM['type']) ? fM['geometries']['length'] : 0x1,
                  fI = 0x0; fI < fB; fI++)
                      if (null !== (fx = fl ? fM['geometries'][fI] : fM))
                          switch (fx['type']) {
                          case 'Point':
                          case 'LineString':
                          case 'MultiPoint':
                          case 'Polygon':
                          case 'MultiLineString':
                          case 'MultiPolygon':
                              if (false === fH(fx, F0, fX, fE, fO))
                                  return false;
                              break;
                          case 'GeometryCollection':
                              for (fA = 0x0; fA < fx['geometries']['length']; fA++)
                                  if (false === fH(fx['geometries'][fA], F0, fX, fE, fO))
                                      return false;
                              break;
                          default:
                              throw new Error('Unknown\x20Geometry\x20Type');
                          }
                      else {
                          if (false === fH(null, F0, fX, fE, fO))
                              return false;
                      }
                  F0++;
              }
          }(fp, function(fm, fH, fe, fA, fI) {
              var fx, fB = null === fm ? null : fm['type'];
              switch (fB) {
              case null:
              case 'Point':
              case 'LineString':
              case 'Polygon':
                  return false !== fR(f3(fm, fe, {
                      'bbox': fA,
                      'id': fI
                  }), fH, 0x0) && undefined;
              }
              switch (fB) {
              case 'MultiPoint':
                  fx = 'Point';
                  break;
              case 'MultiLineString':
                  fx = 'LineString';
                  break;
              case 'MultiPolygon':
                  fx = 'Polygon';
              }
              for (var fM = 0x0; fM < fm['coordinates']['length']; fM++) {
                  var fl = fm['coordinates'][fM];
                  if (false === fR(f3({
                      'type': fx,
                      'coordinates': fl
                  }, fe), fH, fM))
                      return false;
              }
          });
      }
      class fd {
          constructor(fp) {
              this['_sampler'] = undefined,
              this['_destroyed'] = false,
              this['copyFrom'] = ()=>{
                  K['logger']['error']('暂未实现！');
              }
              ,
              this['copyFromFramebuffer'] = ()=>{
                  K['logger']['error']('暂未实现！');
              }
              ,
              this['generateMipmap'] = ()=>{
                  K['logger']['error']('暂未实现！');
              }
              ,
              this['isDestroyed'] = ()=>this['_destroyed'],
              this['destroy'] = ()=>(this['_context']['_gl']['deleteTexture'](this['_texture']),
              this['_destroyed'] = true,
              (0x0,
              J['destroyObject'])(this)),
              fp = (0x0,
              J['defaultValue'])(fp, J['defaultValue']['EMPTY_OBJECT']),
              J['Check']['defined']('options.context', fp['context']);
              var fR = fp['context']
                , fm = fp['width']
                , fH = fp['height'];
              const fe = fp['depth'];
              var fA = fp['source']
                , fI = (0x0,
              J['defaultValue'])(fp['pixelFormat'], J['PixelFormat']['R'])
                , fx = (0x0,
              J['defaultValue'])(fp['pixelDatatype'], J['PixelDatatype']['FLOAT'])
                , fB = J['PixelFormat']['toInternalFormat'](fI, fx, fR);
              if (!(0x0,
              J['defined'])(fm) || !(0x0,
              J['defined'])(fH))
                  throw new J['DeveloperError']('options\x20requires\x20a\x20source\x20field\x20to\x20create\x20an\x20initialized\x20texture\x20or\x20width\x20and\x20height\x20fields\x20to\x20create\x20a\x20blank\x20texture.');
              if (J['Check']['typeOf']['number']['greaterThan']('width', fm, 0x0),
              fm > J['ContextLimits']['maximumTextureSize'])
                  throw new J['DeveloperError']('Width\x20must\x20be\x20less\x20than\x20or\x20equal\x20to\x20the\x20maximum\x20texture\x20size\x20(' + J['ContextLimits']['maximumTextureSize'] + ').\x20\x20Check\x20maximumTextureSize.');
              if (J['Check']['typeOf']['number']['greaterThan']('height', fH, 0x0),
              fH > J['ContextLimits']['maximumTextureSize'])
                  throw new J['DeveloperError']('Height\x20must\x20be\x20less\x20than\x20or\x20equal\x20to\x20the\x20maximum\x20texture\x20size\x20(' + J['ContextLimits']['maximumTextureSize'] + ').\x20\x20Check\x20maximumTextureSize.');
              if (!J['PixelFormat']['validate'](fI))
                  throw new J['DeveloperError']('Invalid\x20options.pixelFormat.');
              if (!J['PixelDatatype']['validate'](fx))
                  throw new J['DeveloperError']('Invalid\x20options.pixelDatatype.');
              if (fI === J['PixelFormat']['DEPTH_COMPONENT'] && fx !== J['PixelDatatype']['UNSIGNED_SHORT'] && fx !== J['PixelDatatype']['UNSIGNED_INT'])
                  throw new J['DeveloperError']('When\x20options.pixelFormat\x20is\x20DEPTH_COMPONENT,\x20options.pixelDatatype\x20must\x20be\x20UNSIGNED_SHORT\x20or\x20UNSIGNED_INT.');
              if (fI === J['PixelFormat']['DEPTH_STENCIL'] && fx !== J['PixelDatatype']['UNSIGNED_INT_24_8'])
                  throw new J['DeveloperError']('When\x20options.pixelFormat\x20is\x20DEPTH_STENCIL,\x20options.pixelDatatype\x20must\x20be\x20UNSIGNED_INT_24_8.');
              if (fx === J['PixelDatatype']['FLOAT'] && !fR['floatingPointTexture'])
                  throw new J['DeveloperError']('When\x20options.pixelDatatype\x20is\x20FLOAT,\x20this\x20WebGL\x20implementation\x20must\x20support\x20the\x20OES_texture_float\x20extension.\x20\x20Check\x20context.floatingPointTexture.');
              if (fx === J['PixelDatatype']['HALF_FLOAT'] && !fR['halfFloatingPointTexture'])
                  throw new J['DeveloperError']('When\x20options.pixelDatatype\x20is\x20HALF_FLOAT,\x20this\x20WebGL\x20implementation\x20must\x20support\x20the\x20OES_texture_half_float\x20extension.\x20Check\x20context.halfFloatingPointTexture.');
              if (J['PixelFormat']['isDepthFormat'](fI)) {
                  if ((0x0,
                  J['defined'])(fA))
                      throw new J['DeveloperError']('When\x20options.pixelFormat\x20is\x20DEPTH_COMPONENT\x20or\x20DEPTH_STENCIL,\x20source\x20cannot\x20be\x20provided.');
                  if (!fR['depthTexture'])
                      throw new J['DeveloperError']('When\x20options.pixelFormat\x20is\x20DEPTH_COMPONENT\x20or\x20DEPTH_STENCIL,\x20this\x20WebGL\x20implementation\x20must\x20support\x20WEBGL_depth_texture.\x20\x20Check\x20context.depthTexture.');
              }
              var fM = (0x0,
              J['defaultValue'])(fp['flipY'], true)
                , fl = fR['_gl']
                , fX = fl['TEXTURE_3D']
                , fE = fl['createTexture']();
              fl['activeTexture'](fl['TEXTURE0']),
              fl['bindTexture'](fX, fE);
              var fO = 0x1;
              (0x0,
              J['defined'])(fA) && (0x0,
              J['defined'])(fA['arrayBufferView']) && (fO = J['PixelFormat']['alignmentInBytes'](fI, fx, fm)),
              fl['pixelStorei'](fl['UNPACK_ALIGNMENT'], fO);
              const F0 = undefined !== fp['preMultiplyAlpha'] && fp['preMultiplyAlpha'];
              if (!(0x0,
              J['defined'])(fA) || !(0x0,
              J['defined'])(fA['arrayBufferView']))
                  throw new J['DeveloperError']('source.arrayBufferView\x20must\x20be\x20set\x20for\x20DataTexture3D');
              fl['texParameteri'](fl['TEXTURE_3D'], fl['TEXTURE_WRAP_R'], fl['CLAMP_TO_EDGE']),
              fl['texParameteri'](fl['TEXTURE_3D'], fl['TEXTURE_WRAP_S'], fl['CLAMP_TO_EDGE']),
              fl['texParameteri'](fl['TEXTURE_3D'], fl['TEXTURE_WRAP_T'], fl['CLAMP_TO_EDGE']),
              fl['pixelStorei'](fl['UNPACK_PREMULTIPLY_ALPHA_WEBGL'], false),
              fl['pixelStorei'](fl['UNPACK_FLIP_Y_WEBGL'], false);
              var F1 = fA['arrayBufferView'];
              fl['texImage3D'](fX, 0x0, fB, fm, fH, fe, 0x0, fI, J['PixelDatatype']['toWebGLConstant'](fx, fR), F1),
              fl['bindTexture'](fX, null);
              var F2 = J['PixelFormat']['textureSizeInBytes'](fI, fx, fm, fH) * fe;
              this['_id'] = (0x0,
              J['createGuid'])(),
              this['_context'] = fR,
              this['_textureFilterAnisotropic'] = fR['_textureFilterAnisotropic'],
              this['_textureTarget'] = fX,
              this['_texture'] = fE,
              this['_internalFormat'] = fB,
              this['_pixelFormat'] = fI,
              this['_pixelDatatype'] = fx,
              this['_width'] = fm,
              this['_height'] = fH,
              this['_dimensions'] = new J['Cartesian3'](fm,fH,fe),
              this['_hasMipmap'] = false,
              this['_sizeInBytes'] = F2,
              this['_preMultiplyAlpha'] = F0,
              this['_flipY'] = fM,
              this['_initialized'] = true,
              this['_sampler'] = undefined,
              this['sampler'] = (0x0,
              J['defined'])(fp['sampler']) ? fp['sampler'] : new J['Sampler']();
          }
          get['id']() {
              return this['_id'];
          }
          get['sampler']() {
              return this['_sampler'];
          }
          set['sampler'](fp) {
              var fR = fp['minificationFilter']
                , fm = fp['magnificationFilter']
                , fH = this['_context']['_gl']
                , fe = this['_textureTarget'];
              fH['activeTexture'](fH['TEXTURE0']),
              fH['bindTexture'](fe, this['_texture']),
              fH['texParameteri'](fe, fH['TEXTURE_MIN_FILTER'], fR),
              fH['texParameteri'](fe, fH['TEXTURE_MAG_FILTER'], fm),
              fH['texParameteri'](fe, fH['TEXTURE_WRAP_S'], fp['wrapS']),
              fH['texParameteri'](fe, fH['TEXTURE_WRAP_T'], fp['wrapT']),
              fH['bindTexture'](fe, null),
              this['_sampler'] = fp;
          }
          get['pixelFormat']() {
              return this['_pixelFormat'];
          }
          get['pixelDatatype']() {
              return this['_pixelDatatype'];
          }
          get['dimensions']() {
              return this['_dimensions'];
          }
          get['preMultiplyAlpha']() {
              return this['_preMultiplyAlpha'];
          }
          get['flipY']() {
              return this['_flipY'];
          }
          get['width']() {
              return this['_width'];
          }
          get['height']() {
              return this['_height'];
          }
          get['sizeInBytes']() {
              return this['_sizeInBytes'];
          }
          get['_target']() {
              return this['_textureTarget'];
          }
          static['create'](fp) {
              return new fd(fp);
          }
      }
      function fb(fp, fR, fm) {
          var fH, fe;
          const fA = {
              'context': fp,
              'width': null !== (fH = fR['width']) && undefined !== fH ? fH : fR['videoWidth'],
              'height': null !== (fe = fR['height']) && undefined !== fe ? fe : fR['videoHeight'],
              'pixelFormat': J['PixelFormat']['RGBA'],
              'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
              'flipY': false,
              'sampler': null != fm ? fm : new J['Sampler']({
                  'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                  'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
              }),
              'source': fR
          };
          return new J['Texture'](fA);
      }
      function fw(fp, fR, fm=J['TextureMinificationFilter']['LINEAR']) {
          if (fR || K['logger']['error']('没有提供相应的数据源来生成Texture！', true),
          fR instanceof K['GrayImageGridData']) {
              const fH = {
                  'context': fp,
                  'width': fR['xSize'],
                  'height': fR['ySize'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': fm,
                      'magnificationFilter': fm
                  }),
                  'source': fR['imageSource']
              };
              return new J['Texture'](fH);
          }
          {
              const fe = {
                  'context': fp,
                  'width': fR['xSize'],
                  'height': fR['ySize'],
                  'pixelFormat': K['consts']['useWebGL2'] && fR['dataType'] !== K['GridDataType']['UInt8'] ? J['PixelFormat']['R'] : J['PixelFormat']['ALPHA'],
                  'pixelDatatype': fR['dataType'] === K['GridDataType']['UInt8'] ? J['PixelDatatype']['UNSIGNED_BYTE'] : J['PixelDatatype']['FLOAT'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': fm,
                      'magnificationFilter': fm
                  }),
                  'source': {
                      'arrayBufferView': fR['dataType'] === K['GridDataType']['UInt8'] ? fR['raw'] : new Float32Array(fR['raw'])
                  }
              };
              return new J['Texture'](fe);
          }
      }
      function fQ(fp, fR, fm, fH=J['TextureMinificationFilter']['NEAREST'], fe=false) {
          fR && 0x0 !== fR['length'] || K['logger']['error']('没有提供相应的数据源来生成Texture！', true);
          const fA = fR[0x0]
            , fI = fA['xSize'] * fA['ySize']
            , fx = (0x0,
          K['createGLTypedArray'])(fA['dataType'], fI * fR['length']);
          let fB = 0x0;
          for (const fl of fR) {
              if (fm['yDelta'] < 0x0 && fe) {
                  const fX = fl['flipY'](true);
                  fx['set'](fX, fB);
              } else
                  fx['set'](fl['raw'], fB);
              fB += fI;
          }
          const fM = {
              'context': fp,
              'width': fA['xSize'],
              'height': fA['ySize'],
              'depth': fR['length'],
              'pixelFormat': K['consts']['useWebGL2'] && fA['dataType'] !== K['GridDataType']['UInt8'] ? J['PixelFormat']['R'] : J['PixelFormat']['ALPHA'],
              'pixelDatatype': fA['dataType'] === K['GridDataType']['UInt8'] ? J['PixelDatatype']['UNSIGNED_BYTE'] : J['PixelDatatype']['FLOAT'],
              'flipY': false,
              'sampler': new J['Sampler']({
                  'minificationFilter': fH,
                  'magnificationFilter': fH
              }),
              'source': {
                  'arrayBufferView': fx
              }
          };
          return K['logger']['debug']('3d\x20texutre\x20created'),
          new fd(fM);
      }
      function fv(fp) {
          return fw(fp, new K['GridData'](K['GridDataType']['UInt8'],0x1,0x1,[0x0]));
      }
      function ft(fp) {
          const fR = {
              'context': fp,
              'width': 0x1,
              'height': 0x1,
              'depth': 0x1,
              'pixelFormat': J['PixelFormat']['ALPHA'],
              'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
              'flipY': false,
              'sampler': new J['Sampler']({
                  'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                  'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
              }),
              'source': {
                  'arrayBufferView': (0x0,
                  K['createGLTypedArray'])(K['GridDataType']['UInt8'], 0x1)
              }
          };
          return new fd(fR);
      }
      function fK(fp, fR='$inject', fm) {
          return new J['ShaderSource'](Object['assign']({
              'sources': [(0x0,
              K['injectBuiltInShaderFunctions'])(fp, fR)]
          }, fm || {}));
      }
      class fJ extends J['Primitive'] {
          constructor(fp) {
              super(fp),
              this['sizeChanged'] = false,
              this['sizeChanging'] = false,
              this['_visible'] = true,
              this['emptyTexture'] = K['consts']['useWebGL2'] ? {} : undefined,
              this['vectorGridMode'] = 'sd',
              this['options'] = (0x0,
              K['setOptions'])({}, fp, fJ['DefaultOptions']),
              this['handleSizeChanged']();
          }
          ['parseNumberStopRules'](fp) {
              const fR = fp['getStops']()
                , fm = fp['getVals']()
                , fH = [];
              for (const fA of fR)
                  fH['push'](parseFloat(fA));
              const fe = [];
              for (const fI of fm)
                  fe['push'](parseFloat(fI));
              return {
                  'numbers': fH,
                  'steps': fe
              };
          }
          ['resetMaskCommand']() {
              var fp, fR, fm;
              this['maskCommand'] && (null === (fp = this['maskTexture']) || undefined === fp || fp['destroy'](),
              null === (fR = this['maskDepthTexture']) || undefined === fR || fR['destroy'](),
              this['maskCommand']['shaderProgram']['destroy'](),
              null === (fm = this['maskVao']) || undefined === fm || fm['destroy'](),
              this['maskTexture'] = undefined,
              this['maskDepthTexture'] = undefined,
              this['maskCommand'] = undefined,
              this['maskVao'] = undefined);
          }
          ['createMaskVao'](fp, fR) {
              const fm = []
                , fH = [];
              fF(this['options']['mask'], fI=>{
                  var fx;
                  if ('Polygon' !== (null === (fx = null == fI ? undefined : fI['geometry']) || undefined === fx ? undefined : fx['type']))
                      return;
                  const fB = (0x0,
                  K['earcutFlatten'])(fI['geometry']['coordinates'])
                    , fM = (0x0,
                  K['earcut'])(fB['vertices'], fB['holes'], fB['dimensions'])
                    , fl = fm['length'] / fB['dimensions'];
                  fB['vertices']['forEach'](fX=>{
                      fm['push'](fX);
                  }
                  ),
                  fM['forEach'](fX=>{
                      fH['push'](fX + fl);
                  }
                  );
              }
              );
              const fe = new Float32Array(fm)
                , fA = new J['Geometry']({
                  'attributes': {
                      'ids': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x2,
                          'values': fe,
                          'normalize': false
                      })
                  },
                  'indices': new Uint32Array(fH)
              });
              return J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fA,
                  'attributeLocations': fR,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
          }
          ['createMaskCommand'](fp) {
              var fR;
              if (!this['options']['mask'])
                  return;
              let fm = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fm = Object['assign'](Object['assign']({}, fm), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  },
                  'cull': {
                      'enabled': false,
                      'face': (null === (fR = this['dataSource']['gridOptions']) || undefined === fR ? undefined : fR['yDelta']) > 0x0 ? J['CullFace']['FRONT'] : J['CullFace']['BACK']
                  }
              });
              const fH = J['RenderState']['fromCache'](fm)
                , fe = fK('\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20position;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldCoords=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(vec3(position.xy,0.));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_projection\x20*\x20czm_view\x20*\x20vec4(worldCoords,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20')
                , fA = fK('\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=vec4(1.,0.,0.,1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20')
                , fI = {
                  'position': 0x0
              };
              this['maskVao'] = this['createMaskVao'](fp, fI);
              const fx = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fe,
                  'fragmentShaderSource': fA,
                  'attributeLocations': fI
              });
              this['maskTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE']
              }),
              this['maskDepthTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['DEPTH_COMPONENT'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_INT']
              }),
              this['maskCommand'] = new J['DrawCommand']({
                  'vertexArray': this['maskVao'],
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fH,
                  'shaderProgram': fx,
                  'uniformMap': {},
                  'owner': this,
                  'pass': J['Pass']['OPAQUE'],
                  'modelMatrix': this['modelMatrix'],
                  'framebuffer': new J['Framebuffer']({
                      'context': fp,
                      'colorTextures': [this['maskTexture']],
                      'depthTexture': this['maskDepthTexture'],
                      'destroyAttachments': false
                  })
              }),
              this['maskClearCommand'] = new J['ClearCommand']({
                  'color': new J['Color'](0x0,0x0,0x0,0x0),
                  'depth': 0x1,
                  'stencil': 0x0,
                  'pass': J['Pass']['OPAQUE']
              }),
              this['maskClearCommand']['framebuffer'] = this['maskCommand']['framebuffer'],
              this['maskClearCommand']['renderState'] = J['RenderState']['fromCache']({
                  'viewport': new J['BoundingRectangle'](0x0,0x0,fp['drawingBufferWidth'],fp['drawingBufferHeight'])
              });
          }
          ['setLayerOptions'](fp, fR=true) {
              var fm, fH;
              'string' == typeof fp ? (this['options'] = null === (fm = K['resourceService']['getResource'](fp)) || undefined === fm ? undefined : fm['instance'],
              this['options'] || K['logger']['error']('图层属性资源' + fp + '不存在！')) : fR && this['options'] ? (0x0,
              K['setOptions'])(this['options'], fp) : (this['options'] = (0x0,
              K['setOptions'])({}, fp, fJ['DefaultOptions']),
              this['options']['name'] = (0x0,
              K['defaultVal'])(this['options']['name'], (0x0,
              K['uid'])()));
              const fe = this['options']['mask'];
              if (this['options']['mask'] && 'string' == typeof this['options']['mask']) {
                  const fA = this['options']['mask'];
                  fA['indexOf'](K['consts']['fieldLoaderIndicator']) > 0x0 ? this['options']['mask'] = (0x0,
                  K['processFieldWithLoaders'])(fA) : this['options']['mask'] = null === (fH = K['resourceService']['getResource'](fA)) || undefined === fH ? undefined : fH['instance'],
                  this['options']['mask'] || K['logger']['warn']('图层' + this['options']['name'] + '的mask资源' + fA + '不存在！');
              }
              if (fe !== this['options']['mask'] && this['resetMaskCommand'](),
              this['options']['heightData']) {
                  if (this['heightTexture'] && (this['heightTexture']['destroy'](),
                  this['heightTexture'] = undefined),
                  'string' == typeof this['options']['heightData'] && (this['options']['heightData'] = (0x0,
                  K['processFieldWithLoaders'])(fp['heightData'])),
                  !(this['options']['heightData']instanceof K['GridData'])) {
                      const fI = this['options']['heightData']
                        , fx = K['layerCreator']['createProvider'](fI);
                      if (!fx)
                          return K['logger']['warn']('不正确的高度信息！'),
                          void K['logger']['warn'](this['options']['heightData']);
                      this['options']['heightData'] = fx;
                  }
              } else
                  null === fp['heightData'] && this['heightTexture'] && (this['heightTexture']['destroy'](),
                  this['heightTexture'] = undefined);
          }
          ['setDrawOptions'](fp, fR=true) {
              return 'string' == typeof fp && (fp['indexOf'](K['consts']['fieldLoaderIndicator']) > 0x0 ? this['drawOptions'] = (0x0,
              K['processFieldWithLoaders'])(fp) : this['drawOptions'] = K['resourceService']['getResource'](fp)['instance']),
              'object' != typeof fp || fp instanceof K['GridGLBaseStyle'] ? this['drawOptions'] = fp : fR && this['drawOptions'] ? this['drawOptions']['update'](fp) : this['drawOptions'] = this['_createStyleObjectFromStyleOptions'](fp),
              this;
          }
          ['parseColorStopRules'](fp) {
              const fR = fp['getStops']()
                , fm = fp['getVals']()
                , fH = [];
              for (const fA of fR) {
                  const fI = fA;
                  fH['push'](new J['Cartesian4'](fI['red']() / 0xff,fI['green']() / 0xff,fI['blue']() / 0xff,fI['alpha']()));
              }
              const fe = [];
              for (const fx of fm)
                  fe['push'](parseFloat(fx));
              return {
                  'colors': fH,
                  'steps': fe
              };
          }
          ['handleSizeChanged']() {
              this['resizeHandler'] = (0x0,
              K['onWindowSizeChanged'])(()=>{
                  this['sizeChanged'] = true,
                  this['sizeChanging'] = false;
              }
              , ()=>{
                  this['sizeChanging'] = true;
              }
              , undefined);
          }
          ['setVisible'](fp) {
              return this['_visible'] === fp || (this['_visible'] = fp),
              this;
          }
          ['isVisible']() {
              return this['_visible'];
          }
          ['clearPreDataSource']() {
              throw new Error('Method\x20not\x20implemented.');
          }
          ['resetCommand'](fp) {}
          ['update'](fp) {
              super['update'](fp),
              this['_visible'] && (this['sizeChanging'] || (this['sizeChanged'] && (this['resetCommand'](false),
              this['resetMaskCommand'](),
              this['sizeChanged'] = false),
              this['options']['mask'] && (this['maskCommand'] || this['createMaskCommand'](fp['context']),
              (0x0,
              J['defined'])(this['maskCommand']) && (fp['commandList']['push'](this['maskClearCommand']),
              fp['commandList']['push'](this['maskCommand'])))));
          }
          ['destroy']() {
              this['resizeHandler']['remove'](),
              super['destroy']();
          }
      }
      fJ['DefaultOptions'] = {
          'trackDataSource': true,
          'cacheDrawOptions': true,
          'interpFromPreSource': false,
          'debugShowPerformance': false,
          'heightUndef': 0x270f
      };
      class fC extends fJ {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp, fC['DefaultOptions'])),
              this['dataPercent'] = 0x0,
              this['preHeight'] = 0x0,
              this['currentHeight'] = 0x0,
              this['updateTDataPercent'] = ()=>{
                  this['dataPercent'] = this['dataSource']['currentTIdx'] - this['dataSource']['getIntTIdx']();
              }
              ,
              this['updateZDataPercent'] = ()=>{
                  this['dataPercent'] = this['dataSource']['currentZIdx'] - this['dataSource']['getIntZIdx']();
              }
              ,
              this['transferCurrentData'] = ()=>{
                  var fR, fm;
                  this['preTexture'] && (this['preTexture']['destroy'](),
                  this['preTexture'] = undefined,
                  this['preGrid'] = undefined),
                  this['preTexture2'] && (this['preTexture2']['destroy'](),
                  this['preTexture2'] = undefined,
                  this['preGrid2'] = undefined),
                  this['options']['interpFromPreSource'] ? (this['preGrid'] = this['currentGrid'],
                  this['preTexture'] = this['currentTexture'],
                  this['dataPercent'] = 0x0,
                  this['preGrid2'] = this['currentGrid2'],
                  this['preTexture2'] = this['currentTexture2'],
                  this['preHeight'] = this['currentHeight']) : (null === (fR = this['currentTexture']) || undefined === fR || fR['destroy'](),
                  null === (fm = this['currentTexture2']) || undefined === fm || fm['destroy']()),
                  this['dataSource']['getU'] ? 'sd' === this['vectorGridMode'] ? (this['currentGrid'] = this['dataSource']['getS'](),
                  this['currentGrid2'] = this['dataSource']['getD']()) : (this['currentGrid'] = this['dataSource']['getU'](),
                  this['currentGrid2'] = this['dataSource']['getV']()) : this['currentGrid'] = this['dataSource']['getGrid']();
                  const fH = this['dataSource']['getIntZIdx']();
                  this['currentHeight'] = this['dataSource']['gridOptions']['zValues'] ? this['dataSource']['gridOptions']['zValues'][fH] : 0x0,
                  (0x0,
                  K['isValid'])(this['currentHeight']) || (this['currentHeight'] = 0x0),
                  this['currentTexture'] = undefined,
                  this['currentTexture2'] = undefined;
              }
              ;
          }
          ['setLayerOptions'](fp, fR=true) {
              super['setLayerOptions'](fp, fR),
              this['options']['trackDataSource'] != this['options']['trackDataSource'] && this['dataSource'] && (this['unsetDataSourceListener'](),
              this['setDataSourceListener']());
          }
          ['setDataSource'](fp) {
              var fR;
              if (fp)
                  return this['dataSource'] && this['dataSource'] !== fp && (this['unsetDataSourceListener'](),
                  this['dataPercent'] = 0x0,
                  this['preGrid'] = undefined,
                  this['preTexture'] && this['preTexture']['destroy'](),
                  this['preTexture2'] && this['preTexture2']['destroy'](),
                  this['preTexture'] = undefined,
                  this['preTexture2'] = undefined,
                  this['currentTexture'] && this['currentTexture']['destroy'](),
                  this['currentTexture2'] && this['currentTexture2']['destroy'](),
                  this['currentTexture'] = undefined,
                  this['currentTexture2'] = undefined),
                  this['dataSource'] && this['dataSource'] === fp || (this['dataSource'] = fp,
                  this['setDataSourceListener'](),
                  this['dataSource']['getU'] ? 'sd' === this['vectorGridMode'] ? (this['currentGrid'] = this['dataSource']['getS'](),
                  this['currentGrid2'] = this['dataSource']['getD']()) : (this['currentGrid'] = this['dataSource']['getU'](),
                  this['currentGrid2'] = this['dataSource']['getV']()) : this['currentGrid'] = this['dataSource']['getGrid'](),
                  this['currentHeight'] = (null === (fR = fp['gridOptions']['zValues']) || undefined === fR ? undefined : fR['length']) > 0x0 ? fp['gridOptions']['zValues'][fp['getIntZIdx']()] : 0x0),
                  this;
              K['logger']['warn']('数据源为空，无法更新！');
          }
          ['clearPreDataSource']() {
              this['preTexture'] && this['preTexture']['destroy'](),
              this['preTexture2'] && this['preTexture2']['destroy'](),
              this['preTexture'] = undefined,
              this['preTexture2'] = undefined,
              this['preGrid'] = undefined,
              this['preGrid2'] = undefined,
              this['dataPercent'] = 0x0;
          }
          ['unsetDataSourceListener']() {
              this['dataSource']['offTChanged'](this['updateTDataPercent']),
              this['dataSource']['offZChanged'](this['updateZDataPercent']),
              this['dataSource']['offIntTZChanged'](this['transferCurrentData']),
              this['dataSource']['offActiveGridUpdated'](this['transferCurrentData']);
          }
          ['setDataSourceListener']() {
              this['options']['trackDataSource'] && (this['dataSource']['onTChanged'](this['updateTDataPercent']),
              this['dataSource']['onZChanged'](this['updateZDataPercent']),
              this['dataSource']['onIntTZChanged'](this['transferCurrentData']),
              this['dataSource']['onActiveGridUpdated'](this['transferCurrentData']));
          }
      }
      fC['DefaultOptions'] = Object['assign']({}, fJ['DefaultOptions']);
      class CPixelLayer extends fC {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp || {}, CPixelLayer['DefaultOptions']));
          }
          ['setDrawOptions'](fp, fR=true) {
              if (super['setDrawOptions'](fp, fR),
              this['_planeOptions'] = this['drawOptions']['getPlaneOptions'](undefined, this['options']['cacheDrawOptions']),
              this['_planeOptions']['fillColor']) {
                  const fe = this['parseColorStopRules'](this['_planeOptions']['fillColor']);
                  this['fillColors'] = fe['colors'],
                  this['fillSteps'] = fe['steps'];
              } else
                  this['_csTexture'] && (this['_csTexture'] && this['_csTexture']['destroy'](),
                  this['_csTexture'] = undefined),
                  this['_updateColorScaleMaxMin']();
              const fm = this['_planeOptions']['emission']['glNumberArray']();
              this['_emission'] = new J['Cartesian3'](fm[0x0],fm[0x1],fm[0x2]);
              const fH = this['_planeOptions']['diffuse']['glNumberArray']();
              if (this['_diffuse'] = new J['Cartesian3'](fH[0x0],fH[0x1],fH[0x2]),
              this['splineMat'] = new J['Matrix4'](-this['drawOptions']['pixelRatio'],0x2 - this['drawOptions']['pixelRatio'],this['drawOptions']['pixelRatio'] - 0x2,this['drawOptions']['pixelRatio'],0x2 * this['drawOptions']['pixelRatio'],this['drawOptions']['pixelRatio'] - 0x3,0x3 - 0x2 * this['drawOptions']['pixelRatio'],-this['drawOptions']['pixelRatio'],-this['drawOptions']['pixelRatio'],0x0,this['drawOptions']['pixelRatio'],0x0,0x0,0x1,0x0,0x0),
              this['_planeOptions']['lineColor']) {
                  const fA = this['_planeOptions']['lineColor'];
                  this['_lineColor'] = new J['Cartesian4'](fA[0x0],fA[0x1],fA[0x2],fA[0x3]);
              } else
                  this['_lineColor'] = undefined;
              return this['_discardColor'] = new J['Cartesian4'](this['_planeOptions']['discardColor'][0x0],this['_planeOptions']['discardColor'][0x1],this['_planeOptions']['discardColor'][0x2],this['_planeOptions']['discardColor'][0x3]),
              this;
          }
          ['setTargetGridOptions'](fp) {
              if (!this['_drawCommand'])
                  return this['_targetGridOptions'] = Object['assign']({}, fp),
                  (0x0,
                  K['ensureGridDataOptions'])(this['_targetGridOptions']),
                  this;
              K['logger']['warn']('请在加入地图之前设置该值');
          }
          ['setDataSource'](fp) {
              return super['setDataSource'](fp),
              this['_updateColorScaleMaxMin'](),
              this;
          }
          ['_updateColorScaleMaxMin']() {
              var fp, fR;
              if (this['dataSource'] && (null === (fR = null === (fp = this['_planeOptions']) || undefined === fp ? undefined : fp['colorScale']) || undefined === fR ? undefined : fR['colorScale']) && (!(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['min']) || !(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['max']))) {
                  K['logger']['debug']('当前colorScale没有配置最大或者最小值，将使用数据中的值，可能造成连续动画时最大最小值不一致！');
                  const fm = this['dataSource']['getGrid']()['maxMin'];
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['min']) || (this['_planeOptions']['colorScale']['min'] = fm['min']),
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['max']) || (this['_planeOptions']['colorScale']['max'] = fm['max']);
              }
          }
          ['resetCommand'](fp=false) {
              var fR, fm, fH, fe, fA;
              this['_drawCommand'] && (null === (fR = this['_contourTexture']) || undefined === fR || fR['destroy'](),
              null === (fm = this['_contourDepthTexture']) || undefined === fm || fm['destroy'](),
              this['_csTexture'] && this['_csTexture']['destroy'](),
              null === (fH = this['_shadedCommand']) || undefined === fH || fH['shaderProgram']['destroy'](),
              null === (fe = this['_drawCommand']) || undefined === fe || fe['shaderProgram']['destroy'](),
              null === (fA = this['_contourCommand']) || undefined === fA || fA['shaderProgram']['destroy'](),
              fp && (this['_vao']['destroy'] && this['_vao']['destroy'](),
              this['_vao'] = undefined),
              this['_shadedCommand'] = undefined,
              this['_contourCommand'] = undefined,
              this['_drawCommand'] = undefined,
              this['_contourClearCommand'] = undefined,
              this['_csTexture'] = undefined);
          }
          ['createVAO'](fp, fR) {
              const fm = performance['now']()
                , fH = this['_targetGridOptions'] || this['dataSource']['gridOptions'];
              let fe = this['options']['ids'];
              if (!fe) {
                  fe = new Float32Array(fH['xSize'] * fH['ySize']);
                  for (let fM = 0x0; fM < fe['length']; fM++)
                      fe[fM] = fM;
              }
              const fA = {
                  'xStart': fH['xStart'],
                  'yStart': fH['yStart'],
                  'xDelta': fH['xDelta'],
                  'yDelta': fH['yDelta'],
                  'xSize': fH['xSize'],
                  'ySize': fH['ySize']
              };
              (0x0,
              K['ensureGridDataOptions'])(fA);
              let fI = this['options']['indices'];
              if (!fI) {
                  let fl = 0x0;
                  fI = new Uint32Array((fA['xSize'] - 0x1) * (fA['ySize'] - 0x1) * 0x6);
                  for (let fX = 0x0; fX < fA['xSize'] * fA['ySize'] - fA['xSize']; fX++) {
                      if ((fX + 0x1) % fA['xSize'] == 0x0)
                          continue;
                      const fE = fX
                        , fO = fX + fA['xSize']
                        , F0 = fO + 0x1
                        , F1 = fE + 0x1;
                      fI[fl++] = fE,
                      fI[fl++] = fO,
                      fI[fl++] = F0,
                      fI[fl++] = fE,
                      fI[fl++] = F0,
                      fI[fl++] = F1;
                  }
              }
              const fx = new J['Geometry']({
                  'attributes': {
                      'ids': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x1,
                          'values': fe,
                          'normalize': false
                      })
                  },
                  'indices': fI
              })
                , fB = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fx,
                  'attributeLocations': fR,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              return this['options']['debugShowPerformance'] && K['logger']['debug']('generate\x20grid\x20indicies\x20costs\x20' + (performance['now']() - fm) + 'ms'),
              fB;
          }
          ['createCommand'](fp, fR) {
              var fm;
              let fH = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fH = Object['assign'](Object['assign']({}, fH), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  },
                  'cull': {
                      'enabled': this['options']['cull'],
                      'face': this['dataSource']['gridOptions']['yDelta'] > 0x0 ? J['CullFace']['FRONT'] : J['CullFace']['BACK']
                  },
                  'blending': J['BlendingState']['ALPHA_BLEND']
              });
              const fe = J['RenderState']['fromCache'](fH)
                , fA = (0x0,
              J['defined'])(this['options']['heightData'])
                , fI = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , fx = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize']);
              let fB = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20cpixel_read_data(vec2\x20uv,int\x20interpMethod){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20' + K['qeGLFuncs']['qe_readGridValByUV'] + '(currentData,uv,xAttr,yAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
              this['options']['interpFromPreSource'] && (fB = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20cpixel_read_data(vec2\x20uv,int\x20interpMethod){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20' + K['qeGLFuncs']['qe_interpGridValByUV'] + '(preData,uv,xAttr,yAttr,undef,interpMethod,currentData,dataPercent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20' + K['qeGLFuncs']['qe_readGridValByUV'] + '(currentData,uv,xAttr,yAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fM = 0x1 !== this['_planeOptions']['extrudeScale'] && 0x0 !== this['_planeOptions']['extrudeScale']
                , fl = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20currentData;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20sampler2D\x20preData;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20float\x20dataPercent;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mediump\x20int\x20fillMode;\x20//0-none(bitmap,no-color-interp&no-data-interp),1-bi(pixel1),2-cardinal(pixel2),3-shaded(no-color-interp&cardinal)\x20cesium在vShader和fShader中对于int的精度定义不一致，需要特别指定\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20bool\x20hasPre;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
              let fX = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20cpixel_get_height(vec2\x20uv){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
              fM && (fX = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20cpixel_get_height(vec2\x20uv){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==3||\x20fillMode==2){\x20//shaded\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//cardinal\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(fillMode==4){\x20//shaded2\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val=cpixel_read_data(uv,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20selVal=fillMode==0?val.x:val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(selVal,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20(selVal+extrudeOffset)*extrudeScale;\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              let fE = '';
              fA && (fE = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20hUV=' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(position,hXAttr,hYAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hUV.x>=0.\x20&&\x20hUV.x<=1.\x20&&\x20hUV.y>=0.\x20&&\x20hUV.y<=1.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20h=' + K['qeGLFuncs']['qe_readHeightValByUV'] + '(heightTexture,hUV,hXAttr,hYAttr,undefH,1).y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(h,undefH)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=height+h*zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fO = this['options']['heightData']
                , F0 = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20float\x20ids;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20hXAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20hYAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20tXAttr;\x20//target\x20grid\x20options\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20tYAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20globalHeight;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20isFlat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] && !fM ? 'uniform\x20float\x20dataPercent;' : '') + '\x20//避免extrude的时候重复定义\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getHeightUniforms'])() + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fM ? (0x0,
              K['getAlgoConstsAndUniforms'])(this['currentGrid']) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fM ? fl : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fA ? (0x0,
              K['getHeightAlgoConstsAndUniforms'])(fO['getGrid'](), false) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20v_normalEC;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fM ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fB + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fX + '\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20cpixel_get_cart(vec2\x20pos){\x20\x20//\x20lon,lat\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(pos,xAttr,yAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20h=cpixel_get_height(uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20cart=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(vec3(pos.xy,h));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20cart;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20cpixel_get_normal(float\x20lon,float\x20lat){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20o_b,o_rb,o_r,o_u,o_lu,o_l=vec3(0.f);\x20\x20//\x20以当前点o为中心，各个方向的向量\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20n_o_b_rb,n_o_rb_r,n_o_r_u,n_o_u_lu,n_o_lu_l,n_o_l_b=vec3(0.f);\x20//\x20共享当前顶点的三角形的法向量\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20no=vec3(0.f);\x20//\x20法向量之和，代表当前顶点的法向量，后续normal过程中会求模，模与三角形的面积成比例，因此自带权重\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20yIdx=floor(ids/xAttr.w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20xIdx=mod(ids,xAttr.w);\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20cartPos=cpixel_get_cart(vec2(lon,lat));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20o_b=cpixel_get_cart(vec2(lon,lat+yAttr.z))-cartPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20o_rb=cpixel_get_cart(vec2(lon+xAttr.z,lat+yAttr.z))-cartPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20o_r=cpixel_get_cart(vec2(lon+xAttr.z,lat))-cartPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx['z'] > 0x0 ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_b_rb=cross(o_rb,o_b);\x20//\x20右下左\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_rb_r=cross(o_r,o_rb);\x20//\x20右下右\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_b_rb=cross(o_b,o_rb);\x20//\x20右下左\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_rb_r=cross(o_rb,o_r);\x20//\x20右下右\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20no=n_o_b_rb+n_o_rb_r;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(ids==0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20no;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20o_l=cpixel_get_cart(vec2(lon-xAttr.z,lat))-cartPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx['z'] > 0x0 ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_l_b=cross(o_b,o_l);\x20//\x20左下\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_l_b=cross(o_l,o_b);\x20//\x20左下\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20no=no+n_o_l_b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(yIdx==0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20横向\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20no;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20o_u=cpixel_get_cart(vec2(lon-xAttr.z,lat-yAttr.z))-cartPos;\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx['z'] > 0x0 ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_r_u=cross(o_u,o_r);\x20//\x20右上\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_r_u=cross(o_r,o_u);\x20//\x20右上\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20no=no+n_o_r_u;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(xIdx==0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//纵向\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20no;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20o_lu=cpixel_get_cart(vec2(lon-xAttr.z,lat-yAttr.z))-cartPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx['z'] > 0x0 ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_u_lu=cross(o_lu,o_u);\x20//\x20左上上\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_lu_l=cross(o_l,o_lu);\x20//\x20左上下\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_u_lu=cross(o_u,o_lu);\x20//\x20左上上\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20n_o_lu_l=cross(o_lu,o_l);\x20//\x20左上下\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20no=no+n_o_u_lu+n_o_lu_l;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20no;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '') + '\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20position=' + K['qeGLFuncs']['qe_idx2LonLat'] + '(ids,tXAttr,tYAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(position,xAttr,yAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUV=uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20height=(globalHeight+currentHeight)*zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(noHeight){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fE + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=height+' + K['qeGLFuncs']['qe_getHeightByPreAndCurrent'] + '(uv,false,' + (this['options']['interpFromPreSource'] ? 'dataPercent' : '0.') + ');\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fM ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=height+cpixel_get_height(vUV);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldCoords=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(vec3(position.xy,height));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_positionEC=vec3(0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_normalEC=vec3(0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fM ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!isFlat){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20normal=cpixel_get_normal(position.x,position.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_positionEC\x20=\x20(czm_modelView\x20*\x20vec4(worldCoords,\x201.0)).xyz;\x20\x20\x20\x20\x20\x20\x20//\x20position\x20in\x20eye\x20coordinates\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_normalEC\x20=\x20czm_normal\x20*\x20normal;\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_projection\x20*\x20czm_view\x20*\x20vec4(worldCoords,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , F1 = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount=' + ((null === (fm = this['fillSteps']) || undefined === fm ? undefined : fm['length']) || 0x1) + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['currentGrid']) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fl + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20csTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMax;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasCs;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasMask;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20reso;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20maskTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20isFlat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20u_diffuse;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20u_emission;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_specular;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_shininess;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20discardColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20v_normalEC;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fB + '\x20\x20//有自定义的时候一定要写到$inject下面\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasMask\x20&&\x20!' + K['qeGLFuncs']['qe_maskout'] + '(reso,maskTexture)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==3||\x20fillMode==2){\x20//shaded\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//cardinal\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(fillMode==4){\x20//shaded2\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val=cpixel_read_data(vUV,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20selVal=fillMode==0?val.x:val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(' + K['qeGLFuncs']['qe_isUndef'] + '(selVal,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=discardColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasCs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['qeGLFuncs']['qe_getColorByScale'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0\x20||\x20fillMode>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['qeGLFuncs']['qe_getColor'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['qeGLFuncs']['qe_interpColor'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor.a=out_FragColor.a*globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(out_FragColor.a<0.001){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fM ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isFlat){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20FLAT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20positionToEyeEC\x20=\x20-v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20normalEC\x20=\x20normalize(v_normalEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20FACE_FORWARD\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20normalEC\x20=\x20faceforward(normalEC,\x20vec3(0.0,\x200.0,\x201.0),\x20-normalEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20czm_materialInput\x20materialInput;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20materialInput.normalEC\x20=\x20normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20materialInput.positionToEyeEC\x20=\x20positionToEyeEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20czm_material\x20material\x20=\x20czm_getDefaultMaterial(materialInput);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20tColor=czm_gammaCorrect(out_FragColor);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.diffuse=tColor.xyz+u_diffuse;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.emission=u_emission;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.specular=u_specular;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.shininess=u_shininess;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.alpha=tColor.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20czm_phong(normalize(positionToEyeEC),\x20material,czm_lightDirectionEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , F2 = fK(F0, undefined, {})
                , F3 = fK(F1, undefined, {});
              let F4 = fI
                , F5 = fx;
              this['_targetGridOptions'] && (F4 = new J['Cartesian4'](this['_targetGridOptions']['xStart'],this['_targetGridOptions']['xEnd'],this['_targetGridOptions']['xDelta'],this['_targetGridOptions']['xSize']),
              F5 = new J['Cartesian4'](this['_targetGridOptions']['yStart'],this['_targetGridOptions']['yEnd'],this['_targetGridOptions']['yDelta'],this['_targetGridOptions']['ySize']));
              const F6 = fv(fp)
                , F7 = new J['Cartesian2'](fp['drawingBufferWidth'],fp['drawingBufferHeight'])
                , F8 = this['_planeOptions']['optimizedInterp'] ? ()=>this['_planeOptions']['fillMode'] === K['GridDataGLFillMode']['bitmap'] ? J['TextureMinificationFilter']['NEAREST'] : J['TextureMinificationFilter']['LINEAR'] : ()=>J['TextureMinificationFilter']['NEAREST'];
              let F9 = new J['Cartesian4']()
                , Ff = new J['Cartesian4']();
              if (this['options']['heightData']) {
                  this['heightTexture'] || (this['heightTexture'] = fw(fp, this['options']['heightData']['getGrid'](), J['TextureMinificationFilter']['NEAREST']));
                  const FQ = this['options']['heightData'];
                  F9 = new J['Cartesian4'](FQ['gridOptions']['xStart'],FQ['gridOptions']['xEnd'],FQ['gridOptions']['xDelta'],FQ['gridOptions']['xSize']),
                  Ff = new J['Cartesian4'](FQ['gridOptions']['yStart'],FQ['gridOptions']['yEnd'],FQ['gridOptions']['yDelta'],FQ['gridOptions']['ySize']);
              }
              const FF = {
                  'xAttr': ()=>fI,
                  'yAttr': ()=>fx,
                  'tXAttr': ()=>F4,
                  'tYAttr': ()=>F5,
                  'currentData': ()=>this['currentTexture'] || (this['currentTexture'] = fw(fp, this['currentGrid'], F8())),
                  'colors': ()=>this['fillColors'] || [],
                  'steps': ()=>this['fillSteps'] || [],
                  'cardinalSplineMat': ()=>this['splineMat'],
                  'fillMode': ()=>null != fR ? fR : this['_planeOptions']['fillMode'],
                  'currentHeight': ()=>this['currentHeight'],
                  'preHeight': ()=>this['preHeight'],
                  'heightTexture': ()=>this['heightTexture'] || F6,
                  'hXAttr': ()=>F9,
                  'hYAttr': ()=>Ff,
                  'zScale': ()=>this['_planeOptions']['zScale'],
                  'extrudeScale': ()=>this['_planeOptions']['extrudeScale'],
                  'extrudeOffset': ()=>this['_planeOptions']['extrudeOffset'],
                  'noHeight': ()=>this['_planeOptions']['noHeight'],
                  'reso': ()=>F7,
                  'hasMask': ()=>!!this['maskTexture'],
                  'maskTexture': ()=>this['maskTexture'] || F6,
                  'csMin': ()=>{
                      var Fv, Ft;
                      return null !== (Ft = null === (Fv = this['_planeOptions']['colorScale']) || undefined === Fv ? undefined : Fv['min']) && undefined !== Ft ? Ft : 0x0;
                  }
                  ,
                  'csMax': ()=>{
                      var Fv, Ft;
                      return null !== (Ft = null === (Fv = this['_planeOptions']['colorScale']) || undefined === Fv ? undefined : Fv['max']) && undefined !== Ft ? Ft : 0x1;
                  }
                  ,
                  'csTexture': ()=>this['_planeOptions']['colorScale'] ? this['_csTexture'] || (this['_csTexture'] = fb(fp, this['_planeOptions']['colorScale']['colorScale'])) : F6,
                  'hasCs': ()=>(0x0,
                  J['defined'])(this['_planeOptions']['colorScale']),
                  'globalHeight': ()=>{
                      var Fv;
                      return null !== (Fv = this['_planeOptions']['height']) && undefined !== Fv ? Fv : 0x0;
                  }
                  ,
                  'globalOpacity': ()=>{
                      var Fv;
                      return null !== (Fv = this['_planeOptions']['globalOpacity']) && undefined !== Fv ? Fv : 0x1;
                  }
                  ,
                  'discardColor': ()=>this['_discardColor'],
                  'isFlat': ()=>this['_planeOptions']['flat'],
                  'u_emission': ()=>this['_emission'],
                  'u_diffuse': ()=>this['_diffuse'],
                  'u_specular': ()=>this['_planeOptions']['specular'],
                  'u_shininess': ()=>this['_planeOptions']['shininess']
              };
              (0x0,
              K['setAlgoUniforms'])(this['currentGrid'], FF),
              fA && (0x0,
              K['setHeightAlgoUniforms'])(fO['getGrid'](), FF),
              this['options']['interpFromPreSource'] && (FF['preData'] = ()=>this['preTexture'] || this['preGrid'] && (this['preTexture'] = fw(fp, this['preGrid'], F8())) || F6,
              FF['dataPercent'] = ()=>this['dataPercent'],
              FF['hasPre'] = ()=>!(!this['options']['interpFromPreSource'] || !this['preGrid']));
              const Fd = {
                  'position': 0x0
              };
              let Fb = this['_vao'];
              this['_vao'] || (Fb = this['_vao'] = this['createVAO'](fp, Fd));
              const Fw = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': F2,
                  'fragmentShaderSource': F3,
                  'attributeLocations': Fd
              });
              return new J['DrawCommand']({
                  'vertexArray': Fb,
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fe,
                  'shaderProgram': Fw,
                  'uniformMap': FF,
                  'owner': this,
                  'pass': this['_planeOptions']['opaque'] ? J['Pass']['OPAQUE'] : J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['createContourVAO'](fp, fR) {
              const fm = new J['Geometry']({
                  'attributes': {
                      'position': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x2,
                          'values': [-0x1, 0x1, -0x1, -0x1, 0x1, -0x1, -0x1, 0x1, 0x1, -0x1, 0x1, 0x1],
                          'normalize': false
                      }),
                      'uv': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x2,
                          'values': [0x0, 0x0, 0x0, 0x1, 0x1, 0x1, 0x0, 0x0, 0x1, 0x1, 0x1, 0x0],
                          'normalize': false
                      })
                  }
              });
              return J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fm,
                  'attributeLocations': fR,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
          }
          ['createContourCommand'](fp) {
              var fR;
              const fm = null !== (fR = this['_planeOptions']['fillModeForLine']) && undefined !== fR ? fR : this['_planeOptions']['fillMode'] === K['GridDataGLFillMode']['pixel1'] ? K['GridDataGLFillMode']['shaded1'] : K['GridDataGLFillMode']['shaded2']
                , fH = this['_shadedCommand'] = this['createCommand'](fp, fm);
              if (!this['_planeOptions']['showLine'])
                  return;
              let fe = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fe = Object['assign'](Object['assign']({}, fe), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  }
              });
              const fA = J['RenderState']['fromCache'](fe)
                , fI = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20position;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUv;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUv=uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(position,0.,1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fx = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20weight1=1./6.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20weight2=weight1*0.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getRGBA2FloatConsts'])() + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20contourTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20depthTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20depthTest;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20showContour;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20showShaded;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20viewportDelta;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20contourlineWidth;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20contourWithPal;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20contourlineColor;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUv;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20bool\x20isContour(vec4\x20col,vec2\x20uv){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20center=' + K['qeGLFuncs']['qe_rgba2float'] + '(col);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20vpDelta=viewportDelta*contourlineWidth*0.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20surrounds[8];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[0]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(0.,vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[1]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(vpDelta.x,0.)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[2]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(0.,-vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[3]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(-vpDelta.x,0.)));\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[4]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vpDelta));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[5]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv-vpDelta));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[6]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(vpDelta.x,-vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[7]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv-vec2(vpDelta.x,-vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20alpha=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i=0;i<4;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(abs(surrounds[i]-center)>0.){\x20//not\x20same\x20range\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20alpha+=weight1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i=4;i<8;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(abs(surrounds[i]-center)>0.){\x20//not\x20same\x20range\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20alpha+=weight2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20alpha>=weight1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=vec4(0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=vec2(vUv.x,1.-vUv.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20col=' + K['glNames']['textureFunc'] + '(contourTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(depthTest){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20globeDepth\x20=\x20czm_unpackDepth(' + K['glNames']['textureFunc'] + '(czm_globeDepthTexture,\x20uv));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20cDepth=' + K['glNames']['textureFunc'] + '(depthTexture,uv).x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(cDepth-globeDepth>=0.005){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_FragDepth=cDepth;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!showContour\x20||\x20col.a<0.001){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isContour(col,uv)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(contourWithPal){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=col;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=contourlineColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fB = {
                  'position': 0x0,
                  'uv': 0x1
              }
                , fM = this['createContourVAO'](fp, fB)
                , fl = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fI,
                  'fragmentShaderSource': fK(fx, undefined, {
                      'defines': ['LOG_DEPTH_WRITE']
                  }),
                  'attributeLocations': fB
              })
                , fX = {
                  'contourTexture': ()=>this['_contourTexture'] || fp['defaultTexture'],
                  'depthTexture': ()=>this['_contourDepthTexture'] || fp['defaultTexture'],
                  'depthTest': ()=>this['_planeOptions']['depthTest'],
                  'showContour': ()=>this['_planeOptions']['showLine'],
                  'viewportDelta': ()=>this['_viewportDelta'],
                  'contourlineWidth': ()=>this['_planeOptions']['lineWidth'],
                  'contourWithPal': ()=>!this['_lineColor'],
                  'contourlineColor': ()=>this['_lineColor'] || J['Color']['TRANSPARENT']
              };
              this['_contourTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE']
              }),
              this['_contourDepthTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['DEPTH_COMPONENT'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_INT']
              }),
              fH['framebuffer'] = new J['Framebuffer']({
                  'context': fp,
                  'colorTextures': [this['_contourTexture']],
                  'depthTexture': this['_contourDepthTexture'],
                  'destroyAttachments': false
              }),
              fH['pass'] = J['Pass']['OPAQUE'];
              const fE = J['RenderState']['fromCache']({
                  'viewport': new J['BoundingRectangle'](0x0,0x0,fp['drawingBufferWidth'],fp['drawingBufferHeight'])
              })
                , fO = new J['ClearCommand']({
                  'color': new J['Color'](0x0,0x0,0x0,0x0),
                  'depth': 0x1,
                  'stencil': 0x0,
                  'pass': J['Pass']['OPAQUE']
              });
              return this['_contourClearCommand'] = fO,
              this['_contourClearCommand']['framebuffer'] = fH['framebuffer'],
              this['_contourClearCommand']['renderState'] = fE,
              this['_viewportDelta'] = new J['Cartesian2'](0x1 / fp['drawingBufferWidth'],0x1 / fp['drawingBufferHeight']),
              new J['DrawCommand']({
                  'vertexArray': fM,
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fA,
                  'shaderProgram': fl,
                  'uniformMap': fX,
                  'owner': this,
                  'pass': J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['update'](fp) {
              super['update'](fp),
              this['_visible'] && this['currentGrid'] && (this['_planeOptions']['fillMode'] !== K['GridDataGLFillMode']['none'] || this['_planeOptions']['showLine']) && ((0x0,
              J['defined'])(this['_drawCommand']) || (this['_drawCommand'] = this['createCommand'](fp['context']),
              this['_planeOptions']['showLine'] && (this['_contourCommand'] = this['createContourCommand'](fp['context']))),
              (0x0,
              J['defined'])(this['_drawCommand']) && (this['_planeOptions']['fillMode'] !== K['GridDataGLFillMode']['none'] && fp['commandList']['push'](this['_drawCommand']),
              this['_planeOptions']['showLine'] && (fp['commandList']['push'](this['_contourClearCommand']),
              fp['commandList']['push'](this['_shadedCommand']),
              fp['commandList']['push'](this['_contourCommand']))));
          }
          ['destroy']() {
              this['resetCommand'](),
              (0x0,
              J['destroyObject'])(this);
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['PixelLayerStyle3D'](fp);
          }
      }
      CPixelLayer['DefaultOptions'] = {
          'allowPicking': false,
          'cull': false
      };
      class CTracingService extends K['TracingService'] {
          constructor() {
              super({
                  'layerCreator': (fp,fR,fm)=>new CGeoJSONLayer(fp)['setDataSource'](fR)['setDrawOptions'](fm)
              });
          }
      }
      class fn extends fJ {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp, fn['DefaultOptions'])),
              this['dataPercent'] = 0x0,
              this['zValuesWithScale'] = [],
              this['updateTDataPercent'] = ()=>{
                  this['dataPercent'] = this['dataSource']['currentTIdx'] - this['dataSource']['getIntTIdx']();
              }
              ,
              this['transferCurrentData'] = ()=>{
                  var fR;
                  this['preTexture'] && (this['preTexture']['destroy'](),
                  this['preTexture'] = undefined,
                  this['preGrids'] = undefined),
                  this['preTexture2'] && (this['preTexture2']['destroy'](),
                  this['preTexture2'] = undefined,
                  this['preGrids2'] = undefined),
                  this['preTexture3'] && (this['preTexture3']['destroy'](),
                  this['preTexture3'] = undefined,
                  this['preGrids3'] = undefined),
                  this['options']['interpFromPreSource'] && (this['preGrids'] = this['currentGrids'],
                  this['preGrids2'] = this['currentGrids2'],
                  this['preGrids3'] = this['currentGrids3'],
                  this['preTexture'] = this['currentTexture'],
                  this['preTexture2'] = this['currentTexture2'],
                  this['preTexture3'] = this['currentTexture3'],
                  this['dataPercent'] = 0x0);
                  const fm = this['dataSource']['getIntTIdx']()
                    , fH = this['dataSource'];
                  fH['getU'] ? ('sd' === this['vectorGridMode'] ? (this['currentGrids'] = fH['allS']()[fm],
                  this['currentGrids2'] = fH['allD']()[fm]) : (this['currentGrids'] = fH['allU']()[fm],
                  this['currentGrids2'] = fH['allV']()[fm]),
                  this['currentGrids3'] = fH['allW'] && (null === (fR = fH['allW']()) || undefined === fR ? undefined : fR['length']) && fH['allW']()[fm]) : this['currentGrids'] = this['dataSource']['allGrids']()[fm],
                  this['currentTexture'] = undefined,
                  this['currentTexture2'] = undefined,
                  this['currentTexture3'] = undefined;
              }
              ;
          }
          ['resetCommand'](fp) {}
          ['setZScale']() {
              this['dataSource'] && this['drawOptions'] && (this['zValuesWithScale'] = this['dataSource']['gridOptions']['zValues']['map'](fp=>fp * this['drawOptions']['zScale']));
          }
          ['setDrawOptions'](fp, fR) {
              return super['setDrawOptions'](fp, fR),
              this['setZScale'](),
              this;
          }
          ['unsetDataSourceListener']() {
              this['dataSource']['offTChanged'](this['updateTDataPercent']),
              this['dataSource']['offIntTChanged'](this['transferCurrentData']);
          }
          ['setDataSourceListener']() {
              this['options']['trackDataSource'] && (this['dataSource']['onTChanged'](this['updateTDataPercent']),
              this['dataSource']['onIntTChanged'](this['transferCurrentData']),
              this['dataSource']['onActiveGridUpdated'](this['transferCurrentData']));
          }
          ['setLayerOptions'](fp, fR=true) {
              super['setLayerOptions'](fp, fR),
              this['options']['trackDataSource'] != this['options']['trackDataSource'] && this['dataSource'] && (this['unsetDataSourceListener'](),
              this['setDataSourceListener']());
          }
          ['setDataSource'](fp) {
              var fR;
              if (fp) {
                  if (this['dataSource'] && this['dataSource'] !== fp && (this['unsetDataSourceListener'](),
                  this['dataPercent'] = 0x0,
                  this['preGrids'] = undefined,
                  this['preGrids2'] = undefined,
                  this['preGrids3'] = undefined,
                  this['preTexture'] && this['preTexture']['destroy'](),
                  this['preTexture2'] && this['preTexture2']['destroy'](),
                  this['preTexture3'] && this['preTexture3']['destroy'](),
                  this['preTexture'] = undefined,
                  this['preTexture2'] = undefined,
                  this['preTexture3'] = undefined,
                  this['currentTexture'] && this['currentTexture']['destroy'](),
                  this['currentTexture'] = undefined),
                  !this['dataSource'] || this['dataSource'] !== fp) {
                      this['dataSource'] = fp,
                      this['setDataSourceListener']();
                      const fm = this['dataSource']['getIntTIdx']()
                        , fH = this['dataSource'];
                      fH['getU'] ? ('sd' === this['vectorGridMode'] ? (this['currentGrids'] = fH['allS']()[fm],
                      this['currentGrids2'] = fH['allD']()[fm]) : (this['currentGrids'] = fH['allU']()[fm],
                      this['currentGrids2'] = fH['allV']()[fm]),
                      this['currentGrids3'] = fH['allW'] && (null === (fR = fH['allW']()) || undefined === fR ? undefined : fR['length']) && fH['allW']()[fm]) : this['currentGrids'] = this['dataSource']['allGrids']()[fm];
                  }
                  return this['setZScale'](),
                  this;
              }
              K['logger']['warn']('数据源为空，无法更新！');
          }
          ['clearPreDataSource']() {
              this['preGrids'] = undefined,
              this['preGrids2'] = undefined,
              this['preGrids3'] = undefined,
              this['preTexture'] && this['preTexture']['destroy'](),
              this['preTexture2'] && this['preTexture2']['destroy'](),
              this['preTexture3'] && this['preTexture3']['destroy'](),
              this['preTexture'] = undefined,
              this['preTexture2'] = undefined,
              this['preTexture3'] = undefined,
              this['dataPercent'] = 0x0;
          }
          ['update'](fp) {
              super['update'](fp),
              this['_visible'] && (this['sizeChanging'] || this['sizeChanged'] && (this['resetCommand'](false),
              this['sizeChanged'] = false));
          }
      }
      fn['DefaultOptions'] = {};
      class CGeometryLayer extends fn {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp || {}, CGeometryLayer['DefaultOptions'])),
              this['_dirty'] = false;
          }
          ['setDrawOptions'](fp, fR=true) {
              var fm;
              super['setDrawOptions'](fp, fR);
              const fH = null === (fm = this['_planeOptions']) || undefined === fm ? undefined : fm['opaque'];
              if (this['_planeOptions'] = this['drawOptions']['getPlaneOptions'](undefined, this['options']['cacheDrawOptions']),
              this['_planeOptions']['fillColor']) {
                  const fI = this['parseColorStopRules'](this['_planeOptions']['fillColor']);
                  this['fillColors'] = fI['colors'],
                  this['fillSteps'] = fI['steps'];
              } else
                  this['_csTexture'] && (this['_csTexture'] && this['_csTexture']['destroy'](),
                  this['_csTexture'] = undefined),
                  this['_updateColorScaleMaxMin']();
              const fe = this['_planeOptions']['emission']['glNumberArray']();
              this['_emission'] = new J['Cartesian3'](fe[0x0],fe[0x1],fe[0x2]);
              const fA = this['_planeOptions']['diffuse']['glNumberArray']();
              return this['_diffuse'] = new J['Cartesian3'](fA[0x0],fA[0x1],fA[0x2]),
              this['_planeOptions']['opaque'] !== fH && this['_command'] && (this['_dirty'] = true),
              this['dataSource'] && this['drawOptions']['section'] && this['_updateSecInfo'](),
              this;
          }
          ['setDataSource'](fp) {
              return super['setDataSource'](fp),
              this['_updateColorScaleMaxMin'](),
              this;
          }
          ['_updateColorScaleMaxMin']() {
              var fp, fR;
              if (this['dataSource'] && (null === (fR = null === (fp = this['_planeOptions']) || undefined === fp ? undefined : fp['colorScale']) || undefined === fR ? undefined : fR['colorScale']) && (!(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['min']) || !(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['max']))) {
                  K['logger']['debug']('当前colorScale没有配置最大或者最小值，将使用数据中的值，可能造成连续动画时最大最小值不一致！');
                  const fm = this['dataSource']['getGrid']()['maxMin'];
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['min']) || (this['_planeOptions']['colorScale']['min'] = fm['min']),
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['max']) || (this['_planeOptions']['colorScale']['max'] = fm['max']);
              }
          }
          ['_updateSecInfo']() {
              var fp, fR, fm, fH, fe, fA;
              const fI = this['dataSource']['gridOptions']
                , fx = (0x0,
              K['gridOptionsToExtent'])(fI)
                , fB = Object['assign']({}, this['drawOptions']['section']);
              fB['maxHeight'] = Math['min'](null !== (fp = this['drawOptions']['section']['maxHeight'] * this['drawOptions']['zScale']) && undefined !== fp ? fp : 0x1 / 0x0, this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1]),
              fB['minHeight'] = Math['max'](null !== (fR = this['drawOptions']['section']['minHeight'] * this['drawOptions']['zScale']) && undefined !== fR ? fR : -0x1 / 0x0, this['zValuesWithScale'][0x0]),
              fB['minLat'] = Math['max'](null !== (fm = this['drawOptions']['section']['minLat']) && undefined !== fm ? fm : -0x1 / 0x0, fx['minLat']),
              fB['maxLat'] = Math['min'](null !== (fH = this['drawOptions']['section']['maxLat']) && undefined !== fH ? fH : 0x1 / 0x0, fx['maxLat']),
              fB['minLon'] = Math['max'](null !== (fe = this['drawOptions']['section']['minLon']) && undefined !== fe ? fe : -0x1 / 0x0, fx['minLon']),
              fB['maxLon'] = Math['min'](null !== (fA = this['drawOptions']['section']['maxLon']) && undefined !== fA ? fA : 0x1 / 0x0, fx['maxLon']),
              this['_secStart'] = new J['Cartesian3'](fB['minLon'],fB['minLat'],fB['minHeight']),
              this['_secEnd'] = new J['Cartesian3'](fB['maxLon'],fB['maxLat'],fB['maxHeight']);
          }
          ['resetCommand'](fp=false) {
              var fR, fm, fH;
              this['_command'] && (null === (fm = null === (fR = this['_command']) || undefined === fR ? undefined : fR['shaderProgram']) || undefined === fm || fm['destroy'](),
              this['_command'] = undefined,
              fp && (null === (fH = this['_vao']) || undefined === fH || fH['destroy'](),
              this['_vao'] = undefined));
          }
          ['_getIndicesArr'](fp, fR) {
              if (0x1 === fp)
                  return new Uint8Array(fR);
              if (0x2 === fp)
                  return new Uint16Array(fR);
              if (0x4 === fp)
                  return new Uint32Array(fR);
              throw new Error('不能识别的索引单个长度：' + fp);
          }
          ['_mergeGeometry'](fp) {
              var fR;
              const fm = {};
              if (0x1 === fp['vertices']['length']) {
                  fm['vertices'] = new Float32Array(fp['vertices'][0x0]);
                  const F2 = fp['indices'][0x0]['len'];
                  return fm['indices'] = this['_getIndicesArr'](F2, fp['indices'][0x0]['data']),
                  fm['normals'] = new Float32Array(fp['normals'][0x0]),
                  (null === (fR = fp['values']) || undefined === fR ? undefined : fR['length']) && (fm['values'] = new Float32Array(fp['values'][0x0])),
                  fm;
              }
              fp['values'] = fp['values'] || [];
              let fH = 0x0
                , fe = 0x0
                , fA = 0x0
                , fI = 0x0;
              for (let F3 = 0x0; F3 < fp['indices']['length']; F3++)
                  fH += fp['vertices'][F3]['byteLength'] / 0x4,
                  fe += fp['indices'][F3]['data']['byteLength'] / fp['indices'][F3]['len'],
                  fA += fp['normals'][F3]['byteLength'] / 0x4,
                  fp['values'][F3] && (fI += fp['values'][F3]['byteLength'] / 0x4);
              const fx = new Float32Array(fH)
                , fB = new Float32Array(fA)
                , fM = new Float32Array(fI);
              let fl = 0x0
                , fX = 0x0
                , fE = 0x0;
              for (let F4 = 0x0; F4 < fp['indices']['length']; F4++) {
                  const F5 = new Float32Array(fp['vertices'][F4]);
                  fx['set'](F5, fl),
                  fl += F5['length'];
                  const F6 = new Float32Array(fp['normals'][F4]);
                  if (fB['set'](F6, fX),
                  fX += F6['length'],
                  fp['values'][F4]) {
                      const F7 = new Float32Array(fp['values'][F4]);
                      fM['set'](F7, fE),
                      fE += F7['length'];
                  }
              }
              const fO = fH / 0x3 > 0xffff ? new Uint32Array(fe) : new Uint16Array(fe);
              let F0 = 0x0
                , F1 = 0x0;
              for (let F8 = 0x0; F8 < fp['indices']['length']; F8++) {
                  const F9 = fp['vertices'][F8]['byteLength'] / 0xc
                    , Ff = this['_getIndicesArr'](fp['indices'][F8]['len'], fp['indices'][F8]['data']);
                  F0 > 0x0 ? Ff['forEach'](FF=>{
                      fO[F1++] = FF + F0;
                  }
                  ) : (fO['set'](Ff),
                  F1 = Ff['length']),
                  F0 += F9;
              }
              return fm['vertices'] = fx,
              fm['indices'] = fO,
              fm['normals'] = fB,
              fm['values'] = fM,
              fm;
          }
          ['_createCommand'](fp) {
              var fR, fm, fH, fe, fA;
              let fI = this['options'];
              if (this['options']['vertices']instanceof Array) {
                  const F9 = {
                      'vertices': [],
                      'indices': [],
                      'normals': [],
                      'values': []
                  };
                  this['options']['vertices']['forEach']((Ff,FF)=>{
                      var Fd;
                      F9['vertices']['push'](Ff['buffer']),
                      F9['indices']['push']({
                          'len': this['options']['indices'][FF]instanceof Uint16Array ? 0x2 : 0x4,
                          'data': this['options']['indices'][FF]['buffer']
                      }),
                      F9['normals']['push'](this['options']['normals'][FF]['buffer']),
                      (null === (Fd = this['options']['values']) || undefined === Fd ? undefined : Fd['length']) && F9['values']['push'](this['options']['values'][FF]['buffer']);
                  }
                  ),
                  fI = this['_mergeGeometry'](F9);
              }
              const fx = {
                  'pos': new J['GeometryAttribute']({
                      'componentDatatype': J['ComponentDatatype']['FLOAT'],
                      'componentsPerAttribute': 0x3,
                      'values': fI['vertices'],
                      'normalize': false
                  }),
                  'normal': new J['GeometryAttribute']({
                      'componentDatatype': J['ComponentDatatype']['FLOAT'],
                      'componentsPerAttribute': 0x3,
                      'values': fI['normals'],
                      'normalize': false
                  })
              };
              (null === (fR = fI['values']) || undefined === fR ? undefined : fR['length']) && (fx['a_val'] = new J['GeometryAttribute']({
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'componentsPerAttribute': 0x1,
                  'values': fI['values'],
                  'normalize': false
              })),
              this['drawOptions']['section'] && !this['_secStart'] ? this['_updateSecInfo']() : (this['_secStart'] = new J['Cartesian3'](),
              this['_secEnd'] = new J['Cartesian3']());
              const fB = new J['Geometry']({
                  'attributes': fx,
                  'indices': fI['indices']
              })
                , fM = {
                  'pos': 0x0,
                  'normal': 0x1,
                  'a_val': 0x2
              };
              this['_vao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fB,
                  'attributeLocations': fM,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              const fl = (null === (fm = this['fillSteps']) || undefined === fm ? undefined : fm['length']) || 0x1
                , fX = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20normal;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + ((null === (fH = fI['values']) || undefined === fH ? undefined : fH['length']) > 0x0 ? K['glNames']['attrIn'] + '\x20float\x20a_val;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20' + K['glNames']['attrIn'] + '\x20vec2\x20st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20v_normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec4\x20v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20' + K['glNames']['varOut'] + '\x20vec2\x20v_st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount=' + fl + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20highp\x20int\x20fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasCs;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMax;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20csTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20secStart;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20secEnd;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20secMode;\x20//<=0\x20off,1:rect,2:tilt\x0a\x20\x20\x20\x20\x20\x20\x20\x20flat\x20out\x20int\x20used;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20clockWise(vec2\x20pt){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20(secStart.x-pt.x)*(secEnd.y-pt.y)-(secStart.y-pt.y)*(secEnd.x-pt.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20position=vec3(pos.xyz);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20geoPos=' + K['qeGLFuncs']['qe_cartesian2deg'] + '(position,true);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20position=' + K['qeGLFuncs']['qe_deg2cartesianV2'] + '(geoPos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20used=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(secMode>0){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(geoPos.z<secStart.z\x20||\x20geoPos.z\x20>\x20secEnd.z)\x20used=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(secMode==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//need\x20plane\x20section\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(geoPos.x\x20<\x20secStart.x\x20||\x20geoPos.x>secEnd.x)\x20used=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20else\x20if(geoPos.y\x20<\x20secStart.y\x20||\x20geoPos.y>secEnd.y)\x20used=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(secMode==2){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//tilt\x20section\x20不再做参数检测，顺时针在右侧\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(clockWise(geoPos.xy)<0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20used=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(geoPos.z<=zAttr.x){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=0.;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(geoPos.z>=zAttr.y){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=1.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=(geoPos.z-zAttr.x)/(zAttr.y-zAttr.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uv=vec3(' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(geoPos.xy,xAttr,yAttr),w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//todo\x20get\x20w\x20weight\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20worldPosition=vec4(position,1.0);\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_positionEC\x20=\x20(czm_modelView\x20*\x20vec4(position,\x201.0)).xyz;\x20\x20\x20\x20\x20\x20\x20//\x20position\x20in\x20eye\x20coordinates\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_normalEC\x20=\x20czm_normal\x20*\x20normal;\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20normal\x20in\x20eye\x20coordinates\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + ((null === (fe = fI['values']) || undefined === fe ? undefined : fe['length']) ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasCs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=' + K['qeGLFuncs']['qe_getColorByScale'] + '(a_val);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0\x20||\x20fillMode>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=' + K['qeGLFuncs']['qe_getColor'] + '(a_val);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=' + K['qeGLFuncs']['qe_interpColor'] + '(a_val);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=vec4(1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20v_st\x20=\x20st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=czm_modelViewProjection\x20*\x20worldPosition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fE = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20int;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler3D;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount=' + fl + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20dataTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasW;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['dataSource']['getGrid'](), false) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20highp\x20int\x20fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasCs;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMax;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20csTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20isFlat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20u_diffuse;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20u_emission;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_specular;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_shininess;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20v_normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20' + K['glNames']['varIn'] + '\x20vec2\x20v_st;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec4\x20v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20flat\x20in\x20int\x20used;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==-1\x20||\x20used==0){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0){\x20//shaded\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//none\x20interp\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x20//interp\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20tColor=vec4(0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + ((null === (fA = fI['values']) || undefined === fA ? undefined : fA['length']) ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tColor=v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20d_uv=vec3(uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20u=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(dataTexture,d_uv,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20speed=u.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasCs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tColor=' + K['qeGLFuncs']['qe_getColorByScale'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0\x20||\x20fillMode>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tColor=' + K['qeGLFuncs']['qe_getColor'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tColor=' + K['qeGLFuncs']['qe_interpColor'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tColor.a=tColor.a*globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tColor.a<0.001){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isFlat){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20tColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20FLAT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20tColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20positionToEyeEC\x20=\x20-v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20normalEC\x20=\x20normalize(v_normalEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20FACE_FORWARD\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20normalEC\x20=\x20faceforward(normalEC,\x20vec3(0.0,\x200.0,\x201.0),\x20-normalEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20czm_materialInput\x20materialInput;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20materialInput.normalEC\x20=\x20normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20materialInput.positionToEyeEC\x20=\x20positionToEyeEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20materialInput.st\x20=\x20v_st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20czm_material\x20material\x20=\x20czm_getDefaultMaterial(materialInput);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tColor=czm_gammaCorrect(tColor);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.diffuse=tColor.xyz+u_diffuse;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.emission=u_emission;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.specular=u_specular;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.shininess=u_shininess;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.alpha=tColor.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20czm_phong(normalize(positionToEyeEC),\x20material,czm_lightDirectionEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fO = fK(fX, undefined, {})
                , F0 = fK(fE, undefined, {})
                , F1 = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fO,
                  'fragmentShaderSource': F0,
                  'attributeLocations': fM
              })
                , F2 = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , F3 = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                , F4 = new J['Cartesian3'](this['zValuesWithScale'][0x0],this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1],this['zValuesWithScale']['length'])
                , F5 = fv(fp)
                , F6 = {
                  'xAttr': ()=>F2,
                  'yAttr': ()=>F3,
                  'zAttr': ()=>F4,
                  'dataTexture': ()=>this['currentTexture'] || (this['currentTexture'] = fQ(fp, this['currentGrids'], this['dataSource']['gridOptions'], undefined)),
                  'colors': ()=>this['fillColors'] || [],
                  'steps': ()=>this['fillSteps'] || [],
                  'fillMode': ()=>this['_planeOptions']['fillMode'],
                  'csMin': ()=>{
                      var Ff, FF;
                      return null !== (FF = null === (Ff = this['_planeOptions']['colorScale']) || undefined === Ff ? undefined : Ff['min']) && undefined !== FF ? FF : 0x0;
                  }
                  ,
                  'csMax': ()=>{
                      var Ff, FF;
                      return null !== (FF = null === (Ff = this['_planeOptions']['colorScale']) || undefined === Ff ? undefined : Ff['max']) && undefined !== FF ? FF : 0x1;
                  }
                  ,
                  'csTexture': ()=>this['_planeOptions']['colorScale'] ? this['_csTexture'] || (this['_csTexture'] = fb(fp, this['_planeOptions']['colorScale']['colorScale'])) : F5,
                  'hasCs': ()=>(0x0,
                  J['defined'])(this['_planeOptions']['colorScale']),
                  'globalOpacity': ()=>{
                      var Ff;
                      return null !== (Ff = this['_planeOptions']['globalOpacity']) && undefined !== Ff ? Ff : 0x1;
                  }
                  ,
                  'hasW': ()=>(0x0,
                  J['defined'])(this['currentGrids3']),
                  'isFlat': ()=>this['_planeOptions']['flat'],
                  'u_emission': ()=>this['_emission'],
                  'u_diffuse': ()=>this['_diffuse'],
                  'u_specular': ()=>this['_planeOptions']['specular'],
                  'u_shininess': ()=>this['_planeOptions']['shininess'],
                  'secMode': ()=>this['drawOptions']['section'] ? this['drawOptions']['sectionMode'] : 0x0,
                  'secStart': ()=>this['_secStart'],
                  'secEnd': ()=>this['_secEnd']
              };
              (0x0,
              K['setAlgoUniforms'])(this['dataSource']['getGrid'](), F6);
              let F7 = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              F7 = Object['assign'](Object['assign']({}, F7), {
                  'depthTest': {
                      'enabled': this['_planeOptions']['depthTest']
                  },
                  'depthMask': {
                      'enabled': this['_planeOptions']['depthTest']
                  }
              });
              const F8 = J['RenderState']['fromCache'](F7);
              this['_command'] = new J['DrawCommand']({
                  'vertexArray': this['_vao'],
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': F8,
                  'shaderProgram': F1,
                  'uniformMap': F6,
                  'owner': this,
                  'pass': this['_planeOptions']['opaque'] ? J['Pass']['OPAQUE'] : J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix']
              }),
              this['_dirty'] = false;
          }
          ['update'](fp) {
              if (super['update'](fp),
              !this['_visible'] || !this['currentGrids'])
                  return;
              const fR = fp['context'];
              this['_command'] ? this['_dirty'] && (this['resetCommand'](),
              this['_createCommand'](fR)) : this['_createCommand'](fR),
              this['_command'] ? fp['commandList']['push'](this['_command']) : K['logger']['warn']('创建Geometry渲染器失败！');
          }
          ['destroy']() {
              this['resetCommand'](true),
              (0x0,
              J['destroyObject'])(this);
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['Geometry3DLayerStyle'](fp);
          }
      }
      function cColor(fp) {
          const fR = fp['getColor']();
          return new J['Color'](fR['r1'],fR['g1'],fR['b1'],fR['a']);
      }
      function createCTileLayer(fp) {
          let fR = Object['assign']({}, (0x0,
          K['getImageTileUrls'])(fp));
          return fR['tms'] && (fR['url'] = fR['url']['replaceAll']('{y}', '{reverseY}')),
          new J['UrlTemplateImageryProvider'](fR);
      }
      function mcbGeometryLayerCreator(fp, fR, fm) {
          var fH, fe;
          const fA = new K['Geometry3DLayerStyle'](fp)
            , fI = fR['allMeshes']()[fR['getIntTIdx']()][0x0];
          if (!(null === (fH = null == fI ? undefined : fI['meshes']) || undefined === fH ? undefined : fH['length']))
              return;
          fR['gridOptions'] || K['logger']['error']('MCB图层的数据源需要提供gridOptions！');
          const fx = fR['gridOptions']['zValues']
            , fB = fR['gridOptions']['xStart']
            , fM = fR['gridOptions']['xDelta']
            , fl = fR['gridOptions']['yStart']
            , fX = fR['gridOptions']['yDelta']
            , fE = null !== (fe = fA['zScale']) && undefined !== fe ? fe : 0x1
            , fO = {
              'vertices': [],
              'indices': [],
              'normals': [],
              'values': []
          };
          fI['meshes']['forEach'](F1=>{
              let F2 = new Float32Array(F1['vertices']);
              if (0x0 === F2['length'])
                  return;
              const F3 = new Float32Array(F2['length']);
              for (let F9 = 0x0; F9 < F2['length']; F9 += 0x3) {
                  let Ff = F2[F9 + 0x2] - 0x1;
                  Ff = Math['max'](0x0, Ff);
                  let FF, Fd = Math['floor'](Ff), Fb = Ff - Fd;
                  FF = 0x0 === Fb ? fx[Fd] : fx[Fd] + (fx[Fd + 0x1] - fx[Fd]) * Fb;
                  const Fw = J['Cartesian3']['fromDegrees'](fB + fM * F2[F9], fl + fX * F2[F9 + 0x1], FF * fE);
                  F3[F9] = Fw['x'],
                  F3[F9 + 0x1] = Fw['y'],
                  F3[F9 + 0x2] = Fw['z'];
              }
              let F4;
              if (F1['indices'])
                  F4 = new Uint32Array(F1['indices']);
              else {
                  F4 = new Uint32Array(F3['length'] / 0x3);
                  for (let FQ = 0x0; FQ < F4['length']; FQ++)
                      F4[FQ] = FQ;
              }
              let F5 = new J['Geometry']({
                  'attributes': {
                      'position': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': F3
                      })
                  },
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'indices': F4
              });
              F5 = J['GeometryPipeline']['computeNormal'](F5);
              const F6 = F3['length'] / 0x3
                , F7 = new Float32Array(F6);
              F7['fill'](parseFloat(F1['properties']['value']));
              const F8 = F5['attributes']['normal']['values'];
              fO['vertices']['push'](F3),
              fO['indices']['push'](F4),
              fO['normals']['push'](F8),
              fO['values']['push'](F7);
          }
          );
          const F0 = new CGeometryLayer(fO);
          return F0['setDrawOptions'](fA)['setDataSource'](fm),
          F0;
      }
      function mcbLayerCreator(fp, fR) {
          var fm, fH;
          const fe = new K['VolumeLayerStyle'](fp)
            , fA = fR['allMeshes']()[fR['getIntTIdx']()][0x0];
          if (!(null === (fm = null == fA ? undefined : fA['meshes']) || undefined === fm ? undefined : fm['length']))
              return;
          fR['gridOptions'] || K['logger']['error']('MCB图层的数据源需要提供gridOptions！');
          const fI = []
            , fx = fR['gridOptions']['zValues']
            , fB = fR['gridOptions']['xStart']
            , fM = fR['gridOptions']['xDelta']
            , fl = fR['gridOptions']['yStart']
            , fX = fR['gridOptions']['yDelta']
            , fE = null !== (fH = fe['zScale']) && undefined !== fH ? fH : 0x1;
          return fA['meshes']['forEach'](fO=>{
              let F0 = new Float32Array(fO['vertices']);
              if (0x0 === F0['length'])
                  return;
              const F1 = new Float64Array(F0['length']);
              for (let F6 = 0x0; F6 < F0['length']; F6 += 0x3) {
                  let F7 = F0[F6 + 0x2] - 0x1;
                  F7 = Math['max'](0x0, F7);
                  let F8, F9 = Math['floor'](F7), Ff = F7 - F9;
                  F8 = 0x0 === Ff ? fx[F9] : fx[F9] + (fx[F9 + 0x1] - fx[F9]) * Ff;
                  const FF = J['Cartesian3']['fromDegrees'](fB + fM * F0[F6], fl + fX * F0[F6 + 0x1], F8 * fE);
                  F1[F6] = FF['x'],
                  F1[F6 + 0x1] = FF['y'],
                  F1[F6 + 0x2] = FF['z'];
              }
              let F2;
              if (fO['indices'])
                  F2 = new Uint32Array(fO['indices']);
              else {
                  F2 = new Uint32Array(F1['length'] / 0x3);
                  for (let Fd = 0x0; Fd < F2['length']; Fd++)
                      F2[Fd] = Fd;
              }
              let F3 = new J['Geometry']({
                  'attributes': {
                      'position': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['DOUBLE'],
                          'componentsPerAttribute': 0x3,
                          'values': F1
                      })
                  },
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'indices': F2,
                  'boundingSphere': J['BoundingSphere']['fromVertices'](F1)
              });
              F3 = J['GeometryPipeline']['computeNormal'](F3);
              const F4 = fe['color']['getRule'](fO['properties']['value'])['stop']['glNumberArray']()
                , F5 = new J['GeometryInstance']({
                  'geometry': F3,
                  'modelMatrix': J['Matrix4']['IDENTITY'],
                  'attributes': {
                      'color': new J['ColorGeometryInstanceAttribute'](F4[0x0],F4[0x1],F4[0x2],F4[0x3])
                  },
                  'id': (0x0,
                  K['uid'])()
              });
              fI['push'](F5);
          }
          ),
          0x0 === fI['length'] ? (K['logger']['debug']('当前分析对象在指定的分析值下没有有效等值面！'),
          new J['Primitive']({
              'allowPicking': false
          })) : new J['Primitive']({
              'geometryInstances': fI,
              'appearance': new J['PerInstanceColorAppearance']({
                  'flat': false,
                  'translucent': !fe['opaque']
              }),
              'asynchronous': false,
              'allowPicking': false
          });
      }
      CGeometryLayer['DefaultOptions'] = {};
      class fi extends J['BillboardCollection'] {
          ['update'](fp) {
              J['BillboardCollection']['prototype']['update']['call'](this, fp);
          }
      }
      function fs(fp) {
          if (!fp)
              throw new Error('coord\x20is\x20required');
          if (!Array['isArray'](fp)) {
              if ('Feature' === fp['type'] && null !== fp['geometry'] && 'Point' === fp['geometry']['type'])
                  return fp['geometry']['coordinates'];
              if ('Point' === fp['type'])
                  return fp['coordinates'];
          }
          if (Array['isArray'](fp) && fp['length'] >= 0x2 && !Array['isArray'](fp[0x0]) && !Array['isArray'](fp[0x1]))
              return fp;
          throw new Error('coord\x20must\x20be\x20GeoJSON\x20Point\x20or\x20an\x20Array\x20of\x20numbers');
      }
      const fg = function(fp, fR, fm) {
          undefined === fm && (fm = {});
          var fH = fs(fp)
            , fe = fs(fR)
            , fA = f7(fe[0x1] - fH[0x1])
            , fI = f7(fe[0x0] - fH[0x0])
            , fx = f7(fH[0x1])
            , fB = f7(fe[0x1])
            , fM = Math['pow'](Math['sin'](fA / 0x2), 0x2) + Math['pow'](Math['sin'](fI / 0x2), 0x2) * Math['cos'](fx) * Math['cos'](fB);
          return function(fl, fX) {
              undefined === fX && (fX = 'kilometers');
              var fE = f2[fX];
              if (!fE)
                  throw new Error(fX + '\x20units\x20is\x20invalid');
              return fl * fE;
          }(0x2 * Math['atan2'](Math['sqrt'](fM), Math['sqrt'](0x1 - fM)), fm['units']);
      };
      function fu(fp, fR, fm) {
          if (undefined === fm && (fm = {}),
          true === fm['final'])
              return function(fX, fE) {
                  var fO = fu(fE, fX);
                  return (fO + 0xb4) % 0x168;
              }(fp, fR);
          var fH = fs(fp)
            , fe = fs(fR)
            , fA = f7(fH[0x0])
            , fI = f7(fe[0x0])
            , fx = f7(fH[0x1])
            , fB = f7(fe[0x1])
            , fM = Math['sin'](fI - fA) * Math['cos'](fB)
            , fl = Math['cos'](fx) * Math['sin'](fB) - Math['sin'](fx) * Math['cos'](fB) * Math['cos'](fI - fA);
          return f6(Math['atan2'](fM, fl));
      }
      function fk(fp, fR, fm, fH) {
          undefined === fH && (fH = {});
          var fe = fs(fp)
            , fA = f7(fe[0x0])
            , fI = f7(fe[0x1])
            , fx = f7(fm)
            , fB = function(fl, fX) {
              undefined === fX && (fX = 'kilometers');
              var fE = f2[fX];
              if (!fE)
                  throw new Error(fX + '\x20units\x20is\x20invalid');
              return fl / fE;
          }(fR, fH['units'])
            , fM = Math['asin'](Math['sin'](fI) * Math['cos'](fB) + Math['cos'](fI) * Math['sin'](fB) * Math['cos'](fx));
          return f4([f6(fA + Math['atan2'](Math['sin'](fx) * Math['sin'](fB) * Math['cos'](fI), Math['cos'](fB) - Math['sin'](fI) * Math['sin'](fM))), f6(fM)], fH['properties']);
      }
      const fy = function(fp, fR, fm, fH) {
          if (!f9(fH = fH || {}))
              throw new Error('options\x20is\x20invalid');
          var fe, fA = [];
          if ('Feature' === fp['type'])
              fe = fp['geometry']['coordinates'];
          else {
              if ('LineString' !== fp['type'])
                  throw new Error('input\x20must\x20be\x20a\x20LineString\x20Feature\x20or\x20Geometry');
              fe = fp['coordinates'];
          }
          for (var fI, fx, fB, fM = fe['length'], fl = 0x0, fX = 0x0; fX < fe['length'] && !(fR >= fl && fX === fe['length'] - 0x1); fX++) {
              if (fl > fR && 0x0 === fA['length']) {
                  if (!(fI = fR - fl))
                      return fA['push'](fe[fX]),
                      f5(fA);
                  fx = fu(fe[fX], fe[fX - 0x1]) - 0xb4,
                  fB = fk(fe[fX], fI, fx, fH),
                  fA['push'](fB['geometry']['coordinates']);
              }
              if (fl >= fm)
                  return (fI = fm - fl) ? (fx = fu(fe[fX], fe[fX - 0x1]) - 0xb4,
                  fB = fk(fe[fX], fI, fx, fH),
                  fA['push'](fB['geometry']['coordinates']),
                  f5(fA)) : (fA['push'](fe[fX]),
                  f5(fA));
              if (fl >= fR && fA['push'](fe[fX]),
              fX === fe['length'] - 0x1)
                  return f5(fA);
              fl += fg(fe[fX], fe[fX + 0x1], fH);
          }
          if (fl < fR && fe['length'] === fM)
              throw new Error('Start\x20position\x20is\x20beyond\x20line');
          var fE = fe[fe['length'] - 0x1];
          return f5([fE, fE]);
      }
        , fZ = function(fp, fR, fm) {
          if (!f9(fm = fm || {}))
              throw new Error('options\x20is\x20invalid');
          var fH = fm['units']
            , fe = fm['reverse'];
          if (!fp)
              throw new Error('geojson\x20is\x20required');
          if (fR <= 0x0)
              throw new Error('segmentLength\x20must\x20be\x20greater\x20than\x200');
          var fA = [];
          return fF(fp, function(fI) {
              fe && (fI['geometry']['coordinates'] = fI['geometry']['coordinates']['reverse']()),
              function(fx, fB, fM, fl) {
                  var fX = function(F0, F1) {
                      return undefined === F1 && (F1 = {}),
                      function(F2, F3, F4) {
                          var F5 = F4
                            , F6 = false;
                          return function(F7, F8) {
                              fF(F7, function(F9, Ff, FF) {
                                  var Fd = 0x0;
                                  if (F9['geometry']) {
                                      var Fb = F9['geometry']['type'];
                                      if ('Point' !== Fb && 'MultiPoint' !== Fb) {
                                          var Fw, FQ = 0x0, Fv = 0x0, Ft = 0x0;
                                          return false !== ff(F9, function(FK, FJ, FC, Fj, Fc) {
                                              if (undefined === Fw || Ff > FQ || Fj > Fv || Fc > Ft)
                                                  return Fw = FK,
                                                  FQ = Ff,
                                                  Fv = Fj,
                                                  Ft = Fc,
                                                  void (Fd = 0x0);
                                              var Fn = f5([Fw, FK], F9['properties']);
                                              if (false === F8(Fn, Ff, FF, Fc, Fd))
                                                  return false;
                                              Fd++,
                                              Fw = FK;
                                          }) && undefined;
                                      }
                                  }
                              });
                          }(F2, function(F7, F8, F9, Ff, FF) {
                              F5 = false === F6 && undefined === F4 ? F7 : F3(F5, F7, F8, F9, Ff, FF),
                              F6 = true;
                          }),
                          F5;
                      }(F0, function(F2, F3) {
                          var F4 = F3['geometry']['coordinates'];
                          return F2 + fg(F4[0x0], F4[0x1], F1);
                      }, 0x0);
                  }(fx, {
                      'units': fM
                  });
                  if (fX <= fB)
                      return fl(fx);
                  var fE = fX / fB;
                  Number['isInteger'](fE) || (fE = Math['floor'](fE) + 0x1);
                  for (var fO = 0x0; fO < fE; fO++)
                      fl(fy(fx, fB * fO, fB * (fO + 0x1), {
                          'units': fM
                      }));
              }(fI, fR, fH, function(fx) {
                  fA['push'](fx);
              });
          }),
          function(fI, fx) {
              undefined === fx && (fx = {});
              var fB = {
                  'type': 'FeatureCollection'
              };
              return fx['id'] && (fB['id'] = fx['id']),
              fx['bbox'] && (fB['bbox'] = fx['bbox']),
              fB['features'] = fI,
              fB;
          }(fA);
      };
      function fh(fp) {
          var fR = [0x1 / 0x0, 0x1 / 0x0, -0x1 / 0x0, -0x1 / 0x0];
          return ff(fp, function(fm) {
              fR[0x0] > fm[0x0] && (fR[0x0] = fm[0x0]),
              fR[0x1] > fm[0x1] && (fR[0x1] = fm[0x1]),
              fR[0x2] < fm[0x0] && (fR[0x2] = fm[0x0]),
              fR[0x3] < fm[0x1] && (fR[0x3] = fm[0x1]);
          }),
          fR;
      }
      fh['default'] = fh;
      const fW = fh;
      class CGeoJSONLayer extends J['PrimitiveCollection'] {
          constructor(fp) {
              super(fp),
              this['textWidthCache'] = {},
              this['Pi2'] = 0x2 * Math['PI'],
              this['_visible'] = true,
              this['handlePick'] = fR=>{
                  try {
                      const fm = this['options']['view']['scene']['pick'](fR['position']);
                      (0x0,
                      J['defined'])(fm) && this['pickEvent']['raiseEvent']({
                          'firer': this,
                          'msg': fm
                      });
                  } catch (fH) {
                      K['logger']['warn'](fH);
                  }
              }
              ,
              this['resetCollisionObjects'] = ()=>{
                  if (this['collisionObjs'] && 0x0 === this['collisionObjs']['length'])
                      return;
                  this['options']['view'] || K['logger']['error']('当前图层存在需要遮盖检测的对象，需要创建图层时传入地图视图！');
                  const fR = performance['now']();
                  for (const fA of this['collisionObjs']) {
                      fA['hidden'] = false;
                      const fI = fA['feature']['pos'] || J['SceneTransforms']['wgs84ToWindowCoordinates'](this['options']['view']['scene'], fA['userObj']['position']);
                      delete fA['feature']['pos'],
                      (0x0,
                      J['defined'])(null == fI ? undefined : fI['x']) ? (fA['x'] = fI['x'] + fA['dx'],
                      fA['y'] = fI['y'] + fA['dy']) : K['logger']['debug']('不正确的坐标映射：' + fI);
                  }
                  const fm = new K['CollisonDetector']({
                      'x': 0x0,
                      'y': 0x0,
                      'width': this['options']['view']['scene']['canvas']['clientWidth'],
                      'height': this['options']['view']['scene']['canvas']['clientHeight'],
                      'collisonMode': this['options']['collisionDetectMode']
                  });
                  for (const fx of this['collisionObjs'])
                      fm['insert'](fx);
                  fm['collisionDectect'](this['collisionObjs']);
                  let fH = 0x0
                    , fe = 0x0;
                  if (this['options']['collisionCreateAll']) {
                      if (this['collisionImages']) {
                          const fB = performance['now']();
                          for (let fM = 0x0; fM < this['collisionObjs']['length']; fM++) {
                              const fl = this['collisionObjs'][fM]
                                , fX = fl['idx'];
                              let fE;
                              fE = 'image' === fl['type'] ? this['collisionImages']['get'](fX) : this['collisionLabels']['get'](fX),
                              fl['hidden'] ? fE['show'] = false : fE['show'] = true;
                          }
                          this['options']['debugShowPerformance'] && K['logger']['debug']('update\x20collision\x20objs\x20costs\x20' + (performance['now']() - fB) + 'ms');
                      } else {
                          this['collisionImages'] = new fi({
                              'blendOption': J['BlendOption']['TRANSLUCENT'],
                              'scene': this['options']['view']['scene']
                          }),
                          this['collisionLabels'] = new J['LabelCollection']({
                              'blendOption': J['BlendOption']['TRANSLUCENT']
                          });
                          for (const fO of this['collisionObjs']) {
                              let F0;
                              fO['hidden'] && (fO['userObj']['show'] = false),
                              'image' === fO['type'] ? (fO['idx'] = fH++,
                              F0 = this['collisionImages']['add'](fO['userObj'])) : (fO['idx'] = fe++,
                              F0 = this['collisionLabels']['add'](fO['userObj'])),
                              F0['feature'] = fO['feature'];
                          }
                          this['add'](this['collisionImages']),
                          this['add'](this['collisionLabels']);
                      }
                  } else {
                      this['collisionImages'] && this['remove'](this['collisionImages']),
                      this['collisionLabels'] && this['remove'](this['collisionLabels']),
                      this['collisionImages'] = new fi({
                          'blendOption': J['BlendOption']['TRANSLUCENT'],
                          'scene': this['options']['view']['scene']
                      }),
                      this['collisionLabels'] = new J['LabelCollection']({
                          'blendOption': J['BlendOption']['TRANSLUCENT']
                      });
                      for (const F1 of this['collisionObjs']) {
                          if (F1['hidden'])
                              continue;
                          let F2;
                          F2 = 'image' === F1['type'] ? this['collisionImages']['add'](F1['userObj']) : this['collisionLabels']['add'](F1['userObj']),
                          F2['feature'] = F1['feature'];
                      }
                      this['add'](this['collisionImages']),
                      this['add'](this['collisionLabels']);
                  }
                  this['options']['debugShowPerformance'] && K['logger']['debug']('collision\x20detect\x20costs\x20' + (performance['now']() - fR) + 'ms');
              }
              ,
              this['redrawFromDataSourceTracking'] = ()=>{
                  this['options']['trackDataSource'] && this['redraw']();
              }
              ,
              this['options'] = (0x0,
              K['setOptions'])({}, fp, CGeoJSONLayer['DefaultOptions']),
              this['options']['name'] = this['options']['name'] || (0x0,
              K['uid'])(),
              this['options']['handleResize'] && (0x0,
              K['onWindowSizeChanged'])(()=>{
                  this['isDestroyed']() || this['resetCollisionObjects']();
              }
              ),
              this['options']['view'] && this['initSetting']();
          }
          ['initSetting']() {
              this['options']['view']['cameraHeightChanged']['addEventListener'](()=>{
                  var fp;
                  this['options']['allowPointCollisionDetect'] && (null === (fp = this['drawOptions']['point']) || undefined === fp ? undefined : fp['avoidCollison']) ? this['redraw']() : this['resetCollisionObjects']();
              }
              ),
              'none' !== this['options']['pickType'] && (this['options']['view'] ? (this['pickHandler'] = new J['ScreenSpaceEventHandler'](this['options']['view']['canvas']),
              this['pickHandler']['setInputAction'](this['handlePick'], J['ScreenSpaceEventType']['LEFT_CLICK']),
              this['pickEvent'] = new J['Event']()) : K['logger']['warn']('当前设置了允许拾取，但是没有传入view，拾取将不生效！'));
          }
          ['setDrawOptions'](fp, fR=true) {
              return 'string' == typeof fp && (fp['indexOf'](K['consts']['fieldLoaderIndicator']) > 0x0 ? this['drawOptions'] = (0x0,
              K['processFieldWithLoaders'])(fp) : this['drawOptions'] = K['resourceService']['getResource'](fp)['instance']),
              'object' != typeof fp || fp instanceof K['FeatureStyle3D'] ? this['drawOptions'] = fp : fR && this['drawOptions'] ? this['drawOptions']['update'](fp) : this['drawOptions'] = this['_createStyleObjectFromStyleOptions'](fp),
              this['dataSource'] && this['redraw'](),
              this;
          }
          ['setDataSource'](fp) {
              return this['dataSource'] && this['dataSource']['offFeaturesUpdate'](this['redrawFromDataSourceTracking']),
              this['dataSource'] = fp,
              this['drawOptions'] && this['redraw'](),
              this['dataSource']['onFeaturesUpdate'](this['redrawFromDataSourceTracking']),
              this;
          }
          ['setVisible'](fp) {
              return this['_visible'] === fp || (this['_visible'] = fp),
              this;
          }
          ['isVisible']() {
              return this['_visible'];
          }
          ['redraw']() {
              if (!this['options']['view'])
                  return;
              const fp = performance['now']();
              this['removeAll'](),
              this['collisionObjs'] = [],
              this['textWidthCache'] = {};
              const fR = new J['PointPrimitiveCollection']({
                  'blendOption': J['BlendOption']['TRANSLUCENT']
              })
                , fm = new J['LabelCollection']({
                  'blendOption': J['BlendOption']['TRANSLUCENT']
              })
                , fH = []
                , fe = new J['BillboardCollection']({
                  'scene': this['options']['view']['scene']
              })
                , fA = []
                , fI = []
                , fx = []
                , fB = new J['PolylineCollection']();
              this['options']['lineTop'] && (fB['topMost'] = true);
              let fM = this['dataSource']['getFeatures']();
              if (this['options']['allowPointCollisionDetect']) {
                  this['options']['collisionCreateAll'] && (K['logger']['warn']('开启点的碰撞检测时collisionCreateAll自动重置为false'),
                  this['options']['collisionCreateAll'] = false);
                  const fX = performance['now']()
                    , fE = new K['CollisonDetector']({
                      'x': 0x0,
                      'y': 0x0,
                      'width': this['options']['view']['scene']['canvas']['clientWidth'],
                      'height': this['options']['view']['scene']['canvas']['clientHeight'],
                      'collisonMode': this['options']['collisionDetectMode']
                  })
                    , fO = []
                    , F0 = {
                      'type': 'FeatureCollection',
                      'features': []
                  };
                  fF(fM, (F1,F2,F3)=>{
                      var F4;
                      if ('Point' !== (null === (F4 = F1['geometry']) || undefined === F4 ? undefined : F4['type']))
                          return void F0['features']['push'](F1);
                      const F5 = this['drawOptions']['point']['getPlaneOptions'](fM['features'][F2], this['options']['cacheDrawOptions']);
                      if (!F5['avoidCollison'])
                          return void F0['features']['push'](F1);
                      const F6 = J['SceneTransforms']['wgs84ToWindowCoordinates'](this['options']['view']['scene'], this['getPointCoor'](F1, F5));
                      if (!F6 || !(null == F6 ? undefined : F6['x']))
                          return void K['logger']['debug']('不正确的坐标映射' + (null == F6 ? undefined : F6['toString']()));
                      F1['pos'] = F6,
                      F5['collisionBuffer']['length'] < 0x2 && (F5['collisionBuffer'] = [F5['collisionBuffer'][0x0], F5['collisionBuffer'][0x0]]);
                      const F7 = {
                          'x': F6['x'],
                          'y': F6['y'],
                          'width': F5['size'] + F5['collisionBuffer'][0x0],
                          'height': F5['size'] + F5['collisionBuffer'][0x1],
                          'feature': F1,
                          'type': 'image'
                      };
                      fO['push'](F7),
                      fE['insert'](F7);
                  }
                  ),
                  fE['collisionDectect'](fO)['forEach'](F1=>F0['features']['push'](F1['feature'])),
                  fM = F0,
                  this['options']['debugShowPerformance'] && K['logger']['debug']('filter\x20collsion\x20points\x20costs\x20' + (performance['now']() - fX) + 'ms');
              }
              fF(fM, F1=>{
                  if (F1['geometry'] && F1['geometry']['type']) {
                      if ('Point' === F1['geometry']['type']) {
                          if (!this['drawOptions']['point'])
                              return;
                          const F2 = this['drawOptions']['point']['getPlaneOptions'](F1, this['options']['cacheDrawOptions']);
                          if (!F2['visible'])
                              return;
                          const F3 = this['getPointCoor'](F1, F2);
                          (F2['fill'] || F2['strokeColor']) && this['addPointPrimitive'](F1, F2, fR, F3),
                          F2['label'] && F2['label']['length'] > 0x0 && F2['label']['forEach'](F4=>{
                              this['addPointLabelPrimitive'](F1, F4, {
                                  'text': fm,
                                  'image': fe,
                                  'polygonGeometryInstances': fA,
                                  'optsForCollsion': fH
                              }, F3);
                          }
                          );
                      } else {
                          if ('Polygon' === F1['geometry']['type']) {
                              if (!this['drawOptions']['polygon'])
                                  return;
                              const F4 = this['drawOptions']['polygon']['getPlaneOptions'](F1, this['options']['cacheDrawOptions']);
                              this['addPolygonPrimitive'](F1, F4, {
                                  'text': fm,
                                  'image': fe,
                                  'optsForCollsion': fH,
                                  'polygonGeometryInstances': fA,
                                  'lineCollection': fB,
                                  'outlineGeometryInstances': fI,
                                  'simpleLineGeoInstances': fx
                              });
                          } else {
                              if ('LineString' === F1['geometry']['type']) {
                                  const F5 = this['drawOptions']['polyline']['getPlaneOptions'](F1, this['options']['cacheDrawOptions']);
                                  this['addPolylinePrimitive'](F1, F5, {
                                      'text': fm,
                                      'optsForCollsion': fH,
                                      'image': fe,
                                      'polygonGeometryInstances': fA,
                                      'lineCollection': fB,
                                      'simpleLineGeoInstances': fx
                                  });
                              }
                          }
                      }
                      delete F1['qe_scpt'];
                  }
              }
              );
              const fl = new J['Primitive']({
                  'geometryInstances': fA,
                  'appearance': new J['PerInstanceColorAppearance']()
              });
              if (this['add'](fl),
              fI['length'] > 0x0) {
                  const F1 = new J['Primitive']({
                      'geometryInstances': fI,
                      'appearance': new J['PerInstanceColorAppearance']({
                          'flat': true
                      })
                  });
                  this['add'](F1);
              }
              if (this['add'](fB),
              fx['length'] > 0x0) {
                  const F2 = new J['Primitive']({
                      'geometryInstances': fx,
                      'appearance': new J['PerInstanceColorAppearance']({
                          'flat': true,
                          'renderState': {
                              'lineWidth': 0x1
                          },
                          'translucent': false
                      })
                  });
                  this['add'](F2);
              }
              return this['add'](fR),
              this['add'](fe),
              this['collisionObjs'] = fH,
              this['resetCollisionObjects'](),
              this['add'](fm),
              this['options']['debugShowPerformance'] && K['logger']['debug']('创建feature\x20primitive耗时' + (performance['now']() - fp) + 'ms'),
              this;
          }
          ['addPolylinePrimitive'](fp, fR, fm) {
              var fH;
              if (0x0 === fp['geometry']['coordinates']['length'] || !fR)
                  return;
              if (fR['label'] && fR['label']['length'] > 0x0) {
                  const fM = null !== (fH = fR['labelDistance3D']) && undefined !== fH ? fH : fR['labelDistance']
                    , fl = fZ(fp, fM);
                  fR['label']['forEach'](fX=>{
                      let fE;
                      fX['text'] && (fE = this['writeTextToCanvas'](fX['text'])),
                      fl['features']['forEach'](fO=>{
                          var F0, F1;
                          const F2 = {
                              'type': 'Feature',
                              'geometry': {
                                  'type': 'Point',
                                  'coordinates': fO['geometry']['coordinates'][0x0]
                              },
                              'properties': fO['properties']
                          }
                            , F3 = this['getPointCoor'](F2, fR)
                            , F4 = ()=>{
                              let F5 = Math['atan2'](fO['geometry']['coordinates'][0x0][0x1] - fO['geometry']['coordinates'][0x1][0x1], fO['geometry']['coordinates'][0x0][0x0] - fO['geometry']['coordinates'][0x1][0x0]);
                              return fR['labelAutoFlip'] && fO['geometry']['coordinates'][0x0][0x0] < fO['geometry']['coordinates'][0x1][0x0] && (F5 += Math['PI']),
                              F5;
                          }
                          ;
                          if (fE) {
                              const F5 = {
                                  'show': fX['text']['visible'],
                                  'position': F3,
                                  'heightReference': 'relative' === fX['text']['heightMode'] ? J['HeightReference']['RELATIVE_TO_GROUND'] : 'clamp' === fX['text']['heightMode'] ? J['HeightReference']['CLAMP_TO_GROUND'] : J['HeightReference']['NONE'],
                                  'image': fE,
                                  'rotation': -(null !== (F0 = fX['text']['angle']) && undefined !== F0 ? F0 : F4()),
                                  'sizeInMeters': false,
                                  'disableDepthTestDistance': fX['text']['depthTest'] ? 0x0 : Number['POSITIVE_INFINITY'],
                                  'verticalOrigin': J['VerticalOrigin']['CENTER'],
                                  'eyeOffset': new J['Cartesian3'](fX['text']['eyeOffset'][0x0],fX['text']['eyeOffset'][0x1],fX['text']['eyeOffset'][0x2])
                              };
                              fm['image']['add'](F5);
                          }
                          fX['image'] && (fX['image']['angle'] = null !== (F1 = fX['image']['angle']) && undefined !== F1 ? F1 : F4(),
                          this['addPointImagePrimitive'](F2, fX['image'], fm['image'], F3, fm['optsForCollsion']));
                      }
                      );
                  }
                  );
              }
              const fe = fp['geometry']['coordinates'][0x0]
                , fA = [];
              let fI;
              if (fR['usePositionHeight'])
                  fI = 0x2 === fe['length'] ? fX=>J['Cartesian3']['fromDegreesArray'](fX)[0x0] : fX=>J['Cartesian3']['fromDegreesArrayHeights'](fX)[0x0];
              else {
                  let fX = 0x0;
                  fR['height'] && (fX = fR['height']),
                  fI = 0x2 === fe['length'] ? fE=>J['Cartesian3']['fromDegreesArrayHeights'](fE['concat'](fX))[0x0] : fE=>J['Cartesian3']['fromDegreesArrayHeights']([fE[0x0], fE[0x1], fX])[0x0];
              }
              fp['geometry']['coordinates']['forEach'](fE=>{
                  const fO = fE['map'](F0=>parseFloat(F0));
                  fA['push'](fI(fO));
              }
              );
              const fx = cColor(fR['color']);
              if (fR['simpleLine']) {
                  const fE = {
                      'positions': fA,
                      'arcType': J['ArcType']['NONE'],
                      'colorsPerVertex': false
                  }
                    , fO = new J['SimplePolylineGeometry'](fE)
                    , F0 = new J['GeometryInstance']({
                      'geometry': fO,
                      'id': (0x0,
                      K['uid'])(),
                      'attributes': {
                          'color': J['ColorGeometryInstanceAttribute']['fromColor'](fx),
                          'show': new J['ShowGeometryInstanceAttribute'](fR['visible'])
                      }
                  });
                  return void fm['simpleLineGeoInstances']['push'](F0);
              }
              const fB = {
                  'show': fR['visible'],
                  'width': fR['width'],
                  'positions': fA
              };
              fR['glowColor'] ? (fB['material'] = J['Material']['fromType']('PolylineGlow'),
              fB['material']['uniforms']['color'] = cColor(fR['glowColor']),
              fB['material']['uniforms']['glowPower'] = fR['glowPower'],
              fB['material']['uniforms']['taperPower'] = fR['taperPower']) : fR['dashArray'] ? (fB['material'] = J['Material']['fromType']('PolylineDash'),
              fB['material']['uniforms']['color'] = fx,
              fB['material']['uniforms']['dashLength'] = fR['dashArray'][0x0],
              fR['dashColor'] && (fB['material']['uniforms']['gapColor'] = cColor(fR['dashColor'])),
              fR['dashArray']['length'] > 0x1 && (fB['material']['uniforms']['dashPattern'] = fR['dashArray'][0x1])) : fR['strokeColor'] ? (fB['material'] = J['Material']['fromType']('PolylineOutline'),
              fB['material']['uniforms']['color'] = fx,
              fB['material']['uniforms']['outlineColor'] = cColor(fR['strokeColor']),
              fB['material']['uniforms']['outlineWidth'] = fR['strokeWidth']) : (fB['material'] = J['Material']['fromType']('Color'),
              fB['material']['uniforms']['color'] = fx),
              fB['material']['translucent'] = true,
              fm['lineCollection']['add'](fB);
          }
          ['addPolygonPrimitive'](fp, fR, fm) {
              if (!fR)
                  return;
              const fH = function(fA, fI) {
                  undefined === fI && (fI = {});
                  var fx = fW(fA);
                  return f4([(fx[0x0] + fx[0x2]) / 0x2, (fx[0x1] + fx[0x3]) / 0x2], fI['properties'], fI);
              }(fp, {
                  'properties': fp['properties']
              });
              let fe = this['getPointCoor'](fH, fR);
              if (fR['extrudeHeight'] > 0x0 && (0x0,
              J['defined'])(fe['z'])) {
                  const fA = J['Cartographic']['fromCartesian'](fe);
                  fA['height'] += fR['extrudeHeight'],
                  fe = J['Cartesian3']['fromRadians'](fA['longitude'], fA['latitude'], fA['height']);
              }
              if (fR['label'] && fR['label']['length'] > 0x0 && fR['label']['forEach'](fI=>{
                  this['addPointLabelPrimitive'](fH, fI, fm, fe);
              }
              ),
              0x0 !== fp['geometry']['coordinates']['length']) {
                  if (fR['fill']) {
                      const fI = this['getPolygonRingCoors'](fp['geometry']['coordinates'][0x0])
                        , fx = [];
                      if (fp['geometry']['coordinates']['length'] > 0x1)
                          for (let fE = 0x1; fE < fp['geometry']['coordinates']['length']; fE++) {
                              const fO = fp['geometry']['coordinates'][fE]
                                , F0 = this['getPolygonRingCoors'](fO);
                              fx['push'](new J['PolygonHierarchy'](F0));
                          }
                      const fB = {
                          'polygonHierarchy': new J['PolygonHierarchy'](fI,fx),
                          'perPositionHeight': fR['usePositionHeight'],
                          'height': fR['height'] || 0x0,
                          'extrudedHeight': fR['extrudeHeight'],
                          'closeTop': fR['closeTop'],
                          'closeBottom': fR['closeBottom'],
                          'vertexFormat': J['PerInstanceColorAppearance']['VERTEX_FORMAT']
                      }
                        , fM = new J['PolygonGeometry'](fB)
                        , fl = cColor(fR['color'])
                        , fX = new J['GeometryInstance']({
                          'geometry': fM,
                          'attributes': {
                              'show': new J['ShowGeometryInstanceAttribute'](fR['visible']),
                              'color': new J['ColorGeometryInstanceAttribute'](fl['red'],fl['green'],fl['blue'],fl['alpha'])
                          }
                      });
                      if (fm['polygonGeometryInstances']['push'](fX),
                      fR['strokeColor']) {
                          const F1 = cColor(fR['strokeColor'])
                            , F2 = new J['GeometryInstance']({
                              'geometry': new J['PolygonOutlineGeometry']({
                                  'polygonHierarchy': new J['PolygonHierarchy'](fI,fx),
                                  'perPositionHeight': fR['usePositionHeight'],
                                  'height': fR['height'],
                                  'extrudedHeight': fR['extrudeHeight'],
                                  'vertexFormat': J['PerInstanceColorAppearance']['VERTEX_FORMAT']
                              }),
                              'attributes': {
                                  'show': new J['ShowGeometryInstanceAttribute'](fR['visible']),
                                  'color': new J['ColorGeometryInstanceAttribute'](F1['red'],F1['green'],F1['blue'])
                              }
                          });
                          fm['outlineGeometryInstances']['push'](F2);
                      }
                  }
                  fR['lineStyle'] && fp['geometry']['coordinates']['forEach'](F3=>{
                      const F4 = {
                          'type': 'Feature',
                          'geometry': {
                              'type': 'LineString',
                              'coordinates': F3
                          },
                          'properties': fp['properties']
                      };
                      this['addPolylinePrimitive'](F4, fR['lineStyle'], {
                          'text': fm['text'],
                          'image': fm['image'],
                          'optsForCollsion': fm['optsForCollsion'],
                          'polygonGeometryInstances': fm['polygonGeometryInstances'],
                          'lineCollection': fm['lineCollection'],
                          'simpleLineGeoInstances': fm['simpleLineGeoInstances']
                      });
                  }
                  );
              }
          }
          ['getPolygonRingCoors'](fp) {
              const fR = []
                , fm = fp[0x0]['length'] > 0x2 ? fH=>J['Cartesian3']['fromDegrees'](Number(fH[0x0]), Number(fH[0x1]), Number(fH[0x2])) : fH=>J['Cartesian3']['fromDegrees'](Number(fH[0x0]), Number(fH[0x1]));
              for (const fH of fp)
                  fR['push'](fm(fH));
              return fR;
          }
          ['getPointCoor'](fp, fR) {
              var fm;
              return fR['usePositionHeight'] ? fp['geometry']['coordinates']['length'] > 0x2 ? J['Cartesian3']['fromDegreesArrayHeights'](fp['geometry']['coordinates'])[0x0] : J['Cartesian3']['fromDegreesArray'](fp['geometry']['coordinates'])[0x0] : J['Cartesian3']['fromDegrees'](Number(fp['geometry']['coordinates'][0x0]), Number(fp['geometry']['coordinates'][0x1]), null !== (fm = fR['height']) && undefined !== fm ? fm : 0x0);
          }
          ['addPointPrimitive'](fp, fR, fm, fH) {
              const fe = {
                  'position': fH,
                  'pixelSize': fR['size'],
                  'show': fR['visible'],
                  'color': cColor(fR['color'])
              };
              fR['strokeColor'] && (fe['outlineColor'] = cColor(fR['strokeColor']),
              fe['outlineWidth'] = fR['strokeWidth']),
              fm['add'](fe)['feature'] = fp;
          }
          ['addPointLabelPrimitive'](fp, fR, fm, fH) {
              fR['image'] && this['addPointImagePrimitive'](fp, fR['image'], fm['image'], fH, fm['optsForCollsion']),
              fR['text'] && this['addPointTextPrimitive'](fp, fR['text'], fm['text'], fm['image'], fm['optsForCollsion'], fH),
              fR['volume'] && this['addPointVolumePrimitive'](fp, fR['volume'], fm['polygonGeometryInstances'], fH);
          }
          ['addPointImagePrimitive'](fp, fR, fm, fH, fe) {
              if (false === fR['visible'])
                  return;
              const fA = {
                  'position': fH,
                  'sizeInMeters': fR['sizeInMeters'],
                  'image': fR['data'],
                  'disableDepthTestDistance': fR['depthTest'] ? 0x0 : Number['POSITIVE_INFINITY'],
                  'eyeOffset': new J['Cartesian3'](fR['eyeOffset'][0x0],fR['eyeOffset'][0x1],fR['eyeOffset'][0x2])
              };
              if (fR['offset'] && (fA['pixelOffset'] = J['Cartesian2']['fromArray'](fR['offset'])),
              fR['heightMode'] ? 'clamp' === fR['heightMode'] ? fA['heightReference'] = J['HeightReference']['CLAMP_TO_GROUND'] : 'relative' === fR['heightMode'] && (fA['heightReference'] = J['HeightReference']['RELATIVE_TO_GROUND']) : fA['heightReference'] = J['HeightReference']['NONE'],
              fR['color'] && (fA['color'] = cColor(fR['color'])),
              fR['angle'] && (fA['rotation'] = fR['angle']),
              fR['size']) {
                  const fI = fR['size'];
                  fA['width'] = fI[0x0],
                  fA['height'] = fI[0x1];
              }
              if (fR['avoidCollison']) {
                  const fx = fR['size'] && fR['size'][0x0] || 0x10
                    , fB = fR['size'] && fR['size'][0x1] || 0x10
                    , fM = {
                      'dx': fR['offset'] && fR['offset'][0x0] || 0x0,
                      'dy': fR['offset'] && fR['offset'][0x1] || 0x0,
                      'width': fx,
                      'height': fB,
                      'feature': fp,
                      'userObj': fA,
                      'type': 'image'
                  };
                  fe['push'](fM);
              } else
                  fm['add'](fA)['feature'] = fp;
          }
          ['addPointTextPrimitive'](fp, fR, fm, fH, fe, fA) {
              if (false === fR['visible'])
                  return;
              const fI = {
                  'position': fA,
                  'text': fR['data'],
                  'fillColor': cColor(fR['color']),
                  'style': J['LabelStyle']['FILL'],
                  'disableDepthTestDistance': fR['depthTest'] ? 0x0 : Number['POSITIVE_INFINITY'],
                  'eyeOffset': new J['Cartesian3'](fR['eyeOffset'][0x0],fR['eyeOffset'][0x1],fR['eyeOffset'][0x2])
              };
              if (fI['text'] && 0x0 !== fI['text']['length']) {
                  if (fR['backColor'] ? (fI['showBackground'] = true,
                  fI['backgroundColor'] = cColor(fR['backColor'])) : fI['showBackground'] = false,
                  fR['font'] && (fI['font'] = fR['font']),
                  fR['offset'] && (fI['pixelOffset'] = J['Cartesian2']['fromArray'](fR['offset'])),
                  fR['strokeColor'] && (fI['outlineColor'] = cColor(fR['strokeColor']),
                  fI['style'] = J['LabelStyle']['FILL_AND_OUTLINE']),
                  fR['strokeWidth'] && (fI['outlineWidth'] = fR['strokeWidth']),
                  'clamp' === fR['heightMode'] ? fI['heightReference'] = J['HeightReference']['CLAMP_TO_GROUND'] : 'relative' === fR['heightMode'] ? fI['heightReference'] = J['HeightReference']['RELATIVE_TO_GROUND'] : fI['heightReference'] = J['HeightReference']['NONE'],
                  undefined !== fR['angle'] || fR['forceImage'])
                      this['addLabelToBillboard'](fp, fR, fI, fH, fA, fe);
                  else {
                      if (fR['avoidCollison']) {
                          const fx = fR['backWidth'] || 0x1e
                            , fB = fR['backHeight'] || 0x14
                            , fM = {
                              'dx': fR['offset'] && fR['offset'][0x0] || 0x0,
                              'dy': fR['offset'] && fR['offset'][0x1] || 0x0,
                              'width': fx,
                              'height': fB,
                              'feature': fp,
                              'userObj': fI,
                              'type': 'text'
                          };
                          fe['push'](fM);
                      } else
                          fm['add'](fI)['feature'] = fp;
                  }
              }
          }
          ['addLabelToBillboard'](fp, fR, fm, fH, fe, fA) {
              if (false === fR['visible'])
                  return;
              const fI = this['writeTextToCanvas'](fR)
                , fx = {
                  'position': fe,
                  'heightReference': fm['heightReference'],
                  'image': fI,
                  'rotation': fR['angle'] ? -fR['angle'] : 0x0,
                  'sizeInMeters': false,
                  'disableDepthTestDistance': fR['depthTest'] ? 0x0 : Number['POSITIVE_INFINITY']
              };
              if (fR['avoidCollison']) {
                  const fB = fR['backWidth'] || 0x1e
                    , fM = fR['backHeight'] || 0x14
                    , fl = {
                      'dx': fR['offset'] && fR['offset'][0x0] || 0x0,
                      'dy': fR['offset'] && fR['offset'][0x1] || 0x0,
                      'width': fB,
                      'height': fM,
                      'feature': fp,
                      'userObj': fx,
                      'type': 'image'
                  };
                  fA['push'](fl);
              } else
                  fH['add'](fx)['feature'] = fp;
          }
          ['addPointVolumePrimitive'](fp, fR, fm, fH) {
              const fe = fR['xDelta'] / 0x2
                , fA = fR['yDelta'] / 0x2
                , fI = Number(fp['geometry']['coordinates'][0x0]) - fe
                , fx = Number(fp['geometry']['coordinates'][0x0]) + fe
                , fB = Number(fp['geometry']['coordinates'][0x1]) - fA
                , fM = Number(fp['geometry']['coordinates'][0x1]) + fA
                , fl = {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Polygon',
                      'coordinates': [[[fI, fB, fH['z']], [fx, fB, fH['z']], [fx, fM, fH['z']], [fI, fM, fH['z']], [fI, fB, fH['z']]]]
                  },
                  'properties': fp['properties']
              }
                , fX = {
                  'visible': fR['visible'],
                  'color': fR['color'],
                  'extrudeHeight': fR['height'],
                  'closeBottom': true,
                  'closeTop': true,
                  'usePositionHeight': false,
                  'fill': true
              };
              this['addPolygonPrimitive'](fl, fX, {
                  'text': undefined,
                  'image': undefined,
                  'optsForCollsion': undefined,
                  'polygonGeometryInstances': fm,
                  'lineCollection': undefined,
                  'outlineGeometryInstances': undefined,
                  'simpleLineGeoInstances': undefined
              });
          }
          ['writeTextToCanvas'](fp) {
              const fR = document['createElement']('canvas')
                , fm = fR['getContext']('2d');
              let fH = fp['backWidth'] || this['textWidthCache'][fp['data']];
              undefined === fH && (fH = fm['measureText'](fp['data'])['width'],
              this['textWidthCache'][fp['data']] = fH),
              fH += 0x2 * fp['backPadding'][0x0];
              const fe = fp['forceImageSize'] && fp['forceImageSize'][0x0] || fH
                , fA = fp['forceImageSize'] && fp['forceImageSize'][0x1] || 0x20;
              let fI = fe / 0x2;
              const fx = fA / 0x2;
              if (fR['width'] = fe,
              fR['height'] = fA,
              fm['font'] = fp['font'],
              fp['backColor']) {
                  fp['backShadowColor'] ? (fm['shadowColor'] = fp['backShadowColor']['rgbaString'](),
                  fm['shadowBlur'] = fp['backShadowBlur'],
                  fm['shadowOffsetX'] = fp['backShadowOffset'][0x0],
                  fm['shadowOffsetY'] = fp['backShadowOffset'][0x1]) : fm['shadowColor'] = 'rgba(0,0,0,0)';
                  const fB = (fp['backHeight'] || 0x14) + 0x2 * fp['backPadding'][0x1];
                  fm['beginPath'](),
                  fp['backRoundRect'] ? (0x0,
                  K['drawRoundRect'])(fm, fI - fH / 0x2, fx - fB / 0x2, fH, fB, fp['backRoundRadius']) : fp['backCircle'] ? fm['arc'](fI, fx, fH - fp['backPadding'][0x0], 0x0, this['Pi2']) : fm['rect'](fI - fH / 0x2, fx - fB / 0x2, fH, fB),
                  fm['fillStyle'] = fp['backColor']['rgbaString'](),
                  fm['fill'](),
                  fp['backStrokeColor'] && fp['backStrokeWidth'] && (fm['strokeStyle'] = fp['backStrokeColor']['rgbaString'](),
                  fm['lineWidth'] = fp['backStrokeWidth'],
                  fp['backStrokeDashArray'] ? fm['setLineDash'](fp['backStrokeDashArray']) : fm['setLineDash']([]),
                  fm['stroke']());
              }
              return fp['baseline'] && (fm['textBaseline'] = fp['baseline']),
              fp['align'] && (fm['textAlign'] = fp['align']),
              fp['shadowColor'] && (fm['shadowColor'] = fp['shadowColor']['rgbaString'](),
              fm['shadowOffsetX'] = fp['shadowOffset'][0x0],
              fm['shadowOffsetY'] = fp['shadowOffset'][0x1],
              fm['shadowBlur'] = fp['shadowBlur']),
              fp['strokeColor'] && fp['strokeWidth'] && (fm['strokeStyle'] = fp['strokeColor'],
              fm['lineWidth'] = fp['strokeWidth'],
              fm['strokeText'](fp['data'], fI, fx)),
              fm['fillStyle'] = fp['color']['rgbaString'](),
              fm['fillText'](fp['data'], fI, fx),
              fR;
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['FeatureStyle3D'](fp);
          }
          ['destroy']() {
              var fp;
              super['destroy'](),
              null === (fp = this['options']['view']) || undefined === fp || fp['cameraHeightChanged']['removeEventListener'](this['resetCollisionObjects']);
          }
          ['update'](fp) {
              this['_visible'] && (J['PrimitiveCollection']['prototype']['update']['call'](this, fp),
              this['options']['view'] || (this['options']['view'] = fp['camera']['_scene']['viewer'],
              this['initSetting'](),
              this['dataSource'] && this['drawOptions'] && this['redraw']()));
          }
      }
      CGeoJSONLayer['DefaultOptions'] = {
          'debugShowPerformance': false,
          'cacheDrawOptions': true,
          'trackDataSource': false,
          'lineTop': false,
          'destroyPrimitives': true,
          'view': undefined,
          'collisionCreateAll': true,
          'pickType': 'none',
          'collisionDetectMode': K['CollisionDetectMode']['Hide_Only_Self'],
          'allowPointCollisionDetect': true
      };
      const fT = J['PolylineCollection']['prototype']['update'];
      var CFixedPlane;
      J['PolylineCollection']['prototype']['update'] = function(fp) {
          if (fT['call'](this, fp),
          this['topMost']) {
              this['_translucentRS'] = this['__opaqueRS'] = J['RenderState']['fromCache']({
                  'blending': J['BlendingState']['ALPHA_BLEND'],
                  'depthMask': true,
                  'depthTest': {
                      'enabled': false
                  }
              });
              for (const fR of this['_colorCommands'])
                  fR['renderState'] = this['_translucentRS'];
          }
      }
      ,
      function(fp) {
          fp[fp['lonLat'] = 0x0] = 'lonLat',
          fp[fp['lonZ'] = 0x1] = 'lonZ',
          fp[fp['latZ'] = 0x2] = 'latZ',
          fp[fp['fixedLonLat'] = 0x3] = 'fixedLonLat';
      }(CFixedPlane || (CFixedPlane = {}));
      class CSectionLayer extends fn {
          get['empty']() {
              var fp;
              return !((null === (fp = Object['keys'](this['_meshPath'])) || undefined === fp ? undefined : fp['length']) > 0x0);
          }
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp || {}, CSectionLayer['DefaultOptions'])),
              this['_fixedPlane'] = CFixedPlane['lonLat'],
              this['_meshPath'] = {},
              this['_needRebuildVao'] = false,
              (0x0,
              J['defined'])(null == fp ? undefined : fp['fixedPlane']) && (this['_fixedPlane'] = fp['fixedPlane']);
          }
          ['setDrawOptions'](fp, fR=true) {
              if (super['setDrawOptions'](fp, fR),
              this['_planeOptions'] = this['drawOptions']['getPlaneOptions'](undefined, this['options']['cacheDrawOptions']),
              this['_planeOptions']['fillColor']) {
                  const fm = this['parseColorStopRules'](this['_planeOptions']['fillColor']);
                  this['fillColors'] = fm['colors'],
                  this['fillSteps'] = fm['steps'];
              } else
                  this['_csTexture'] && (this['_csTexture'] && this['_csTexture']['destroy'](),
                  this['_csTexture'] = undefined),
                  this['_updateColorScaleMaxMin']();
              if (this['splineMat'] = new J['Matrix4'](-this['drawOptions']['pixelRatio'],0x2 - this['drawOptions']['pixelRatio'],this['drawOptions']['pixelRatio'] - 0x2,this['drawOptions']['pixelRatio'],0x2 * this['drawOptions']['pixelRatio'],this['drawOptions']['pixelRatio'] - 0x3,0x3 - 0x2 * this['drawOptions']['pixelRatio'],-this['drawOptions']['pixelRatio'],-this['drawOptions']['pixelRatio'],0x0,this['drawOptions']['pixelRatio'],0x0,0x0,0x1,0x0,0x0),
              this['_planeOptions']['lineColor']) {
                  const fH = this['_planeOptions']['lineColor'];
                  this['_lineColor'] = new J['Cartesian4'](fH[0x0],fH[0x1],fH[0x2],fH[0x3]);
              } else
                  this['_lineColor'] = undefined;
              return this['_discardColor'] = new J['Cartesian4'](this['_planeOptions']['discardColor'][0x0],this['_planeOptions']['discardColor'][0x1],this['_planeOptions']['discardColor'][0x2],this['_planeOptions']['discardColor'][0x3]),
              this;
          }
          ['setDataSource'](fp) {
              return fp['gridOptions']['zValues']['length'] <= 0x1 ? (K['logger']['error']('剖面图层不支持单层数据！'),
              this['dataSource'] = undefined,
              void (this['currentGrids'] = undefined)) : (super['setDataSource'](fp),
              this['_updateColorScaleMaxMin'](),
              this);
          }
          ['removeSectionPath'](fp) {
              let fR = true;
              (0x0,
              J['defined'])(fp) ? this['_meshPath'][fp] ? delete this['_meshPath'][fp] : fR = false : this['_meshPath'] = {},
              this['_needRebuildVao'] = fR;
          }
          ['setSectionPath'](fp, fR, fm=true, fH='default', fe=true) {
              var fA;
              if (!(null == fp ? undefined : fp['length']) || fp['length'] < 0x2)
                  return void K['logger']['warn']('剖面路径点不能小于2个！');
              if (!this['dataSource'])
                  throw new Error('请先设置数据源！');
              if ('single' === this['options']['sectionMode'] && this['removeSectionPath'](),
              fp[0x0]instanceof Array) {
                  const fl = [];
                  fp['forEach'](fX=>fl['push']({
                      'x': fX[0x0],
                      'y': fX[0x1]
                  })),
                  fp = fl;
              }
              fR = null !== (fA = null != fR ? fR : this['_fixedPlane']) && undefined !== fA ? fA : CFixedPlane['lonLat'];
              let fI = this['dataSource']['gridOptions']['xDelta']
                , fx = this['dataSource']['gridOptions']['yDelta']
                , fB = 0x0;
              if (fR === CFixedPlane['lonZ'])
                  fI = this['dataSource']['gridOptions']['yDelta'],
                  fx = (this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1] - this['zValuesWithScale'][0x0]) / this['zValuesWithScale']['length'] / 0x2;
              else {
                  if (fR === CFixedPlane['latZ'])
                      fI = this['dataSource']['gridOptions']['xDelta'],
                      fx = (this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1] - this['zValuesWithScale'][0x0]) / this['zValuesWithScale']['length'] / 0x2;
                  else {
                      if (fR === CFixedPlane['fixedLonLat']) {
                          this['_fixedLonLat'] || (this['_fixedLonLat'] = new J['Cartesian2'](Math['min'](this['dataSource']['gridOptions']['xStart'], this['dataSource']['gridOptions']['xEnd']),Math['max'](this['dataSource']['gridOptions']['yStart'], this['dataSource']['gridOptions']['yEnd'])));
                          const fX = fp;
                          if (fX[0x0]['x'] === fX[0x1]['x'])
                              fB = 0x1;
                          else {
                              if (fX[0x0]['y'] !== fX[0x1]['y'])
                                  return void K['logger']['error']('当设置剖面平面固定显示在某个经纬度位置时，路径上每个点的经纬和纬度需要有一个保持不变！');
                              fB = 0x0;
                          }
                      } else {
                          if (fR !== CFixedPlane['lonLat'])
                              throw new Error('不正确的fixedPlane！');
                      }
                  }
              }
              const fM = fe ? (0x0,
              K['getTiltPathOfGridDatas'])(fp, fI, fx) : {
                  'posMap': fp
              };
              this['_meshPath'][fH] = {
                  'point': fM['posMap'],
                  'fixed': fB
              },
              this['_fixedPlane'] = fR,
              fm && (this['_needRebuildVao'] = true);
          }
          ['setLatSection'](fp, fR) {
              var fm;
              if (!this['dataSource'] || !this['drawOptions'])
                  return;
              if (!(null === (fm = this['zValuesWithScale']) || undefined === fm ? undefined : fm['length']))
                  throw new Error('当前数据源没有提供z轴信息，请检查gridOptions.zValues!');
              if (this['_fixedPlane'] !== CFixedPlane['lonLat'] && this['_fixedPlane'] !== CFixedPlane['fixedLonLat'])
                  return void K['logger']['error']('该快捷方法不支持非经纬度固定平面，请使用任意路径剖面方法！');
              fp = null != fp ? fp : (this['dataSource']['gridOptions']['yStart'] + this['dataSource']['gridOptions']['yEnd']) / 0x2;
              const fH = [{
                  'x': this['dataSource']['gridOptions']['xEnd'],
                  'y': fp
              }, {
                  'x': this['dataSource']['gridOptions']['xStart'],
                  'y': fp
              }];
              this['setSectionPath'](fH, this['_fixedPlane'], !!this['_drawCommand'], null != fR ? fR : 'lat');
          }
          ['setLonSection'](fp, fR) {
              var fm;
              if (!this['dataSource'] || !this['drawOptions'])
                  return;
              if (!(null === (fm = this['zValuesWithScale']) || undefined === fm ? undefined : fm['length']))
                  throw new Error('当前数据源没有提供z轴信息，请检查gridOptions.zValues!');
              if (this['_fixedPlane'] !== CFixedPlane['lonLat'] && this['_fixedPlane'] !== CFixedPlane['fixedLonLat'])
                  return void K['logger']['error']('该快捷方法不支持非经纬度固定平面，请使用任意路径剖面方法！');
              const fH = [{
                  'x': fp = null != fp ? fp : (this['dataSource']['gridOptions']['xStart'] + this['dataSource']['gridOptions']['xEnd']) / 0x2,
                  'y': this['dataSource']['gridOptions']['yStart']
              }, {
                  'x': fp,
                  'y': this['dataSource']['gridOptions']['yEnd']
              }];
              this['setSectionPath'](fH, this['_fixedPlane'], !!this['_drawCommand'], null != fR ? fR : 'lon');
          }
          ['_updateColorScaleMaxMin']() {
              var fp, fR;
              if (this['dataSource'] && (null === (fR = null === (fp = this['_planeOptions']) || undefined === fp ? undefined : fp['colorScale']) || undefined === fR ? undefined : fR['colorScale']) && (!(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['min']) || !(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['max']))) {
                  K['logger']['debug']('当前colorScale没有配置最大或者最小值，将使用数据中的值，可能造成连续动画时最大最小值不一致！');
                  const fm = this['dataSource']['getGrid']()['maxMin'];
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['min']) || (this['_planeOptions']['colorScale']['min'] = fm['min']),
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['max']) || (this['_planeOptions']['colorScale']['max'] = fm['max']);
              }
          }
          ['resetCommand'](fp=false) {
              var fR, fm, fH, fe, fA;
              this['_drawCommand'] && (null === (fR = this['_contourTexture']) || undefined === fR || fR['destroy'](),
              null === (fm = this['_contourDepthTexture']) || undefined === fm || fm['destroy'](),
              this['_csTexture'] && this['_csTexture']['destroy'](),
              null === (fH = this['_shadedCommand']) || undefined === fH || fH['shaderProgram']['destroy'](),
              null === (fe = this['_drawCommand']) || undefined === fe || fe['shaderProgram']['destroy'](),
              null === (fA = this['_contourCommand']) || undefined === fA || fA['shaderProgram']['destroy'](),
              fp && (this['_vao']['destroy'] && this['_vao']['destroy'](),
              this['_vao'] = undefined),
              this['_shadedCommand'] = undefined,
              this['_contourCommand'] = undefined,
              this['_drawCommand'] = undefined,
              this['_contourClearCommand'] = undefined,
              this['_csTexture'] = undefined);
          }
          ['setFixedLonLat'](fp) {
              this['_fixedPlane'] = CFixedPlane['fixedLonLat'],
              this['_drawCommand'] && (this['_needRebuildVao'] = true),
              this['_fixedLonLat'] = fp;
          }
          ['createVAO'](fp, fR, fm) {
              const fH = performance['now']();
              let fe, fA;
              const fI = this['dataSource']['gridOptions'];
              if (this['_fixedPlane'] === CFixedPlane['lonLat'] || this['_fixedPlane'] === CFixedPlane['fixedLonLat'])
                  fe = this['currentGrids']['length'],
                  fA = (F5,F6)=>({
                      'lon': F6['x'],
                      'lat': F6['y'],
                      'hgt': this['zValuesWithScale'][F5]
                  });
              else {
                  if (this['_fixedPlane'] === CFixedPlane['lonZ'])
                      fe = this['currentGrids'][0x0]['xSize'],
                      fA = (F5,F6)=>({
                          'lon': fI['xStart'] + F5 * fI['xDelta'],
                          'lat': F6['x'],
                          'hgt': F6['y']
                      });
                  else {
                      if (this['_fixedPlane'] !== CFixedPlane['latZ'])
                          throw new Error('不正确的固定平面！');
                      fe = this['currentGrids'][0x0]['ySize'],
                      fA = (F5,F6)=>({
                          'lon': F6['x'],
                          'lat': fI['yStart'] + F5 * fI['yDelta'],
                          'hgt': F6['y']
                      });
                  }
              }
              const fx = (F5,F6,F7,F8,F9,Ff,FF,Fd)=>{
                  const Fb = F5['length'];
                  let Fw = Ff
                    , FQ = Fd;
                  for (let FC = 0x0; FC < fe; FC++)
                      for (let Fj = 0x0; Fj < Fb; Fj++) {
                          const Fc = F5[Fj]
                            , Fn = fA(FC, Fc);
                          F7[Fw] = Fn['lon'],
                          F7[Fw + 0x1] = Fn['lat'],
                          F7[Fw + 0x2] = Fn['hgt'],
                          Fw += 0x3,
                          F9[FQ] = F6,
                          FQ++;
                      }
                  const Fv = Fb
                    , Ft = fe;
                  let FK = FF;
                  const FJ = Ff / 0x3;
                  for (let FP = 0x0; FP < Fv * Ft - Fv; FP++) {
                      if ((FP + 0x1) % Fv == 0x0)
                          continue;
                      const FN = FP + FJ
                        , FL = FN + Fv
                        , Fr = FL + 0x1
                        , Fa = FN + 0x1;
                      F8[FK++] = FN,
                      F8[FK++] = FL,
                      F8[FK++] = Fr,
                      F8[FK++] = FN,
                      F8[FK++] = Fr,
                      F8[FK++] = Fa;
                  }
              }
              ;
              let fB = 0x0
                , fM = 0x0
                , fl = 0x0;
              for (const F5 in fm) {
                  const F6 = fm[F5]
                    , F7 = F6['point']['length'] * fe * 0x3
                    , F8 = F6['point']['length'] * fe
                    , F9 = (F6['point']['length'] - 0x1) * (fe - 0x1) * 0x6;
                  fB += F7,
                  fM += F9,
                  fl += F8,
                  F6['posLen'] = F7,
                  F6['idxLen'] = F9,
                  F6['fixedLen'] = F8;
              }
              const fX = new Float32Array(fB)
                , fE = new Uint32Array(fM)
                , fO = new Float32Array(fl);
              let F0 = 0x0
                , F1 = 0x0
                , F2 = 0x0;
              for (const Ff in fm) {
                  const FF = fm[Ff];
                  fx(FF['point'], FF['fixed'], fX, fE, fO, F0, F1, F2),
                  F0 += FF['posLen'],
                  F1 += FF['idxLen'],
                  F2 += FF['fixedLen'];
              }
              const F3 = new J['Geometry']({
                  'attributes': {
                      'pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fX
                      }),
                      'fixed': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x1,
                          'values': fO
                      })
                  },
                  'indices': fE
              })
                , F4 = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': F3,
                  'attributeLocations': fR,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              return this['options']['debugShowPerformance'] && K['logger']['debug']('generate\x20grid\x20indicies\x20costs\x20' + (performance['now']() - fH) + 'ms'),
              F4;
          }
          ['createCommand'](fp, fR) {
              var fm, fH;
              let fe = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fe = Object['assign'](Object['assign']({}, fe), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  },
                  'cull': {
                      'enabled': false,
                      'face': this['dataSource']['gridOptions']['yDelta'] > 0x0 ? J['CullFace']['FRONT'] : J['CullFace']['BACK']
                  }
              });
              const fA = J['RenderState']['fromCache'](fe);
              let fI = 'val=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(currentData,vUV,xAttr,yAttr,zAttr,undef,interpMethod);';
              this['options']['interpFromPreSource'] && (fI = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preData,vUV,xAttr,yAttr,zAttr,undef,interpMethod,currentData,dataPercent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(currentData,vUV,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fx = 0x1 !== this['_planeOptions']['extrudeScale'] && 0x0 !== this['_planeOptions']['extrudeScale']
                , fB = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20highp\x20sampler3D\x20currentData;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20highp\x20sampler3D\x20preData;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20float\x20dataPercent;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mediump\x20int\x20fillMode;\x20//0-none(bitmap,no-color-interp&no-data-interp),1-bi(pixel1),2-cardinal(pixel2),3-shaded(no-color-interp&cardinal)\x20cesium在vShader和fShader中对于int的精度定义不一致，需要特别指定\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20bool\x20hasPre;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
              let fM = '';
              fx && (fM = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==3||\x20fillMode==2){\x20//shaded\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//cardinal\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(fillMode==4){\x20//shaded2\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fI + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20selVal=fillMode==0?val.x:val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(selVal,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=height+((selVal+extrudeOffset)*extrudeScale);\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fl = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20zLen=' + this['currentGrids']['length'] + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20float\x20fixedMode;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x20\x20//grid\x20data\x20attr\x20实际只用到zSize\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20zValues[zLen];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20fixedPlane;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20extrudeScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20extrudeOffset;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20reverseX;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20reverseY;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20fixedLonLat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] && !fx ? 'uniform\x20float\x20dataPercent;' : '') + '\x20//避免extrude的时候重复定义\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx ? (0x0,
              K['getAlgoConstsAndUniforms'])(this['currentGrids'][0x0]) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx ? fB : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20vUV;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20position=pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//先计算数据获取的位置\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(position.xy,xAttr,yAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20w=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(position.z<=zAttr.x){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=0.;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(position.z>=zAttr.y){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=1.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20for(int\x20i=1;i<zLen;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20if(position.z<=zValues[i]){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20zWeight=(position.z-zValues[i-1])/(zValues[i]-zValues[i-1]);\x20//percent\x20relative\x20to\x20bottom\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20\x20\x20\x20\x20w=\x20(float(i)+zWeight)/float(zLen);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20\x20\x20\x20\x20break;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=(position.z-zValues[0])/(zValues[zLen-1]-zValues[0]);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(reverseX){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uv.x=1.-uv.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(reverseY){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uv.y=1.-uv.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUV=vec3(uv,w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//计算显示的位置\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fixedPlane==3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fixedMode==0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20position.y=fixedLonLat.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20position.x=fixedLonLat.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20hgt=position.z;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//根据fixed模式确定挤压的面\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20height=0.;\x20\x20//挤压的高度\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fM + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fixedPlane==0\x20||\x20fixedPlane==3){\x20\x20//fix\x20lon\x20lat\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20hgt=height+hgt;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fixedPlane==1){\x20\x20//fix\x20z\x20lon\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20position.x+=height;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20position.y+=height;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldCoords=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(vec3(position.xy,hgt));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_projection\x20*\x20czm_view\x20*\x20vec4(worldCoords,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fX = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount=' + ((null === (fm = this['fillSteps']) || undefined === fm ? undefined : fm['length']) || 0x1) + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['currentGrids'][0x0]) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fB + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20csTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMax;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasCs;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20reso;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20discardColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20vUV;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==3||\x20fillMode==2){\x20//shaded\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//cardinal\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(fillMode==4){\x20//shaded2\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fI + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20selVal=fillMode==0?val.x:val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(' + K['qeGLFuncs']['qe_isUndef'] + '(selVal,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=discardColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasCs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['qeGLFuncs']['qe_getColorByScale'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0\x20||\x20fillMode>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['qeGLFuncs']['qe_getColor'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['qeGLFuncs']['qe_interpColor'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor.a=out_FragColor.a*globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(out_FragColor.a<0.001){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20out_FragColor=vec4(1.,1.,0.,1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fE = fK(fl, undefined, {})
                , fO = fK(fX, undefined, {})
                , F0 = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , F1 = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                , F2 = new J['Cartesian3'](this['zValuesWithScale'][0x0],this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1],this['zValuesWithScale']['length'])
                , F3 = ft(fp)
                , F4 = new J['Cartesian2'](fp['drawingBufferWidth'],fp['drawingBufferHeight'])
                , F5 = this['_fixedPlane']
                , F6 = this['dataSource']['gridOptions']['yDelta'] > 0x0
                , F7 = this['dataSource']['gridOptions']['xDelta'] < 0x0;
              this['_fixedLonLat'] || (this['_fixedLonLat'] = new J['Cartesian2'](Math['min'](this['dataSource']['gridOptions']['xStart'], this['dataSource']['gridOptions']['xEnd']),Math['max'](this['dataSource']['gridOptions']['yStart'], this['dataSource']['gridOptions']['yEnd'])));
              const F8 = {
                  'xAttr': ()=>F0,
                  'yAttr': ()=>F1,
                  'currentData': ()=>this['currentTexture'] || (this['currentTexture'] = fQ(fp, this['currentGrids'], this['dataSource']['gridOptions'])),
                  'colors': ()=>this['fillColors'] || [],
                  'steps': ()=>this['fillSteps'] || [],
                  'cardinalSplineMat': ()=>this['splineMat'],
                  'fillMode': ()=>null != fR ? fR : this['_planeOptions']['fillMode'],
                  'zScale': ()=>this['_planeOptions']['zScale'],
                  'extrudeScale': ()=>this['_planeOptions']['extrudeScale'],
                  'extrudeOffset': ()=>this['_planeOptions']['extrudeOffset'],
                  'noHeight': ()=>this['_planeOptions']['noHeight'],
                  'reso': ()=>F4,
                  'csMin': ()=>{
                      var Fb, Fw;
                      return null !== (Fw = null === (Fb = this['_planeOptions']['colorScale']) || undefined === Fb ? undefined : Fb['min']) && undefined !== Fw ? Fw : 0x0;
                  }
                  ,
                  'csMax': ()=>{
                      var Fb, Fw;
                      return null !== (Fw = null === (Fb = this['_planeOptions']['colorScale']) || undefined === Fb ? undefined : Fb['max']) && undefined !== Fw ? Fw : 0x1;
                  }
                  ,
                  'csTexture': ()=>this['_planeOptions']['colorScale'] ? this['_csTexture'] || (this['_csTexture'] = fb(fp, this['_planeOptions']['colorScale']['colorScale'])) : F3,
                  'hasCs': ()=>(0x0,
                  J['defined'])(this['_planeOptions']['colorScale']),
                  'zAttr': ()=>F2,
                  'zValues': ()=>this['zValuesWithScale'],
                  'fixedPlane': ()=>F5,
                  'globalOpacity': ()=>{
                      var Fb;
                      return null !== (Fb = this['_planeOptions']['globalOpacity']) && undefined !== Fb ? Fb : 0x1;
                  }
                  ,
                  'discardColor': ()=>this['_discardColor'],
                  'reverseX': ()=>F7,
                  'reverseY': ()=>F6,
                  'fixedLonLat': ()=>this['_fixedLonLat']
              };
              (0x0,
              K['setAlgoUniforms'])(this['currentGrids'][0x0], F8),
              this['options']['interpFromPreSource'] && (F8['preData'] = ()=>this['preTexture'] || this['preGrids'] && (this['preTexture'] = fQ(fp, this['preGrids'], this['dataSource']['gridOptions'])) || F3,
              F8['dataPercent'] = ()=>this['dataPercent'],
              F8['hasPre'] = ()=>!(!this['options']['interpFromPreSource'] || !this['preGrids']));
              const F9 = {
                  'pos': 0x0,
                  'fixed': 0x1
              };
              let Ff = this['_vao']
                , FF = this['_meshPath'];
              if (!(null === (fH = Object['keys'](FF)) || undefined === fH ? undefined : fH['length']))
                  return;
              this['_vao'] || (Ff = this['_vao'] = this['createVAO'](fp, F9, FF));
              const Fd = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fE,
                  'fragmentShaderSource': fO,
                  'attributeLocations': F9
              });
              return new J['DrawCommand']({
                  'vertexArray': Ff,
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fA,
                  'shaderProgram': Fd,
                  'uniformMap': F8,
                  'owner': this,
                  'pass': this['_planeOptions']['opaque'] ? J['Pass']['OPAQUE'] : J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['createContourVAO'](fp, fR) {
              const fm = new J['Geometry']({
                  'attributes': {
                      'position': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x2,
                          'values': [-0x1, 0x1, -0x1, -0x1, 0x1, -0x1, -0x1, 0x1, 0x1, -0x1, 0x1, 0x1],
                          'normalize': false
                      }),
                      'uv': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x2,
                          'values': [0x0, 0x0, 0x0, 0x1, 0x1, 0x1, 0x0, 0x0, 0x1, 0x1, 0x1, 0x0],
                          'normalize': false
                      })
                  }
              });
              return J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fm,
                  'attributeLocations': fR,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
          }
          ['createContourCommand'](fp) {
              var fR;
              const fm = null !== (fR = this['_planeOptions']['fillModeForLine']) && undefined !== fR ? fR : this['_planeOptions']['fillMode'] === K['GridDataGLFillMode']['pixel1'] ? K['GridDataGLFillMode']['shaded1'] : K['GridDataGLFillMode']['shaded2']
                , fH = this['_shadedCommand'] = this['createCommand'](fp, fm);
              if (!this['_planeOptions']['showLine'])
                  return;
              let fe = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fe = Object['assign'](Object['assign']({}, fe), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': false
                  }
              });
              const fA = J['RenderState']['fromCache'](fe)
                , fI = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20position;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUv;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUv=uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(position,0.,1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fx = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20weight1=1./6.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20weight2=weight1*0.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getRGBA2FloatConsts'])() + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20contourTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20depthTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20depthTest;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20showContour;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20showShaded;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20viewportDelta;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20contourlineWidth;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20contourWithPal;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20contourlineColor;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUv;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20bool\x20isContour(vec4\x20col,vec2\x20uv){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20center=' + K['qeGLFuncs']['qe_rgba2float'] + '(col);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20vpDelta=viewportDelta*contourlineWidth*0.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20surrounds[8];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[0]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(0.,vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[1]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(vpDelta.x,0.)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[2]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(0.,-vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[3]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(-vpDelta.x,0.)));\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[4]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vpDelta));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[5]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv-vpDelta));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[6]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv+vec2(vpDelta.x,-vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20surrounds[7]=' + K['qeGLFuncs']['qe_rgba2float'] + '(' + K['glNames']['textureFunc'] + '(contourTexture,uv-vec2(vpDelta.x,-vpDelta.y)));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20alpha=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i=0;i<4;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(abs(surrounds[i]-center)>0.){\x20//not\x20same\x20range\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20alpha+=weight1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i=4;i<8;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(abs(surrounds[i]-center)>0.){\x20//not\x20same\x20range\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20alpha+=weight2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20alpha>=weight1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=vec4(0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=vec2(vUv.x,1.-vUv.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20col=' + K['glNames']['textureFunc'] + '(contourTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(depthTest){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20globeDepth\x20=\x20czm_unpackDepth(' + K['glNames']['textureFunc'] + '(czm_globeDepthTexture,\x20uv));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20cDepth=' + K['glNames']['textureFunc'] + '(depthTexture,uv).x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(cDepth-globeDepth>=0.01){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_FragDepth=cDepth;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!showContour\x20||\x20col.a<0.001){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isContour(col,uv)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(contourWithPal){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=col;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=contourlineColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fB = {
                  'position': 0x0,
                  'uv': 0x1
              }
                , fM = this['createContourVAO'](fp, fB)
                , fl = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fI,
                  'fragmentShaderSource': fK(fx, undefined, {
                      'defines': ['LOG_DEPTH_WRITE']
                  }),
                  'attributeLocations': fB
              })
                , fX = {
                  'contourTexture': ()=>this['_contourTexture'] || fp['defaultTexture'],
                  'depthTexture': ()=>this['_contourDepthTexture'] || fp['defaultTexture'],
                  'depthTest': ()=>this['_planeOptions']['depthTest'],
                  'showContour': ()=>this['_planeOptions']['showLine'],
                  'viewportDelta': ()=>this['_viewportDelta'],
                  'contourlineWidth': ()=>this['_planeOptions']['lineWidth'],
                  'contourWithPal': ()=>!this['_lineColor'],
                  'contourlineColor': ()=>this['_lineColor'] || J['Color']['TRANSPARENT']
              };
              this['_contourTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE']
              }),
              this['_contourDepthTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['DEPTH_COMPONENT'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_INT']
              }),
              fH['framebuffer'] = new J['Framebuffer']({
                  'context': fp,
                  'colorTextures': [this['_contourTexture']],
                  'depthTexture': this['_contourDepthTexture'],
                  'destroyAttachments': false
              }),
              fH['pass'] = J['Pass']['OPAQUE'];
              const fE = J['RenderState']['fromCache']({
                  'viewport': new J['BoundingRectangle'](0x0,0x0,fp['drawingBufferWidth'],fp['drawingBufferHeight'])
              })
                , fO = new J['ClearCommand']({
                  'color': new J['Color'](0x0,0x0,0x0,0x0),
                  'depth': 0x1,
                  'stencil': 0x0,
                  'pass': J['Pass']['OPAQUE']
              });
              return this['_contourClearCommand'] = fO,
              this['_contourClearCommand']['framebuffer'] = fH['framebuffer'],
              this['_contourClearCommand']['renderState'] = fE,
              this['_viewportDelta'] = new J['Cartesian2'](0x1 / fp['drawingBufferWidth'],0x1 / fp['drawingBufferHeight']),
              new J['DrawCommand']({
                  'vertexArray': fM,
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fA,
                  'shaderProgram': fl,
                  'uniformMap': fX,
                  'owner': this,
                  'pass': J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['update'](fp) {
              this['empty'] || (super['update'](fp),
              this['_visible'] && this['currentGrids'] && (this['_planeOptions']['fillMode'] !== K['GridDataGLFillMode']['none'] || this['_planeOptions']['showLine']) && (this['_needRebuildVao'] && this['_vao'] && (this['resetCommand'](true),
              this['_needRebuildVao'] = false),
              (0x0,
              J['defined'])(this['_drawCommand']) || (this['_drawCommand'] = this['createCommand'](fp['context']),
              this['_planeOptions']['showLine'] && (this['_contourCommand'] = this['createContourCommand'](fp['context']))),
              (0x0,
              J['defined'])(this['_drawCommand']) && (this['_planeOptions']['fillMode'] !== K['GridDataGLFillMode']['none'] && fp['commandList']['push'](this['_drawCommand']),
              this['_planeOptions']['showLine'] && (fp['commandList']['push'](this['_contourClearCommand']),
              fp['commandList']['push'](this['_shadedCommand']),
              fp['commandList']['push'](this['_contourCommand'])))));
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['PixelLayerStyle3D'](fp);
          }
      }
      CSectionLayer['DefaultOptions'] = {
          'fixedPlane': CFixedPlane['lonLat'],
          'allowPicking': false
      };
      class CVolumeLayer extends fn {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp, CVolumeLayer['DefaultOptions'])),
              this['options']['camera'] && K['logger']['debug']('体渲染传入了相机对象，将使用指定的相机状态渲染！');
          }
          ['setDrawOptions'](fp, fR=true) {
              var fm;
              super['setDrawOptions'](fp, fR);
              const fH = this['parseColorStopRules'](this['drawOptions']['color']);
              return this['colors'] = fH['colors'],
              this['steps'] = fH['steps'],
              this['_planeOptions'] = this['drawOptions']['getPlaneOptions'](undefined, null !== (fm = this['options']['cacheDrawOptions']) && undefined !== fm && fm),
              this;
          }
          ['setDataSource'](fp) {
              return super['setDataSource'](fp),
              this;
          }
          ['update'](fp) {
              super['update'](fp),
              this['_camera'] = fp['camera'],
              this['currentGrids'] && ((0x0,
              J['defined'])(this['_drawCommand']) || (this['_drawCommand'] = this['createCommand'](fp['context'])),
              (0x0,
              J['defined'])(this['_drawCommand']) && fp['commandList']['push'](this['_drawCommand']));
          }
          ['createVAO'](fp, fR, fm) {
              const fH = performance['now']()
                , fe = (0x0,
              K['createBoxGeometry'])(fm['x'], fm['y'], fm['z'], 0x14, 0x14)
                , fA = new J['Geometry']({
                  'attributes': {
                      'pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fe['vertices'],
                          'normalize': false
                      })
                  },
                  'indices': new Uint16Array(fe['indices'])
              })
                , fI = this['_vao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fA,
                  'attributeLocations': fR,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              return this['options']['debugShowPerformance'] && K['logger']['debug']('generate\x20volume\x20indicies\x20costs\x20' + (performance['now']() - fH) + 'ms'),
              fI;
          }
          ['createCommand'](fp) {
              const fR = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fR['cull'] = {
                  'enabled': true,
                  'face': J['CullFace']['FRONT']
              };
              const fm = J['RenderState']['fromCache'](fR)
                , fH = this['steps']['length']
                , fe = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20in\x20vec3\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20eye_pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20dimensions;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20center;\x20//lon,lat,hgt\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out\x20vec3\x20vray_dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20flat\x20out\x20vec3\x20transformed_eye;\x20//flat\x20only\x20in\x20webgl2\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20out\x20vec3\x20vPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20out\x20vec3\x20vCPos;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(void)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20cPos=pos+center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20position=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(cPos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20\x20czm_projection\x20*\x20czm_view\x20\x20*\x20vec4(position,\x201);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20vPos=pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20vCPos=center;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transformed_eye\x20=\x20((eye_pos-center)\x20+\x20dimensions/2.)\x20/\x20dimensions;\x20\x20//eye\x20coords\x20in\x20local\x20coords\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vray_dir\x20=\x20(pos+dimensions/2.)/dimensions\x20-\x20transformed_eye;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
              let fA = 'val=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(currentData,p,xAttr,yAttr,zAttr,undef,interpMethod);';
              this['options']['interpFromPreSource'] && (fA = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preData,p,xAttr,yAttr,zAttr,undef,interpMethod,currentData,dataPercent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(currentData,p,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fI = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount\x20=\x20' + fH + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20REFINEMENT_STEPS=4;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//自动生成数据贴图数组\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20highp\x20sampler3D\x20currentData;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20highp\x20sampler3D\x20preData;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20float\x20dataPercent;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mediump\x20int\x20interpMethod;\x20//0-none\x201-bi\x20cesium在vShader和fShader中对于int的精度定义不一致，需要特别指定\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (this['options']['interpFromPreSource'] ? 'uniform\x20bool\x20hasPre;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20ivec3\x20volume_dims;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20dt_scale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['currentGrids'][0x0]) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20interpColor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20dimensions;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20eye_pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20vec4\x20ambient_color\x20=\x20vec4(0.2,\x200.4,\x200.2,\x201.0);\x0a\x09\x09\x09const\x20vec4\x20diffuse_color\x20=\x20vec4(0.8,\x200.2,\x200.2,\x201.0);\x0a\x09\x09\x09const\x20vec4\x20specular_color\x20=\x20vec4(1.0,\x201.0,\x201.0,\x201.0);\x0a\x09\x09\x09const\x20float\x20shininess\x20=\x2040.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20in\x20vec3\x20vPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20in\x20vec3\x20vCPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20in\x20vec3\x20vray_dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20flat\x20in\x20vec3\x20transformed_eye;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20out\x20vec4\x20color;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//#region\x20intersect_box\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20intersect_box(vec3\x20orig,\x20vec3\x20dir)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20vec3\x20box_min\x20=\x20vec3(0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20vec3\x20box_max\x20=\x20vec3(1);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20inv_dir\x20=\x201.0\x20/\x20dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20tmin_tmp\x20=\x20(box_min\x20-\x20orig)\x20*\x20inv_dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20tmax_tmp\x20=\x20(box_max\x20-\x20orig)\x20*\x20inv_dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20tmin\x20=\x20min(tmin_tmp,\x20tmax_tmp);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20tmax\x20=\x20max(tmin_tmp,\x20tmax_tmp);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20t0\x20=\x20max(tmin.x,\x20max(tmin.y,\x20tmin.z));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20t1\x20=\x20min(tmax.x,\x20min(tmax.y,\x20tmax.z));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(t0,\x20t1);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//#endregion\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//#region\x20wang_hash\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Pseudo-random\x20number\x20gen\x20from\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20http://www.reedbeta.com/blog/quick-and-easy-gpu-random-numbers-in-d3d11/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20with\x20some\x20tweaks\x20for\x20the\x20range\x20of\x20values\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20wang_hash(int\x20seed)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20seed\x20=\x20(seed\x20^\x2061)\x20^\x20(seed\x20>>\x2016);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20seed\x20*=\x209;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20seed\x20=\x20seed\x20^\x20(seed\x20>>\x204);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20seed\x20*=\x200x27d4eb2d;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20seed\x20=\x20seed\x20^\x20(seed\x20>>\x2015);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20float(seed\x20%\x202147483647)\x20/\x20float(2147483647);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//#endregion\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20cast_mip(vec2\x20t_hit,float\x20dt,vec3\x20ray_dir,vec3\x20p){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20max_val=-1e6;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20max_p=p;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color=vec4(0.0,0.,0.,0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for\x20(float\x20t\x20=\x20t_hit.x;\x20t\x20<\x20t_hit.y;\x20t\x20+=\x20dt)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fA + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(val.y,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20if(val.y>max_val){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20max_val=val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20max_p=p;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20val_color\x20=\x20interpColor?' + K['qeGLFuncs']['qe_interpColor'] + '(val.y):\x20' + K['qeGLFuncs']['qe_getColor'] + '(val.y);\x20//interpColor(val);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20alpha\x20=\x20\x20(1.0\x20-\x20color.a)\x20*\x20val_color.a;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.rgb\x20+=\x20alpha\x20*\x20val_color.rgb;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.a\x20+=\x20alpha;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(color.a\x20>=\x200.95)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20break;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20p\x20+=\x20ray_dir\x20*\x20dt;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20p=max_p;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20dt=dt/float(REFINEMENT_STEPS);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20for(int\x20i=-2;i<2;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20p=p+float(i)*ray_dir*dt;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20$\x20{readDataFunc}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20if(!$\x20{qeGLFuncs.qe_isUndef}(val.y,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20\x20\x20\x20\x20max_val\x20=\x20max(max_val,\x20val.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20out_FragColor=' + K['qeGLFuncs']['qe_interpColor'] + '(max_val);\x20//color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20sample1(vec3\x20p)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/*\x20Sample\x20float\x20value\x20from\x20a\x203D\x20texture.\x20Assumes\x20intensity\x20data.\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fA + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20apply_colormap(float\x20val)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20interpColor?' + K['qeGLFuncs']['qe_interpColor'] + '(val):\x20' + K['qeGLFuncs']['qe_getColor'] + '(val);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20add_lighting(float\x20val,\x20vec3\x20loc,\x20vec3\x20step,\x20vec3\x20view_ray)\x0a\x09\x09\x09\x09{\x0a\x09\x09\x09\x09\x09//\x20Calculate\x20color\x20by\x20incorporating\x20lighting\x0a\x0a\x09\x09\x09\x09\x09\x09//\x20View\x20direction\x0a\x09\x09\x09\x09\x09\x09vec3\x20V\x20=\x20normalize(view_ray);\x0a\x0a\x09\x09\x09\x09\x09\x09//\x20calculate\x20normal\x20vector\x20from\x20gradient\x0a\x09\x09\x09\x09\x09\x09vec3\x20N;\x0a\x09\x09\x09\x09\x09\x09float\x20val1,\x20val2;\x0a\x09\x09\x09\x09\x09\x09val1\x20=\x20sample1(loc\x20+\x20vec3(-step[0],\x200.0,\x200.0));\x0a\x09\x09\x09\x09\x09\x09val2\x20=\x20sample1(loc\x20+\x20vec3(+step[0],\x200.0,\x200.0));\x0a\x09\x09\x09\x09\x09\x09N[0]\x20=\x20val1\x20-\x20val2;\x0a\x09\x09\x09\x09\x09\x09val\x20=\x20max(max(val1,\x20val2),\x20val);\x0a\x09\x09\x09\x09\x09\x09val1\x20=\x20sample1(loc\x20+\x20vec3(0.0,\x20-step[1],\x200.0));\x0a\x09\x09\x09\x09\x09\x09val2\x20=\x20sample1(loc\x20+\x20vec3(0.0,\x20+step[1],\x200.0));\x0a\x09\x09\x09\x09\x09\x09N[1]\x20=\x20val1\x20-\x20val2;\x0a\x09\x09\x09\x09\x09\x09val\x20=\x20max(max(val1,\x20val2),\x20val);\x0a\x09\x09\x09\x09\x09\x09val1\x20=\x20sample1(loc\x20+\x20vec3(0.0,\x200.0,\x20-step[2]));\x0a\x09\x09\x09\x09\x09\x09val2\x20=\x20sample1(loc\x20+\x20vec3(0.0,\x200.0,\x20+step[2]));\x0a\x09\x09\x09\x09\x09\x09N[2]\x20=\x20val1\x20-\x20val2;\x0a\x09\x09\x09\x09\x09\x09val\x20=\x20max(max(val1,\x20val2),\x20val);\x0a\x0a\x09\x09\x09\x09\x09\x09float\x20gm\x20=\x20length(N);\x20//\x20gradient\x20magnitude\x0a\x09\x09\x09\x09\x09\x09N\x20=\x20normalize(N);\x0a\x0a\x09\x09\x09\x09\x09\x09//\x20Flip\x20normal\x20so\x20it\x20points\x20towards\x20viewer\x0a\x09\x09\x09\x09\x09\x09float\x20Nselect\x20=\x20float(dot(N,\x20V)\x20>\x200.0);\x0a\x09\x09\x09\x09\x09\x09N\x20=\x20(2.0\x20*\x20Nselect\x20-\x201.0)\x20*\x20N;\x09//\x20==\x09Nselect\x20*\x20N\x20-\x20(1.0-Nselect)*N;\x0a\x0a\x09\x09\x09\x09\x09\x09//\x20Init\x20colors\x0a\x09\x09\x09\x09\x09\x09vec4\x20ambient_color\x20=\x20vec4(0.0,\x200.0,\x200.0,\x200.0);\x0a\x09\x09\x09\x09\x09\x09vec4\x20diffuse_color\x20=\x20vec4(0.0,\x200.0,\x200.0,\x200.0);\x0a\x09\x09\x09\x09\x09\x09vec4\x20specular_color\x20=\x20vec4(0.0,\x200.0,\x200.0,\x200.0);\x0a\x0a\x09\x09\x09\x09\x09\x09//\x20note:\x20could\x20allow\x20multiple\x20lights\x0a\x09\x09\x09\x09\x09\x09for\x20(int\x20i=0;\x20i<1;\x20i++)\x0a\x09\x09\x09\x09\x09\x09{\x0a\x09\x09\x09\x09\x09\x09\x09\x09\x20//\x20Get\x20light\x20direction\x20(make\x20sure\x20to\x20prevent\x20zero\x20devision)\x0a\x09\x09\x09\x09\x09\x09\x09\x09vec3\x20L\x20=\x20normalize(view_ray);\x09//lightDirs[i];\x0a\x09\x09\x09\x09\x09\x09\x09\x09float\x20lightEnabled\x20=\x20float(\x20length(L)\x20>\x200.0\x20);\x0a\x09\x09\x09\x09\x09\x09\x09\x09L\x20=\x20normalize(L\x20+\x20(1.0\x20-\x20lightEnabled));\x0a\x0a\x09\x09\x09\x09\x09\x09\x09\x09//\x20Calculate\x20lighting\x20properties\x0a\x09\x09\x09\x09\x09\x09\x09\x09float\x20lambertTerm\x20=\x20clamp(dot(N,\x20L),\x200.0,\x201.0);\x0a\x09\x09\x09\x09\x09\x09\x09\x09vec3\x20H\x20=\x20normalize(L+V);\x20//\x20Halfway\x20vector\x0a\x09\x09\x09\x09\x09\x09\x09\x09float\x20specularTerm\x20=\x20pow(max(dot(H,\x20N),\x200.0),\x20shininess);\x0a\x0a\x09\x09\x09\x09\x09\x09\x09\x09//\x20Calculate\x20mask\x0a\x09\x09\x09\x09\x09\x09\x09\x09float\x20mask1\x20=\x20lightEnabled;\x0a\x0a\x09\x09\x09\x09\x09\x09\x09\x09//\x20Calculate\x20colors\x0a\x09\x09\x09\x09\x09\x09\x09\x09ambient_color\x20+=\x09mask1\x20*\x20ambient_color;\x09//\x20*\x20gl_LightSource[i].ambient;\x0a\x09\x09\x09\x09\x09\x09\x09\x09diffuse_color\x20+=\x09mask1\x20*\x20lambertTerm;\x0a\x09\x09\x09\x09\x09\x09\x09\x09specular_color\x20+=\x20mask1\x20*\x20specularTerm\x20*\x20specular_color;\x0a\x09\x09\x09\x09\x09\x09}\x0a\x0a\x09\x09\x09\x09\x09\x09//\x20Calculate\x20final\x20color\x20by\x20componing\x20different\x20components\x0a\x09\x09\x09\x09\x09\x09vec4\x20final_color;\x0a\x09\x09\x09\x09\x09\x09vec4\x20color\x20=\x20apply_colormap(val);\x0a\x09\x09\x09\x09\x09\x09final_color\x20=\x20color\x20*\x20(ambient_color\x20+\x20diffuse_color)\x20+\x20specular_color;\x0a\x09\x09\x09\x09\x09\x09final_color.a\x20=\x20color.a;\x0a\x09\x09\x09\x09\x09\x09return\x20final_color;\x0a\x09\x09\x09\x09}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20cast_iso(vec2\x20t_hit,float\x20dt,vec3\x20ray_dir,vec3\x20p){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20low_threshold\x20=\x2045.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20dstep\x20=\x201.5\x20/\x20vec3(volume_dims);\x09//\x20step\x20to\x20sample\x20derivative\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for\x20(float\x20t\x20=\x20t_hit.x;\x20t\x20<\x20t_hit.y;\x20t\x20+=\x20dt)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fA + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(val.y,undef)\x20&&\x20val.y\x20>\x20low_threshold){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20ip=p-ray_dir*dt*0.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20p_temp=vec3(p.xyz);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i=0;i<REFINEMENT_STEPS;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20p=ip;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fA + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(val.y,undef)\x20&&\x20val.y\x20>\x20low_threshold){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20add_lighting(val.y,\x20p,\x20dstep,\x20ray_dir);\x20//' + K['qeGLFuncs']['qe_interpColor'] + '(val.y);\x0a\x09\x09\x09\x09\x09\x09\x09\x09return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20p=p_temp;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20p\x20+=\x20ray_dir\x20*\x20dt;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(void)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color=vec4(0.0,0.,0.,0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20out_FragColor=color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20vec3\x20transformed_eye\x20=\x20((eye_pos-vCPos)\x20+\x20dimensions/2.)\x20/\x20dimensions;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20vec3\x20vray_dir=(vPos+dimensions/2.)/dimensions\x20-\x20transformed_eye;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20ray_dir\x20=\x20normalize(vray_dir);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20t_hit\x20=\x20intersect_box(transformed_eye,\x20ray_dir);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(t_hit.x\x20>\x20t_hit.y)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t_hit.x\x20=\x20max(t_hit.x,\x200.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20dt_vec\x20=\x201.0\x20/\x20(vec3(volume_dims)\x20*\x20abs(ray_dir));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20dt\x20=\x20dt_scale\x20*\x20min(dt_vec.x,\x20min(dt_vec.y,\x20dt_vec.z));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20offset\x20=\x20wang_hash(int(gl_FragCoord.x\x20+\x20640.0\x20*\x20gl_FragCoord.y));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20p\x20=\x20transformed_eye\x20+\x20(t_hit.x\x20+\x20offset\x20*\x20dt)\x20*\x20ray_dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20cast_mip(t_hit,dt,ray_dir,p);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20cast_iso(t_hit,dt,ray_dir,p);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fx = fK(fe)
                , fB = fK(fI)
                , fM = (0x0,
              K['gridOptionsToExtent'])(this['dataSource']['gridOptions'])
                , fl = (this['dataSource']['gridOptions']['xStart'] + this['dataSource']['gridOptions']['xEnd']) / 0x2
                , fX = (this['dataSource']['gridOptions']['yStart'] + this['dataSource']['gridOptions']['yEnd']) / 0x2
                , fE = (this['zValuesWithScale'][0x0] + this['zValuesWithScale'][this['dataSource']['gridOptions']['zValues']['length'] - 0x1]) / 0x2
                , fO = fM['maxLon'] - fM['minLon']
                , F0 = fM['maxLat'] - fM['minLat']
                , F1 = this['zValuesWithScale'][this['dataSource']['gridOptions']['zValues']['length'] - 0x1] - this['zValuesWithScale'][0x0]
                , F2 = new J['Cartesian3'](fO,F0,F1)
                , F3 = new J['Cartesian3'](fl,fX,fE)
                , F4 = new J['Cartesian3'](this['dataSource']['gridOptions']['xSize'],this['dataSource']['gridOptions']['ySize'],this['zValuesWithScale']['length'])
                , F5 = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , F6 = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                , F7 = new J['Cartesian3'](this['zValuesWithScale'][0x0],this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1],this['zValuesWithScale']['length'])
                , F8 = 0xb4 / Math['PI']
                , F9 = {
                  'xAttr': ()=>F5,
                  'yAttr': ()=>F6,
                  'zAttr': ()=>F7,
                  'currentData': ()=>this['currentTexture'] || (this['currentTexture'] = fQ(fp, this['currentGrids'], this['dataSource']['gridOptions'], undefined, true)),
                  'colors': ()=>this['colors'],
                  'steps': ()=>this['steps'],
                  'interpMethod': ()=>0x1,
                  'interpColor': ()=>true,
                  'dimensions': ()=>F2,
                  'center': ()=>F3,
                  'volume_dims': ()=>F4,
                  'dt_scale': ()=>this['_planeOptions']['samplingRate'] || 0x1,
                  'eye_pos': ()=>{
                      var Fb;
                      const Fw = (null !== (Fb = this['options']['camera']) && undefined !== Fb ? Fb : this['_camera'])['_positionCartographic'];
                      return new J['Cartesian3'](Fw['longitude'] * F8,Fw['latitude'] * F8,Fw['height']);
                  }
              };
              (0x0,
              K['setAlgoUniforms'])(this['currentGrids'][0x0], F9),
              this['options']['interpFromPreSource'] && (F9['preData'] = ()=>this['preTexture'] || this['preGrids'] && (this['preTexture'] = fQ(fp, this['preGrids'], this['dataSource']['gridOptions'], undefined, true)) || fp['defaultTexture'],
              F9['dataPercent'] = ()=>this['dataPercent'],
              F9['hasPre'] = ()=>!!this['preGrids']);
              const Ff = {
                  'pos': 0x0
              }
                , FF = this['createVAO'](fp, Ff, F2)
                , Fd = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fx,
                  'fragmentShaderSource': fB,
                  'attributeLocations': Ff
              });
              return new J['DrawCommand']({
                  'vertexArray': FF,
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fm,
                  'shaderProgram': Fd,
                  'uniformMap': F9,
                  'owner': this,
                  'pass': this['_planeOptions']['opaque'] ? J['Pass']['OPAQUE'] : J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix'] || J['Matrix4']['IDENTITY']
              });
          }
          ['resetCommand']() {
              var fp;
              this['_drawCommand'] && (null === (fp = this['_drawCommand']) || undefined === fp || fp['shaderProgram']['destroy'](),
              this['_drawCommand'] = undefined);
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['VolumeLayerStyle'](fp);
          }
      }
      CVolumeLayer['DefaultOptions'] = {
          'camera': undefined,
          'appearance': new J['MaterialAppearance']({
              'material': new J['Material']({
                  'fabric': {
                      'type': 'Color',
                      'uniforms': {
                          'color': new J['Color'](0x1,0x0,0x0,0.5)
                      },
                      'components': {
                          'diffuse': 'vec3(0.5)',
                          'specular': '0.1'
                      }
                  }
              })
          })
      };
      class CWindLayer extends fn {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp || {}, CWindLayer['DefaultOptions'])),
              this['_moving'] = false,
              this['ptTextureDirty'] = false,
              this['vectorGridMode'] = 'uv',
              this['_pixelLayer'] = new CPixelLayer(fp);
          }
          ['updateVisExtent']() {
              var fp;
              if (!(null === (fp = this['_planeOptions']) || undefined === fp ? undefined : fp['particleRegion']) || !this['dataSource'])
                  return;
              const fR = this['_planeOptions']['particleRegion']
                , fm = fR['minLon']
                , fH = fR['maxLon']
                , fe = fR['minLat']
                , fA = fR['maxLat']
                , fI = this['dataSource']['gridOptions']['xEnd'] - this['dataSource']['gridOptions']['xStart']
                , fx = (fm - this['dataSource']['gridOptions']['xStart']) / fI
                , fB = (fH - this['dataSource']['gridOptions']['xStart']) / fI
                , fM = this['dataSource']['gridOptions']['yEnd'] - this['dataSource']['gridOptions']['yStart']
                , fl = (fe - this['dataSource']['gridOptions']['yStart']) / fM
                , fX = (fA - this['dataSource']['gridOptions']['yStart']) / fM;
              this['_visExtent'] = new J['Cartesian4'](Math['max'](0x0, Math['min'](fx, fB)),Math['min'](0x1, Math['max'](fx, fB)),Math['max'](0x0, Math['min'](fl, fX)),Math['min'](0x1, Math['max'](fl, fX)));
          }
          ['setDataSource'](fp) {
              return super['setDataSource'](fp),
              this['updateVisExtent'](),
              this['_pixelLayer']['setDataSource'](fp),
              this;
          }
          ['setDrawOptions'](fp, fR=true) {
              if (super['setDrawOptions'](fp, fR),
              this['_planeOptions'] = this['drawOptions']['getPlaneOptions'](undefined, this['options']['cacheDrawOptions']),
              this['_planeOptions']['color']) {
                  const fH = this['parseColorStopRules'](this['_planeOptions']['color']);
                  this['fillColors'] = fH['colors'],
                  this['fillSteps'] = fH['steps'];
              } else
                  this['_csTexture'] && (this['_csTexture'] && this['_csTexture']['destroy'](),
                  this['_csTexture'] = undefined);
              this['splineMat'] = new J['Matrix4'](-this['drawOptions']['interpSmoothFactor'],0x2 - this['drawOptions']['interpSmoothFactor'],this['drawOptions']['interpSmoothFactor'] - 0x2,this['drawOptions']['interpSmoothFactor'],0x2 * this['drawOptions']['interpSmoothFactor'],this['drawOptions']['interpSmoothFactor'] - 0x3,0x3 - 0x2 * this['drawOptions']['interpSmoothFactor'],-this['drawOptions']['interpSmoothFactor'],-this['drawOptions']['interpSmoothFactor'],0x0,this['drawOptions']['interpSmoothFactor'],0x0,0x0,0x1,0x0,0x0),
              this['updateVisExtent']();
              const fm = this['drawOptions']['count'];
              return this['_count'] ? this['_count'] !== fm && this['dataSource'] && (this['sizeChanged'] = true,
              this['_count'] = fm) : this['_count'] = fm,
              this['_currentImageTexture'] !== this['drawOptions']['texture'] && (this['_currentImageTexture'] = this['drawOptions']['texture'],
              this['ptTextureDirty'] = true),
              this['_pixelLayer']['setDrawOptions'](this['drawOptions']['pixelOptions']),
              this;
          }
          ['resetCommand'](fp=false) {
              var fR, fm, fH, fe, fA, fI, fx, fB, fM, fl, fX, fE, fO, F0, F1, F2, F3, F4, F5, F6, F7, F8, F9, Ff, FF, Fd, Fb, Fw, FQ, Fv, Ft;
              this['_posCommand'] && (null === (fR = this['_particleTexture0']) || undefined === fR || fR['destroy'](),
              null === (fm = this['_particleTexture1']) || undefined === fm || fm['destroy'](),
              null === (fH = this['_positionTexture']) || undefined === fH || fH['destroy'](),
              null === (fe = this['_ptTexture']) || undefined === fe || fe['destroy'](),
              null === (fA = this['_depthHolderTexture']) || undefined === fA || fA['destroy'](),
              null === (fI = this['_positionBackTexture']) || undefined === fI || fI['destroy'](),
              null === (fx = this['_zPositionTexutre']) || undefined === fx || fx['destroy'](),
              null === (fB = this['_particleDepthTexture']) || undefined === fB || fB['destroy'](),
              null === (fM = this['_zPositionBackTexture']) || undefined === fM || fM['destroy'](),
              null === (fX = null === (fl = this['_posCommand']) || undefined === fl ? undefined : fl['shaderProgram']) || undefined === fX || fX['destroy'](),
              null === (fO = null === (fE = this['_zPosCommand']) || undefined === fE ? undefined : fE['shaderProgram']) || undefined === fO || fO['destroy'](),
              null === (F1 = null === (F0 = this['_depthCommand']) || undefined === F0 ? undefined : F0['shaderProgram']) || undefined === F1 || F1['destroy'](),
              null === (F3 = null === (F2 = this['_screenCommand']) || undefined === F2 ? undefined : F2['shaderProgram']) || undefined === F3 || F3['destroy'](),
              null === (F5 = null === (F4 = this['_particleCommand']) || undefined === F4 ? undefined : F4['shaderProgram']) || undefined === F5 || F5['destroy'](),
              null === (F7 = null === (F6 = this['_particleFadeCommand']) || undefined === F6 ? undefined : F6['shaderProgram']) || undefined === F7 || F7['destroy'](),
              null === (F9 = null === (F8 = this['_clearDepthBufferCommand']) || undefined === F8 ? undefined : F8['shaderProgram']) || undefined === F9 || F9['destroy'](),
              null === (FF = null === (Ff = this['_clearFrameBufferCommand']) || undefined === Ff ? undefined : Ff['shaderProgram']) || undefined === FF || FF['destroy'](),
              fp && (null === (Fd = this['_fadeVao']) || undefined === Fd || Fd['destroy'](),
              null === (Fb = this['_depthVao']) || undefined === Fb || Fb['destroy'](),
              null === (Fw = this['_screenVao']) || undefined === Fw || Fw['destroy'](),
              null === (FQ = this['_particleVao']) || undefined === FQ || FQ['destroy'](),
              null === (Fv = this['_positionVao']) || undefined === Fv || Fv['destroy'](),
              null === (Ft = this['_zPositionVao']) || undefined === Ft || Ft['destroy'](),
              this['_fadeVao'] = undefined,
              this['_depthVao'] = undefined,
              this['_screenVao'] = undefined,
              this['_particleVao'] = undefined,
              this['_positionVao'] = undefined,
              this['_zPositionVao'] = undefined),
              this['_particleTexture0'] = undefined,
              this['_particleTexture1'] = undefined,
              this['_positionTexture'] = undefined,
              this['_ptTexture'] = undefined,
              this['_depthHolderTexture'] = undefined,
              this['_positionBackTexture'] = undefined,
              this['_zPositionTexutre'] = undefined,
              this['_particleDepthTexture'] = undefined,
              this['_zPositionBackTexture'] = undefined,
              this['_posCommand'] = undefined,
              this['_zPosCommand'] = undefined,
              this['_depthCommand'] = undefined,
              this['_screenCommand'] = undefined,
              this['_particleCommand'] = undefined,
              this['_particleFadeCommand'] = undefined,
              this['_clearDepthBufferCommand'] = undefined,
              this['_clearFrameBufferCommand'] = undefined);
          }
          ['_createPositionCommand'](fp) {
              const fR = new Float32Array([-0x1, 0x1, 0x0, -0x1, -0x1, 0x0, 0x1, -0x1, 0x0, -0x1, 0x1, 0x0, 0x1, -0x1, 0x0, 0x1, 0x1, 0x0])
                , fm = new J['Geometry']({
                  'attributes': {
                      'pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fR,
                          'normalize': false
                      })
                  }
              })
                , fH = {
                  'pos': 0x0
              };
              this['_positionVao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fm,
                  'attributeLocations': fH,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              }),
              this['_positionTexture'] = new J['Texture']({
                  'context': fp,
                  'width': this['_planeOptions']['count'],
                  'height': this['_planeOptions']['count'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  })
              }),
              this['_positionBackTexture'] = new J['Texture']({
                  'context': fp,
                  'width': this['_planeOptions']['count'],
                  'height': this['_planeOptions']['count'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  }),
                  'source': {
                      'arrayBufferView': new Uint8Array(this['_planeOptions']['count'] * this['_planeOptions']['count'] * 0x4)
                  }
              });
              const fe = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUV=(pos.xy+1.)/2.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(pos,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fA = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20int;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler3D;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20earthC\x20=\x2040075.;\x20\x20//km\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20degPerLatKM\x20=\x20' + 0x1 / 111.32 + ';\x20//每公里多少度\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20dropRate;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20posTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20randSeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20uTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20vTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20preUTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20preVTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20percent;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasPre;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20extent;\x20//xStart,xEnd,yStart,yEnd->data\x20options\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20dt;\x20//seconds\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20spdFactor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20visExtent;\x20//xStart,xEnd,yStart,yEnd\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['dataSource']['getU'](), false, false) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20interpMethod;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20zPosTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20onlyZ;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20pseudo-random\x20generator\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20vec3\x20rand_constants\x20=\x20vec3(12.9898,\x2078.233,\x204375.85453);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20rand(const\x20vec2\x20co)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20t\x20=\x20dot(rand_constants.xy,\x20co);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20fract(sin(t)\x20*\x20(rand_constants.z\x20+\x20t));\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20getRandPos(vec2\x20seed){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20randPos=vec2(rand(seed+1.6),rand(seed+2.8));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20x=visExtent.x+(visExtent.y-visExtent.x)*randPos.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20y=visExtent.z+(visExtent.w-visExtent.z)*randPos.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20randPos=vec2(x,y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fract(randPos\x20*\x20255.0),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20floor(randPos\x20*\x20255.0)\x20/\x20255.0);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20encodePosition(vec2\x20rawPos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fract(rawPos\x20*\x20255.0),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20floor(rawPos\x20*\x20255.0)\x20/\x20255.0);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20updatePos(vec2\x20current,vec2\x20uv){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(onlyZ==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(current.xy);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20lon=extent.x+(extent.y-extent.x)*current.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20lat=extent.z+(extent.w-extent.z)*current.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20degPerLonKM=1.0/(earthC*cos(radians(lat))/360.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20uDegSpeed=degPerLonKM*(uv.x/1000.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20vDegSpeed=degPerLatKM*(uv.y/1000.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20s=vec2(uDegSpeed,vDegSpeed)*dt*spdFactor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20pos=vec2(lon,lat)+s;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20uPos=(pos.x-extent.x)/(extent.y-extent.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20vPos=(pos.y-extent.z)/(extent.w-extent.z);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(uPos,vPos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20decodePos(vec4\x20src){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20src.r\x20/\x20255.0\x20+\x20src.b,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20src.g\x20/\x20255.0\x20+\x20src.a);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//previous\x20encoded\x20position\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20posTex=' + K['glNames']['textureFunc'] + '(posTexture,vUV);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20pos=decodePos(posTex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20zPosTex=' + K['glNames']['textureFunc'] + '(zPosTexture,vUV);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20zPos=decodePos(zPosTex);\x20//only\x20use\x20x\x20for\x20speed,y\x20always\x200\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20seed=(vUV+pos)*randSeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20randPos=getRandPos(seed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(posTex.r==0.\x20&&\x20posTex.g==0.\x20&&\x20posTex.b==0.\x20&&\x20posTex.a==0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//first\x20load,use\x20all\x20random\x20pos\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=randPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20texPos=vec3(pos.xy,zPos.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20u;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20v;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20u=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preUTexture,texPos,xAttr,yAttr,zAttr,undef,interpMethod,uTexture,percent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preVTexture,texPos,xAttr,yAttr,zAttr,undef,interpMethod,vTexture,percent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20u=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(uTexture,texPos,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(vTexture,texPos,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=vec2(u.y,v.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(' + K['qeGLFuncs']['qe_isUndef'] + '(uv.x,undef)\x20||\x20' + K['qeGLFuncs']['qe_isUndef'] + '(uv.y,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=randPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20pos=updatePos(pos,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(pos.x>visExtent.y\x20||\x20pos.x<visExtent.x\x20||\x20pos.y>visExtent.w\x20||\x20pos.y<visExtent.z){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=randPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20posTex=encodePosition(pos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20drop=step(1.0\x20-\x20dropRate,\x20rand(seed));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=mix(posTex,randPos,drop);\x20//avoid\x20floating\x20error\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fI = fK(fe, undefined, {})
                , fx = fK(fA, undefined, {})
                , fB = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fI,
                  'fragmentShaderSource': fx,
                  'attributeLocations': fH
              })
                , fM = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , fl = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                , fX = new J['Cartesian3'](this['zValuesWithScale'][0x0],this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1],this['zValuesWithScale']['length'])
                , fE = ft(fp)
                , fO = fv(fp)
                , F0 = this['dataSource']['gridOptions']
                , F1 = new J['Cartesian4'](F0['xStart'],F0['xEnd'],F0['yStart'],F0['yEnd'])
                , F2 = new J['Cartesian4'](0x0,0x1,0x0,0x1)
                , F3 = {
                  'xAttr': ()=>fM,
                  'yAttr': ()=>fl,
                  'zAttr': ()=>fX,
                  'uTexture': ()=>this['currentTexture'] || (this['currentTexture'] = fQ(fp, this['currentGrids'], this['dataSource']['gridOptions'])),
                  'vTexture': ()=>this['currentTexture2'] || (this['currentTexture2'] = fQ(fp, this['currentGrids2'], this['dataSource']['gridOptions'])),
                  'preUTexture': ()=>this['options']['interpFromPreSource'] && (this['preTexture'] || this['preGrids'] && (this['preTexture'] = fQ(fp, this['preGrids'], this['dataSource']['gridOptions']))) || fE,
                  'preVTexture': ()=>this['options']['interpFromPreSource'] && (this['preTexture2'] || this['preGrids2'] && (this['preTexture2'] = fQ(fp, this['preGrids2'], this['dataSource']['gridOptions']))) || fE,
                  'hasPre': ()=>{
                      var F4;
                      return this['options']['interpFromPreSource'] && (null === (F4 = this['preGrids']) || undefined === F4 ? undefined : F4['length']);
                  }
                  ,
                  'percent': ()=>{
                      var F4;
                      return null !== (F4 = this['dataPercent']) && undefined !== F4 ? F4 : 0x1;
                  }
                  ,
                  'dropRate': ()=>this['_planeOptions']['dropRate'],
                  'posTexture': ()=>this['_positionBackTexture'],
                  'randSeed': ()=>this['_randomSeed'],
                  'extent': ()=>F1,
                  'spdFactor': ()=>this['_planeOptions']['speedFactor'],
                  'visExtent': ()=>{
                      var F4;
                      return null !== (F4 = this['_visExtent']) && undefined !== F4 ? F4 : F2;
                  }
                  ,
                  'cardinalSplineMat': ()=>this['splineMat'],
                  'interpMethod': ()=>this['_planeOptions']['interpMethod'],
                  'zPosTexture': ()=>{
                      var F4;
                      return null !== (F4 = this['_zPositionBackTexture']) && undefined !== F4 ? F4 : fO;
                  }
                  ,
                  'onlyZ': ()=>this['_planeOptions']['onlyZ'],
                  'dt': ()=>this['_dt']
              };
              (0x0,
              K['setAlgoUniforms'])(this['dataSource']['getU'](), F3),
              this['_posCommand'] = new J['ComputeCommand']({
                  'vertexArray': this['_positionVao'],
                  'shaderProgram': fB,
                  'uniformMap': F3,
                  'outputTexture': this['_positionTexture'],
                  'persists': true,
                  'owner': this
              });
          }
          ['_createZPositionCommand'](fp) {
              const fR = new Float32Array([-0x1, 0x1, 0x0, -0x1, -0x1, 0x0, 0x1, -0x1, 0x0, -0x1, 0x1, 0x0, 0x1, -0x1, 0x0, 0x1, 0x1, 0x0])
                , fm = new J['Geometry']({
                  'attributes': {
                      'pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fR,
                          'normalize': false
                      })
                  }
              })
                , fH = {
                  'pos': 0x0
              };
              this['_zPositionVao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fm,
                  'attributeLocations': fH,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              }),
              this['_zPositionTexutre'] = new J['Texture']({
                  'context': fp,
                  'width': this['_planeOptions']['count'],
                  'height': this['_planeOptions']['count'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  })
              }),
              this['_zPositionBackTexture'] = new J['Texture']({
                  'context': fp,
                  'width': this['_planeOptions']['count'],
                  'height': this['_planeOptions']['count'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  }),
                  'source': {
                      'arrayBufferView': new Uint8Array(this['_planeOptions']['count'] * this['_planeOptions']['count'] * 0x4)
                  }
              });
              const fe = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUV=(pos.xy+1.)/2.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(pos,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fA = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20int;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler3D;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20earthC\x20=\x2040075.;\x20\x20//km\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20degPerLatKM\x20=\x20' + 0x1 / 111.32 + ';\x20//每公里多少度\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20dropRate;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20posTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20zPosTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20randSeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//diff\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20wTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20preWTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20zExtent;\x20//minZ\x20maxZ\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20zCount=' + this['zValuesWithScale']['length'] + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20zList[zCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20currentZIdx;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20zScale;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20percent;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasPre;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20dt;\x20//seconds\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20spdFactor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20visExtent;\x20//xStart,xEnd,yStart,yEnd\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['dataSource']['getU'](), false, false) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20interpMethod;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20zPosTexture;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20pseudo-random\x20generator\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20vec3\x20rand_constants\x20=\x20vec3(12.9898,\x2078.233,\x204375.85453);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20rand(const\x20vec2\x20co)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(currentZIdx>=0.\x20||\x20zCount==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//show\x20fixed\x20level\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(zCount<=1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(currentZIdx>=float(zCount-1)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x201.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20zIdx=int(floor(currentZIdx));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20zWeight=fract(currentZIdx);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20hgt=zList[zIdx]*zWeight+zList[zIdx+1]*(1.-zWeight);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20(hgt-zAttr.x)/(zAttr.y-zAttr.x);\x20//zAttr.x\x20means\x20zList[0]\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20t\x20=\x20dot(rand_constants.xy,\x20co);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20fract(sin(t)\x20*\x20(rand_constants.z\x20+\x20t));\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20getRandPos(vec2\x20seed){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20randPos=vec2(rand(seed+1.6),0.);\x20//y\x20always\x200\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fract(randPos\x20*\x20255.0),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20floor(randPos\x20*\x20255.0)\x20/\x20255.0);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20encodePosition(vec2\x20rawPos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec4(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fract(rawPos\x20*\x20255.0),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20floor(rawPos\x20*\x20255.0)\x20/\x20255.0);\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20updatePos(float\x20z,float\x20speed){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20hgt=zAttr.x+(zAttr.y-zAttr.x)*z;\x20//zoomed\x20hgt\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20newHgt\x20=\x20hgt+speed*dt*spdFactor*zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20(newHgt-zAttr.x)/(zAttr.y-zAttr.x);\x20//hgt\x20pos\x20storage\x20means\x20linear\x20position\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20decodePos(vec4\x20src){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20src.r\x20/\x20255.0\x20+\x20src.b,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20src.g\x20/\x20255.0\x20+\x20src.a);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//previous\x20encoded\x20position\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20posTex=' + K['glNames']['textureFunc'] + '(posTexture,vUV);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20pos=decodePos(posTex);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20zPosTex=' + K['glNames']['textureFunc'] + '(zPosTexture,vUV);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20zPos=decodePos(zPosTex);\x20//only\x20use\x20x\x20for\x20speed,y\x20always\x200\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20seed=(vUV+pos+0.5)*randSeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20randPos=getRandPos(seed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if((posTex.r==0.\x20&&\x20posTex.g==0.\x20&&\x20posTex.b==0.\x20&&\x20posTex.a==0.\x20)||\x20currentZIdx>=0.\x20||\x20zCount==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//first\x20load,use\x20all\x20random\x20pos\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=randPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20texPos=vec3(pos.xy,zPos.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20speed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preWTexture,texPos,xAttr,yAttr,zAttr,undef,interpMethod,wTexture,percent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(wTexture,texPos,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(' + K['qeGLFuncs']['qe_isUndef'] + '(speed.y,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=randPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPos=vec2(updatePos(zPos.x,speed.y),0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(zPos.x>1.\x20||\x20zPos.x<0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color=randPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20sameSeed=(vUV+pos)*randSeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPosTex=encodePosition(zPos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20drop=step(1.0\x20-\x20dropRate,\x20rand(sameSeed));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=mix(zPosTex,randPos,drop);\x20\x20//avoid\x20floating\x20error\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fI = fK(fe, undefined, {})
                , fx = fK(fA, undefined, {})
                , fB = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fI,
                  'fragmentShaderSource': fx,
                  'attributeLocations': fH
              })
                , fM = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , fl = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                , fX = new J['Cartesian3'](this['zValuesWithScale'][0x0],this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1],this['zValuesWithScale']['length'])
                , fE = ft(fp)
                , fO = fv(fp)
                , F0 = this['dataSource']['gridOptions']
                , F1 = (new J['Cartesian4'](F0['xStart'],F0['xEnd'],F0['yStart'],F0['yEnd']),
              new J['Cartesian4'](0x0,0x1,0x0,0x1))
                , F2 = {
                  'xAttr': ()=>fM,
                  'yAttr': ()=>fl,
                  'zAttr': ()=>fX,
                  'wTexture': ()=>this['currentTexture3'] || this['currentGrids3'] && (this['currentTexture3'] = fQ(fp, this['currentGrids3'], this['dataSource']['gridOptions'])) || fE,
                  'preWTexture': ()=>this['options']['interpFromPreSource'] && (this['preTexture3'] || this['preGrids3'] && (this['preTexture3'] = fQ(fp, this['preGrids3'], this['dataSource']['gridOptions']))) || fE,
                  'hasPre': ()=>{
                      var F3;
                      return this['options']['interpFromPreSource'] && (null === (F3 = this['preGrids']) || undefined === F3 ? undefined : F3['length']);
                  }
                  ,
                  'percent': ()=>{
                      var F3;
                      return null !== (F3 = this['dataPercent']) && undefined !== F3 ? F3 : 0x1;
                  }
                  ,
                  'dropRate': ()=>this['_planeOptions']['dropRate'],
                  'posTexture': ()=>this['_positionBackTexture'],
                  'randSeed': ()=>this['_randomSeed'],
                  'spdFactor': ()=>this['_planeOptions']['speedFactor'],
                  'visExtent': ()=>{
                      var F3;
                      return null !== (F3 = this['_visExtent']) && undefined !== F3 ? F3 : F1;
                  }
                  ,
                  'colors': ()=>this['fillColors'] || [],
                  'steps': ()=>this['fillSteps'] || [],
                  'cardinalSplineMat': ()=>this['splineMat'],
                  'interpMethod': ()=>this['_planeOptions']['interpMethod'],
                  'zPosTexture': ()=>{
                      var F3;
                      return null !== (F3 = this['_zPositionBackTexture']) && undefined !== F3 ? F3 : fO;
                  }
                  ,
                  'zList': ()=>{
                      var F3;
                      return null !== (F3 = this['zValuesWithScale']) && undefined !== F3 ? F3 : [0x0];
                  }
                  ,
                  'currentZIdx': ()=>this['_planeOptions']['zIndex'],
                  'zScale': ()=>this['_planeOptions']['zScale'],
                  'dt': ()=>this['_dt']
              };
              (0x0,
              K['setAlgoUniforms'])(this['dataSource']['getU'](), F2),
              this['_zPosCommand'] = new J['ComputeCommand']({
                  'vertexArray': this['_zPositionVao'],
                  'shaderProgram': fB,
                  'uniformMap': F2,
                  'outputTexture': this['_zPositionTexutre'],
                  'persists': true,
                  'owner': this
              });
          }
          ['_createParticleCommand'](fp) {
              var fR;
              let fm = this['_planeOptions']['count'] * this['_planeOptions']['count'];
              this['_planeOptions']['usePoint'] || (fm *= 0x2);
              const fH = new Float32Array(fm);
              for (let Fv = 0x0; Fv < fm; Fv++)
                  fH[Fv] = Fv;
              const fe = {
                  'idx': 0x0
              }
                , fA = new J['Geometry']({
                  'attributes': {
                      'idx': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x1,
                          'values': fH,
                          'normalize': false
                      })
                  }
              });
              this['_particleVao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fA,
                  'attributeLocations': fe,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              }),
              this['_particleTexture0'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  }),
                  'source': {
                      'arrayBufferView': new Uint8Array(fp['drawingBufferWidth'] * fp['drawingBufferHeight'] * 0x4)
                  }
              }),
              this['_particleTexture1'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  }),
                  'source': {
                      'arrayBufferView': new Uint8Array(fp['drawingBufferWidth'] * fp['drawingBufferHeight'] * 0x4)
                  }
              });
              const fI = this['options']['heightData']
                , fx = (0x0,
              J['defined'])(this['options']['heightData']);
              let fB = '';
              fx && (fB = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20hUV=' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(lonLat,hXAttr,hYAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hUV.x>=0.\x20&&\x20hUV.x<=1.\x20&&\x20hUV.y>=0.\x20&&\x20hUV.y<=1.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20h=' + K['qeGLFuncs']['qe_readHeightValByUV'] + '(heightTexture,hUV,hXAttr,hYAttr,undefH,1).y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(h,undefH)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20hgt=hgt+h*zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fM = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler3D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20float\x20idx;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20posTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20preTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['dataSource']['getU'](), false, false) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (fx ? (0x0,
              K['getHeightAlgoConstsAndUniforms'])(fI['getGrid'](), false) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getHeightUniforms'])() + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20hgtOffset;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20zPosTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20preZPosTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20zCount\x20=\x20' + this['zValuesWithScale']['length'] + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20zList[zCount];\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mediump\x20int\x20isPoint;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20cols;\x20//cols\x20equals\x20rows\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20extent;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20lineExceedGap;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20pointSize;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20hXAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20hYAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20vPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20float\x20vHgt;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20getLonLat(vec2\x20pos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20lon=extent.x+(extent.y-extent.x)*pos.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20lat=extent.z+(extent.w-extent.z)*pos.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(lon,lat);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20getUV(float\x20currentIdx){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fract(currentIdx\x20/\x20cols),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20floor(currentIdx\x20/\x20cols)/cols\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20posTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20otherTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20zPosTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20otherZPosTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20used=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isPoint==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uv=getUV(idx);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20posTex=' + K['glNames']['textureFunc'] + '(posTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherTex=posTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPosTex=' + K['glNames']['textureFunc'] + '(zPosTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherZPosTex=zPosTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fract(idx/2.)==0.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20realIdx=idx/2.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uv=getUV(realIdx);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20posTex=' + K['glNames']['textureFunc'] + '(preTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherTex=' + K['glNames']['textureFunc'] + '(posTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPosTex=' + K['glNames']['textureFunc'] + '(preZPosTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherZPosTex=' + K['glNames']['textureFunc'] + '(zPosTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20realIdx=(idx-1.)/2.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uv=vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20fract(realIdx\x20/\x20cols),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20floor(realIdx\x20/\x20cols)/cols);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20posTex=' + K['glNames']['textureFunc'] + '(posTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherTex=' + K['glNames']['textureFunc'] + '(preTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPosTex=' + K['glNames']['textureFunc'] + '(zPosTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherZPosTex=' + K['glNames']['textureFunc'] + '(preZPosTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20pos=vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20posTex.r\x20/\x20255.0\x20+\x20posTex.b,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20posTex.g\x20/\x20255.0\x20+\x20posTex.a);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20zPosLinear=vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPosTex.r\x20/\x20255.0\x20+\x20zPosTex.b,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zPosTex.g\x20/\x20255.0\x20+\x20zPosTex.a);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20hgt=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(zCount==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20hgt=zList[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vPos=vec3(pos.xy,0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20hgt=zAttr.x+(zAttr.y-zAttr.x)*zPosLinear.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20zIdx;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hgt<=zAttr.x){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zIdx=0;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(hgt>=zAttr.y){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zIdx=zCount-1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(int\x20i=1;i<zCount;i++){\x20//hgt<=zList[0]\x20already\x20processed)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hgt<=zList[i]){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zIdx=i;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20break;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vPos=vec3(pos.xy,float(zIdx)/float(zCount-1));\x20//zTexPos\x20may\x20put\x20into\x20zPosTexture.y\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20hgt=hgt+hgtOffset;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20lonLat=getLonLat(pos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isPoint==0){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20otherPos=vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherTex.r\x20/\x20255.0\x20+\x20otherTex.b,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherTex.g\x20/\x20255.0\x20+\x20otherTex.a);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20otherLonLat=getLonLat(otherPos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20space=abs(lonLat-otherLonLat);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20zSpace=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(zCount>1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20otherZPosLinear=vec2(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherZPosTex.r\x20/\x20255.0\x20+\x20otherZPosTex.b,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20otherZPosTex.g\x20/\x20255.0\x20+\x20otherZPosTex.a);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20otherHgt=zAttr.x+(zAttr.y-zAttr.x)*otherZPosLinear.x+hgtOffset;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20zSpace=abs(hgt-otherHgt)/zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(space.x>=lineExceedGap\x20||\x20space.y>=lineExceedGap\x20||\x20zSpace>=500.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20used=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20used=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20used=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_PointSize=pointSize;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fB + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vHgt=hgt;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(used==0){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(-2.,-2.,0.,1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldCoords=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(vec3(lonLat.xy,hgt));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_projection\x20*\x20czm_view\x20*\x20vec4(worldCoords,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20gl_Position.z\x20-=0.001\x20*\x20gl_Position.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fl = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler3D;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount=' + ((null === (fR = this['fillSteps']) || undefined === fR ? undefined : fR['length']) || 0x1) + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20opacityRatio;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20uTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20vTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20wTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20preUTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20preVTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20preWTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasPre;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasMask;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20maskTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20reso;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20retinaReso;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20minUVSpeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20ptTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20usePtTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['dataSource']['getU'](), true, false) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20fadeWithSpeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20interpMethod;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20percent;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mediump\x20int\x20isPoint;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20pointY;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20int\x20colorMode;\x20//0:uv\x20speed,1:z\x20speed\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20zScale;\x0a\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20vPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20float\x20vHgt;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasMask\x20&&\x20!' + K['qeGLFuncs']['qe_maskout'] + '(reso,maskTexture)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20u;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20v;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20u=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preUTexture,vPos,xAttr,yAttr,zAttr,undef,interpMethod,uTexture,percent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preVTexture,vPos,xAttr,yAttr,zAttr,undef,interpMethod,vTexture,percent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20u=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(uTexture,vPos,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(vTexture,vPos,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20speed=sqrt(u.y*u.y+v.y*v.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(speed<=minUVSpeed){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(colorMode==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=' + K['qeGLFuncs']['qe_interpGridVal3DByUV'] + '(preWTexture,vPos,xAttr,yAttr,zAttr,undef,interpMethod,wTexture,percent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(wTexture,vPos,xAttr,yAttr,zAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=w.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20else\x20if(colorMode==2){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=vHgt/zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color=' + K['qeGLFuncs']['qe_interpColor'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isPoint==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(pointY<1.\x20&&\x20pointY>0.\x20&&\x20gl_PointCoord.y>pointY){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(usePtTexture==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20dir=radians(mod(270.\x20-\x20(atan(v.y,\x20u.y)\x20*\x20180.0)\x20/\x203.1415926,360.));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20c\x20=\x20cos(dir);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20s\x20=\x20sin(dir);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//考虑heading\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20rotatedUV\x20=\x20vec2(c\x20*\x20(gl_PointCoord.x\x20-\x200.5)\x20+\x20s\x20*\x20(gl_PointCoord.y\x20-\x200.5)\x20+\x200.5,c\x20*\x20(gl_PointCoord.y\x20-\x200.5)\x20-\x20s\x20*\x20(gl_PointCoord.x\x20-\x200.5)\x20+\x200.5);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20ptTex\x20=\x20' + K['glNames']['textureFunc'] + '(\x20ptTexture,\x20\x20rotatedUV\x20);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(ptTex.a<0.1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//vec4\x20ptTex=' + K['glNames']['textureFunc'] + '(ptTexture,gl_PointCoord);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color=color*ptTex;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fadeWithSpeed==1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20opacity=max(0.2,min(speed*opacityRatio,1.));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.a=opacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fX = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , fE = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                , fO = new J['Cartesian3'](this['zValuesWithScale'][0x0],this['zValuesWithScale'][this['zValuesWithScale']['length'] - 0x1],this['zValuesWithScale']['length'])
                , F0 = ft(fp)
                , F1 = fv(fp)
                , F2 = this['dataSource']['gridOptions']
                , F3 = new J['Cartesian4'](F2['xStart'],F2['xEnd'],F2['yStart'],F2['yEnd']);
              let F4 = 0x0;
              this['currentGrids3'] && 'w' === this['_planeOptions']['colorWith'] ? F4 = 0x1 : 'hgt' === this['_planeOptions']['colorWith'] && (F4 = 0x2);
              let F5 = new J['Cartesian4']()
                , F6 = new J['Cartesian4']();
              if (this['options']['heightData']) {
                  this['heightTexture'] || (this['heightTexture'] = fw(fp, this['options']['heightData']['getGrid'](), J['TextureMinificationFilter']['NEAREST']));
                  const Ft = this['options']['heightData'];
                  F5 = new J['Cartesian4'](Ft['gridOptions']['xStart'],Ft['gridOptions']['xEnd'],Ft['gridOptions']['xDelta'],Ft['gridOptions']['xSize']),
                  F6 = new J['Cartesian4'](Ft['gridOptions']['yStart'],Ft['gridOptions']['yEnd'],Ft['gridOptions']['yDelta'],Ft['gridOptions']['ySize']);
              }
              const F7 = new J['Cartesian2'](fp['drawingBufferWidth'],fp['drawingBufferHeight'])
                , F8 = {
                  'xAttr': ()=>fX,
                  'yAttr': ()=>fE,
                  'zAttr': ()=>fO,
                  'uTexture': ()=>this['currentTexture'] || (this['currentTexture'] = fQ(fp, this['currentGrids'], this['dataSource']['gridOptions'])),
                  'vTexture': ()=>this['currentTexture2'] || (this['currentTexture2'] = fQ(fp, this['currentGrids2'], this['dataSource']['gridOptions'])),
                  'preUTexture': ()=>this['options']['interpFromPreSource'] && (this['preTexture'] || this['preGrids'] && (this['preTexture'] = fQ(fp, this['preGrids'], this['dataSource']['gridOptions']))) || F0,
                  'preVTexture': ()=>this['options']['interpFromPreSource'] && (this['preTexture2'] || this['preGrids2'] && (this['preTexture2'] = fQ(fp, this['preGrids2'], this['dataSource']['gridOptions']))) || F0,
                  'wTexture': ()=>this['currentTexture3'] || this['currentGrids3'] && (this['currentTexture3'] = fQ(fp, this['currentGrids3'], this['dataSource']['gridOptions'])) || F0,
                  'preWTexture': ()=>this['options']['interpFromPreSource'] && (this['preTexture3'] || this['preGrids3'] && (this['preTexture3'] = fQ(fp, this['preGrids3'], this['dataSource']['gridOptions']))) || F0,
                  'hasPre': ()=>{
                      var FK;
                      return this['options']['interpFromPreSource'] && (null === (FK = this['preGrids']) || undefined === FK ? undefined : FK['length']);
                  }
                  ,
                  'percent': ()=>{
                      var FK;
                      return null !== (FK = this['dataPercent']) && undefined !== FK ? FK : 0x1;
                  }
                  ,
                  'extent': ()=>F3,
                  'colors': ()=>this['fillColors'] || [],
                  'steps': ()=>this['fillSteps'] || [],
                  'posTexture': ()=>this['_positionTexture'],
                  'preTexture': ()=>this['_positionBackTexture'],
                  'heightTexture': ()=>{
                      var FK;
                      return null !== (FK = this['heightTexture']) && undefined !== FK ? FK : F1;
                  }
                  ,
                  'hXAttr': ()=>F5,
                  'hYAttr': ()=>F6,
                  'hgtOffset': ()=>this['_planeOptions']['hgtOffset'],
                  'zPosTexture': ()=>{
                      var FK;
                      return null !== (FK = this['_zPositionTexutre']) && undefined !== FK ? FK : F1;
                  }
                  ,
                  'preZPosTexture': ()=>{
                      var FK;
                      return null !== (FK = this['_zPositionBackTexture']) && undefined !== FK ? FK : F1;
                  }
                  ,
                  'zList': ()=>{
                      var FK;
                      return (null === (FK = this['zValuesWithScale']) || undefined === FK ? undefined : FK['length']) ? this['zValuesWithScale'] : [0x0];
                  }
                  ,
                  'isPoint': ()=>this['_planeOptions']['usePoint'],
                  'cols': ()=>this['_planeOptions']['count'],
                  'lineExceedGap': ()=>this['_planeOptions']['lineMaxDistance'],
                  'pointSize': ()=>this['_planeOptions']['pointSize'],
                  'opacityRatio': ()=>0x1 / this['_planeOptions']['fadeSpeedMax'],
                  'minUVSpeed': ()=>{
                      var FK;
                      return null !== (FK = this['_planeOptions']['minSpeed']) && undefined !== FK ? FK : 0x0;
                  }
                  ,
                  'ptTexture': ()=>{
                      var FK;
                      return null !== (FK = this['_ptTexture']) && undefined !== FK ? FK : F1;
                  }
                  ,
                  'usePtTexture': ()=>this['_ptTexture'] ? 0x1 : 0x0,
                  'fadeWithSpeed': ()=>this['_planeOptions']['fadeWithSpeed'] ? 0x1 : 0x0,
                  'cardinalSplineMat': ()=>this['splineMat'],
                  'interpMethod': ()=>this['_planeOptions']['interpMethod'],
                  'pointY': ()=>this['_planeOptions']['pointDropPosY'],
                  'colorMode': ()=>F4,
                  'zScale': ()=>this['_planeOptions']['zScale'],
                  'reso': ()=>F7,
                  'hasMask': ()=>!!this['maskTexture'],
                  'maskTexture': ()=>this['maskTexture'] || F0,
                  'currentHeight': ()=>0x0,
                  'preHeight': ()=>0x0
              };
              (0x0,
              K['setAlgoUniforms'])(this['dataSource']['getU'](), F8),
              fx && (0x0,
              K['setHeightAlgoUniforms'])(fI['getGrid'](), F8);
              const F9 = fK(fM, undefined, {})
                , Ff = fK(fl, undefined, {})
                , FF = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': F9,
                  'fragmentShaderSource': Ff,
                  'attributeLocations': fe
              });
              this['_particleDepthTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['DEPTH_COMPONENT'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_INT']
              }),
              this['_particleFrameBuffer'] = new J['Framebuffer']({
                  'context': fp,
                  'colorTextures': [this['_particleTexture0']],
                  'depthTexture': this['_particleDepthTexture'],
                  'destroyAttachments': false
              });
              let Fd = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              Fd = Object['assign'](Object['assign']({}, Fd), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  }
              });
              const Fb = J['RenderState']['fromCache'](Fd);
              this['_particleCommand'] = new J['DrawCommand']({
                  'vertexArray': this['_particleVao'],
                  'primitiveType': this['_planeOptions']['usePoint'] ? J['PrimitiveType']['POINTS'] : J['PrimitiveType']['LINES'],
                  'renderState': Fb,
                  'shaderProgram': FF,
                  'uniformMap': F8,
                  'owner': this,
                  'pass': J['Pass']['OPAQUE'],
                  'framebuffer': this['_particleFrameBuffer'],
                  'modelMatrix': this['modelMatrix']
              });
              const Fw = J['RenderState']['fromCache']({
                  'viewport': new J['BoundingRectangle'](0x0,0x0,fp['drawingBufferWidth'],fp['drawingBufferHeight'])
              })
                , FQ = new J['ClearCommand']({
                  'color': new J['Color'](0x0,0x0,0x0,0x0),
                  'depth': 0x1,
                  'stencil': 0x0,
                  'pass': J['Pass']['OPAQUE']
              });
              this['_clearFrameBufferCommand'] = FQ,
              this['_clearFrameBufferCommand']['framebuffer'] = this['_particleFrameBuffer'],
              this['_clearFrameBufferCommand']['renderState'] = Fw;
          }
          ['_createFadeCommand'](fp) {
              const fR = new Float32Array([-0x1, 0x1, 0x0, -0x1, -0x1, 0x0, 0x1, -0x1, 0x0, -0x1, 0x1, 0x0, 0x1, -0x1, 0x0, 0x1, 0x1, 0x0])
                , fm = new J['Geometry']({
                  'attributes': {
                      'pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fR,
                          'normalize': false
                      })
                  }
              })
                , fH = {
                  'pos': 0x0
              };
              this['_fadeVao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fm,
                  'attributeLocations': fH,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              const fe = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUV;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUV=(pos.xy+1.)/2.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(pos,0.,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fA = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20int;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20screenTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20opacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20minOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUV;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color=' + K['glNames']['textureFunc'] + '(screenTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.a=color.a*opacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(color.a<minOpacity){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.a=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fI = {
                  'screenTexture': ()=>this['_particleTexture1'],
                  'opacity': ()=>this['_planeOptions']['fadeRate'],
                  'minOpacity': ()=>this['_planeOptions']['minOpacity']
              };
              let fx = J['Appearance']['getDefaultRenderState'](false, false, undefined)
                , fB = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fB = Object['assign'](Object['assign']({}, fx), {
                  'depthTest': {
                      'enabled': false
                  },
                  'depthMask': {
                      'enabled': false
                  }
              });
              const fM = J['RenderState']['fromCache'](fB)
                , fl = fK(fe, undefined, {})
                , fX = fK(fA, undefined, {})
                , fE = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fl,
                  'fragmentShaderSource': fX,
                  'attributeLocations': fH
              });
              this['_particleFadeCommand'] = new J['DrawCommand']({
                  'vertexArray': this['_fadeVao'],
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fM,
                  'shaderProgram': fE,
                  'uniformMap': fI,
                  'owner': this,
                  'pass': J['Pass']['OPAQUE'],
                  'framebuffer': this['_particleFrameBuffer'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['_createDepthCommand'](fp) {
              const fR = performance['now']()
                , fm = {
                  'position': 0x0
              }
                , fH = this['currentGrids'][0x0]
                , fe = this['dataSource']['gridOptions'];
              if (!this['_depthVao']) {
                  const F8 = new Float32Array(fH['xSize'] * fH['ySize']);
                  for (let Fw = 0x0; Fw < F8['length']; Fw++)
                      F8[Fw] = Fw;
                  const F9 = {
                      'xStart': fe['xStart'],
                      'yStart': fe['yStart'],
                      'xDelta': fe['xDelta'],
                      'yDelta': fe['yDelta'],
                      'xSize': fe['xSize'],
                      'ySize': fe['ySize']
                  };
                  (0x0,
                  K['ensureGridDataOptions'])(F9);
                  let Ff = 0x0;
                  const FF = (F9['xSize'] - 0x1) * (F9['ySize'] - 0x1) * 0x6
                    , Fd = new Uint32Array(FF);
                  for (let FQ = 0x0; FQ < F9['xSize'] * F9['ySize'] - F9['xSize']; FQ++) {
                      if ((FQ + 0x1) % F9['xSize'] == 0x0)
                          continue;
                      const Fv = FQ
                        , Ft = FQ + F9['xSize']
                        , FK = Ft + 0x1
                        , FJ = Fv + 0x1;
                      Fd[Ff++] = Fv,
                      Fd[Ff++] = Ft,
                      Fd[Ff++] = FK,
                      Fd[Ff++] = Fv,
                      Fd[Ff++] = FK,
                      Fd[Ff++] = FJ;
                  }
                  const Fb = new J['Geometry']({
                      'attributes': {
                          'ids': new J['GeometryAttribute']({
                              'componentDatatype': J['ComponentDatatype']['FLOAT'],
                              'componentsPerAttribute': 0x1,
                              'values': F8,
                              'normalize': false
                          })
                      },
                      'indices': new Uint32Array(Fd)
                  });
                  this['_depthVao'] = J['VertexArray']['fromGeometry']({
                      'context': fp,
                      'geometry': Fb,
                      'attributeLocations': fm,
                      'bufferUsage': J['BufferUsage']['STATIC_DRAW']
                  });
              }
              this['options']['debugShowPerformance'] && K['logger']['debug']('generate\x20grid\x20indicies\x20costs\x20' + (performance['now']() - fR) + 'ms');
              let fA = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fA = Object['assign'](Object['assign']({}, fA), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  },
                  'cull': {
                      'enabled': true,
                      'face': this['dataSource']['gridOptions']['yDelta'] > 0x0 ? J['CullFace']['FRONT'] : J['CullFace']['BACK']
                  }
              });
              const fI = J['RenderState']['fromCache'](fA)
                , fx = (0x0,
              J['defined'])(this['options']['heightData']);
              let fB = '';
              fx && (fB = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20hUV=' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(position,hXAttr,hYAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hUV.x>=0.\x20&&\x20hUV.x<=1.\x20&&\x20hUV.y>=0.\x20&&\x20hUV.y<=1.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20h=' + K['qeGLFuncs']['qe_readHeightValByUV'] + '(heightTexture,hUV,hXAttr,hYAttr,undefH,1).y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!' + K['qeGLFuncs']['qe_isUndef'] + '(h,undefH)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=height+h*zScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
              const fM = this['options']['heightData']
                , fl = fK('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20float\x20ids;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20hXAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20hYAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20globalHeight;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20percent;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getHeightUniforms'])() + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fx ? (0x0,
              K['getHeightAlgoConstsAndUniforms'])(fM['getGrid'](), false) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20position=' + K['qeGLFuncs']['qe_idx2LonLat'] + '(ids,xAttr,yAttr);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=' + K['qeGLFuncs']['qe_idx2LonLatTexPos'] + '(ids,xAttr.w,yAttr.w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20height=globalHeight;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(noHeight){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + fB + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height=height+' + K['qeGLFuncs']['qe_getHeightByPreAndCurrent'] + '(uv,false,' + (this['options']['interpFromPreSource'] ? 'percent' : '0.') + ');\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldCoords=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(vec3(position.xy,height));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_projection\x20*\x20czm_view\x20*\x20vec4(worldCoords,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20', undefined, {})
                , fX = fK('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=vec4(1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20', undefined, {})
                , fE = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                , fO = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize']);
              let F0 = new J['Cartesian4']()
                , F1 = new J['Cartesian4']();
              if (this['options']['heightData']) {
                  this['heightTexture'] || (this['heightTexture'] = fw(fp, this['options']['heightData']['getGrid'](), J['TextureMinificationFilter']['NEAREST']));
                  const FC = this['options']['heightData'];
                  F0 = new J['Cartesian4'](FC['gridOptions']['xStart'],FC['gridOptions']['xEnd'],FC['gridOptions']['xDelta'],FC['gridOptions']['xSize']),
                  F1 = new J['Cartesian4'](FC['gridOptions']['yStart'],FC['gridOptions']['yEnd'],FC['gridOptions']['yDelta'],FC['gridOptions']['ySize']);
              }
              const F2 = fv(fp)
                , F3 = new J['Cartesian2'](fp['drawingBufferWidth'],fp['drawingBufferHeight'])
                , F4 = {
                  'xAttr': ()=>fE,
                  'yAttr': ()=>fO,
                  'currentHeight': ()=>0x0,
                  'preHeight': ()=>0x0,
                  'heightTexture': ()=>this['heightTexture'] || F2,
                  'hXAttr': ()=>F0,
                  'hYAttr': ()=>F1,
                  'zScale': ()=>this['_planeOptions']['zScale'],
                  'noHeight': ()=>false,
                  'reso': ()=>F3,
                  'globalHeight': ()=>0x0,
                  'percent': ()=>{
                      var Fj;
                      return null !== (Fj = this['dataPercent']) && undefined !== Fj ? Fj : 0x1;
                  }
              };
              (0x0,
              K['setAlgoUniforms'])(this['currentGrids'][0x0], F4),
              fx && (0x0,
              K['setHeightAlgoUniforms'])(fM['getGrid'](), F4);
              const F5 = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fl,
                  'fragmentShaderSource': fX,
                  'attributeLocations': fm
              });
              this['_depthHolderTexture'] = new J['Texture']({
                  'context': fp,
                  'width': fp['drawingBufferWidth'],
                  'height': fp['drawingBufferHeight'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['NEAREST'],
                      'magnificationFilter': J['TextureMagnificationFilter']['NEAREST']
                  }),
                  'source': {
                      'arrayBufferView': new Uint8Array(fp['drawingBufferWidth'] * fp['drawingBufferHeight'] * 0x4)
                  }
              }),
              this['_depthFrameBuffer'] = new J['Framebuffer']({
                  'context': fp,
                  'colorTextures': [this['_depthHolderTexture']],
                  'depthTexture': this['_particleDepthTexture'],
                  'destroyAttachments': false
              });
              const F6 = J['RenderState']['fromCache']({
                  'viewport': new J['BoundingRectangle'](0x0,0x0,fp['drawingBufferWidth'],fp['drawingBufferHeight'])
              })
                , F7 = new J['ClearCommand']({
                  'color': new J['Color'](0x0,0x0,0x0,0x0),
                  'depth': 0x1,
                  'stencil': 0x0,
                  'pass': J['Pass']['OPAQUE']
              });
              this['_clearDepthBufferCommand'] = F7,
              this['_clearDepthBufferCommand']['framebuffer'] = this['_depthFrameBuffer'],
              this['_clearDepthBufferCommand']['renderState'] = F6,
              this['_depthCommand'] = new J['DrawCommand']({
                  'vertexArray': this['_depthVao'],
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fI,
                  'shaderProgram': F5,
                  'uniformMap': F4,
                  'owner': this,
                  'framebuffer': this['_depthFrameBuffer'],
                  'pass': J['Pass']['OPAQUE'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['_createScreenCommand'](fp) {
              const fR = new Float32Array([-0x1, 0x1, 0x0, -0x1, -0x1, 0x0, 0x1, -0x1, 0x0, -0x1, 0x1, 0x0, 0x1, -0x1, 0x0, 0x1, 0x1, 0x0])
                , fm = new J['Geometry']({
                  'attributes': {
                      'pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fR,
                          'normalize': false
                      })
                  }
              })
                , fH = {
                  'pos': 0x0
              };
              this['_screenVao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fm,
                  'attributeLocations': fH,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              const fe = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec2\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec2\x20vUV;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vUV=(pos.xy+1.)/2.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=vec4(pos,0.,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fA = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20int;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20screenTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20depthTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20depthTest;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20opacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20minOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec2\x20vUV;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20uv=vUV;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20color=' + K['glNames']['textureFunc'] + '(screenTexture,uv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.a=color.a*opacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(depthTest){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20globeDepth\x20=\x20czm_unpackDepth(' + K['glNames']['textureFunc'] + '(czm_globeDepthTexture,\x20uv));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20cDepth=' + K['glNames']['textureFunc'] + '(depthTexture,uv).x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_FragDepth=cDepth;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(cDepth-globeDepth>=0.005){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(color.a<minOpacity){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20color.a=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , fI = {
                  'screenTexture': ()=>this['_particleTexture0'],
                  'opacity': ()=>0x1,
                  'minOpacity': ()=>this['_planeOptions']['minOpacity'],
                  'depthTest': ()=>true,
                  'depthTexture': ()=>this['_particleDepthTexture']
              };
              let fx = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fx = Object['assign'](Object['assign']({}, fx), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  }
              });
              const fB = J['RenderState']['fromCache'](fx)
                , fM = fK(fe, undefined, {})
                , fl = fK(fA, undefined, {})
                , fX = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fM,
                  'fragmentShaderSource': fl,
                  'attributeLocations': fH
              });
              this['_screenCommand'] = new J['DrawCommand']({
                  'vertexArray': this['_screenVao'],
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': fB,
                  'shaderProgram': fX,
                  'uniformMap': fI,
                  'owner': this,
                  'pass': J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix']
              });
          }
          ['_createCommand'](fp) {
              this['_timestamp'] = performance['now'](),
              this['_createPositionCommand'](fp),
              this['dataSource']['wProvider'] && this['currentGrids3'] && this['_createZPositionCommand'](fp),
              this['_createParticleCommand'](fp),
              this['_createFadeCommand'](fp),
              this['_createDepthCommand'](fp),
              this['_createScreenCommand'](fp);
          }
          ['_handleCameraMoving'](fp) {
              if (this['_movingHandler'])
                  return void K['logger']['debug']('moving\x20handler\x20already\x20exists!');
              const fR = fp['camera']['moveStart']['addEventListener'](()=>{
                  this['_moving'] = true;
              }
              )
                , fm = fp['camera']['moveEnd']['addEventListener'](()=>{
                  this['_moving'] = false;
              }
              );
              this['_movingHandler'] = {
                  'remove': ()=>{
                      fR(),
                      fm(),
                      this['_moving'] = false,
                      this['_movingHandler'] = undefined;
                  }
              };
          }
          ['update'](fp) {
              if (this['drawOptions']['showPixel'] && (this['_pixelLayer']['sizeChanged'] = this['sizeChanged'],
              this['_pixelLayer']['update'](fp)),
              super['update'](fp),
              !this['_visible'] || !this['currentGrids'] || this['_moving'] && this['options']['hideWhenMoving'])
                  return;
              (0x0,
              J['defined'])(this['_movingHandler'] && this['options']['disableFadeWhenMoving']) || this['_handleCameraMoving'](fp['camera']['_scene']['view']);
              const fR = fp['context'];
              if (this['_posCommand']) {
                  let fm = this['_positionBackTexture'];
                  this['_positionBackTexture'] = this['_positionTexture'],
                  this['_positionTexture'] = fm,
                  this['_posCommand']['outputTexture'] = this['_positionTexture'],
                  this['_zPosCommand'] && (fm = this['_zPositionBackTexture'],
                  this['_zPositionBackTexture'] = this['_zPositionTexutre'],
                  this['_zPositionTexutre'] = fm,
                  this['_zPosCommand']['outputTexture'] = this['_zPositionTexutre']),
                  fm = this['_particleTexture0'],
                  this['_particleTexture0'] = this['_particleTexture1'],
                  this['_particleTexture1'] = fm,
                  function(fH, fe) {
                      const fA = fH['_gl'];
                      fH['_bind'](),
                      fA['framebufferTexture2D'](fA['FRAMEBUFFER'], fA['COLOR_ATTACHMENT0'], fe['_target'], fe['_texture'], 0x0),
                      fH['_colorTextures'][0x0] = fe,
                      fH['_unBind']();
                  }(this['_particleFrameBuffer'], this['_particleTexture0']);
              } else
                  this['_createCommand'](fR);
              this['_posCommand'] ? (this['_ptTexture'] && this['ptTextureDirty'] && (this['_ptTexture']['destroy'](),
              this['_ptTexture'] = undefined),
              this['ptTextureDirty'] = false,
              this['_planeOptions']['texture'] && !this['_ptTexture'] && (this['_ptTexture'] = new J['Texture']({
                  'context': fR,
                  'width': this['drawOptions']['texture']['width'],
                  'height': this['drawOptions']['texture']['height'],
                  'pixelFormat': J['PixelFormat']['RGBA'],
                  'pixelDatatype': J['PixelDatatype']['UNSIGNED_BYTE'],
                  'flipY': false,
                  'sampler': new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['LINEAR'],
                      'magnificationFilter': J['TextureMagnificationFilter']['LINEAR']
                  }),
                  'source': this['drawOptions']['texture']
              })),
              this['_randomSeed'] = Math['random'](),
              this['_dt'] = (performance['now']() - this['_timestamp']) / 0x3e8,
              this['_timestamp'] = performance['now'](),
              fp['commandList']['push'](this['_posCommand']),
              this['_zPosCommand'] && fp['commandList']['push'](this['_zPosCommand']),
              fp['commandList']['push'](this['_clearFrameBufferCommand']),
              !this['_moving'] && fp['commandList']['push'](this['_particleFadeCommand']),
              fp['commandList']['push'](this['_clearDepthBufferCommand']),
              fp['commandList']['push'](this['_depthCommand']),
              fp['commandList']['push'](this['_particleCommand']),
              fp['commandList']['push'](this['_screenCommand'])) : K['logger']['warn']('创建风场失败！');
          }
          ['destroy']() {
              this['resetCommand'](),
              (0x0,
              J['destroyObject'])(this),
              this['_pixelLayer']['destroy']();
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['Wind3DLayerStyle'](fp);
          }
      }
      CWindLayer['DefaultOptions'] = {
          'disableFadeWhenMoving': true,
          'hideWhenMoving': false
      };
      class CWindArrowLayer extends fJ {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp || {}, CWindArrowLayer['DefaultOptions'])),
              this['_dirty'] = false,
              this['_loadingVector'] = false,
              this['options']['interpFromPreSource'] = false,
              this['options']['trackDataSource'] = false;
          }
          ['_loadVectorInfo']() {
              return fp = this,
              fR = undefined,
              fH = function*() {
                  return new Promise((fe,fA)=>{
                      this['_geometryWorker'] = this['_geometryWorker'] || new Worker(K['consts']['workerPath'] + '/geometry.arrow.js',{
                          'type': 'classic'
                      }),
                      this['_geometryWorker']['onmessage'] = fx=>{
                          const fB = fx['data'];
                          this['options']['preserveGeometryWorker'] || (this['_geometryWorker']['terminate'](),
                          this['_geometryWorker'] = undefined),
                          fe(fB);
                      }
                      ,
                      this['_geometryWorker']['onerror'] = fx=>{
                          K['logger']['error']('get\x20arrow\x20geometry\x20failed!'),
                          fe(undefined);
                      }
                      ;
                      const fI = {
                          'headRadius': this['drawOptions']['headRadius'],
                          'headLength': this['drawOptions']['headLength'],
                          'headSegments': this['drawOptions']['headSegments'],
                          'bodyTopRadius': this['drawOptions']['bodyTopRadius'],
                          'bodyBottomRadius': this['drawOptions']['bodyBottomRadius'],
                          'bodyLength': this['drawOptions']['bodyLength'],
                          'bodySegments': this['drawOptions']['bodySegments'],
                          'flipArrow': this['drawOptions']['flipArrow']
                      };
                      this['_geometryWorker']['postMessage'](fI);
                  }
                  );
              }
              ,
              new ((fm = undefined) || (fm = Promise))(function(fe, fA) {
                  function fI(fM) {
                      try {
                          fB(fH['next'](fM));
                      } catch (fl) {
                          fA(fl);
                      }
                  }
                  function fx(fM) {
                      try {
                          fB(fH['throw'](fM));
                      } catch (fl) {
                          fA(fl);
                      }
                  }
                  function fB(fM) {
                      var fl;
                      fM['done'] ? fe(fM['value']) : (fl = fM['value'],
                      fl instanceof fm ? fl : new fm(function(fX) {
                          fX(fl);
                      }
                      ))['then'](fI, fx);
                  }
                  fB((fH = fH['apply'](fp, fR || []))['next']());
              }
              );
              var fp, fR, fm, fH;
          }
          get['vectorInfo']() {
              if (this['_vectorInfo'])
                  return this['_vectorInfo'];
              this['_loadingVector'] ? K['logger']['debug']('geometry\x20worker\x20busy!') : (this['_loadingVector'] = true,
              this['_loadVectorInfo']()['then'](fp=>{
                  this['_vectorInfo'] = fp,
                  this['_loadingVector'] = false;
              }
              ));
          }
          ['setDataSource'](fp, fR=false) {
              (this['dataSource'] !== fp || fR) && (this['dataSource'] = fp,
              fp && (this['_dirty'] = true));
          }
          ['setDrawOptions'](fp, fR=true) {
              super['setDrawOptions'](fp, fR);
              const fm = this['drawOptions']['opaque']
                , fH = this['drawOptions']['maxCount'];
              if (this['drawOptions']['fillColor']) {
                  const fI = this['parseColorStopRules'](this['drawOptions']['fillColor']);
                  this['fillColors'] = fI['colors'],
                  this['fillSteps'] = fI['steps'];
              } else
                  this['_csTexture'] && (this['_csTexture'] && this['_csTexture']['destroy'](),
                  this['_csTexture'] = undefined);
              const fe = this['drawOptions']['emission']['glNumberArray']();
              this['_emission'] = new J['Cartesian3'](fe[0x0],fe[0x1],fe[0x2]);
              const fA = this['drawOptions']['diffuse']['glNumberArray']();
              return this['_diffuse'] = new J['Cartesian3'](fA[0x0],fA[0x1],fA[0x2]),
              (this['drawOptions']['opaque'] !== fm || this['drawOptions']['maxCount'] !== fH || this['drawOptions']['shapeNeedsUpdate']) && this['_command'] && (this['_dirty'] = true),
              this;
          }
          ['resetCommand'](fp=false) {
              var fR, fm, fH, fe, fA, fI;
              this['_command'] && (null === (fm = null === (fR = this['_command']) || undefined === fR ? undefined : fR['shaderProgram']) || undefined === fm || fm['destroy'](),
              this['_command'] = undefined,
              fp && (null === (fH = this['_vao']) || undefined === fH || fH['destroy'](),
              this['_vao'] = undefined,
              null === (fe = this['_vTexture']) || undefined === fe || fe['destroy'](),
              null === (fA = this['_uTexture']) || undefined === fA || fA['destroy'](),
              null === (fI = this['_wTexture']) || undefined === fI || fI['destroy'](),
              this['_vTexture'] = this['_uTexture'] = this['_wTexture'] = this['_uGrids'] = this['_vGrids'] = this['_wGrids'] = undefined));
          }
          ['_createCommand'](fp) {
              let fR, fm, fH, fe = true, fA = false;
              const fI = this['drawOptions']['headLength'] + this['drawOptions']['bodyLength'] + 0x64
                , fx = performance['now']();
              if (this['dataSource']['getFeatures']) {
                  this['drawOptions']['speed'] && this['drawOptions']['angle'] || K['logger']['warn']('没有配置speed和angle字段，将默认都为0！');
                  const Fd = []
                    , Fb = []
                    , Fw = [];
                  fF(this['dataSource']['getFeatures'](), FQ=>{
                      if ('Point' !== FQ['geometry']['type'])
                          return;
                      const Fv = this['drawOptions']['speed'] ? this['drawOptions']['speed'](FQ) : 0x0
                        , Ft = this['drawOptions']['angle'] ? this['drawOptions']['angle'](FQ) : 0x0;
                      let FK = this['drawOptions']['height'] && this['drawOptions']['height'](FQ);
                      FK = (0x0,
                      J['defined'])(FK) ? FK : FQ['geometry']['coordinates']['length'] > 0x2 ? FQ['geometry']['coordinates'][0x2] : fI,
                      FK *= this['drawOptions']['zScale'],
                      Fd['push'](FQ['geometry']['coordinates'][0x0], FQ['geometry']['coordinates'][0x1], FK),
                      Fb['push'](Fv, Ft);
                      const FJ = J['Cartesian3']['fromDegrees'](FQ['geometry']['coordinates'][0x0], FQ['geometry']['coordinates'][0x1], FK)
                        , FC = J['Transforms']['eastNorthUpToFixedFrame'](FJ);
                      Fw['push'](FC[0x0]),
                      Fw['push'](FC[0x4]),
                      Fw['push'](FC[0x8]),
                      Fw['push'](FC[0xc]),
                      Fw['push'](FC[0x1]),
                      Fw['push'](FC[0x5]),
                      Fw['push'](FC[0x9]),
                      Fw['push'](FC[0xd]),
                      Fw['push'](FC[0x2]),
                      Fw['push'](FC[0x6]),
                      Fw['push'](FC[0xa]),
                      Fw['push'](FC[0xe]),
                      Fw['push'](FC[0x3]),
                      Fw['push'](FC[0x7]),
                      Fw['push'](FC[0xb]),
                      Fw['push'](FC[0xf]);
                  }
                  ),
                  fR = new Float32Array(Fd),
                  fm = new Float32Array(Fb),
                  fH = new Float32Array(Fw),
                  fe = false,
                  fA = true;
              } else {
                  const FQ = this['dataSource'];
                  if (!FQ['allU'])
                      throw new Error('当前数据源不是风场数据！');
                  let Fv, Ft, FK;
                  this['drawOptions']['gridPreferSD'] ? (Fv = FQ['allS']()[FQ['getIntTIdx']()],
                  Ft = FQ['allD']()[FQ['getIntTIdx']()],
                  fe = false) : (Fv = FQ['allU']()[FQ['getIntTIdx']()],
                  Ft = FQ['allV']()[FQ['getIntTIdx']()]),
                  FQ['wProvider'] && (FK = FQ['allW']()[FQ['getIntTIdx']()]),
                  fR = new Float32Array(0x3 * this['drawOptions']['maxCount']);
                  const FJ = this['options']['pointGenerator'] ? this['options']['pointGenerator'] : Fc=>(0x0,
                  K['randomPointInGrid'])(FQ['gridOptions'], true);
                  let FC = 0x0
                    , Fj = this['drawOptions']['height'] && this['drawOptions']['height'](undefined);
                  fH = new Float32Array(0x10 * this['drawOptions']['maxCount']);
                  for (let Fc = 0x0; Fc < this['drawOptions']['maxCount']; Fc++) {
                      const Fn = FJ(Fc);
                      fR[FC++] = Fn[0x0],
                      fR[FC++] = Fn[0x1];
                      const FP = ((0x0,
                      J['defined'])(Fj) ? Fj : Fn['length'] > 0x2 ? Fn[0x2] : fI) * this['drawOptions']['zScale'];
                      fR[FC++] = FP;
                      const FN = J['Cartesian3']['fromDegrees'](Fn[0x0], Fn[0x1], FP)
                        , FL = J['Transforms']['eastNorthUpToFixedFrame'](FN)
                        , Fr = 0x10 * Fc;
                      fH[Fr] = FL[0x0],
                      fH[Fr + 0x1] = FL[0x4],
                      fH[Fr + 0x2] = FL[0x8],
                      fH[Fr + 0x3] = FL[0xc],
                      fH[Fr + 0x4] = FL[0x1],
                      fH[Fr + 0x5] = FL[0x5],
                      fH[Fr + 0x6] = FL[0x9],
                      fH[Fr + 0x7] = FL[0xd],
                      fH[Fr + 0x8] = FL[0x2],
                      fH[Fr + 0x9] = FL[0x6],
                      fH[Fr + 0xa] = FL[0xa],
                      fH[Fr + 0xb] = FL[0xe],
                      fH[Fr + 0xc] = FL[0x3],
                      fH[Fr + 0xd] = FL[0x7],
                      fH[Fr + 0xe] = FL[0xb],
                      fH[Fr + 0xf] = FL[0xf];
                  }
                  this['_uGrids'] = Fv,
                  this['_vGrids'] = Ft,
                  this['_wGrids'] = FK;
              }
              const fB = {}
                , fM = J['Buffer']['createVertexBuffer']({
                  'context': fp,
                  'usage': J['BufferUsage']['STATIC_DRAW'],
                  'typedArray': new Float32Array(this['_vectorInfo']['vertices'])
              });
              fB['pos'] = 0x0;
              const fl = J['Buffer']['createVertexBuffer']({
                  'context': fp,
                  'usage': J['BufferUsage']['STATIC_DRAW'],
                  'typedArray': new Float32Array(this['_vectorInfo']['normals'])
              });
              fB['normal'] = 0x1;
              const fX = J['Buffer']['createVertexBuffer']({
                  'context': fp,
                  'usage': J['BufferUsage']['STATIC_DRAW'],
                  'typedArray': fR
              });
              fB['lonlat'] = 0x2;
              const fE = J['Buffer']['createVertexBuffer']({
                  'context': fp,
                  'usage': J['BufferUsage']['STATIC_DRAW'],
                  'typedArray': fH
              });
              fB['transrow_a'] = 0x3,
              fB['transrow_b'] = 0x4,
              fB['transrow_c'] = 0x5,
              fB['transrow_d'] = 0x6;
              const fO = J['ComponentDatatype']['getSizeInBytes'](J['ComponentDatatype']['FLOAT'])
                , F0 = [{
                  'index': fB['pos'],
                  'vertexBuffer': fM,
                  'componentsPerAttribute': 0x3,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'normalize': false
              }, {
                  'index': fB['normal'],
                  'vertexBuffer': fl,
                  'componentsPerAttribute': 0x3,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'normalize': false
              }, {
                  'index': fB['lonlat'],
                  'vertexBuffer': fX,
                  'componentsPerAttribute': 0x3,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'normalize': false,
                  'instanceDivisor': 0x1
              }, {
                  'index': fB['transrow_a'],
                  'vertexBuffer': fE,
                  'componentsPerAttribute': 0x4,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'offsetInBytes': 0x0,
                  'strideInBytes': 0x10 * fO,
                  'normalize': false,
                  'instanceDivisor': 0x1
              }, {
                  'index': fB['transrow_b'],
                  'vertexBuffer': fE,
                  'componentsPerAttribute': 0x4,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'offsetInBytes': 0x4 * fO,
                  'strideInBytes': 0x10 * fO,
                  'normalize': false,
                  'instanceDivisor': 0x1
              }, {
                  'index': fB['transrow_c'],
                  'vertexBuffer': fE,
                  'componentsPerAttribute': 0x4,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'offsetInBytes': 0x8 * fO,
                  'strideInBytes': 0x10 * fO,
                  'normalize': false,
                  'instanceDivisor': 0x1
              }, {
                  'index': fB['transrow_d'],
                  'vertexBuffer': fE,
                  'componentsPerAttribute': 0x4,
                  'componentDatatype': J['ComponentDatatype']['FLOAT'],
                  'offsetInBytes': 0xc * fO,
                  'strideInBytes': 0x10 * fO,
                  'normalize': false,
                  'instanceDivisor': 0x1
              }];
              if (null == fm ? undefined : fm['length']) {
                  const Fa = J['Buffer']['createVertexBuffer']({
                      'context': fp,
                      'usage': J['BufferUsage']['STATIC_DRAW'],
                      'typedArray': new Float32Array(fm)
                  });
                  fB['val'] = 0x3,
                  F0['push']({
                      'index': fB['val'],
                      'vertexBuffer': Fa,
                      'componentsPerAttribute': 0x2,
                      'componentDatatype': J['ComponentDatatype']['FLOAT'],
                      'normalize': false,
                      'instanceDivisor': 0x1
                  });
              }
              const F1 = J['Buffer']['createIndexBuffer']({
                  'context': fp,
                  'typedArray': 0x1 === this['_vectorInfo']['indiceByteLen'] ? new Uint8Array(this['_vectorInfo']['indices']) : 0x2 === this['_vectorInfo']['indiceByteLen'] ? new Uint16Array(this['_vectorInfo']['indices']) : new Uint32Array(this['_vectorInfo']['indices']),
                  'usage': J['BufferUsage']['STATIC_DRAW'],
                  'indexDatatype': 0x1 === this['_vectorInfo']['indiceByteLen'] ? J['IndexDatatype']['UNSIGNED_BYTE'] : 0x2 === this['_vectorInfo']['indiceByteLen'] ? J['IndexDatatype']['UNSIGNED_SHORT'] : J['IndexDatatype']['UNSIGNED_INT']
              });
              this['_vao'] = new J['VertexArray']({
                  'context': fp,
                  'attributes': F0,
                  'indexBuffer': F1
              }),
              this['options']['debugShowPerformance'] && K['logger']['debug']('generate\x20buffers\x20cost\x20' + (performance['now']() - fx) + 'ms');
              const F2 = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20int;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler3D;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20normal;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20lonlat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec4\x20transrow_a;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec4\x20transrow_b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec4\x20transrow_c;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec4\x20transrow_d;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (fA ? K['glNames']['attrIn'] + '\x20vec2\x20val;' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20' + K['glNames']['attrIn'] + '\x20vec2\x20st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec3\x20v_normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varOut'] + '\x20vec4\x20v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20' + K['glNames']['varOut'] + '\x20vec2\x20v_st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20int\x20stepCount=' + this['fillSteps']['length'] + ';\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (fA ? '' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (0x0,
              K['getAlgoConstsAndUniforms'])(this['dataSource']['getGrid'](), false) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20zAttr;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20uTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20vTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler3D\x20wTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasW;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20isUv;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20baseSpeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20highp\x20int\x20fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasCs;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20csMax;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20csTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20shapeScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20vDataScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20rotateAxis(vec3\x20p,\x20vec3\x20axis,\x20float\x20angle)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20mix(dot(axis,\x20p)*axis,\x20p,\x20cos(angle))\x20+\x20cross(axis,p)*sin(angle);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20geoPos=vec3(lonlat);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20origin=' + K['qeGLFuncs']['qe_deg2cartesianV2'] + '(geoPos);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20mat4\x20modelMatrix\x20=\x20mat4(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transrow_a.x,\x20transrow_b.x,\x20transrow_c.x,\x20transrow_d.x,\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transrow_a.y,\x20transrow_b.y,\x20transrow_c.y,\x20transrow_d.y,\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transrow_a.z,\x20transrow_b.z,\x20transrow_c.z,\x20transrow_d.z,\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20transrow_a.w,\x20transrow_b.w,\x20transrow_c.w,\x20transrow_d.w\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//read\x20data\x20value\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20speed;vec3\x20dir;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (fA ? '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=val.x;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20tmp\x20=\x20((270.0\x20-\x20val.y)\x20*\x203.1415926)\x20/\x20180.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20dir=vec3(speed*cos(tmp),speed*sin(tmp),0.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0){\x20//shaded\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//none\x20interp\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x20//interp\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(geoPos.z<=zAttr.x){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=0.;\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(geoPos.z>=zAttr.y){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=1.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20w=(geoPos.z-zAttr.x)/(zAttr.y-zAttr.x);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20p=vec3(' + K['qeGLFuncs']['qe_getLonLatTexPos'] + '(geoPos.xy,xAttr,yAttr),w);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20val1=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(uTexture,p,xAttr,yAttr,zAttr,undef,interpMethod).y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20val2=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(vTexture,p,xAttr,yAttr,zAttr,undef,interpMethod).y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20val3=0.;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasW){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val3=' + K['qeGLFuncs']['qe_readGridVal3DByUV'] + '(wTexture,p,xAttr,yAttr,zAttr,undef,interpMethod).y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isUv){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20dir=vec3(val1,val2,val3*vDataScale);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=sqrt(val1*val1+val2*val2);\x20\x20\x20//暂时只使用水平速度\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20speed=val1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20tmp\x20=\x20((270.0\x20-\x20val2)\x20*\x203.1415926)\x20/\x20180.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20dir=vec3(speed*cos(tmp),speed*sin(tmp),val3*vDataScale);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20scale=speed/baseSpeed;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//rotate\x20\x20around\x20zaxis\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20vPos=vec3(pos)*shapeScale;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20float\x20angle=acos(length(vec2(dir.xy))/length(dir));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//vec3\x20rPos=rotateAxis(vPos,vec3(1.0,0.0,0.0),radians(180.));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20rPos=rotateAxis(vPos,vec3(1.0,0.0,0.0),angle);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20angle=radians(mod(270.\x20-\x20(atan(dir.y,\x20dir.x)\x20*\x20180.0)\x20/\x203.1415926,360.));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20rPos=rotateAxis(rPos,vec3(0.0,0.0,1.0),-1.0*angle);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20mat4\x20modelView\x20=\x20czm_view\x20*\x20modelMatrix;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20mv_position=modelView\x20*\x20vec4(rPos,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_positionEC\x20=\x20mv_position.xyz;\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20mat3\x20normalMatrix\x20=\x20mat3(modelMatrix);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_normalEC\x20=\x20normalMatrix\x20*\x20normal;\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20normal\x20in\x20eye\x20coordinates\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasCs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=' + K['qeGLFuncs']['qe_getColorByScale'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==0\x20||\x20fillMode>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=' + K['qeGLFuncs']['qe_getColor'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color=' + K['qeGLFuncs']['qe_interpColor'] + '(speed);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20v_color.a=v_color.a*globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20v_st\x20=\x20st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20gl_Position=czm_modelViewProjection\x20*\x20worldPosition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position=czm_projection\x20*\x20mv_position;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , F3 = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20isFlat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20u_diffuse;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20u_emission;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_specular;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_shininess;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20highp\x20int\x20fillMode;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasMask;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20reso;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20maskTexture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec3\x20v_normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20' + K['glNames']['varIn'] + '\x20vec2\x20v_st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['varIn'] + '\x20vec4\x20v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(fillMode==-1){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasMask\x20&&\x20!' + K['qeGLFuncs']['qe_maskout'] + '(reso,maskTexture)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isFlat){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20FLAT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20v_color;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20positionToEyeEC\x20=\x20-v_positionEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20normalEC\x20=\x20normalize(v_normalEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#ifdef\x20FACE_FORWARD\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20normalEC\x20=\x20faceforward(normalEC,\x20vec3(0.0,\x200.0,\x201.0),\x20-normalEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20#endif\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20czm_materialInput\x20materialInput;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20materialInput.normalEC\x20=\x20normalEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20materialInput.positionToEyeEC\x20=\x20positionToEyeEC;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20materialInput.st\x20=\x20v_st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20czm_material\x20material\x20=\x20czm_getDefaultMaterial(materialInput);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20tColor=czm_gammaCorrect(v_color);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.diffuse=tColor.xyz+u_diffuse;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.emission=u_emission;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.specular=u_specular;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.shininess=u_shininess;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20material.alpha=tColor.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor\x20=\x20czm_phong(normalize(positionToEyeEC),\x20material,czm_lightDirectionEC);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                , F4 = fK(F2, undefined, {})
                , F5 = fK(F3, undefined, {})
                , F6 = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': F4,
                  'fragmentShaderSource': F5,
                  'attributeLocations': fB
              })
                , F7 = new J['Cartesian2'](fp['drawingBufferWidth'],fp['drawingBufferHeight'])
                , F8 = fv(fp);
              let F9 = {
                  'colors': ()=>this['fillColors'] || [],
                  'steps': ()=>this['fillSteps'] || [],
                  'fillMode': ()=>this['drawOptions']['fillMode'],
                  'csMin': ()=>{
                      var Fi, Fs;
                      return null !== (Fs = null === (Fi = this['drawOptions']['colorScale']) || undefined === Fi ? undefined : Fi['min']) && undefined !== Fs ? Fs : 0x0;
                  }
                  ,
                  'csMax': ()=>{
                      var Fi, Fs;
                      return null !== (Fs = null === (Fi = this['drawOptions']['colorScale']) || undefined === Fi ? undefined : Fi['max']) && undefined !== Fs ? Fs : 0x1;
                  }
                  ,
                  'csTexture': ()=>this['drawOptions']['colorScale'] ? this['_csTexture'] || (this['_csTexture'] = fb(fp, this['drawOptions']['colorScale']['colorScale'])) : F8,
                  'hasCs': ()=>(0x0,
                  J['defined'])(this['drawOptions']['colorScale']),
                  'reso': ()=>F7,
                  'hasMask': ()=>!!this['maskTexture'],
                  'maskTexture': ()=>this['maskTexture'] || F8,
                  'globalOpacity': ()=>{
                      var Fi;
                      return null !== (Fi = this['drawOptions']['globalOpacity']) && undefined !== Fi ? Fi : 0x1;
                  }
                  ,
                  'isFlat': ()=>this['drawOptions']['flat'],
                  'u_emission': ()=>this['_emission'],
                  'u_diffuse': ()=>this['_diffuse'],
                  'u_specular': ()=>this['drawOptions']['specular'],
                  'u_shininess': ()=>this['drawOptions']['shininess'],
                  'baseSpeed': ()=>this['drawOptions']['baseSpeed'],
                  'shapeScale': ()=>this['drawOptions']['shapeScale'],
                  'vDataScale': ()=>this['drawOptions']['verticalDataScale']
              };
              if (!fA) {
                  const Fi = this['dataSource']
                    , Fs = new J['Cartesian4'](Fi['gridOptions']['xStart'],Fi['gridOptions']['xEnd'],Fi['gridOptions']['xDelta'],Fi['gridOptions']['xSize'])
                    , Fg = new J['Cartesian4'](Fi['gridOptions']['yStart'],Fi['gridOptions']['yEnd'],Fi['gridOptions']['yDelta'],Fi['gridOptions']['ySize'])
                    , Fu = new J['Cartesian3'](Fi['gridOptions']['zValues'][0x0] * this['drawOptions']['zScale'],Fi['gridOptions']['zValues'][Fi['gridOptions']['zValues']['length'] - 0x1] * this['drawOptions']['zScale'],Fi['gridOptions']['zValues']['length'])
                    , Fk = ft(fp);
                  F9 = Object['assign'](Object['assign']({}, F9), {
                      'xAttr': ()=>Fs,
                      'yAttr': ()=>Fg,
                      'zAttr': ()=>Fu,
                      'uTexture': ()=>this['_uTexture'] || (this['_uTexture'] = fQ(fp, this['_uGrids'], Fi['gridOptions'], undefined)),
                      'vTexture': ()=>this['_vTexture'] || (this['_vTexture'] = fQ(fp, this['_vGrids'], Fi['gridOptions'])),
                      'wTexture': ()=>this['_wTexture'] || this['_wGrids'] && (this['_wTexture'] = fQ(fp, this['_wGrids'], Fi['gridOptions'])) || Fk,
                      'isUv': ()=>fe,
                      'hasW': ()=>(0x0,
                      J['defined'])(this['_wGrids'])
                  }),
                  (0x0,
                  K['setAlgoUniforms'])(Fi['getGrid'](), F9);
              }
              let Ff = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              Ff = Object['assign'](Object['assign']({}, Ff), {
                  'depthTest': {
                      'enabled': this['drawOptions']['depthTest']
                  },
                  'depthMask': {
                      'enabled': true
                  }
              });
              const FF = J['RenderState']['fromCache'](Ff);
              this['_command'] = new J['DrawCommand']({
                  'vertexArray': this['_vao'],
                  'primitiveType': J['PrimitiveType']['TRIANGLES'],
                  'renderState': FF,
                  'shaderProgram': F6,
                  'uniformMap': F9,
                  'owner': this,
                  'pass': this['drawOptions']['opaque'] ? J['Pass']['OPAQUE'] : J['Pass']['TRANSLUCENT'],
                  'modelMatrix': this['modelMatrix'],
                  'instanceCount': fR['length'] / 0x3
              }),
              this['_dirty'] = false;
          }
          ['update'](fp) {
              var fR;
              if (super['update'](fp),
              (null === (fR = this['drawOptions']) || undefined === fR ? undefined : fR['shapeNeedsUpdate']) && (this['_vectorInfo'] = undefined,
              this['drawOptions']['shapeNeedsUpdate'] = false),
              !(this['_visible'] && this['dataSource'] && this['drawOptions'] && this['vectorInfo']))
                  return;
              const fm = fp['context'];
              this['_command'] ? this['_dirty'] && (this['resetCommand'](),
              this['_createCommand'](fm)) : this['_createCommand'](fm),
              this['_command'] ? fp['commandList']['push'](this['_command']) : K['logger']['warn']('创建Geometry渲染器失败！');
          }
          ['destroy']() {
              this['resetCommand'](),
              (0x0,
              J['destroyObject'])(this);
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['WindArrowLayerStyle'](fp);
          }
      }
      CWindArrowLayer['DefaultOptions'] = Object['assign'](Object['assign']({}, fJ['DefaultOptions']), {
          'preserveGeometryWorker': false,
          'interpFromPreSource': false,
          'trackDataSource': false
      });
      class CGroundLayer extends fC {
          constructor(fp) {
              super(),
              this['options'] = (0x0,
              K['setOptions'])({}, fp, CGroundLayer['DefaultOptions']);
          }
          ['setDrawOptions'](fp, fR=true) {
              if (super['setDrawOptions'](fp, fR),
              this['_planeOptions'] = this['drawOptions']['getPlaneOptions'](undefined, this['options']['cacheDrawOptions']),
              !this['_planeOptions']['fillColor'])
                  return this['_csTexture'] && (this['_csTexture'] && this['_csTexture']['destroy'](),
                  this['_csTexture'] = undefined),
                  this['_updateColorScaleMaxMin'](),
                  this['splineMat'] = J['Matrix4']['toArray'](new J['Matrix4'](-this['drawOptions']['pixelRatio'],0x2 - this['drawOptions']['pixelRatio'],this['drawOptions']['pixelRatio'] - 0x2,this['drawOptions']['pixelRatio'],0x2 * this['drawOptions']['pixelRatio'],this['drawOptions']['pixelRatio'] - 0x3,0x3 - 0x2 * this['drawOptions']['pixelRatio'],-this['drawOptions']['pixelRatio'],-this['drawOptions']['pixelRatio'],0x0,this['drawOptions']['pixelRatio'],0x0,0x0,0x1,0x0,0x0)),
                  this;
              K['logger']['error']('格点贴地图层暂时不支持fillColor配色，请改用colorScale配色！', true);
          }
          ['update'](fp) {
              var fR, fm;
              if (this['_visible'] && this['dataSource'] && this['drawOptions']) {
                  if (!this['_groudPrimitive']) {
                      const fH = (0x0,
                      K['gridOptionsToExtent'])(this['dataSource']['gridOptions'])
                        , fe = null !== (fR = this['options']['granularity']) && undefined !== fR ? fR : Math['min'](0x1, Math['max'](0.01, Math['min'](Math['abs'](this['dataSource']['gridOptions']['xDelta']), Math['abs'](this['dataSource']['gridOptions']['yDelta']))))
                        , fA = new J['RectangleGeometry']({
                          'rectangle': J['Rectangle']['fromDegrees'](fH['minLon'], fH['minLat'], fH['maxLon'], fH['maxLat']),
                          'granularity': fe,
                          'vertexFormat': this['options']['flat'] ? J['VertexFormat']['POSITION_AND_ST'] : J['VertexFormat']['POSITION_NORMAL_AND_ST']
                      });
                      let fI = 'val=' + K['qeGLFuncs']['qe_readGridValByUV'] + '(currentData,vUV,xAttr,yAttr,undef,interpMethod);';
                      this['options']['interpFromPreSource'] && (fI = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasPre){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val=' + K['qeGLFuncs']['qe_interpGridValByUV'] + '(preData,vUV,xAttr,yAttr,undef,interpMethod,currentData,dataPercent);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20val=' + K['qeGLFuncs']['qe_readGridValByUV'] + '(currentData,vUV,xAttr,yAttr,undef,interpMethod);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                      const fx = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20currentData;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20preData;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20dataPercent;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20undef;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20fillMode;\x20//0-none(bitmap,no-color-interp&no-data-interp),1-bi(pixel1),2-cardinal(pixel2),3-shaded(no-color-interp&cardinal)\x20cesium在vShader和fShader中对于int的精度定义不一致，需要特别指定\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20cardinalSplineMat;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20bool\x20hasPre;\x0a\x20\x20\x20\x20\x20\x20\x20\x20'
                        , fB = (null === (fm = this['fillSteps']) || undefined === fm ? undefined : fm['length']) || 0x1
                        , fM = (0x0,
                      K['injectBuiltInShaderFunctions'])('\x0a\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20' + (0x0,
                      K['getAlgoConstsAndUniforms'])(this['currentGrid']) + '\x0a\x20\x20\x20\x20const\x20int\x20stepCount=' + fB + ';\x0a\x20\x20\x20\x20' + fx + '\x0a\x20\x20\x20\x20uniform\x20vec4\x20xAttr;\x0a\x20\x20\x20\x20uniform\x20vec4\x20yAttr;\x0a\x20\x20\x20\x20//\x20uniform\x20vec4\x20colors[stepCount];\x0a\x20\x20\x20\x20//\x20uniform\x20float\x20steps[stepCount];\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20csTexture;\x0a\x20\x20\x20\x20uniform\x20float\x20csMin;\x0a\x20\x20\x20\x20uniform\x20float\x20csMax;\x0a\x20\x20\x20\x20uniform\x20bool\x20hasCs;\x0a\x20\x20\x20\x20uniform\x20bool\x20hasMask;\x0a\x20\x20\x20\x20uniform\x20vec2\x20reso;\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20maskTexture;\x0a\x20\x20\x20\x20uniform\x20float\x20globalOpacity;\x0a\x0a\x20\x20\x20\x20$inject\x0a\x0a\x20\x20\x20\x20czm_material\x20czm_getMaterial(czm_materialInput\x20materialInput)\x0a\x20\x20\x20\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20czm_material\x20m\x20=\x20czm_getDefaultMaterial(materialInput);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(hasMask\x20&&\x20!' + K['qeGLFuncs']['qe_maskout'] + '(reso,maskTexture)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20vUV=materialInput.st;\x0a\x20\x20\x20\x20\x20\x20\x20\x20int\x20interpMethod=int(fillMode);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(interpMethod==3||\x20interpMethod==2){\x20//shaded2\x20or\x20pixel2\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//cardinal\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=2;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}else\x20if(interpMethod==4){\x20//shaded1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20interpMethod=1;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20val;\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + fI + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20selVal=interpMethod==0?val.x:val.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec4\x20resColor=vec4(1.);\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(' + K['qeGLFuncs']['qe_isUndef'] + '(selVal,undef)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(hasCs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20resColor=' + K['qeGLFuncs']['qe_getColorByScale'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20if(fillMode==0.\x20||\x20fillMode>=3.){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20resColor=' + K['qeGLFuncs']['qe_getColor'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20}else{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20\x20\x20\x20\x20resColor=' + K['qeGLFuncs']['qe_interpColor'] + '(selVal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20resColor.a=resColor.a*globalOpacity;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20if(resColor.a<0.001){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20vec4\x20ndcPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20ndcPos.xy\x20=\x20((2.0\x20*\x20gl_FragCoord.xy)\x20-\x20(2.0\x20*\x20czm_viewport.xy))\x20/\x20(czm_viewport.zw)\x20-\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20ndcPos.z\x20=\x20(2.0\x20*\x20gl_FragCoord.z\x20-\x20gl_DepthRange.near\x20-\x20gl_DepthRange.far)\x20/(gl_DepthRange.far\x20-\x20gl_DepthRange.near);\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20ndcPos.w\x20=\x201.0;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20vec4\x20clipPos\x20=\x20ndcPos\x20/\x20gl_FragCoord.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20//vec4\x20eyePosition\x20=\x20czm_inverseProjection\x20*\x20clipPos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20vec4\x20wPos=czm_inverseViewProjection*clipPos;\x20//czm_inverseView\x20*\x20eyePosition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20vec3\x20pos=' + K['qeGLFuncs']['qe_cartesian2deg'] + '(wPos.xyz,true);\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20m.diffuse\x20=resColor.xyz;\x0a\x20\x20\x20\x20\x20\x20\x20\x20m.specular\x20=\x200.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20m.alpha=resColor.w;\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20m;\x0a\x20\x20\x20\x20}\x20\x20\x20\x20\x20\x0a\x0a\x20\x20\x20\x20')
                        , fl = document['createElement']('canvas');
                      fl['width'] = fl['height'] = 0x1f4,
                      fl['getContext']('2d')['fillStyle'] = 'blue',
                      fl['getContext']('2d')['fillRect'](0x0, 0x0, 0x1f4, 0x1f4);
                      const fX = fp['context']
                        , fE = new J['Cartesian4'](this['dataSource']['gridOptions']['xStart'],this['dataSource']['gridOptions']['xEnd'],this['dataSource']['gridOptions']['xDelta'],this['dataSource']['gridOptions']['xSize'])
                        , fO = new J['Cartesian4'](this['dataSource']['gridOptions']['yStart'],this['dataSource']['gridOptions']['yEnd'],this['dataSource']['gridOptions']['yDelta'],this['dataSource']['gridOptions']['ySize'])
                        , F0 = new J['Cartesian2'](fX['drawingBufferWidth'],fX['drawingBufferHeight'])
                        , F1 = this['_planeOptions']['optimizedInterp'] ? ()=>this['_planeOptions']['fillMode'] === K['GridDataGLFillMode']['bitmap'] ? J['TextureMinificationFilter']['NEAREST'] : J['TextureMinificationFilter']['LINEAR'] : ()=>J['TextureMinificationFilter']['NEAREST']
                        , F2 = fv(fX);
                      this['_updateUniformsFunc'] = F6=>{
                          var F7, F8, F9, Ff, FF;
                          for (const Fd in F6)
                              Fd['startsWith']('currentData') ? F6[Fd] = this['currentTexture'] || (this['currentTexture'] = fw(fX, this['currentGrid'], F1())) : Fd['startsWith']('cardinalSplineMat') ? F6[Fd] = this['splineMat'] : Fd['startsWith']('fillMode') ? F6[Fd] = this['_planeOptions']['fillMode'] : Fd['startsWith']('hasMask') ? F6[Fd] = !!this['maskTexture'] : Fd['startsWith']('maskTexture') ? F6[Fd] = this['maskTexture'] || F2 : Fd['startsWith']('csMin') ? F6[Fd] = null !== (F8 = null === (F7 = this['_planeOptions']['colorScale']) || undefined === F7 ? undefined : F7['min']) && undefined !== F8 ? F8 : 0x0 : Fd['startsWith']('csMax') ? F6[Fd] = null !== (Ff = null === (F9 = this['_planeOptions']['colorScale']) || undefined === F9 ? undefined : F9['max']) && undefined !== Ff ? Ff : 0x1 : Fd['startsWith']('csTexture') ? this['_planeOptions']['colorScale'] ? F6[Fd] = this['_csTexture'] || (this['_csTexture'] = fb(fX, this['_planeOptions']['colorScale']['colorScale'])) : F6[Fd] = F2 : Fd['startsWith']('hasCs') ? F6[Fd] = (0x0,
                              J['defined'])(this['_planeOptions']['colorScale']) : Fd['startsWith']('globalOpacity') ? F6[Fd] = null !== (FF = this['_planeOptions']['globalOpacity']) && undefined !== FF ? FF : 0x1 : Fd['startsWith']('undef') ? F6[Fd] = (0x0,
                              K['defaultVal'])(this['currentGrid']['undef'], 0xf423f) : Fd['startsWith']('dataOffset') ? F6[Fd] = this['currentGrid']['dataOffset'] : Fd['startsWith']('dataScale') ? F6[Fd] = this['currentGrid']['dataScale'] : Fd['startsWith']('dataAlgo') && (F6[Fd] = this['currentGrid']['algo']),
                              this['options']['interpFromPreSource'] ? Fd['startsWith']('preData') ? F6[Fd] = this['preTexture'] || this['preGrid'] && (this['preTexture'] = fw(fX, this['preGrid'], F1())) || F2 : Fd['startsWith']('dataPercent') ? F6[Fd] = this['dataPercent'] : Fd['startsWith']('hasPre') && (F6[Fd] = !(!this['options']['interpFromPreSource'] || !this['preGrid'])) : Fd['startsWith']('preData') ? F6[Fd] = F2 : Fd['startsWith']('dataPercent') ? F6[Fd] = this['dataPercent'] : Fd['startsWith']('hasPre') && (F6[Fd] = false);
                      }
                      ;
                      const F3 = {
                          'xAttr': fE,
                          'yAttr': fO,
                          'reso': F0,
                          'currentData': undefined,
                          'cardinalSplineMat': undefined,
                          'fillMode': undefined,
                          'hasMask': undefined,
                          'maskTexture': undefined,
                          'csMin': undefined,
                          'csMax': undefined,
                          'csTexture': undefined,
                          'hasCs': undefined,
                          'globalOpacity': undefined,
                          'undef': undefined,
                          'dataOffset': undefined,
                          'dataScale': undefined,
                          'dataAlgo': undefined,
                          'preData': undefined,
                          'dataPercent': undefined,
                          'hasPre': undefined
                      };
                      this['_updateUniformsFunc'](F3);
                      const F4 = new J['Material']({
                          'fabric': {
                              'type': 'CGColor',
                              'uniforms': F3,
                              'source': fM
                          },
                          'translucent': true,
                          'autoDestroyOldTexture': false
                      })
                        , F5 = {
                          'geometryInstances': new J['GeometryInstance']({
                              'geometry': fA
                          }),
                          'appearance': new J['MaterialAppearance']({
                              'material': F4,
                              'flat': this['options']['flat']
                          })
                      };
                      this['_groudPrimitive'] = this['options']['onGround'] ? new J['GroundPrimitive'](F5) : new J['Primitive'](F5);
                  }
                  this['_updateUniformsFunc'](this['_groudPrimitive']['appearance']['material']['uniforms']),
                  this['_groudPrimitive']['update'](fp);
              }
          }
          ['setDataSource'](fp) {
              return super['setDataSource'](fp),
              this['_updateColorScaleMaxMin'](),
              this;
          }
          ['_updateColorScaleMaxMin']() {
              var fp, fR;
              if (this['dataSource'] && (null === (fR = null === (fp = this['_planeOptions']) || undefined === fp ? undefined : fp['colorScale']) || undefined === fR ? undefined : fR['colorScale']) && (!(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['min']) || !(0x0,
              J['defined'])(this['_planeOptions']['colorScale']['max']))) {
                  K['logger']['debug']('当前colorScale没有配置最大或者最小值，将使用数据中的值，可能造成连续动画时最大最小值不一致！');
                  const fm = this['dataSource']['getGrid']()['maxMin'];
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['min']) || (this['_planeOptions']['colorScale']['min'] = fm['min']),
                  (0x0,
                  J['defined'])(this['_planeOptions']['colorScale']['max']) || (this['_planeOptions']['colorScale']['max'] = fm['max']);
              }
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['PixelLayerStyle'](fp);
          }
      }
      CGroundLayer['DefaultOptions'] = Object['assign'](Object['assign']({}, fC['DefaultOptions']), {
          'flat': true,
          'onGround': true
      });
      class CPointImageLayer extends fJ {
          ['setDataSource'](fp) {
              return this['dataSource'] = fp,
              this['resetCommand'](true),
              this;
          }
          ['setDrawOptions'](fp, fR) {
              return super['setDrawOptions'](fp),
              this['_textureDims'] = new J['Cartesian2'](this['drawOptions']['textureDim'][0x0],this['drawOptions']['textureDim']['length'] > 0x1 ? this['drawOptions']['textureDim'][0x1] : this['drawOptions']['textureDim'][0x0]),
              this;
          }
          ['_createCommand'](fp) {
              const fR = [];
              this['dataSource']['getFeatures']()['features']['forEach'](fO=>{
                  var F0;
                  'Point' === (null === (F0 = null == fO ? undefined : fO['geometry']) || undefined === F0 ? undefined : F0['type']) && fR['push'](fO['geometry']['coordinates'][0x0], fO['geometry']['coordinates'][0x1], fO['geometry']['coordinates']['length'] > 0x2 ? fO['geometry']['coordinates'][0x2] : 0x0);
              }
              );
              const fm = new Float32Array(fR)
                , fH = {
                  'a_pos': 0x0
              }
                , fe = new J['Geometry']({
                  'attributes': {
                      'a_pos': new J['GeometryAttribute']({
                          'componentDatatype': J['ComponentDatatype']['FLOAT'],
                          'componentsPerAttribute': 0x3,
                          'values': fm,
                          'normalize': false
                      })
                  }
              });
              this['_vao'] = J['VertexArray']['fromGeometry']({
                  'context': fp,
                  'geometry': fe,
                  'attributeLocations': fH,
                  'bufferUsage': J['BufferUsage']['STATIC_DRAW']
              });
              const fA = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + K['glNames']['attrIn'] + '\x20vec3\x20a_pos;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_size;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20float\x20u_scale_max;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldCoords=' + K['qeGLFuncs']['qe_deg2cartesian'] + '(a_pos);\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_PointSize=u_size;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20czm_projection\x20*\x20czm_view\x20*\x20vec4(worldCoords,1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a'
                , fI = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x20\x20\x20\x20\x20\x20\x20\x20precision\x20highp\x20sampler2D;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20sampler2D\x20u_texture;\x0a\x20\x20\x20\x20\x20\x20\x20\x20uniform\x20vec2\x20u_texture_dims;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20out_FragColor=' + K['glNames']['textureFunc'] + '(u_texture,gl_PointCoord);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a'
                , fx = {
                  'u_size': ()=>this['drawOptions']['size'],
                  'u_scale_max': ()=>this['drawOptions']['scaleMax'],
                  'u_texture_dims': ()=>this['_textureDims'],
                  'u_texture': ()=>this['_texture'] || (this['_texture'] = fb(fp, this['drawOptions']['texture'], new J['Sampler']({
                      'minificationFilter': J['TextureMinificationFilter']['LINEAR'],
                      'magnificationFilter': J['TextureMagnificationFilter']['LINEAR']
                  })))
              }
                , fB = fK(fA)
                , fM = fK(fI)
                , fl = J['ShaderProgram']['fromCache']({
                  'context': fp,
                  'vertexShaderSource': fB,
                  'fragmentShaderSource': fM,
                  'attributeLocations': fH
              });
              let fX = J['Appearance']['getDefaultRenderState'](false, false, undefined);
              fX = Object['assign'](Object['assign']({}, fX), {
                  'depthTest': {
                      'enabled': true
                  },
                  'depthMask': {
                      'enabled': true
                  }
              });
              const fE = J['RenderState']['fromCache'](fX);
              this['_command'] = new J['DrawCommand']({
                  'vertexArray': this['_vao'],
                  'primitiveType': J['PrimitiveType']['POINTS'],
                  'renderState': fE,
                  'shaderProgram': fl,
                  'uniformMap': fx,
                  'owner': this,
                  'pass': J['Pass']['TRANSLUCENT'],
                  'modelMatrix': J['Matrix4']['IDENTITY']
              });
          }
          ['resetCommand'](fp) {
              var fR, fm, fH;
              this['_command'] && (null === (fm = null === (fR = this['_command']) || undefined === fR ? undefined : fR['shaderProgram']) || undefined === fm || fm['destroy'](),
              this['_command'] = undefined,
              fp && (null === (fH = this['_vao']) || undefined === fH || fH['destroy'](),
              this['_vao'] = undefined));
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['PointImageStyle3D'](fp);
          }
          ['update'](fp) {
              if (!(this['_visible'] && this['dataSource'] && this['drawOptions'] && this['drawOptions']['texture']))
                  return;
              super['update'](fp);
              const fR = fp['context'];
              this['_command'] || this['_createCommand'](fR),
              this['_command'] ? fp['commandList']['push'](this['_command']) : K['logger']['warn']('创建Geometry渲染器失败！');
          }
          ['destroy']() {
              this['resetCommand'](),
              (0x0,
              J['destroyObject'])(this);
          }
      }
      class CCSLayer extends CGeoJSONLayer {
          constructor(fp) {
              super((0x0,
              K['setOptions'])({}, fp, CCSLayer['DefaultOptions'])),
              this['redrawFromDataSourceTracking'] = ()=>{
                  this['options']['trackDataSource'] && this['drawOptions'] && this['_getCSDatasource']()['then'](fR=>{
                      super['setDataSource'](fR);
                  }
                  );
              }
              ;
          }
          ['setDrawOptions'](fp, fR) {
              super['setDrawOptions'](fp, fR);
              const fm = this['_anaValues'];
              return this['_anaValues'] = fp['analysisValues'],
              this['originalSource'] && fm !== fp['analysisValues'] && this['_getCSDatasource']()['then'](fH=>{
                  super['setDataSource'](fH);
              }
              ),
              this;
          }
          ['setDataSource'](fp) {
              if (fp['getFeatures']) {
                  const fR = this['originalSource']
                    , fm = fp;
                  fR && fR['offFeaturesUpdate'](this['redrawFromDataSourceTracking']),
                  fm && fm['onFeaturesUpdate'](this['redrawFromDataSourceTracking']);
              } else {
                  const fH = this['originalSource']
                    , fe = fp;
                  fH && this['originalSource'] !== fe && (fH['offActiveGridUpdated'](this['redrawFromDataSourceTracking']),
                  fH['offIntTZChanged'](this['redrawFromDataSourceTracking'])),
                  fH && fH === fe || (fe['onActiveGridUpdated'](this['redrawFromDataSourceTracking']),
                  fe['onIntTZChanged'](this['redrawFromDataSourceTracking']));
              }
              return this['originalSource'] = fp,
              this['drawOptions'] && this['_getCSDatasource']()['then'](fA=>{
                  super['setDataSource'](fA);
              }
              ),
              this;
          }
          ['_getCSDatasource']() {
              return fp = this,
              fR = undefined,
              fH = function*() {
                  let fe = this['originalSource'];
                  this['originalSource']['getFeatures'] && (fe = K['TracingService']['interpToGridProvider'](this['drawOptions']['interpGridOptions'], this['originalSource'], this['drawOptions']['interpField'], this['drawOptions']['undef']));
                  const fA = new K['TracingService'](undefined)
                    , fI = {
                      'dataSource': fe,
                      'withShaded': this['drawOptions']['withShaded'],
                      'analysisValues': this['drawOptions']['analysisValues'](),
                      'reserveTracingInfo': true
                  };
                  return this['options']['wasm'] ? (yield fA['tracingContourShadedWASM'](fI))['dataSource'] : fA['tracingContourShaded'](fI)['dataSource'];
              }
              ,
              new ((fm = undefined) || (fm = Promise))(function(fe, fA) {
                  function fI(fM) {
                      try {
                          fB(fH['next'](fM));
                      } catch (fl) {
                          fA(fl);
                      }
                  }
                  function fx(fM) {
                      try {
                          fB(fH['throw'](fM));
                      } catch (fl) {
                          fA(fl);
                      }
                  }
                  function fB(fM) {
                      var fl;
                      fM['done'] ? fe(fM['value']) : (fl = fM['value'],
                      fl instanceof fm ? fl : new fm(function(fX) {
                          fX(fl);
                      }
                      ))['then'](fI, fx);
                  }
                  fB((fH = fH['apply'](fp, fR || []))['next']());
              }
              );
              var fp, fR, fm, fH;
          }
          ['_createStyleObjectFromStyleOptions'](fp) {
              return new K['CSStyle3D'](fp);
          }
      }
      CCSLayer['DefaultOptions'] = {
          'wasm': false
      },
      CCSLayer['qeName'] = 'l_grid_cs',
      K['layerCreator']['register'](CCSLayer),
      (0x0,
      K['auth'])();
  }
  )(),
  Q;
}
)());


QE.init()//quickearth.core.js
