import PropTypes from 'prop-types';
import React,{ useState, useEffect,Suspense } from 'react';


import styles from './PersonPage.module.css';
import {getApiResource} from "../../utils/network";
import {useParams} from "react-router";
import {getPeopleImage} from "../../services/getPeopleData";
import PersonPhoto from "../../components/PersonPage/PersonPhoto";
import PersonInfo from "../../components/PersonPage/PersonInfo";
import {withErrorApi} from "../../hoc-helpers/withErrorApi";
import {API_PERSON} from "../../constants/api";
import PersonLinkBack from "../../components/PersonPage/PersonLinkBack";
import UiLoading from "../../components/UI/UiLoading";
import {useSelector} from "react-redux";
const PersonFilms = React.lazy(() => import("../../components/PersonPage/PersonFilms"))


const PersonPage = ({ match, setErrorApi }) => {
    const [personInfo, setPersonInfo] = useState(null);
    const [personId, setPersonId] = useState(null);
    const [personName, setPersonName] = useState(null);
    const [personPhoto, setPersonPhoto] = useState(null);
    const [personFilms, setPersonFilms] = useState(null);
    const [personFavorite, setPersonFavorite] = useState(false);
    const {id} = useParams();
    const storeData = useSelector(s => s.favoriteReducer)

    useEffect(() => {
        (async () => {
            setPersonId(id)
            storeData[id] ? setPersonFavorite(true) : setPersonFavorite(false)
            const res = await getApiResource(`${API_PERSON}/${id}/`);
            if (res) {
                setPersonInfo([
                    { title: 'Height', data: res.height },
                    { title: 'Mass', data: res.mass },
                    { title: 'Hair Color', data: res.hair_color },
                    { title: 'Skin Color', data: res.skin_color },
                    { title: 'Eye Color', data: res.eye_color },
                    { title: 'Birth Year', data: res.birth_year },
                    { title: 'Gender', data: res.gender },
                ]);
                res.films.length && setPersonFilms(res.films)
                setPersonName(res.name);
                setPersonPhoto(getPeopleImage(id));
                setErrorApi(false);
            } else {
                setErrorApi(true);
            }
        })();
    }, []);

    return (
        <>
            <PersonLinkBack/>

            <div className={styles.wrapper}>
                <span className={styles.person__name}>{personName}</span>

                <div className={styles.container}>
                    <PersonPhoto
                        personPhoto={personPhoto}
                        personName={personName}
                        personId={personId}
                        personFavorite={personFavorite}
                        setPersonFavorite={setPersonFavorite}
                    />

                    {personInfo && <PersonInfo personInfo={personInfo} />}

                    {personFilms && (
                        <Suspense  fallback={<UiLoading isShadow theme={'white'}/>}>
                            <PersonFilms personFilms={personFilms} />
                        </Suspense>
                    )}
                </div>

            </div>

        </>

    )
}

PersonPage.propTypes = {
    match: PropTypes.object,
    setErrorApi: PropTypes.func,
}

export default withErrorApi(PersonPage);
