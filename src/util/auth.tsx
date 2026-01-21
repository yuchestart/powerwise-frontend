'use client';
import { createContext } from "react";

export const AuthContext = createContext({});

export function AuthManager(){
    return <AuthContext.Provider value={{}}></AuthContext.Provider>
}

export async function fetchWithAuth(input:string|URL|Request,init?:RequestInit){
    //TODO: Implement auth
    return fetch(input,init)
}