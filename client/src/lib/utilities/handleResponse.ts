import type { NestError } from "../../../../interfaces/NestError";

const handleResponse = async<T>(res: Response, callback: (json: T) => void) => {
    if(res.ok) {
        const json: T = await res.json();
        callback(json);
    } else {
        const json: NestError = await res.json();
        if (json.message !== undefined) {
            alert(json.message);
            return;
        }
        let errorText = '';
        if (json.messages !== undefined) {
            for (const message of json.messages) errorText += (message + '\n');
        }
        alert(errorText);
    }   
}

export default handleResponse; 