import { createRoot, Root } from "react-dom/client"
import { LucidePause, LucidePlay } from "lucide-react"
import { getMMSS } from "@/lib/utils"
import * as log from "@/lib/logger"
import { listArtists } from "@/elements/search-list"
import { audio, next } from "@/backend/audio"
import "@/css/controls.css"


let mouseDown = false
let mouseX: number
let ctrlReady = false
let progress: HTMLProgressElement // progress bar
let cover: Root
let detailsRoot: Root
let pauseBtn: Root
let ctrlUpdate: any

export function startCtrl(id: number) {
	log.info(`start music: ${id}`)
	if (cover == undefined) cover = createRoot(document.getElementsByClassName('cover')[0] as HTMLElement)
	if (detailsRoot == undefined) detailsRoot = createRoot(document.getElementsByClassName("details")[0])
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
			detailsRoot.render(<><h1>{result.name}</h1><small>{listArtists(result.artists)}</small></>)
			const duration = (result.duration) / 1000
			log.info(`music: ${result.name}  duration: ${duration}  cover_url: ${result.album.picUrl}`)
			startProgress(duration)
		})
}

export function clearCtrlDetails() {
	try {
		cover.render(<></>)
		detailsRoot.render(<h1>Not Playing</h1>)
		window.clearInterval(ctrlUpdate)
		progress.max = 100
		progress.value = 0
		document.querySelector('.total')!.innerHTML = "--:--"
		document.querySelector('.played')!.innerHTML = "--:--"
	} catch (_) { }
}

function startProgress(duration: number) {
	log.debug("starting progressbar")
	window.clearInterval(ctrlUpdate)
	// progress
	progress.max = duration // max value of progress bar == audio duration
	document.querySelector('.total')!.innerHTML = getMMSS(duration) // human readable duration under progress bar
	ctrlUpdate = setInterval(() => {
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

function initProgress() {
	log.debug("init progress bar")

	// progress bar
	// mouse-based progress bar dragging
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

	// touch-based progress bar dragging
	progress.addEventListener('touchstart', function (event) {
		mouseX = event.touches[0].clientX
		mouseDown = true
	})

	progress.addEventListener('touchmove', function (event) {
		mouseX = event.touches[0].clientX
	})

	progress.addEventListener('touchend', function () {
		mouseDown = false
		audio.currentTime = progress.value
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
	try {
		audio.pause()
		pauseBtn.render(<LucidePlay />)
	} catch (_) { }
}
