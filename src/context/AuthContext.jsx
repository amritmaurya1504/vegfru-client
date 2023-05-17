import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [currentPlace, setCurrentPlace] = useState();
    const [geo, setGeo] = useState();
    const [loader, setLoader] = useState(false);
    const [stores, setStores] = useState();

    const getStores = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/get-stores`);
            setStores(data.stores);
        } catch (error) {
            console.log(error)
        }
    }

    const getPlace = async (location) => {
        try {
            const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location[1]},${location[0]}.json?access_token=${import.meta.env.VITE_MAPBOX_KEY}`);
            const address = `${res.data.features[0].place_name}`
            setCurrentPlace(address)
            // console.log(res);
        } catch (error) {
            console.log(error)
        }
    }

    const getLocation = () => {
        setLoader(true);
        navigator.geolocation.getCurrentPosition((position) => {
            getPlace([position.coords.latitude, position.coords.longitude])
            setLoader(false)
        },
            (error) => {
                console.log(error);
                setLoader(false)
            },
            { enableHighAccuracy: true });
    }

    return (
        <AuthContext.Provider value={{ user, setUser, currentPlace, getPlace, setGeo, geo, getLocation, loader, setLoader, getStores,stores }} >
            {children}
        </AuthContext.Provider>
    )
}