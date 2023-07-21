import axios from 'axios';

export const feedbackService = {
    getById,
    create,
    PutUpdateFeed,
    remove,
    getAll,
    createfromuser,
    PostFeedfromadmin
}

///
const base_url = 'https://proj.ruppin.ac.il/cgroup99/prod/api'
const module = 'Feedback'
const userEmail = 'Benda669@gmail.com'


// https://localhost:44350/api/traveldiary/noycn27@gmail.com/chapters
async function getAll() {
    try {
        const res = await axios.get(`${base_url}/${module}`)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
        return []
    }
}
// https://localhost:44350/api/traveldiary/Benda669@gmail.com/GetTravelDiaryChaptersById/טרק
async function getById(FeedbackKey) {
    try {
        const res = await axios.get(`${base_url}/${module}/${FeedbackKey}/GetByName`)
        console.log({ res });
        return res.data[0]
    } catch (err) {
        console.log({ err });
    }
}

// post: https://localhost:44300/api/Feedback/{feedbackINTindb}/PostNew/
async function create(feedback) {
    console.log( feedback.FeedbackPersona );
    try {
        const res = await axios.post(`${base_url}/${module}/${feedback.FeedbackKey}/PostNew/`,{FeedbackPersona:feedback.FeedbackPersona.trim()})
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}
//api/Feedback/PostFeed/
async function createfromuser(feedback, userFromDB) {
    console.log({ feedback });
    try {
        //api/Feedback/PostFeed/{useremail}/
        const res = await axios.post(`${base_url}/${module}/PostFeed/${userFromDB.UserEmail}/`, feedback)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}

async function PostFeedfromadmin(feedback, userFromDB) {
    console.log({ feedback });
    try {
        //api/Feedback/PostFeed/{useremail}/
        const res = await axios.post(`${base_url}/${module}/PostFeedfromadmin/${userFromDB.UserEmail}/`, feedback)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}

//api/Feedback/PutUpdateFeed/{feedKey}/
async function PutUpdateFeed(feedback) {
    try {
        const res = await axios.put(`${base_url}/${module}/PutUpdateFeed/${feedback.FeedbackKey}/`, feedback)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}


//api/Feedback/DeleteFeedback/{feedbackIDfromdb}
async function remove(FeedbackKey) {
    try {
        const res = await axios.delete(`${base_url}/${module}/DeleteFeedback/${FeedbackKey}`)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}
