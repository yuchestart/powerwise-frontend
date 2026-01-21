"use client";

import {useContext,createContext,useState, useRef, useEffect} from "react";

const ThemeContext = createContext<"light"|"dark">("light");

export function useTheme(){
    return useContext(ThemeContext);
}

export default function ThemeManager({children}){
    const [theme,setTheme] = useState<"light"|"dark">("light");
    const mediaQueryRef = useRef(null);
    useEffect(()=>{
        mediaQueryRef.current = window.matchMedia('(prefers-color-scheme:dark)');
        setTheme(mediaQueryRef.current.matches ? 'dark' : 'light')
        mediaQueryRef.current.addEventListener('change',(e)=>{
            setTheme(e.matches ? 'dark' : 'light');
        })
    },[]);

    return <ThemeContext.Provider value={theme}>
        {children}
    </ThemeContext.Provider>
}