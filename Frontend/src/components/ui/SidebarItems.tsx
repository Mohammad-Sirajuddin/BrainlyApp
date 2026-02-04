import type { ReactElement } from "react";

export interface ItemProps {
    icon:ReactElement;
    text:string
    OnClick?: () => void
}

export function SideBarItems(props:ItemProps){
    return (
        <div className="flex items-center pl-4 py-3 hover:bg-gray-200 cursor-pointer hover:rounded-xl transition-all duration-200"
        onClick={props.OnClick}>
            <div className="w-6 h-6 flex items-center justify-center">
                {props.icon}
            </div>
            <p className="text-lg font-medium font-serif ml-3">{props.text}</p>
        </div>
    )
}