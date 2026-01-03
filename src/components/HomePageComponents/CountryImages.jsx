import { useEffect, useState } from "react";
import "./styles.css";
import LoadingPageSpinner from "../UIComponents/LoadingPageSpinner";
import Error from "../UIComponents/Error";
import { useLocation } from "../../hooks/LocationContext";

function CountryImages() {
    const {country, images, setImages} = useLocation()
    const [isLoading, setIsloading] = useState(false)
    const [error, setError] = useState(``)

    useEffect(()=> {
        async function fetchImgs() {
            try {
                setError(``)
                setIsloading(true)
                const res = await fetch(`https://api.unsplash.com/search/photos?query=${country?.name?.common}&per_page=10`,
                {
                    headers: {
                    Authorization: "Client-ID mKdZ296JNUSiZslJVABlBYHoEalL2PS2CvZK4J93U6c"
                    }
                }
                );
                if(res.ok !== true) throw new Error(`Failed to fetch`)

                const data = await res.json();
                if(!data) throw new Error(`${country?.name?.common} images was not found!`)
                setImages(()=> data.results.map(img => img.urls.full).slice(0,14));
                setIsloading(false)
            }

            catch(err) {
                setError(err.message)
            }
        }

        fetchImgs();
    }, [country?.name?.common])

    
    return (
        <>
        <h4 style={{marginTop: `70px`}}>Images 🎥</h4>
        {error ? <Error msg={error} type="full" /> :

        (isLoading ? (
          <LoadingPageSpinner type="small" />
        ) : (
        <div className="country-image">
          {images.map((src, i) => 
            <img key={i} src={src} alt="country_place" />
        )}
        </div> 
        ))}  
        </>   
    );
    };

export default CountryImages ;