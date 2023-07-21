import { ref, uploadString, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
export const storageService = {
    upload, load
}

async function upload(file) {
    const storageRef = ref(storage, file.name);
    // uploadString(storageRef,base64, 'base64url').then((snapshot) => {
    //     console.log('Uploaded a base64 string!');
    // });
   // https://firebasestorage.googleapis.com/v0/b/chattripaftetthearmy.appspot.com/o/1.jpg?alt=media&token=a2dd93ea-5fad-4438-8663-4c6bd10ebbd1&_gl=1*14q81sp*_ga*MTc5OTg5MTY5LjE2Njc5ODg1NzY.*_ga_CW55HF8NVT*MTY4NTg5OTg4Ny4xMC4xLjE2ODU5MDExMjMuMC4wLjA.
    //https://firebasestorage.googleapis.com/v0/b/chattripaftetthearmy.appspot.com/o/WhatsApp%20Image%202022-07-04%20at%2011.50.16.jpeg?alt=media&token=23f545b9-b640-4592-b6ef-df58f50c039e&_gl=1*hr618x*_ga*MTc5OTg5MTY5LjE2Njc5ODg1NzY.*_ga_CW55HF8NVT*MTY4NTg5OTg4Ny4xMC4xLjE2ODU5MDEwNjcuMC4wLjA.
    // uploadBytesResumable(storageRef, file).then((snapshot) => {
    //     return getDownloadURL(snapshot.ref)
    // }).then(downloadURL => {
    //     console.log('Download URL', downloadURL)
    // })

    const snapshot = await uploadBytesResumable(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log({ downloadURL });
    return downloadURL
}


function load() {


}