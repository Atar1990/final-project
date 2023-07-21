import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { favoriteservice } from '../services/Favorites.service';
import { useEffect } from 'react';
import { useState } from 'react';

const fieldsMapper = {
    0: {
        title: "AidCompName",
        image: "AidComplexesPhoto",
        description: "AidComplexesDescription",
        selector: "H"
    },
    1: {
        title: "TripsName",
        image: "TripsPhoto",
        description: "TripsDescription",
        selector: "T"
    },
    2: {
        title: "SleepingCompName",
        image: "SleepingComplexesPhoto",
        description: "SleepingComplexesDescription",
        selector: "S"
    },
    3: {
        title: "AttractionName",
        image: "AttractionPhoto",
        description: "AttractionDescription",
        selector: "A"
    }
}

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function OptionsCard({ tabIndex, item, index, selected, userFromDB }) {
    const [expanded, setExpanded] = React.useState(false);
    const [favAtts, setFavAtt] = React.useState([]);
    const [msg, setMsg] = useState('')
    console.log('gdgr', item, userFromDB);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    useEffect(() => {
        loadFavs()
    }, [])

    const loadFavs = async () => {
        const res = await favoriteservice.Getall(userFromDB.UserEmail)
        console.log({ res });
        setFavAtt(res)
    }

    const isFav = (attraction) => {
        return favAtts.find(f =>
            f.FnameDTO === attraction.AttractionName ||
            f.FnameDTO === attraction.AidCompName ||
            f.FnameDTO === attraction.TripsName ||
            f.FnameDTO === attraction.SleepingCompName
        )
    }

    const { title, image, selector, description } = fieldsMapper[tabIndex];

    const itemSelector = `${selector}${index}`

    const isSelected = selected === `.${itemSelector}`

    return (
        <Card className={itemSelector} style={isSelected ? { backgroundColor: '#ececec' } : {}} sx={{ maxWidth: 345 }}>
            <CardHeader

                title={item[title]}
            />
            <CardMedia
                component="img"
                height="194"
                image={item[image] || 'https://picsum.photos/200/300'}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">

                </Typography>
            </CardContent>
            {msg && <div className="msg">{msg}</div>}
            <CardActions disableSpacing>
                <IconButton aria-label="ad d to favorites" onClick={async() => {
                    if (isFav(item)) {
                        setMsg('אופס, פריט זה כבר נמצא במועדפים שלך')
                        setTimeout(() => {
                            setMsg('')
                        }, 1000)
                    } else {
                       await  favoriteservice.AddFav(item.OptionKey, userFromDB.UserEmail)
                        loadFavs()
                    }
                }}>
                    <FavoriteIcon style={isFav(item) ? { color: 'red' } : {}} />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
                {item.AttractionsPersona || item.SleepingComplexesPersona || item.TripsPersona }
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{item[description]}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}