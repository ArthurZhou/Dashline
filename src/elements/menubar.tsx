import { LucideSearch } from "lucide-react"
import { Menubar, MenubarMenu } from "@/components/ui/menubar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/elements/mode-toggle"
import { SearchList } from "@/elements/search-list"
import Home, { currentPage } from "@/page"
import { show } from "@/main"

export function MenuBar() {
	return (
		<Menubar className="p-5">
			<MenubarMenu><SidebarTrigger /></MenubarMenu>
			<MenubarMenu><SearchBox /></MenubarMenu>
			<MenubarMenu><ModeToggle /></MenubarMenu>
		</Menubar>
	)
}

export let keyword: string;
function SearchBox() {
	return (
		<div className="flex w-full max-w-sm items-center space-x-2">
			<Input placeholder="Search" onChangeCapture={e => keyword = e.currentTarget.value} onKeyDown={(event) => {
				if (event.key === 'Enter') {if (currentPage != "Home") show(Home());SearchList()}
			}} />
			<Button onClick={SearchList}><LucideSearch /></Button>
		</div>
	)
}