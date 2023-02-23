import handleResponse from "./handleResponse";

const uploadMultipleAttachments = async<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST',
    newAttachments: FileList,
    handleResponseCallback: (data: T) => void,
    otherData: object = {},
    mode: 'thumbnail' | 'attachments' = 'attachments'
) => {
    let attachments = [];
    let thumbnail: string | ArrayBuffer;
    
    const request = async() => {
        await handleResponse<T>(
            endpoint,
            {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    [mode]: mode === 'attachments' ? attachments : thumbnail,
                    ...otherData
                },
                errorMessage: 'Could not attach files'
            },
            (json) => { handleResponseCallback(json) },
        );
    }

    const read = async(i=0) => {
        if (newAttachments === undefined || newAttachments.length === 0) {
            await request();
            return;
        }
        
        if(i < newAttachments.length) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (mode === 'attachments') attachments.push(reader.result);
                else {
                    if (thumbnail !== undefined) i = newAttachments.length;
                    thumbnail = reader.result;
                }
                read(i+1);
            }
            reader.readAsDataURL(newAttachments[i]);
        } else {
            request();
        }
    }

    read();
}

export default uploadMultipleAttachments