import { db } from "../firebase";
import { addDoc, and, collection, doc, getDoc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { userService } from "./user.service";
export const chatService = {
    getAllChats,
    getChat,
    createMsg,
    createChat,
    updateMsg,
    loadFullChats,
    getAllMsgs
}



async function getAllChats() {
    try {
        const chats = []
        const users = await userService.getAll()
        console.log({ users });
        const querySnapshot = await getDocs(collection(db, "chats"));
        querySnapshot.forEach((doc) => {
            const chat = { ...doc.data(), id: doc.id }
            const currentUser = users.find(u => u.UserEmail === chat.userEmail2)
            console.log({ currentUser });
            chat.username = `${currentUser?.UserFirstName} ${currentUser?.UserLastName}`
            chats.push(chat)
        });
        console.log({ chats });
        return chats
    } catch (e) {
        console.log("Error getting cached document:", e);
    }
}

async function loadFullChats(UserEmail) {
    //   return await getDocs(collection(db, "chats"));
    return query(collection(db, "chats"),
        or(
            where("userEmail", "==", UserEmail),
            where("userEmail2", "==", UserEmail),
        ))

}

async function getAllMsgs() {
    return await query(collection(db, "messages"));
}

// 1.get all chats 
// 2.loop chats, and check each msgs if have isRead=false.
//     3.get the chat the have the unread msg and present on the screen.


async function createMsg(txt, chat, userEmailFromDB) {
    // create msg into firebase collection
    const docRef = await addDoc(collection(db, "messages"), {
        txt,
        userEmail: userEmailFromDB,
        isRead: false,
        createdAt: new Date()
    });
    // get the current  chat
    const chatRef = doc(db, "chats", chat.id);
    //update the current chat with the new msg
    await updateDoc(chatRef, {
        messages: [...chat.messages?.map(m => m.id) || [], docRef.id]
    });
    return
}


async function updateMsg(msgId) {
    const messageRef = doc(db, "messages", msgId);
    await updateDoc(messageRef, {
        isRead: true
    });
}

async function getChat(userEmail2, userEmailFromDB) {

    try {


        return query(collection(db, "chats"),
            or(
                and(
                    where("userEmail2", "==", userEmail2),
                    where("userEmail", "==", userEmailFromDB)
                ),
                and(
                    where("userEmail2", "==", userEmailFromDB),
                    where("userEmail", "==", userEmail2)
                ))
        );


        // const chatSnapShot = await getDocs(q);
        // return chatSnapShot


    } catch (e) {
        console.log("Error getting cached document:", e);
    }
}


async function createChat(userEmail2, userEmailFromDB) {
    const docRef = await addDoc(collection(db, "chats"), {
        userEmail2,
        userEmail: userEmailFromDB,
        messages: []
    });
}
// const q = query(collection(db, "cities"), where("state", "==", "CA"));
// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   const cities = [];
//   querySnapshot.forEach((doc) => {
//       cities.push(doc.data().name);
//   });
//   console.log("Current cities in CA: ", cities.join(", "));
// });



