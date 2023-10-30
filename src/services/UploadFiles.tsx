import storage from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

let files:any[] = [];

export const selectFile = (event:any) => {
    files = Array.from(event.target.files);
    return files;
}

export const uploadFile = (userId:any) => {
    const uploadPromises = files.map((file: any) => {
        const fileName = `${uuidv4()}-${file.name}`;
        const fileRef = ref(storage, `User ${userId}/${fileName}`);
        if(files.find((e) => e.type === 'video/x-matroska') !== undefined) {
            return 'No podés subir archivos .mkv';
        } else {
            const task = uploadBytesResumable(fileRef, file);

            return task.then(async () => {
                const URL = await getDownloadURL(fileRef);
                return {dataType: file.type, URL}
            });
        
        }
    });
    return Promise.all(uploadPromises)
}