import clsx from "clsx";

export default function SmallButton({title=null,children=null,isDanger=false,onClick=null}){
    const classes = clsx({"bg-red-500 hover:bg-[#ff8787]":isDanger,"bg-foreground2 hover:bg-foreground-hover":!isDanger})
    return <button className={
        `${classes} text-background px-1 text-center transition-colors font-medium text-sm
        rounded-sm cursor-pointer `}
        title={title}
        onClick ={onClick}
    >
        {children}
    </button>
}