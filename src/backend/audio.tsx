import { clearCtrlDetails, pause, play, startCtrl } from "@/elements/controls"
import { refreshPlaylist } from "@/elements/playlist"
import * as log from "@/lib/logger"


interface Song {
	id: number;
	name: string;
	// add other properties if needed
}

export let playlist: Song[] = []
export let playing = -1
export let audio: HTMLAudioElement

export function addToPlaylist(result: any, immediate: boolean = false) {
	log.info(`add to playlist: ${result.name}`)
	playlist.splice(playing + 1, 0, result)
	if (immediate) {
		playing++
		startMusic(playing)
	}
	refreshPlaylist()
}

export function delFromPlaylist(index: number) {
	log.info(`delete from playlist: ${playlist[index].name}`)
	playlist.splice(index, 1)
	if (index == playing && playing < playlist.length) {
		startMusic(playing)
	} else if (index == playing && playing == playlist.length && playlist.length != 0) {
		playing--
		startMusic(playing)
	} else if (playlist.length == 0) {
		playing = -1
		pause()
		clearCtrlDetails()
	} else if (index != playing && index < playing) {
		playing--
	}
	refreshPlaylist()
}

export function turnToPlaylist(index: number) {
	log.info(`turn to playlist: ${playlist[index].name}`)
	playing = index
	refreshPlaylist()
	startMusic(playing)
}

export function startMusic(index: number) {
	const song: any = playlist[index]
	const id = song.id
	if (audio == undefined) audio = new Audio(`https://music.163.com/song/media/outer/url?id=${id}.mp3`)
	else audio.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
	audio.pause()
	startCtrl(id)
	play()
}

export function previous() {
	log.info("previous")
	if (playing - 1 >= 0) {
		playing--
		startMusic(playing)
	}
	refreshPlaylist()
}

export function next() {
	log.info("next")
	if (playing + 1 <= playlist.length - 1) {
		playing++
		startMusic(playing)
	}
	refreshPlaylist()
}
