export default function Button({title=null,children=null,onClick=null}){
    return <button onClick={onClick} className={
        `bg-foreground2 text-background py-1.5 px-2.5 text-center
        hover:bg-foreground-hover transition-colors active:bg-gray font-medium text-sm
        rounded-lg cursor-pointer`}
        title={title}
    >
        {children}
    </button>
}