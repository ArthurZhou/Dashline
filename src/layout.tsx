import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css";
import { AppSidebar } from "./elements/app-sidebar";
import { MenuBar } from "./elements/menubar";
import { Button } from "./components/ui/button";
import { LucidePause, LucideSkipBack, LucideSkipForward } from "lucide-react";
import { audio } from "./backend/audio";
import { pause, play } from "./elements/controls";

function calcCtrlItems() {
  let isMobile = null;

  if (typeof window !== "undefined") {
    isMobile = window.innerWidth < 400;
  }
  if (!isMobile) {
    return (<><div className="cover"></div><div className="details"><h1>Not playing</h1></div></>)
  } else {
    return (<></>)
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <SidebarProvider>
            <AppSidebar />
            <div className="controls">
              <div className="progress">
                <progress value="0" max="100"></progress>
                <div className="interval"><p className="played"></p><p className="total"></p></div>
              </div>
              {calcCtrlItems()}
              <div className="ctrls">
                <Button className="ctrl back"><LucideSkipBack /></Button>
                <Button className="ctrl pause" onClick={() => {
                  if (audio.paused) {
                    play()
                  } else {
                    pause()
                  }
                }}><LucidePause /></Button>
                <Button className="ctrl forward"><LucideSkipForward /></Button>
              </div>
            </div>
            <main style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              <MenuBar />
              {children} {/* Here is the page content */}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
