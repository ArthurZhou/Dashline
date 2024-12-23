import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { keyword } from "./search-box"
import ReactDOM from "react-dom";
import { addToPlaylist } from "../backend/audio";


export function SearchList() {
    if (keyword != undefined) {
        fetch(`https://music.163.com/api/search/get?s=${keyword}&type=1&offset=0&limit=50`)
            .then((response) => response.json())
            .then((responseJson) => {
                ReactDOM.render(
                    ListResults(responseJson.result?.songs),
                    document.getElementById('searchArea')
                )
            })
    }
}

function compressName(name: string) {
    if (name.length>=15) {
        return name.substring(0,12)+"..."
    } else {
        return name
    }
}

export function ListResults(results: any) {
    let list = []
    for (let index = 0; index < results.length; index++) {
        const result = results[index]
        list.push(<TableRow key={result.id} onDoubleClick={() => addToPlaylist(result, true)}>
            <TableCell className="font-bold">{compressName(result.name)}<br/><small>{ListArtists(result.artists)}</small></TableCell>
            <TableCell>{msToTime(result.duration)}</TableCell>
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

function msToTime(s: number) {
    function padding(num: number, length = 2) {
        return (Array(length).join("0") + num).slice(-length);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = (s % 60);
    s = (s - secs) / 60;
    var mins = s % 60;

    return padding(mins) + ':' + padding(secs);
}

function ListArtists(artists: []) {
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
