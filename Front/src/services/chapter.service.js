import axios from 'axios';
import Swal from 'sweetalert2';
export const chapterService = {
    getById,
    create,
    update,
    remove,
    getAll,
}

const base_url = 'https://proj.ruppin.ac.il/cgroup99/prod/api'
const module = 'traveldiary'
const userEmail = 'Benda669@gmail.com'


// https://localhost:44350/api/traveldiary/noycn27@gmail.com/chapters
async function getAll(Email) {
    try {
        // const userEmail = Email;
        const res = await axios.get(`${base_url}/${module}/${Email}/chapters`)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
        return []
    }
}
// https://localhost:44350/api/traveldiary/Benda669@gmail.com/GetTravelDiaryChaptersById/טרק
async function getById(NameOfChapter, Email) {
    try {
        const res = await axios.get(`${base_url}/${module}/${Email}/GetTravelDiaryChaptersById/${NameOfChapter}`)
        console.log({ res });
        return res.data[0]
    } catch (err) {
        console.log({ err });
    }
}

// post: https://localhost:44350/api/traveldiary/Post/noycn27@gmail.com/{newchap}
// api/traveldiary/PostCAP/{userImput}/

async function create(episode, Email) {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${base_url}/${module}/PostCAP/${Email}/`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: episode
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}
//api/traveldiary/Put/{nameofchapterfromdb}/
async function update(episode) {
    try {
        console.log({ episode });
        const res = await axios.put(`${base_url}/${module}/PutUpdate/${episode.ChapterKey}/`, episode)
        console.log({ res });
        return res.data
    } catch (err) {
        console.log({ err });
    }
}



async function remove(NameOfChapter, Email) {
    try {
        const res = await axios.delete(`${base_url}/${module}/${Email}/deletechapter/${NameOfChapter}`)
        console.log({ res });
     Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'פרק נמחק בהצלחה',
      showConfirmButton: false,
      timer: 2000
    })
        return res.data
    } catch (err) {
        console.log({ err });
    }
}
