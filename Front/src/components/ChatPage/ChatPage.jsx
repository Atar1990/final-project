import React, { useEffect, useState } from 'react'
import './ChatPage.css'
import { chatService } from '../../services/chat.service'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import TopOfAplication from '../TopOfAplication';
import Navigation from '../Navigation';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { userService } from '../../services/user.service'
import NavigationAdmin from '../NavigationAdmin'
function ChatPage({ userFromDB }) {
    const nav = useNavigate()
    const { userEmail2 } = useParams()
    const [chat, setChat] = useState()
    const [txt, setTxt] = useState('')
    useEffect(() => {
        loadChat()
    }, [])
    useEffect(() => {
        if (chat) {
            console.log({ chat });
            chat.messages.forEach((meesage) => {
                if (userFromDB.UserEmail !== meesage.userEmail)
                    chatService.updateMsg(meesage.id, userFromDB.UserEmail)
            })
            window.scrollTo(0, document.body.scrollHeight);

        }

    }, [chat])

    const handleChange = (ev) => { //לוקח את הפרמטרים ש/מזינים בפורם
        let { name, value } = ev.target;
        setTxt(value)
    };
    async function loadChat() {
        const q = await chatService.getChat(userEmail2, userFromDB.UserEmail)
        let res;

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            if (querySnapshot?.docs?.length) {
                querySnapshot.forEach(async (document) => {
                    res = { ...document.data(), id: document.id }
                    console.log({ res });
                    res.messages = res?.messages?.length ? res.messages : [];
                    const promisses = await res.messages.map(async (messageId) => {
                        const docRef = doc(db, "messages", messageId);
                        const docSnap = await getDoc(docRef);
                        const meesage = { ...docSnap.data(), id: messageId }


                        return meesage
                    })
                    res.messages = await Promise.all(promisses)
                    const users = await userService.getAll()
                    const currentUser = users.find(u => {
                        return (u.UserEmail === res.userEmail2 || u.UserEmail === res.userEmail) && (u.UserEmail !== userFromDB.UserEmail)
                    })
                    res.username = currentUser?`${currentUser?.UserFirstName} ${currentUser?.UserLastName}`:`${userFromDB?.UserFirstName} ${userFromDB?.UserLastName}`
                    setChat(res)
                });
            } else {
                console.log('else', userFromDB);
                await chatService.createChat(userEmail2, userFromDB.UserEmail)
                loadChat()
            }

        });



    }

    async function submit() {
        console.log('submit');
        await chatService.createMsg(txt, chat, userFromDB.UserEmail)
        setTxt('')
    }

    return (
        <div className='chat-page'>
            <TopOfAplication label={chat?.username || 'Chat'} />
            <br></br>
            <br></br>
            <br></br>
            <div className="messages">
                {chat && chat.messages.map((m) => {
                    let time = '10:47'

                    if (m?.createdAt) {
                        const date = new Date(m.createdAt.seconds * 1000)
                        date?.setSeconds(0)
                        time = date?.toLocaleString()?.split(' ')[1]?.split(':');
                        time = `${time[0]}:${time[1]}`
                    }
                    return <div key={m.id} className={m.userEmail === userFromDB.UserEmail ? "right-message message" : "left-message message"}   >
                        <span>  {m.txt}</span>
                        <span className={m.userEmail === userFromDB.UserEmail ? "time right-time" : "time left-time"}>{time}</span>
                    </div>
                })}
            </div>


            <div style={{ zIndex: 2, backgroundColor: 'white' }}>
                <Box onClick={submit} style={{ zIndex: 10, position: 'fixed', alignItems: 'center', bottom: 55, left: 280, right: 0, backgroundColor: 'white' }} sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab variant="extended">
                        <NavigationIcon sx={{ mr: 1 }} />
                    </Fab>
                </Box>
                <FormControl style={{ paddingBottom: 5, paddingTop: 3, zIndex: 1, position: 'fixed', alignItems: 'center', bottom: 47, backgroundColor: 'white' }} sx={{ m: 1, }} className='txt-input' variant="outlined">
                    <OutlinedInput
                        onInput={handleChange}
                        multiline={true}
                        name='txt'
                        label=""
                        dir='rtl'
                        value={txt}
                    />
                </FormControl>
            </div>

            <br></br>
            <br></br>
{userFromDB.UserEmail==="admin@gmail.com"?<NavigationAdmin/>:<Navigation/>}

        </div>
    )
}

export default ChatPage