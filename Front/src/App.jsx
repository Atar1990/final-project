import './App.css';
import Questionnaire from './components/Questionnaire';
import { useEffect, useState } from 'react';
import Question from './components/Question';
import Persona from './components/Persona';
import UserProfile from './components/UserProfile';
import Budget from './components/Budget';
import NewExpense from './components/NewExpense';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ExpensesAnalysis from './components/ExpensesAnalysis';
import Map from './components/Map';
import Login from './components/Login';
import Favorites from './components/Favorites/Favorites';
import Signup from './components/Signup';
import Episodes from './components/Episodes/Episodes';
import CreateEpisode from './components/CreateEpisode/CreateEpisode';
import EpisodePage from './components/EpisodePage/EpisodePage';
import CreateFeedback from './components/CreateFeedback/CreateFeedback';
import Diary from './components/Diary/Diary';
import FeedbackPage from './components/FeedbackPage/FeedbackPage';
import Feedbacks from './components/Feedbacks/Feedbacks';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ThanksPage from './components/ThanksPage/ThanksPage';
import { getEnv } from './utils/env';
import ChatsPage from './components/ChatsPage/ChatsPage';
import ChatPage from './components/ChatPage/ChatPage';
import Fab from '@mui/material/Fab';
import ForumIcon from '@mui/icons-material/Forum';
import { chatService } from './services/chat.service';
import { doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { userService } from './services/user.service';
import { db } from './firebase';
import { Badge } from '@mui/material';
import styled from '@emotion/styled';
import ChangePassword from './components/ChangePassword';
import ChangePasswordCom from './components/ChangePasswordCom';
import KpiCard from './components/KpiCard';
import GeographyChart from './components/GeographyChart';
import UserProfileAdmin from './components/UserProfileAdmin';
import CreateFeedbackAdmin from './components/CreateFeedbackAdmin/CreateFeedbackAdmin';
import MapAdmin from './components/MapAdmin';
import ChangePasswordComAdmin from './components/ChangePasswordComAdmin';
import NewQuestion from './components/NewQuestion/NewQuestion';
import EditFeedbackAdmin from './components/EditFeedbackAdmin/EditFeedbackAdmin';
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#f00',
    color: '#f00',
    // boxShadow:'0 0 0 20px',
    boxShadow: '0 0 0 2px ${theme.palette.background.paper}',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
function App() {
  const [userInApp, setUserInApp] = useState('');// בתאכלס, משתמש ישלח כבר מעטר, עד החיבור מביא אותו בגט לפי מיקום
  const [expensesInApp, setExpensesInApp] = useState('');/// הבאה בצורה אסינכורית את כל ההוצאות של המשתמש
  const [chatVisiable, setChatVisiable] = useState(false);/// הבאה בצורה אסינכורית את כל ההוצאות של המשתמש
  const nav = useNavigate();
  const location = useLocation();
  const chatPaths = ['/profile', '/budget', '/map', '/episodes', '/Favorites','/UserProfileAdmin']
  const [isRead, setIsRead] = useState(true)
  ////////////////////////////////////////////////////////

  const [userEmailFromDB, setUserEmailFromDB] = useState('');
  const [userFromDB, setUserFromDB] = useState('');//שינוי של עומר לשרשור היוזר
  const [userType, setUserType] = useState('');//טיים לאפ

  useEffect(() => {
    if (chatPaths.includes(location.pathname)) {
      setChatVisiable(true)
    } else {
      setChatVisiable(false)
    }
  }, [location]);

  useEffect(() => {
    const apiUrl = getEnv() + '/users/getemail/?email=Benda669@gmail.com';
    // const apiUrl = 'https://localhost:44300/users/getemail/?email=Benda669@gmail.com';
    fetch(apiUrl,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })

      })
      .then(response => {
        console.log('response= ', response);
        console.log('response statuse=', response.status);
        console.log('response.ok=', response.ok)

        return response.json()
      })
      .then(
        (result) => {
          console.log("result=", result.UserFirstName);
          setUserInApp(result); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
          console.log('first name=', result.UserFirstName)
          console.log('first name=', result.UserLastName)
          console.log('budget=', result.UserBudget)

        },
        (error) => {
          console.log("err post=", error);
        });

  }, [])

  useEffect(() => {
    console.log({ userFromDB });
    if (userFromDB)
      loadFullChats()
  }, [userFromDB])


  const loadFullChats = async () => {
    // const chats = []
    const users = await userService.getAll()

    const q = await chatService.getAllMsgs()

    onSnapshot(q, async () => {
      const querySnapshot = await chatService.loadFullChats(userFromDB.UserEmail)
      const docs = await getDocs(querySnapshot)
      const promises = await docs.docs.map(async (document) => {
        const chat = { ...document.data(), id: document.id }
        const currentUser = users.find(u => u.UserEmail === chat.userEmail2)
        chat.messages = chat?.messages?.length ? chat.messages : [];
        const promisses = await chat.messages.map(async (messageId) => {
          const docRef = doc(db, "messages", messageId);
          const docSnap = await getDoc(docRef);
          const meesage = { ...docSnap.data(), id: messageId }
          return meesage
        })
        chat.messages = await Promise.all(promisses);
        const unreadMsgs = chat.messages.filter((m) => !m?.isRead && m.userEmail !== userFromDB.UserEmail)
        chat.isRead = !unreadMsgs.length
        chat.username = `${currentUser?.UserFirstName} ${currentUser?.UserLastName}`
        console.log('added chat');
        return chat
      });


      const chats = await Promise.all(promises)
      const unReadChat = chats.find(c => {
        console.log(c.isRead);
        return !c.isRead
      });
      console.log({ unReadChat });
      setIsRead(!unReadChat)

      console.log('here after x');
    })

  }

  useEffect(() => {
    loadUser()
    const apiUrl = getEnv() + '/expenses/?email=Benda669@gmail.com'
    fetch(apiUrl,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        }),

      })
      .then(response => {
        console.log('response= ', response);
        console.log('response statuse=', response.status);
        console.log('response.ok=', response.ok)

        return response.json()
      })
      .then(
        (result) => {
          console.log("fetch get user by id=", result);
          setExpensesInApp(result); // השמה של המשתמש שהגיע מהדאטה בייס להמשך עבודה בצד שרת
          console.log('UserEmail', result[0].UserEmail)
          console.log('ExpensesTitle=', result[0].ExpensesTitle)
          console.log(result.length);
          const lengthOfArr = result.length;

        },
        (error) => {
          console.log("err post=", error);
        });
  }, [])



  const getUserEmail = (email) => {
    setUserEmailFromDB(email)
    console.log('get send email !!')
    console.log(email)
  }

  const getUser = (user) => {
    setUserFromDB(user)
    console.log('get send user !!')
    console.log(user)
  }

  const loadUser = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setUserFromDB(user)
      setUserEmailFromDB(user.UserEmail)

    } else {
      nav('/')
    }
  }




  return (
    <div className="App" >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="App-characterizatin">

          <Routes>
            <Route path="/" element={<Login getEmail={getUserEmail} getUser={getUser} />} />
            <Route path='/ChangePassword' element={<ChangePassword />} />
            <Route path='/ChangePasswordCom' element={<ChangePasswordCom userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path="signup" element={<Signup getEmail={getUserEmail} />} />
            <Route path='NewQuestion' element={<NewQuestion getUser={getUser} userFromDB={userFromDB} userEmailFromDB={userEmailFromDB}/>}/>
            <Route path="Questionnaire" element={<Questionnaire userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path="firstQues" element={<Question pageNum='first' userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path="secondQues" element={<Question userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} pageNum='second' />} />
            <Route path="PersonaM" element={<Persona userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} pageNum='mucillar' />} />
            <Route path="PersonaB" element={<Persona userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} pageNum='balyanim' />} />
            <Route path="PersonaC" element={<Persona userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} pageNum='chill' />} />
            <Route path="userProfile" element={<UserProfile userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} getUser={getUser}/>} />
            <Route path="budget" element={<Budget userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} bug={userFromDB.UserBudget} />} />
            {/* <Route path="budget" element={<Budget userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} allExpenes={expensesInApp} bug={userFromDB.UserBudget} />} /> */}
            <Route path="profile" element={userFromDB ? <UserProfile userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} getUser={getUser} personaType={userFromDB.UserType} /> : <div>Loading...</div>} />
            <Route path="NewExpense" element={<NewExpense userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path="Analysis" element={<ExpensesAnalysis userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path="map"  element={<Map userFromDB={userFromDB} />} />
            <Route path='episodes' element={<Episodes userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='favorites' element={<Favorites userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='create-episode/:NameOfChapter' element={<CreateEpisode userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='create-episode' element={<CreateEpisode userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='episode/:NameOfChapter' element={<EpisodePage userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='CreateFeedback' element={<CreateFeedback  userFromDB={userFromDB} />} />
            <Route path='Feedbacks' element={<Feedbacks userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='ThanksPage' element={<ThanksPage />} />
            <Route path='Diary' element={<Diary />} />
            <Route path='FeedbackPage/:FeedbackKey' element={<FeedbackPage  userFromDB={userFromDB} userEmailFromDB={userEmailFromDB}/>} />
            <Route path='chats' element={<ChatsPage userFromDB={userFromDB} />} />
            <Route path='chat/:userEmail2' element={<ChatPage userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='KpiCard' element={<KpiCard category={'אטרקציות'} expend={'852'} precent={'55'} />} />
           
            {/* אדמין */}
            <Route path="UserProfileAdmin" element={userFromDB?<UserProfileAdmin userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />:<div>loading...</div>} />
            <Route path='CreateFeedbackAdmin/:FeedbackKey' element={<CreateFeedbackAdmin userFromDB={userFromDB} />} />
            <Route path='CreateFeedbackAdmin' element={<CreateFeedbackAdmin userFromDB={userFromDB} />} />
            <Route path="mapAdmin" element={<MapAdmin userFromDB={userFromDB} />} />
            <Route path='ChangePasswordComAdmin' element={<ChangePasswordComAdmin userFromDB={userFromDB} userEmailFromDB={userEmailFromDB} />} />
            <Route path='EditFeedbackAdmin/:FeedbackKey' element={<EditFeedbackAdmin userFromDB={userFromDB} />} />

          </Routes>

{/* לא לגעת בקוד הזה */}
        </div>
        {chatVisiable && <div className="chat-btn" >
          {!isRead ? <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            variant="dot"
          >
            <div className="chat-btn-container">
              <ForumIcon onClick={() => nav('chats')} />
            </div>
          </StyledBadge> : <div className="chat-btn-container">
            <ForumIcon onClick={() => nav('chats')} />
          </div>}
        </div>}
{/* לא לגעת בקוד הזה */}


      </LocalizationProvider>

    </div >
  );
}

export default App;
