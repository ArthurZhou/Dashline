import { LucideRefreshCcw, LucideSettings } from "lucide-react"
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


export function AppSidebar() {
	return (
		<Sidebar><SidebarContent><SidebarGroup>
			<SidebarHeader><h1>Dashline</h1></SidebarHeader>
			<SidebarGroupContent><SidebarMenu>
				<SidebarMenuItem key={"Settings"}><SidebarMenuButton onPointerDown={alert}>
					<LucideSettings /><span>Settings</span></SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem key={"Restart"}><SidebarMenuButton onPointerDown={() => { window.location.reload() }}>
					<LucideRefreshCcw /><span>Restart</span></SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar>
	)
}
