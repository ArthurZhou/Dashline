import ReactDOM from "react-dom"
import { play, startCtrl } from "../elements/controls"

export let playlist: JSON[] = []
export let playing = 0

export let audio = new Audio("http://none")

export function addToPlaylist(result: any, immediate: boolean = false) {
    playlist.push(result)
    if (immediate) {
        startMusic(result)
    }
}

export function startMusic(result: any) {
    audio.pause()
    ReactDOM.render(
        <h1>{result.name}</h1>,
        document.getElementsByClassName("details")[0]
    )
    audio.src = `https://music.163.com/song/media/outer/url?id=${result.id}.mp3`
    startCtrl(result.id)
    play()
}
