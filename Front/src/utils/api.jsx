import { getEnv } from "./env";

const userPos = async () => {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude
                resolve({
                    lat, lng,
                });
            }
        )
    })
}

export const login = async (loginFields) => {
    const pos = await userPos()
    const response = await fetch(`${getEnv()}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            UserEmail: loginFields.email,
            UserPassword: loginFields.password,
            UserLatPosition: pos.lat,
            UserLongPosition: pos.lng,
            UserLngPosition: pos.lng
        })
    })
    if (!response.ok) {
        console.log("response not ok");
        throw new Error('Data could not be fetched!')
    } else {
        console.log("response is ok");
        return response.text()
    }
}

export const saveUserPosToDB = async ({ email, lat, lng }) => {
    const response = await fetch(`${getEnv()}/users/PutlocationById/${email}/${lat}/${lng}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(userPos)
    })
    if (!response.ok) {
        console.log("response not ok");
        // throw new Error('Data could not be fetched!')
    } else {
        console.log("response is ok");
        return response.text()
    }
}

export const signup = async (loginFields) => {
    const pos = await userPos()
    const response = await fetch(`${getEnv()}/signup`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            UserEmail: loginFields.email,
            UserPassword: loginFields.password1,
            UserLastName: loginFields.last_name,
            UserFirstName: loginFields.first_name,
            UserLatPosition: pos.lat,
            UserLongPosition: pos.lng,
            UserLngPosition: pos.lng,
            Userphonenumber: loginFields.phone
        })
    })
    if (!response.ok) {
        throw new Error('Data could not be fetched!')
    } else {
        return response.text()
    }
}

export const signup2 = async (loginFields, emailFromChangCom, userFromDB) => {
    const response = await fetch(`${getEnv()}/users/putall/?email=` + emailFromChangCom, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            UserPassword: loginFields.password1,
            UserLastName: loginFields.last_name,
            UserFirstName: loginFields.first_name,
            // UserType:'ציל',
            UserType: userFromDB.UserType,
            UserImg: userFromDB.UserImg,
            UserBudget: userFromDB.UserBudget,
            Numberoffrieds: userFromDB.Numberoffrieds,
            // Numberoffrieds:2,
            UserEmail: userFromDB.UserEmail,
            UserTimeTraveling: userFromDB.UserTimeTraveling,
            Userphonenumber: userFromDB.Userphonenumber

        })
    })
    if (!response.ok) {
        throw new Error('Data could not be fetched!')
    } else {
        return response.text()
    }
}

export const getUsersPositions = async () => {
    const { lat, lng } = await userPos()
    const apiUrl = getEnv() + `/Users/getusersplace?lat=${lat}&lng=${lng}`;
    return new Promise(resolve => {
        fetch(apiUrl,
            {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                })

            })
            .then(response => {
                return response.json()
            })
            .then(
                (result) => {
                    resolve(result)
                });
    })
}