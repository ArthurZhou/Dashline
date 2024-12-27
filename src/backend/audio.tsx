import { play, refreshPlaylist, startCtrl } from "../elements/controls"

export let playlist: JSON[] = []
export let playing = -1
export let audio: HTMLAudioElement


export function addToPlaylist(result: any, immediate: boolean = false) {
    playlist.splice(playing+1, 0, result)
    playing++
    if (immediate) {
        startMusic(playing)
    }
    refreshPlaylist()
}

export function turnToPlaylist(index: number) {
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
    if (playing-1>=0) {
        playing--
        startMusic(playing)
    }
    refreshPlaylist()
}

export function next() {
    if (playing+1<=playlist.length-1) {
        playing++
        startMusic(playing)
    }
    refreshPlaylist()
}
