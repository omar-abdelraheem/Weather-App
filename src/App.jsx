import "./App.css";

// React imports
import { useEffect,useState} from "react";

// material ui imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
// axios
import axios from "axios";
// day js imports
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
// i18n imports
import { useTranslation } from 'react-i18next';


let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();
  const [theTemp,settheTemp]=useState(null)
  const [minTemp,setMinTemp]=useState(null)
  const [maxTemp,setMaxTemp]=useState(null)
  const [skyStatus,setSkyStatus]=useState(null)
  const [weatherIcon,setWeatherIcon]=useState(null)
  
  

  
  useEffect(()=>{
  

  axios
  .get("https://api.openweathermap.org/data/2.5/weather?lat=30.03&lon=31.23&appid=ffbaa7f98c8958f290e5a4278886755d&units=metric",
    {
      cancelToken:new axios.CancelToken((c)=>{
        cancelAxios = c;
      })
    }
  )
  .then((response) => {
    const tempData = Math.round(response.data.main.temp) ;
    const minTempData = Math.round(response.data.main.temp_min) ;
    const maxTempData = Math.round(response.data.main.temp_max) ;
    const skyData = response.data.weather[0].main;
    const weatherIconCode = response.data.weather[0].icon;
    const weatherIconUrl =`https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
    setWeatherIcon(weatherIconUrl)

    settheTemp(tempData);
    setSkyStatus(skyData);
    setMinTemp(minTempData);
    setMaxTemp(maxTempData)
    console.log(response.data)
    
  })
  .catch((error) => {
    console.error(error);
  })
return () => {
  if (cancelAxios) cancelAxios();

}
  },[])





  const toggleLanguage=()=>{
    const currentLanguage = i18n.language;
    const newLanguage = currentLanguage === 'ar'?'en':'ar';
    i18n.changeLanguage(newLanguage);
   dayjs.locale(newLanguage)  
  }
    return (
    <>
      {/* container */}
      <Container maxWidth="sm">
        {/* card container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          {/* card */}
          <div style={{backgroundColor: '#8ecae66b',width:"100%",borderRadius:'10px',padding:'20px',color:'white',boxShadow:'10px 10px 8px rgba(0, 0, 0, 0.2)',direction:i18n.language === 'ar'? 'rtl':'ltr'}}>
            {/* content */}
            <div>
              {/* city and date */}
              <div style={{ display:'flex',justifyContent:'start',alignItems:'end'}}>
                <Typography variant="h1" style={{fontFamily:'nonoSans',fontWeight:'bold',marginRight:'10px',fontSize:'5rem'}}>{t('city')}</Typography>
                <Typography variant="h5" style={{fontFamily:'nonoSans',fontWeight:'lighter'}}>{dayjs().locale(i18n.language).format('dddd, DD MMMM YYYY')}</Typography>
              </div>
              {/*== city and date ==*/}
              <hr />
              {/* weather info */}
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                {/* weather icon  */}
                <div><CloudIcon style={{fontSize:'14rem',color:'#ffffffe1'}} /></div>
                 {/*== weather icon  ==*/}

                 {/* weather details */}
                <div style={{ display:'flex',flexDirection:'column',gap:'20px',marginTop:'20px',alignItems:'center'}}>
                  <Typography variant="h1" style={{fontFamily:'nonoSans',display:'flex',    alignItems:'start'}}><img src={weatherIcon}/>{theTemp}°
                     </Typography>
                     
                  <Typography variant="h5" >{skyStatus}</Typography>
                  <div style={{display:'flex'}}>
                    <Typography variant="h6" style={{fontFamily:'nonoSans',fontWeight:'bold',fontSize:'1.1rem'}}>{t('min')}: {minTemp+""}°</Typography>
                    <Typography variant="h6" style={{fontFamily:'nonoSans',fontWeight:'bold',fontSize:'1.1rem',margin:'0 10px'}}>|</Typography>
                    <Typography variant="h6" style={{fontFamily:'nonoSans',fontWeight:'bold',fontSize:'1.1rem'}}>{t('min')}: {maxTemp}°</Typography>
                  </div>
                </div>
              </div>
              {/*== weather info ==*/}
            </div>
            {/*== content ==*/}
          </div>
          {/*== card ==*/}

          <Button  onClick={toggleLanguage}  style={{alignSelf: i18n.language === 'ar'? 'start':'end',color:'white',fontFamily:'nonoSans',fontSize:'17px',padding:'0',margin:'0'}}sx={{
          '&:hover': {
            bgcolor: '#1c768d23',
          },
        }}>{i18n.language === 'ar' ? 'Eng' : 'العربية'}</Button>
        </div>
        {/*== card container ==*/}
      </Container>
      {/*== container ==*/}
    </>
  );
}

export default App;
