import {
    Menubar,
    MenubarMenu,
} from "@/components/ui/menubar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { SearchBox } from "./search-box"

export function MenuBar() {
    return (
        <Menubar className="p-5">
            <MenubarMenu><SidebarTrigger /></MenubarMenu>
            <MenubarMenu><SearchBox /></MenubarMenu>
            <MenubarMenu><ModeToggle /></MenubarMenu>
        </Menubar>
    )
}