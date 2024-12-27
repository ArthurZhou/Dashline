import { audio, next, playing, playlist, turnToPlaylist } from "../backend/audio"
import { LucidePause, LucidePlay } from "lucide-react"
import * as log from "../lib/logger"
import { createRoot } from "react-dom/client"
import { v4 as uuid } from 'uuid'
import "../css/controls.css"

let mouseDown = false
let mouseX: number
let ctrlReady = false
let playlistDOM: any
let playlistElm: any
let progress: HTMLProgressElement // progress bar
let cover: any
let detailsDOM: any
let pauseBtn: any


function getMMSS(seconds: number) { // convert seconds to HH:MM:SS
    const minute = Math.floor(seconds / 60)
    const second = Math.floor(seconds - minute * 60)
    return minute.toString().padStart(2, "0") + ":" + second.toString().padStart(2, "0");
}

export function startCtrl(id: number) {
    log.info(`start music: ${id}`)
    if (cover == undefined) cover = createRoot(document.getElementsByClassName('cover')[0] as HTMLElement)
    if (detailsDOM == undefined) detailsDOM = createRoot(document.getElementsByClassName("details")[0])
    if (!ctrlReady) {
        log.debug("ctrls not ready yet")
        progress = document.querySelector('.progress')?.children[0] as HTMLProgressElement
        initProgress()
    }
    log.debug("fetching music info")
    fetch(`https://music.163.com/api/song/detail?ids=[${id}]`)
        .then((response) => response.json())
        .then((responseJson: { songs: any[] }) => {
            let result = responseJson.songs[0]
            cover.render(<img loading="eager" src={result.album.picUrl} />)
            detailsDOM.render(<h1>{result.name}</h1>)
            const duration = (result.duration) / 1000
            log.info(`music: ${result.name}  duration: ${duration}  cover_url: ${result.album.picUrl}`)
            startProgress(duration)
        })
}

function startProgress(duration: number) {
    log.debug("starting progressbar")
    // progress
    progress.max = duration // max value of progress bar == audio duration
    document.querySelector('.total')!.innerHTML = getMMSS(duration) // human readable duration under progress bar
    const ctrlUpdate = setInterval(() => {
        if (!mouseDown) { // if progress bar has not been dragged manually
            progress.value = audio.currentTime // progress bar value == current time of audio
        }
        document.querySelector('.played')!.innerHTML = getMMSS(audio.currentTime) // humanreadable play time under bar
        if (Math.ceil(duration * 10) / 10 == Math.ceil(audio.currentTime * 10) / 10 && audio.paused == false) { // when playback finished
            pause()
            window.clearInterval(ctrlUpdate)
            next()
        }
    }, 100) // update frequently
}

export function refreshPlaylist() {
    if (playlistDOM == undefined) playlistDOM = createRoot(document.querySelector('.playlist') as HTMLElement)
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
        }} className={highlighted+" "+"song-in-list"} key={id}>{result.name}</li>)
    }

    playlistDOM.render(<ul>{list}</ul>)
}

export function initProgress() {
    log.debug("init progress bar")

    // progress bar
    window.addEventListener('mousemove', function (event) { // return x coordinate of the mouse
        mouseX = event.clientX;
    });

    progress.addEventListener('mousedown', function () { // when mouse pressed down on progress bar, start dragging
        mouseDown = true
    })

    progress.addEventListener('mouseup', function () { // when mouse released on progress bar, stop dragging
        mouseDown = false
        audio.currentTime = progress.value // change audio time to progress bar value
    })


    // why to do this?
    // event listener can only handle mouse events triggered inside this element
    // if mouse was pressed inside bar, leave, then released outside the bar,
    // 'mouseup' event will not be triggered, and progress bar will continue following the mouse even it isn't pressed

    progress.addEventListener('mouseleave', function () { // when mouse leave progress bar, stop dragging
        if (mouseDown) { // only handle this event when mouse pressed down on bar and leave without a 'mouse up'
            mouseDown = false
            audio.currentTime = progress.value
        }
    })

    setInterval(dragBar, 100)
    ctrlReady = true
    log.debug("ctrls ready")
}

function dragBar() { // handle drag progress bar event
    if (mouseDown == true) {
        let barPos = progress.getBoundingClientRect().left
        let barLen = progress.getBoundingClientRect().right - progress.getBoundingClientRect().left
        let toPercent = (mouseX - barPos) / barLen
        progress.value = toPercent * progress.max
    }
}

export function play() {
    if (pauseBtn == undefined) {
        pauseBtn = createRoot(document.getElementsByClassName("pause")[0])
    }
    log.info("playback started")
    if (audio.src != undefined) {
        pauseBtn.render(<LucidePause />)
        audio.play()
    }
}

export function pause() {
    if (pauseBtn == undefined) {
        pauseBtn = createRoot(document.getElementsByClassName("pause")[0])
    }
    log.info("playback paused")
    audio.pause()
    pauseBtn.render(<LucidePlay />)
}

export function showPlaylist() {
    if (playlistElm == undefined) initPlaylist()
    else {
        if (playlistElm.style.height == "70%") {
            playlistElm.style.height = "0px"
            playlistElm.style.padding = "0px"
        }
        else if (playlistElm.style.height == "0px") {
            playlistElm.style.height = "70%"
            playlistElm.style.padding = "10px"
        }
    }
}

function initPlaylist() {
    let mouseOverList = false
    let mouseOverBtn = true

    playlistElm = document.querySelector('.playlist')
    playlistElm.style.height = "70%"
    playlistElm.style.padding = "10px"

    playlistElm.addEventListener('mouseover', function () {
        mouseOverList = true
    })
    playlistElm.addEventListener('mouseleave', function () {
        mouseOverList = false
    })
    document.querySelector('.playlist-btn')?.addEventListener('mouseover', function () {
        mouseOverBtn = true
    })
    document.querySelector('.playlist-btn')?.addEventListener('mouseleave', function () {
        mouseOverBtn = false
    })
    window.addEventListener('click', function () {
        if (!mouseOverList && !mouseOverBtn && playlistElm.style.height == "70%") showPlaylist()
    });
}
