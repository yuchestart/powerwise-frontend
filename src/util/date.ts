/**
 * This converts a date into a fully ISO-8601 compliant string, which is only accepted by FastAPI
 * @param date The date
 * @returns 
 */
export function toISOString(date:Date){
    return `${
        date.getFullYear().toString().padStart(4,'0')
    }-${
        (date.getMonth()+1).toString().padStart(2,'0')
    }-${
        (date.getDate()).toString().padStart(2,'0')
    }T${
        date.getHours().toString().padStart(2,'0')
    }:${
        date.getMinutes().toString().padStart(2,'0')
    }:${
        date.getSeconds().toString().padStart(2,'0')
    }Z`
}

export function toDateString(date:Date){
    return `${
        date.getFullYear().toString().padStart(4,'0')
    }-${
        (date.getMonth()+1).toString().padStart(2,'0')
    }-${
        (date.getDate()).toString().padStart(2,'0')
    }`
}

export function toTimeString(date:Date){
    return `${
        date.getHours().toString().padStart(2,'0')
    }:${
        date.getMinutes().toString().padStart(2,'0')
    }:${
        date.getSeconds().toString().padStart(2,'0')
    }`
}

export function toHrString(date:Date){
    return `${
        (date.getHours()%12).toString().padStart(2)
    }:${
        date.getMinutes().toString().padStart(2,'0')
    } ${date.getHours() < 12 ? "AM" : "PM"}`
}

export function roundToHour(date:Date):Date{
    return new Date(Math.floor(date.getTime()/HOUR) * HOUR);
}

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;