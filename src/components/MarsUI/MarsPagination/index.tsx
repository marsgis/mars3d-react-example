import { Pagination } from "antd"
import type { PaginationProps } from "antd/lib/pagination"
import classNames from "classnames"
import "./index.less"

export const MarsPagination = ({ className, ...props }: PaginationProps & { className?: string }) => {
  return (
    <Pagination
      className={classNames({
        "mars-pagination": true,
        [className]: className
      })}
      {...props}
    ></Pagination>
  )
}
