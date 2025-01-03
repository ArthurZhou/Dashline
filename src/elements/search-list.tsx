import { createRoot, Root } from 'react-dom/client'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { keyword } from "@/elements/menubar"
import { addToPlaylist } from "@/backend/audio"
import * as log from "@/lib/logger"
import { compressName, getMMSS } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { LucideListPlus } from 'lucide-react'
import "@/css/search-list.css"


let searchAreaRoot: Root;

export function SearchList() {
	if (searchAreaRoot == undefined) searchAreaRoot = createRoot(document.getElementById('searchArea') as HTMLElement)
	if (keyword != undefined) {
		log.info(`searching: ${keyword}`)
		fetch(`https://music.163.com/api/search/get?s=${keyword}&type=1&offset=0&limit=50`)
			.then((response) => response.json())
			.then((responseJson) => {
				searchAreaRoot.render(ListResults(responseJson.result?.songs))
			})
	}
}

export function ListResults(results: any) {
	let list = []

	for (let index = 0; index < results.length; index++) {
		const result = results[index]
		list.push(<TableRow key={result.id} onDoubleClick={() => addToPlaylist(result, true)}>
			<TableCell className="font-bold">{compressName(result.name)}<br /><small>{listArtists(result.artists)}</small></TableCell>
			<TableCell><Button className="add-song" onClick={() => addToPlaylist(result, false)}><LucideListPlus /></Button>{getMMSS(result.duration/1000)}</TableCell>
		</TableRow>)
	}
	return (
		<div>
			<Table className="border-border w-full h-10 overflow-clip relative"
				divClassname="h-[calc(100vh-120px)] overflow-y-scroll overflow-x-hidden">
				<TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border bg-secondary">
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Length</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{list}
				</TableBody>
			</Table>
		</div>
	)
}

export function listArtists(artists: []) {
	let artistsText = []
	let wordCount = 0
	for (let index = 0; index < artists.length; index++) {
		const artist = artists[index]
		if (index != 0) {
			artistsText.push('/')
		}
		artistsText.push(<a>{artist?.["name"]}</a>)
		wordCount += artist?.["name"]["length"]
		if (wordCount >= 16) {
			artistsText.push("...")
			break
		}
	}
	return artistsText
}
