import ReactDOM from "react-dom"
import { LucidePause, LucidePlay } from "lucide-react"

export let playlist: JSON[] = []
export let playing = 0
export let audio = new Audio("http://none")

export function addToPlaylist(result: any, immediate: boolean = false) {
    playlist.push(result)
    if (immediate) {
        startMusic(result)
    }
}

function startMusic(result: any) {
    audio.pause()
    audio.src = `https://music.163.com/song/media/outer/url?id=${result.id}.mp3`
    ReactDOM.render(
        <img src="http://p2.music.126.net/0vXaGbemth0GEhORjDaYAw==/109951166563280906.jpg?param=130y130" /> ,
        document.getElementsByClassName("cover")[0]
    )
    ReactDOM.render(
        <h1>{result.name}</h1>,
        document.getElementsByClassName("details")[0]
    )
    play()
}

export function play() {
    if (audio.src!=="http://none/") {
        ReactDOM.render(
            <LucidePlay />,
            document.getElementsByClassName("pause")[0]
        )
        audio.play()
    }
}

export function pause() {
    audio.pause()
    ReactDOM.render(
        <LucidePause />,
        document.getElementsByClassName("pause")[0]
    )
}