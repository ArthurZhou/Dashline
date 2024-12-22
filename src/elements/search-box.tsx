import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"
import type { LucideIcon } from 'lucide-react';
import { SearchList } from "./list";
interface ButtonProps {
    icon: LucideIcon
}
export let keyword: string;
const IconButton = ({ icon: Icon }: ButtonProps) => <Button onClick={SearchList}><Icon /></Button>;

export function SearchBox() {
    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="search" placeholder="Search" onChangeCapture={e => keyword=e.currentTarget.value} />
            <IconButton icon={Search} />
        </div>
    )
}