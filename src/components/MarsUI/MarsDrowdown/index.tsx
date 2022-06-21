import { Menu, Dropdown } from "antd"
import type { DropdownProps } from "antd/lib/dropdown"
import "./dropdown.less"

export const MarsMenu = Menu

export const MarsDropdown = ({ className, ...props }: DropdownProps & { className?: string }) => {
  return <Dropdown overlayClassName="mars-dropdown-menu" {...props}></Dropdown>
}
