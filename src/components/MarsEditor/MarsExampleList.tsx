// @ts-nocheck
import { useState, useEffect, useCallback, useMemo } from "react"
import { MarsIcon } from "@mars/components/MarsUI"
import { downloadFile } from "@mars/utils/file-util"
import _ from "lodash"
import reactIcon from "./reactIcon.svg"
import "@mars/assets/style/index.less"

function getAllName(packageName, examples_list) {
  let arrNew = packageName + "功能清单："
  const qianzhui = "1."
  examples_list.forEach((item, index1) => {
    if (!item.children) {
      return
    }
    arrNew += `\n\n${qianzhui}${index1 + 1}  ${item.name}`

    item.children.forEach((item2, index2) => {
      if (!item2.children) {
        return
      }
      arrNew += `\n${qianzhui}${index1 + 1}.${index2 + 1}  ${item2.name}\n`

      item2.children.forEach((item3, index3) => {
        if (index3 === 0) {
          arrNew += `\t${item3.name}`
        } else {
          arrNew += `,${item3.name}`
        }
      })
      arrNew += "\n"
    })
  })
  return arrNew
}

function getVerDiff(examples_list) {
  let index = 0
  let arrNew = "序号,分类,子分类,功能名称,更新时间\n"

  examples_list.forEach((item) => {
    if (!item.children) {
      return
    }
    item.children.forEach((item2) => {
      if (!item2.children) {
        return
      }
      item2.children.forEach((item3) => {
        arrNew += `${++index},${item.name},${item2.name},${item3.name},${item3.date}\n`
      })
    })
  })

  return arrNew
}

const show = () => {
  const side2 = document.querySelectorAll(".sidebar-2")
  const side1Item = document.querySelectorAll(".side1-item")
  const p = document.querySelectorAll(".sidebar-1 p")
  const side2Item = document.querySelectorAll(".side2-item")
  const a = document.querySelectorAll(".a")

  for (let i = 0; i < side1Item.length; i++) {
    side1Item[i].onclick = function () {
      for (let j = 0; j < side1Item.length; j++) {
        if (i === j) {
          /* side2[j].style.display='block' */
          side1Item[j].classList.add("active1")
          side1Item[j].classList.add("active3")
          p[j].classList.add("active3")
          const x = side2[i].style.display
          if (x !== "block") {
            side2[j].style.display = "block"
          } else {
            side2[j].style.display = "none"
          }
        } else {
          side2[j].style.display = "none"
          side1Item[j].classList.remove("active1")
          side1Item[j].classList.remove("active3")
          p[j].classList.remove("active3")
        }
      }
    }
  }
  for (let i = 0; i < side2Item.length; i++) {
    side2Item[i].onclick = function () {
      for (let j = 0; j < side2Item.length; j++) {
        if (i === j) {
          side2Item[j].classList.add("active2")
          a[j].style.color = "#f08519"
          a[j].style.opacity = 1.0
        } else {
          side2Item[j].classList.remove("active2")
          a[j].style.color = "#FFFFFF"
          a[j].style.opacity = 0.6
        }
      }
    }
  }
}

function MarsExampleList({ exampleList, jump, packageName, totalCount }) {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    show()
  }, [exampleList])

  const searchList = useMemo(() => {
    const newList = _.cloneDeep(exampleList)
    newList.forEach((item) => {
      if (item.children) {
        const childrenList = []
        item.children.forEach((ite) => {
          if (ite.children) {
            const lis = []
            ite.children.forEach((itemes) => {
              if (itemes.name.search(inputValue) !== -1) {
                lis.push(itemes)
              }
            })
            ite.children = lis
          }
          if (ite.children.length !== 0) {
            childrenList.push(ite)
          }
        })
        item.children = childrenList
      }
    })

    return newList
  }, [inputValue, exampleList])

  const searchText = useCallback(
    (e) => {
      setInputValue(e.target.value)
    },
    [setInputValue]
  )

  return (
    <div className="page-wrap">
      <div className="page-box">
        {/* 侧边栏 */}
        <div className="sidebar">
          {exampleList.map((item, index) => (
            <div className="sidebar-1" key={index}>
              <div className="side1-item">
                <i className={"fa" || item.icon}></i>
                <p className="name">
                  {item.name} ({item.count})
                </p>
                <MarsIcon icon="right" size="24" fill="#fff"></MarsIcon>
              </div>
              <div className="sidebar-2">
                {item.children.map((item, index) => (
                  <div className="side2-item" key={index}>
                    <span>·</span>
                    <a className="a" href={"#" + item.id}>
                      {item.name} ({item.count})
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="download">
            <div>【共 {totalCount} 个示例】</div>
            <div>
              <p onClick={() => downloadFile(packageName + "功能清单.txt", getAllName(packageName, exampleList))}>下载功能清单.txt</p>
            </div>
            <div>
              <p onClick={() => downloadFile(packageName + "功能清单.csv", getVerDiff(exampleList))}>下载功能清单.csv</p>
            </div>
          </div>
        </div>

        {/* 主体 */}
        <div className="contain">
          {/* 搜索框 */}
          <div className={"search-wrap"}>
            <div className="search-l">
              <input value={inputValue} onChange={(e) => searchText(e)} className="search-i" color="#fff" placeholder="请输入示例名称筛选..." />
              <div className="ss-pic">
                <MarsIcon icon="search" size="24" fill="#fff"></MarsIcon>
              </div>
              <div className="clear-value" style={{ display: inputValue ? "block" : "none" }} onClick={() => setInputValue("")}>
                <MarsIcon icon="close" size="24"></MarsIcon>
              </div>
            </div>

            <div className="search-r">
              <MarsIcon className="help" icon="search" size="20" fill="#bbbbbb"></MarsIcon>
              <p className="look">查看说明</p>
              <div className="sanjiao"></div>
              <div className="sanjiao-1"></div>
              <div className="explain">
                <div className="explain-wrap">
                  <div className="sm-pic">
                    <MarsIcon icon="agreement" size="24" fill="#008aff"></MarsIcon>
                  </div>
                  <div className="sm">说明</div>
                  <div className="line1">
                    <span></span>
                  </div>
                </div>
                <p>
                  1. 您可以访问
                  <a href={`https://gitee.com/marsgis/${packageName}-vue-example`} target="_black">
                    GitHub
                  </a>
                  下载当前示例代码到本地运行
                </p>
                <p>2. 名称内有 demo 的属于存在已知问题的示例，此处仅做演示</p>
                <p>
                  3. 如果您访问体验当中发现bug问题或有好的建议，欢迎随时反馈给
                  <a href="http://marsgis.cn/weixin.html" target="_blank" rel="noreferrer">
                    我们
                  </a>
                  .
                </p>
                <p>
                  4. 如果缺少您想要的示例，可以整理需求发送邮件至
                  <a href="mailto:wh@marsgis.cn" rel="nofollow">
                    wh@marsgis.cn
                  </a>
                </p>
                <p>
                  <a target="_black" href={`https://www.npmjs.com/package/${packageName}`}>
                    <img alt="Npm version" src={`https://img.shields.io/npm/v/${packageName}.svg?style=flat&logo=npm&label=版本号`} />
                  </a>
                  &nbsp;&nbsp;
                  <a target="_black" href={`https://www.npmjs.com/package/${packageName}`}>
                    <img alt="Npm downloads" src={`https://img.shields.io/npm/dt/${packageName}?style=flat&logo=npm&label=下载量`} />
                  </a>
                  &nbsp;&nbsp;
                  <a target="_black" href={`https://github.com/marsgis/${packageName}`}>
                    <img alt="GitHub stars" src={`https://img.shields.io/github/stars/marsgis/${packageName}?style=flat&logo=github`} />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* 示例 */}

          {searchList.map((item, index) => (
            <div style={{ display: item.children.length !== 0 ? "block" : "none" }} className="big" key={index}>
              <div className="start">
                <p>
                  {item.name} ({item.children.length})
                </p>
                <div className="line">
                  <span></span>
                </div>
              </div>
              {/* 创建三维场景 */}
              {item.children.map((item1, index) => (
                <div className="three" id={item1.id} key={item1.id}>
                  <h3>
                    {item1.name} ({item1.children.length})
                    <div className="question" v-if="item1.details">
                      <MarsIcon className="icon" icon="help" size="20" fill="#bbbbbb"></MarsIcon>
                      <div className="sanjiao1"></div>
                      <div className="sanjiao2"></div>
                      <div className="tan1">
                        <p>
                          <span className="color">说明：</span>
                          {item1.details}
                        </p>
                      </div>
                    </div>
                  </h3>
                  <ul>
                    {item1.children.map(
                      (item2, index) =>
                        item2.hidden !== true && (
                          <li key={item2.id} onClick={() => jump && jump(item2)}>
                            {/* <span title="这是最近新加的功能">新</span> */}
                            <div className="pic">
                              <img src={item2.thumbnail} alt="" />
                            </div>
                            <p>
                              {item2.name}
                              {item2.hasPannel === true && (
                                <span className="iconPic">
                                  <img src={reactIcon} alt="react"></img>
                                </span>
                              )}
                              {item2.plugins && <span>[{item2.plugins}插件]</span>}
                            </p>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarsExampleList
