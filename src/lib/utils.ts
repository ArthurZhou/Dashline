import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getMMSS(seconds: number) { // convert seconds to HH:MM:SS
	const minute = Math.floor(seconds / 60)
	const second = Math.floor(seconds - minute * 60)
	return minute.toString().padStart(2, "0") + ":" + second.toString().padStart(2, "0");
}

export function compressName(name: string) {
	if (name.length >= 15) {
		return name.substring(0, 12) + "..."
	} else {
		return name
	}
}
