import type {ReactNode} from "react";

export const NAVBAR_HEIGHT = 64;

function NavLink({ to, name }: { to: string, name: ReactNode }) {
    return <a
        href={to}
        className="text-sm no-underline text-inherit hover:underline"
    >
        {name}
    </a>
}

export default function Navbar() {
    return (
        <header
            role="navigation"
            aria-label="Main navigation"
            className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-background backdrop-blur-sm shadow-sm"
        >
            <div className="flex gap-4">
                <div className="flex items-center gap-3">
                    <a href="/dashboard" className="text-inherit no-underline font-semibold">
                        PowerWise
                    </a>
                </div>
                <nav aria-label="Primary" className="flex gap-4 items-center">
                    <NavLink to="/about" name="About Us"></NavLink>
                    <NavLink to="/privacy" name="Privacy Policy & Terms of Service"></NavLink>
                </nav>
            </div>
            {/*
            <div>
                <NavLink to="/login" name={
                    <img src="/placeholder.svg" className="h-6" title="Login"></img>
                }></NavLink>
            </div>*/}
        </header>
    );
}