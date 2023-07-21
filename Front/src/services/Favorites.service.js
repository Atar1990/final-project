import axios from 'axios';

export const favoriteservice = {
    getByName,
    // create,
    PutFavourites,
    DeleteFavourites,
    Getall,
    AddFav
    // createfromuser
}



const base_url = 'https://proj.ruppin.ac.il/cgroup99/prod/api'
const module = 'Favourites'
const userEmail = 'Benda669@gmail.com'


// https://localhost:44350/api/traveldiary/noycn27@gmail.com/chapters
async function Getall(Email) {
    try {
        const res = await axios.get(`${base_url}/${module}/${Email}/Getall`)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
        return []
    }
}
// https://localhost:44350/api/traveldiary/Benda669@gmail.com/GetTravelDiaryChaptersById/טרק
async function getByName(FavKey) {
    try {
        const res = await axios.get(`${base_url}/${module}/${FavKey}/GetByName`)
        console.log({ res });
        return res.data[0]
    } catch (err) {
        console.log({ err });
    }
}
//api/Favourites/{OptINTindb}/{Favemail}/PostAddFav
async function AddFav(FavKey,Email) {
    try {
        console.log(FavKey,Email);
        const res = await axios.post(`${base_url}/${module}/${FavKey}/${Email}/PostAddFav`)
        console.log({ res });
        return res.data[0]
    } catch (err) {
        console.log({ err });
    }
}

// post: https://localhost:44300/api/Feedback/2/PostNew
// async function create(feedback) {
//     console.log({ feedback });
//     try {
//         const res = await axios.post(`${base_url}/${module}/${feedback.FeedbackKey}/PostNew`)
//         console.log({ res });
//         return res.data
//     } catch (err) {
//         console.log({ err });
//     }
// }
//api/Feedback/PostFeed/
// async function createfromuser(feedback) {
//     console.log({ feedback });
//     try {
//         const res = await axios.post(`${base_url}/${module}/PostFeed/`,feedback)
//         console.log({ res });
//         return res.data
//     } catch (err) {
//         console.log({ err });
//     }
// }


async function PutFavourites(id) {
    try {
        const res = await axios.put(`${base_url}/${module}/${id}/PutFavourites`)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}




//api/Feedback/DeleteFeedback/{feedbackIDfromdb}
async function DeleteFavourites(FavKey) {
    try {
        const res = await axios.delete(`${base_url}/${module}/DeleteFavourites/${FavKey}`)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}
