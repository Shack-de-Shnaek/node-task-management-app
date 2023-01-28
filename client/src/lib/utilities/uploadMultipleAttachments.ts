import handleResponse from "./handleResponse";

const uploadMultipleAttachments = async<T>(
    endpoint: string,
    method: string='POST',
    newAttachments: FileList,
    handleResponseCallback: (data: T) => void,
    otherData: object={}  
) => {
    let attachments = [];
    
    const request = async() => {
        try {
            const res = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    attachments: attachments,
                    ...otherData
                })
            });
            handleResponse<T>(res, (json) => {
                handleResponseCallback(json);
            });
        } catch (e) {
            alert('Could not attach files');
            console.log(e);
        }
    }

    const read = async(i=0) => {
        if (newAttachments === undefined || newAttachments.length === 0) {
            await request();
            return;
        }
        
        if(i < newAttachments.length) {
            const reader = new FileReader();
            reader.onloadend = () => {
                attachments.push(reader.result);
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