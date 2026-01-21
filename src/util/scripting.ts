export function debounce(fn: (...x: any[]) => any, time: number):(...args:any[])=>void{
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() =>
            fn.apply(this, args)
            , time)
    }
}