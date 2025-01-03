import ReactDOM from "react-dom/client";
import { useState } from "react"
import { LucideList, LucidePause, LucideSkipBack, LucideSkipForward } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/elements/sidebar"
import { MenuBar } from "@/elements/menubar"
import { pause, play, showPlaylist } from "@/elements/controls"
import { audio, next, previous } from "@/backend/audio"
import Home from "@/page";
import "@/css/globals.css"


function RenderLayout({ }) {
	let [ctrlInfoVis, setCtrlInfoVis] = useState(false)
	setInterval(() => { // check if the viewport is to narrow
		if (window != undefined) {
			const isMobile = window.innerWidth < 450
			if (isMobile && !ctrlInfoVis) {
				setCtrlInfoVis(true)
			} else if (!isMobile && ctrlInfoVis) {
				setCtrlInfoVis(false)
			}
		}
	}, 100);
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"><SidebarProvider>
			<AppSidebar />
			<div className="controls">
				<div className="progress">
					<progress value="0" max="100"></progress>
					<div className="interval"><p className="played"></p><p className="total"></p></div>
				</div>
				<div className="cover" hidden={ctrlInfoVis}></div>
				<div className="details" hidden={ctrlInfoVis}><h1>Not playing</h1></div>
				<div className="ctrls">
					<Button className="ctrl back" onClick={previous}><LucideSkipBack /></Button>
					<Button className="ctrl pause" onClick={() => {
						if (audio != undefined) { if (audio.paused) play(); else pause() }
					}}><LucidePause /></Button>
					<Button className="ctrl forward" onClick={next}><LucideSkipForward /></Button>
				</div>
				<Button className="playlist-btn" onClick={showPlaylist}><LucideList /></Button>
			</div>
			<div className="playlist"></div>
			<main style={{ width: "100%", height: "100%", overflow: "hidden" }}>
				<MenuBar />
				<div id="children"><Home /></div> {/* Here is the page content */}
			</main>
		</SidebarProvider></ThemeProvider>
	);
}

let children: ReactDOM.Root
export function show(content: JSX.Element = <Home />) {
	if (children == undefined) children = ReactDOM.createRoot(document.getElementById("children") as HTMLElement)
	children.render(content)
}


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<RenderLayout />
);
