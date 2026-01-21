
export default function HelpLink({ to, onClick}: { to?: string, onClick?:()=>any}) {
    return <a
        className="text-blue-500 underline hover:text-blue-300 transition-colors cursor-pointer select-none text-2xl"
        onClick={()=>{
            if(to){
                open(`/help/${to}`,"_blank")
                return;
            }
            onClick()
        }}
    >?</a>
}