import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer, OverlayView, StreetViewPanorama } from '@react-google-maps/api';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CountrySelect from './SelectComp';
import TopOfAplication from './TopOfAplication';
import Navigation from './Navigation';
import { Button, NativeSelect, Paper } from '@mui/material';
import FormControlLabelPosition from './FormControlLabelPosition';
import OptionsCom from './OptionsCom';
import { Box } from '@mui/system';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { Gite, Whatshot } from '@mui/icons-material';
import { getEnv } from '../utils/env';
import { saveUserPosToDB, getUsersPositions } from '../utils/api'
import { useNavigate } from 'react-router';
import NavigationAdmin from './NavigationAdmin';


const containerStyle = {
    width: '320px',
    height: '390px',
    borderRadius: '10px',
};

const Flagimage = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

const star = {
    path:
        "M8 12l-4.7023 2.4721.898-5.236L.3916 5.5279l5.2574-.764L8 0l2.3511 4.764 5.2574.7639-3.8043 3.7082.898 5.236z",
    fillColor: "gold",
    fillOpacity: 0.9,
    scale: 1.3,
    strokeColor: "black",
    strokeWeight: 1,
}

const locations = [
    // { lat: 26.167789, lng: 73.898222 },
    // { lat: 25.718234, lng: 73.363181 },
    // { lat: 25.727111, lng: 73.371124 },
    // { lat: 29.848588, lng: 73.209834 },
    // { lat: 28.851702, lng: 69.216968 },
    // { lat: 29.671264, lng: 75.863657 },
    // { lat: 27.304724, lng: 79.662905 },
    // { lat: 24.817685, lng: 77.699196 },
    // { lat: 30.828611, lng: 77.790222 },
    // { lat: 26.556104, lng: 77.491577 },
    // { lat: 25.759859, lng: 78.128708 },
    // { lat: 24.765015, lng: 82.133858 },
    // { lat: -37.770104, lng: 145.143299 },
    // { lat: -37.7737, lng: 145.145187 },
    // { lat: -37.774785, lng: 145.137978 },
    // { lat: -37.819616, lng: 144.968119 },
    // { lat: -38.330766, lng: 144.695692 },
    // { lat: -39.927193, lng: 175.053218 },
    // { lat: -41.330162, lng: 174.865694 },
    // { lat: -42.734358, lng: 147.439506 },
    // { lat: -42.734358, lng: 147.501315 },
    // { lat: -42.735258, lng: 147.438 },
    // { lat: -43.999792, lng: 170.463352 },
]


function createKey(location) {
    return location.lat + location.lng;
}
function createLocationsArray(location, latField, longField) {
    const locationsA = [];
    for (let index = 0; index < location.length; index++) {
        locationsA[index] = { ...location[index], lat: location[index][latField], lng: location[index][longField] }
    }
    console.log(locationsA)
    return locationsA;
}
function createLocation(location) {

    return createLocationsArray(location, 'AttractionsLatitude', 'AttractionsLongitude')
}
function createLocationSleep(location) {
    return createLocationsArray(location, 'SleepingCompLat', 'SleepingCompLon')
}
function createLocationTrip(location) {
    return createLocationsArray(location, 'TripsLatitude', 'TripsLongitude')
}
function createLocationAid(location) {
    return createLocationsArray(location, 'AidCompLat', 'AidCompLon')
}

const usersLocationsMock = [
    {
        id: '12112',
        user: 'atar',
        position: {
            lat: 32.4607275, lng: 35.0034335
        }
    }
];

function MapAdmin(props) {
    const [selectedTab, setSelectedTab] = React.useState(3);

    const [attractionList, setAttractionList] = React.useState([]);// אטרקציות של המדינה שנבחרה
    const [sleepingList, setSleepingList] = React.useState([]);// מקומות לינה של המדינה שנבחרה
    const [aidCompList, setAidCompListList] = React.useState([]);// מתחמי סיוע של המדינה שנבחרה
    const [tripList, setTripList] = React.useState([]);// הצעות לטיולים במדינה שנבחרה
    const [usersList, setUsersList] = React.useState([])
    const [zoom, setZoom] = React.useState(12)
    const nav = useNavigate()
    const myArea = () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude
                setUserLocation({
                    userLat: lat,
                    userLng: lng
                })
                console.log(userLocation);
                setCenter({
                    lat: lat,
                    lng: lng
                })

                saveUserPosToDB({
                    lat, lng,
                    email: JSON.parse(localStorage.user).UserEmail
                });

                const users = await getUsersPositions();
                setUsersList(users.map(user => ({
                    ...user,
                    lat: user.UserLotPosition,
                    lng: user.UserLatPosition
                })));
            }
        )
    }

    const handleChange = (event) => {
        setSelectCountry(event.target.value);
        if (event.target.value === 'בסביבה') {
            setZoom(12)
            myArea()
        }
        else {
            setZoom(3.5)
            const apiURL = getEnv() + '/map/';
            fetch(apiURL + event.target.value, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
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
                        console.log("fetch get user by id=", result);
                        console.log(result[0]);
                        setcountryFromDB(result[0])
                        setCenter({
                            lat: result[0].CountryLat,
                            lng: result[0].CountryLon
                        })
                        setAttractionList(createLocation(result[0].AttractionList))//// בעזרת השם אם זה עובד, תיווצר בפועל רשימה מסוג לוקיישן על פי הפורמט המקובל על גוגל
                        setSleepingList(createLocationSleep(result[0].SleepingCompList))// מקומות לינה 
                        setAidCompListList(createLocationAid(result[0].AidCompList))// מתחמי סיוע
                        setTripList(createLocationTrip(result[0].tripList))// הצעות לטיולים
                    },
                    (error) => {
                        console.log("err post=", error);
                    });
        }
    };
    const [selectCountry, setSelectCountry] = React.useState("בחר מדינה");
    const [userInfoBox, setUserInfoBox] = React.useState(null)
    const [map, setMap] = React.useState(null);

    const [countryFromDB, setcountryFromDB] = useState(
        {
            CountryLat: 0,
            CountryLon: 0

        }
    )//// מחזיק את כל הפרטים שיש לנו בדאטה בייס על המידה - נבנה כמערך שבמקום ה0 יש אובייקט שכולל גם הוא מערכים

    const [center, setCenter] = useState({
        lat: -37.765015,
        lng: 145.133858
    })

    const [userLocation, setUserLocation] = useState({
        userLat: 0,
        userLng: 0
    })

    const [selected, setSelected] = useState('')

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCzxNzo8N6KHRkVreIVvJeqnLVE2vDjJ8c"
    })

    const userClick = (user) => {
        setUserInfoBox(user)
    }

    const onLoad = React.useCallback(function callback(map_) {
        setMap(map_);
        myArea()

    }, []);/// בכניסה ראשונית למסך מפה- יקבע המרכז על פי המיקום של המשתמש

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, []);

    const locationClick = (cordinaint, selector) => {

        const mapper = {
            'H': 0,
            'T': 1,
            'S': 2,
            'A': 3
        }
        setSelectedTab(mapper[selector[1]])
        setSelected(selector)


        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: "center", inline: "nearest" });
        }
    }// זמני- בלחיצה על נקודה מסומנת איזה פעולה נרצה שתקה
    return isLoaded ? (
        <>
            <TopOfAplication label='מה יש לעולם להציע' UserType={props.userFromDB.UserType} />
            <div>
                <Button onClick={() => nav("/CreateFeedbackAdmin")}
                    className='btncreate2'
                    variant='contained'
                    style={{direction:'rtl'}}
                >
                    מה שכחנו?
                </Button>
                <NativeSelect
                    defaultValue={selectCountry}
                    inputProps={{
                        name: 'PageNum',
                        id: 'uncontrolled-native',
                    }}
                    onChange={handleChange}
                    sx={{ mb: 2, mt: 6, minWidth: 50, maxHeight: 30, borderRadius: '20%', fontSize: '15px' }}>
                    <option value={'בסביבה'}>בסביבה שלי</option>
                    <option value={'הודו'}>הודו</option>
                    <option value={'ברזיל'}>ברזיל</option>
                    <option value={'אווקודור'}>אקוודור</option>
                    <option value={'ארגנטינה'}>ארגנטינה</option>
                    <option value={'בוליביה'}>בוליביה</option>
                    <option value={'בורמה'}>בורמה</option>
                    <option value={'נאפל'}>נאפל</option>
                    <option value={'גוואטמלה'}>גוואטמלה</option>
                    <option value={'ויאטנם'}>ויאטנם</option>
                    <option value={'לאוס'}>לאוס</option>
                    <option value={'סרילנקה'}>סרילנקה</option>
                    <option value={'פיליפינים'}>פיליפינים</option>
                    <option value={'פנמה'}>פנמה</option>
                    <option value={'פרו'}>פרו</option>
                    <option value={'צילה'}>צילה</option>
                    <option value={'קוסטה ריקה'}>קוסטה ריקה</option>
                    <option value={'קמבודיה'}>קמבודיה</option>
                    <option value={'תאילנד'}>תאילנד</option>
                </NativeSelect>

                <br />
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}>
                    {
                        locations.map((location) => (
                            <Marker key={createKey(location)} position={location} />
                        ))
                    }

                    {
                        attractionList.map((location, index) => (
                            <Marker label='A' key={createKey(location)} position={location} onClick={() => { locationClick(createKey(location), `.A${index}`) }} />
                        ))
                    }

                    {
                        sleepingList.map((location, index) => (
                            <Marker label='S' key={createKey(location)} position={location} onClick={() => { locationClick(createKey(location), `.S${index}`) }} />
                        ))
                    }

                    {
                        aidCompList.map((location, index) => (
                            <Marker label='H' key={createKey(location)} position={location} onClick={() => { locationClick(createKey(location), `.H${index}`) }} />
                        ))
                    }

                    {
                        tripList.map((location, index) => (
                            <Marker label='T' key={createKey(location)} position={location} onClick={() => { locationClick(createKey(location), `.T${index}`) }} />
                        ))
                    }

                    {usersList.map((user) => (
                        <Marker label="U" key={createKey(user) + Math.random() * 9999999} position={user} onClick={() => {
                            userClick(user)
                        }} >
                        </Marker>
                    ))}

                    {
                        userInfoBox && <InfoWindow
                            onCloseClick={() => { setUserInfoBox(null) }}
                            position={userInfoBox}
                        >
                            <div className='infoBox' onClick={() => {
                                console.log(userInfoBox);
                                nav(`/chat/${userInfoBox.Useremail}`)
                            }}>
                                <div className='infoBoxTitle'>
                                    דבר עם
                                    <div className='infoBoxName'>
                                        {userInfoBox.UserFirstName}
                                    </div>
                                </div>
                            </div>
                        </InfoWindow>
                    }


                </GoogleMap>
                <Box>
                    <OptionsCom tabChanged={(value) => { setSelectedTab(value) }} value={selectedTab} selected={selected} userFromDB={props.userFromDB} countryName={selectCountry} data={[aidCompList, tripList, sleepingList, attractionList]} />
                </Box>
            </div>
            <NavigationAdmin pagNav={'mapAdmin'} />
        </>
    ) : <></>
}

export default React.memo(MapAdmin)