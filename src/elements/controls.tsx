import ReactDOM from "react-dom"
import { audio } from "../backend/audio"
import { LucidePause, LucidePlay } from "lucide-react"

let mouseDown: boolean
let mouseX: number
let ctrlReady = false
let progress: HTMLProgressElement // progress bar


function getMMSS(seconds: number) { // convert seconds to HH:MM:SS
    const minute = Math.floor(seconds/60)
    const second = Math.floor(seconds-minute*60)
    return minute.toString().padStart(2, "0")+":"+second.toString().padStart(2, "0");
}

function getSeconds(timeTxt: string) { // 
    let slice1 = timeTxt.split(':')
    let slice2 = slice1[1].split('.')
    return (parseInt(slice1[0])) * 60 + (parseInt(slice2[0])) + (parseInt(slice2[1])) / 100;
}

export function startCtrl(id: number) {
    if (!ctrlReady) {
        progress = document.querySelector('.progress')?.children[0] as HTMLProgressElement
        initCtrl()
    }
    fetch(`https://music.163.com/api/song/detail?ids=[${id}]`)
        .then((response) => response.json())
        .then((responseJson) => {
            ReactDOM.render(
                <img src={responseJson.songs[0].album.picUrl} />,
                document.getElementsByClassName('cover')[0]
            )
            const duration = (responseJson.songs[0].duration)/1000
            initProgress(duration)
        })
}

function initProgress(duration: number) {
    // progress
    progress.max = duration // max value of progress bar == audio duration
    document.querySelector('.total')!.innerHTML = getMMSS(duration) // human readable duration under progress bar
    const ctrlUpdate = setInterval(() => {
        if (mouseDown == false) { // if progress bar has not been dragged manually
            progress.value = audio.currentTime // progress bar value == current time of audio
        }
        document.querySelector('.played')!.innerHTML = getMMSS(audio.currentTime) // humanreadable play time under bar
        if (Math.ceil(duration*10)/10 == Math.ceil(audio.currentTime*10)/10 && audio.paused == false) { // when playback finished
            pause()
            window.clearInterval(ctrlUpdate)
        }
    }, 100) // update frequently
}

export function initCtrl() {
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
    console.log("Playback started")
    if (audio.src !== "http://none/") {
        ReactDOM.render(
            <LucidePlay />,
            document.getElementsByClassName("pause")[0]
        )
        audio.play()
    }
}

export function pause() {
    console.log("Playback paused")
    audio.pause()
    ReactDOM.render(
        <LucidePause />,
        document.getElementsByClassName("pause")[0]
    )
}