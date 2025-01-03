import { createRoot, Root } from "react-dom/client"
import { v4 as uuid } from "uuid"
import { playlist, playing, turnToPlaylist, delFromPlaylist } from "@/backend/audio"
import * as log from "@/lib/logger"
import "@/css/playlist.css"
import { Button } from "@/components/ui/button"
import { LucideX } from "lucide-react"


let playlistRoot: Root
let playlistElement: HTMLElement

export function refreshPlaylist() {
    if (playlistRoot == undefined) playlistRoot = createRoot(document.querySelector('.playlist') as HTMLElement)
    let list = []

    for (let index = 0; index < playlist.length; index++) {
        const result: any = playlist[index]
        const id = uuid()
        let highlighted = ""
        if (index == playing) highlighted = "highlight"
        list.push(<li id={id} onDoubleClick={(event: any) => {
            const allSongs = document.querySelectorAll(".song-in-list")
            for (let index = 0; index < allSongs.length; index++) {
                const song: any = allSongs[index]
                if (song.id == event.target.id) turnToPlaylist(index)
            }
        }} className={highlighted + " " + "song-in-list"} key={id}>{result.name} <Button id={id} onClick={(event: any) => {
            const allSongs = document.querySelectorAll(".song-in-list")
            for (let index = 0; index < allSongs.length; index++) {
                const song: any = allSongs[index]
                if (song.id == event.target.id) delFromPlaylist(index)
            }
        }}><LucideX /></Button> </li>)
    }

    playlistRoot.render(<ul>{list}</ul>)
}

export function showPlaylist() {
	if (playlistElement == undefined) initPlaylist()
	else {
		if (playlistElement.style.height == "70%") {
			playlistElement.style.height = "0px"
			playlistElement.style.padding = "0px"
		}
		else if (playlistElement.style.height == "0px") {
			playlistElement.style.height = "70%"
			playlistElement.style.padding = "10px"
		}
	}
}

function initPlaylist() {
	log.debug("init playlist")

	let mouseOverList = false
	let mouseOverBtn = true

	playlistElement = document.querySelector('.playlist') as HTMLElement
	playlistElement.style.height = "70%"
	playlistElement.style.padding = "10px"

	// close list when clicked outside
	playlistElement.addEventListener('mouseover', function () {
		mouseOverList = true
	})
	playlistElement.addEventListener('mouseleave', function () {
		mouseOverList = false
	})
	document.querySelector('.playlist-btn')?.addEventListener('mouseover', function () {
		mouseOverBtn = true
	})
	document.querySelector('.playlist-btn')?.addEventListener('mouseleave', function () {
		mouseOverBtn = false
	})
	window.addEventListener('click', function () {
		if (!mouseOverList && !mouseOverBtn && playlistElement.style.height == "70%") showPlaylist()
	});

	// close list when touch outside
	window.addEventListener('touchstart', function (event) {
		const touchX = event.touches[0].clientX
		const touchY = event.touches[0].clientY
		const playlistRect = playlistElement.getBoundingClientRect()
		mouseOverList = touchX > playlistRect.left && touchX < playlistRect.right && touchY > playlistRect.top && touchY < playlistRect.bottom

		const btnRect: any = document.querySelector('.playlist-btn')?.getBoundingClientRect()
		mouseOverBtn = touchX > btnRect.left && touchX < btnRect.right && touchY > btnRect.top && touchY < btnRect.bottom
		
		if (!mouseOverList && !mouseOverBtn && playlistElement.style.height == "70%") showPlaylist()
	});
}
