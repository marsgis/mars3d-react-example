/// <reference types="vite/client" />
/**
 * 统一定义ts模块类型
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2022-01-01
 */

declare module "nprogress" {
  const nprogress: any
  export default nprogress
}

declare module "uuid" {
  export const v4: any
}

// declare module "mars3d" {
//   export * from "@mars/common/mars3d-sdk/dist/mars3d"
// }
