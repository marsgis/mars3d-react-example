const CustomLang = {
  /** 标识语言的唯一标识 */
  type: "en",

  /** Cesium内部 初始化CesiumWidget时 错误弹窗 标题 */
  ErrorCreateCatch: "Error constructing CesiumWidget.",
  /** Cesium内部 初始化CesiumWidget时 错误弹窗 内容 */
  ErrorCreateCatchMessage: `Visit <a href="http://get.webgl.org">http://get.webgl.org</a> to verify that your web browser and hardware support WebGL.  Consider trying a different web browser or updating your video drivers.  Detailed error information is below:`,
  /** Cesium内部 运行中 renderError时 错误弹窗 标题 */
  ErrorTitleRenderStopped: "An error occurred while rendering.  Rendering has stopped.",


  // src\control\czm\Animation.js
  Today: "Today",
  TodayRealTime: "Today (real-time)",
  Pause: "Pause",
  PlayReverse: "Play Reverse",
  PlayForward: "Play Forward",
  CurrentTimeNotInRange: "Current time not in range",

  // src\control\czm\BaseLayerPicker.js
  Imagery: "Imagery",
  CesiumIon: "Cesium ion",
  Other: "Other",
  Terrain: "Terrain",
  EllipsoidTerrainProvider: "WGS84 Ellipsoid",
  EllipsoidTerrainProviderTooltip: "WGS84 standard ellipsoid, also known as EPSG:4326",
  TerrainProvider: "World Terrain",
  TerrainProviderTooltip: "High-resolution global terrain tileset curated from several datasources",

  // src\control\czm\BaseLayerPicker.js
  FullScreen: "Full screen",
  ExitFullScreen: "Exit full screen",
  FullScreenUnavailable: "Full screen unavailable",

  // src\control\czm\Geocoder.js
  EnterAnAddressOrLandmark: "Enter an address or landmark...",
  Searching: "Searching...",

  // src\control\czm\HomeButton.js
  ViewHome: "View Home",

  // src\control\czm\NavigationHelpButton.js
  NavigationInstructions: "Navigation Instructions",
  Mouse: "Mouse",
  Touch: "Touch",
  PanView: "Pan view",
  LeftClickDrag: "Left click + drag",
  ZoomView: "Zoom view",
  RightClick: "Right click + drag, or",
  MouseWheelScroll: "Mouse wheel scroll",
  RotateView: "Rotate view",
  MiddleClickDrag: "Middle click + drag, or",
  CtrlAndClickDrag: "CTRL + Left/Right click + drag",
  OneFingerDrag: "One finger drag",
  TwoFingerPinch: "Two finger pinch",
  TiltView: "Tilt view",
  TwoFingerDragSameDirection: "Two finger drag, same direction",
  TwoFingerDragOppositeDirection: "Two finger drag, opposite direction",

  // src\control\czm\ProjectionPicker.js
  PerspectiveProjection: "Perspective Projection",
  OrthographicProjection: "Orthographic Projection",

  // src\control\czm\SceneModePicker.js
  _2D: "2D",
  _3D: "3D",
  ColumbusView: "Columbus View",

  // src\control\czm\VRButton.js
  EnterVRMode: "Enter VR mode",
  ExitVRMode: "Exit VR mode",
  VRModeIsUnavailable: "VR mode is unavailable",

  // src\control\Zoom.js
  _放大: "Zoom In",
  _缩小: "Zoom Out",

  // src\control\ClockAnimate.js
  _暂停: "Pause",
  _继续: "Continue",

  // src\control\Compass.js
  _导航球: "Navigation ball",
  _拖拽调整俯仰角: "Drag to adjust pitch Angle",
  _拖拽调整四周方向角: "Drag to adjust the Heading Angle, double-click to return to true north",

  // 右键菜单 src\map\core\getDefaultContextMenu.js
  _查看此处坐标: "Location info",
  _位置信息: "The location information",
  _经度: "Lon",
  _纬度: "Lat",
  _海拔: "Alt",
  _横坐标: "X",
  _纵坐标: "Y",

  _查看当前视角: "Camera info",
  _当前视角信息: "Current Camera Information",

  _视角切换: "Camera",
  _禁止进入地下: "Do not go underground",
  _允许进入地下: "Access to the ground",
  _绕此处环绕飞行: "Fly around here",
  _关闭环绕飞行: "Close off circling",
  _移动到此处: "Move it over here",
  _第一视角站到此处: "First view is here",
  _开启键盘漫游: "Enable keyboard roaming",
  _关闭键盘漫游: "Turn off keyboard roaming",
  _跟踪锁定: "TrackedEntity",
  _取消锁定: "Unlocked",

  _图层: "Layer",
  _显示三角网: "Display Wireframe",
  _关闭三角网: "Close Wireframe",
  _显示包围盒: "Display BoundingVolume",
  _关闭包围盒: "Close BoundingVolume",

  _地形: "Terrain",
  _开启地形: "Open terrain",
  _关闭地形: "Close terrain",

  _图上标记: "Drawing",
  _标记点: "Mark points",
  _标记线: "Tag line",
  _标记面: "Mark surface",
  _标记圆: "Mark round",
  _标记矩形: "Mark rectangular",
  _允许编辑: "Allowed to edit",
  _禁止编辑: "Prohibit to edit",
  _导出JSON: "Export JSON",
  _导入文件: "Import JSON",
  _清除标记: "Clear",

  _特效效果: "Effects",
  _开启下雨: "Enable rain",
  _关闭下雨: "Close rain",
  _开启下雪: "Enable snow",
  _关闭下雪: "Close snow",
  _开启雾天气: "Enable fog",
  _关闭雾天气: "Close fog",
  _开启泛光: "Enable bloom",
  _关闭泛光: "Close bloom",
  _开启亮度: "Enable brightness",
  _关闭亮度: "Close brightness",
  _开启夜视: "Enable night vision",
  _关闭夜视: "Close night vision",
  _开启黑白: "Enable black and white",
  _关闭黑白: "Close black and white",
  _开启拾取高亮: "Enable Pick highlighted",
  _关闭拾取高亮: "Close Pick highlighted",

  _场景: "Scene",
  _开启深度监测: "Enable depth test against terrain",
  _关闭深度监测: "Close depth test against terrain",
  _显示星空背景: "Enable skyBox",
  _关闭星空背景: "Close skyBox",
  _开启日照阴影: "Enable shadow",
  _关闭日照阴影: "Close shadow",
  _开启大气渲染: "Enable sky atmosphere",
  _关闭大气渲染: "Close sky atmosphere",
  _场景出图: "Export image",

  _图上量算: "Measure",
  _删除测量: "Delete",

  // 图上量算 tooltip
  _角度: "Angle",
  _距离: "Distance",
  _面积: "Area",
  _总长: "Total distance",
  _起点: "Start",
  _高度差: "Height difference",
  _空间距离: "Space distance",
  _水平距离: "Horizontal distance",
  _正在计算体积: "Calculating volume",
  _填方体积: "The volume of fill",
  _挖方体积: "Excavation volume",
  _横切面积: "Crosscutting area",
  _面上: "Up",
  _面下: "Down",
  _米: "m",
  _公里: "km",
  _万米: "myriametre",
  _海里: "mile",
  _丈: "zhang",
  _平方米: "m²",
  _平方公里: "km²",
  _亩: "mu",
  _公顷: "ha",
  _立方米: "m³",
  _万立方米: "wm³",
  _秒: "S",
  _分钟: "M",
  _小时: "H",

  // 标绘 tooltip
  _单击开始绘制: "Click to start drawing",
  _单击完成绘制: "Click to finish drawing",
  _双击完成绘制: "Double click to finish drawing",
  _单击增加点: "left click add point",
  _右击删除点: "right click delete point",

  _单击后激活编辑: "Click to activate editing",
  _右击菜单删除: "Right click menu to delete",
  _更多功能请右击: "For more functions, right click",

  _停止编辑: "Stop editing",
  _删除该点: "Delete that point",
  _按轴平移: "Translation by axis",
  _停止按轴平移: "Stop translation along axis",
  _按轴旋转: "Rotation on axis",
  _停止按轴旋转: "Stop rotation on axis",
  _调整比例: "Edit Scale",
  _停止调整比例: "Stop edit scale",

  _释放后完成修改: "Complete the modification after release",
  _该对象不允许编辑: "This object does not allow editing",
  _拖动该点后: "Drag that point",
  _拖动对象后: "Drag that object",
  _修改位置: "Modify the position",
  _整体平移: "The overall translation",
  _增加点: "Add point",
  _修改高度: "Modify the height",
  _修改半径: "Modify the radius",
  _修改长度: "Modify the length(X direction )",
  _修改宽度: "Change the width(Y direction)",
  _修改方向: "Change direction",
  _修改缩放比例: "Modify the Scale",
  _无法删除不能少于最小点数: "Cannot delete, the number of dots cannot be less than",
  _删除: "Delete",
  _半径: "Radius",

  // src\graphic\entity\ModelEntity.js
  _加载模型中: "Load Model…"
}
