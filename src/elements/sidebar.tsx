import { LucideHome, LucideRefreshCcw, LucideSettings } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Home from "@/page"
import { show } from "@/main"


export function AppSidebar() {
	return (
		<Sidebar><SidebarContent><SidebarGroup>
			<SidebarHeader><h1>Dashline</h1></SidebarHeader>
			<SidebarGroupContent><SidebarMenu>
				<SidebarMenuItem key={"Home"}><SidebarMenuButton onPointerDown={() => { show(Home()) }}>
					<LucideHome /><span>Home</span></SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem key={"Settings"}><SidebarMenuButton onPointerDown={alert}>
					<LucideSettings /><span>Settings</span></SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem key={"Restart"}><SidebarMenuButton onPointerDown={() => { window.location.reload() }}>
					<LucideRefreshCcw /><span>Restart</span></SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar>
	)
}
