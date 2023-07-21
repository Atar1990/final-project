import axios from 'axios';
export const userService = {
  getAll,
  updateIMG,
}

const base_url = 'https://proj.ruppin.ac.il/cgroup99/prod/api'
const module = 'Users'
async function getAll() {
  try {
    const res = await axios.get(`${base_url}/${module}/getnmame/`)
    console.log({ res });
    return res.data
  } catch (err) {
    console.log({ err });
    return []
  }
}

///https://proj.ruppin.ac.il/cgroup99/prod/api/users/PutImg/?email=Benda669@gmail.com
//api/traveldiary/Put/{nameofchapterfromdb}/
async function updateIMG(url, email) {
  try {
    let data = JSON.stringify(url);
    const Email = email;
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'https://proj.ruppin.ac.il/cgroup99/prod/api/users/PutImg/?email=' + Email,
      // url: 'https://proj.ruppin.ac.il/cgroup99/prod/api/users/PutImg/?email=Benda669@gmail.com',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log({ err });
  }
}
