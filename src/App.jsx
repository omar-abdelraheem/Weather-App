import "./App.css";

// React imports
import { useEffect,useState} from "react";

// material ui imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import { useMediaQuery } from '@mui/material';

// axios
import axios from "axios";
// day js imports
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
// i18n imports
import { useTranslation } from 'react-i18next';
// react-icon-imports
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm } from "react-icons/wi";


let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();
  const [theTemp,settheTemp]=useState(null)
  const [minTemp,setMinTemp]=useState(null)
  const [maxTemp,setMaxTemp]=useState(null)
  const [skyStatus,setSkyStatus]=useState(null)
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const getWeatherIcon = (code) => {
  if (code === 0) return <WiDaySunny size={50} color="#fffb00" />;
  if (code >= 1 && code <= 3) return <WiCloudy size={50} color="#505050" />;
  if (code >= 51 && code <= 67) return <WiRain size={50} color="#505050" />;
  if (code >= 95) return <WiThunderstorm size={50} color="#505050" />;
  return <WiDaySunny size={50} />; 
};

  const getWeatherStatus = (code) => {
    const weatherMapping = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Icy fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Heavy freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
    };
    return weatherMapping[code] || "Unknown";
  };
  useEffect(()=>{
  axios
  .get("https://api.open-meteo.com/v1/forecast", {
            params: {
              latitude: 30.0626, // إحداثيات القاهرة
              longitude: 31.2497,
              current: "temperature_2m,weather_code,cloud_cover",
              daily: "temperature_2m_max,temperature_2m_min",
              timezone: "Africa/Cairo",
              forecast_days: 1
            },
             cancelToken:new axios.CancelToken((c)=>{
        cancelAxios = c;
      })
          },
    
  )
  .then((response) => {
    const tempData = Math.round(response.data.current.temperature_2m) ;
    const minTempData = Math.round(response.data.daily.temperature_2m_min) ;
    const maxTempData = Math.round(response.data.daily.temperature_2m_max) ;
    const skyData = response.data.current.weather_code;
    
    settheTemp(tempData);
    setSkyStatus(skyData);
    setMinTemp(minTempData);
    setMaxTemp(maxTempData)
    console.log(response.data)
    console.log(getWeatherStatus(skyData))
    console.log(getWeatherIcon (skyData))
    
  })
  .catch((error) => {
    console.error(error);
  })
return () => {
  if (cancelAxios) cancelAxios();

}
  },[]);

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
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          {/* card */}
          <div style={{backgroundColor: '#8ecae66b',width:"100%",borderRadius:'10px',padding:'20px',color:'white',boxShadow:'10px 10px 8px rgba(0, 0, 0, 0.2)',direction:i18n.language === 'ar'? 'rtl':'ltr'}}>
            {/* content */}
            <div>
              {/* city and date */}
              <div style={{ display:'flex',justifyContent:'start',alignItems:isSmallScreen?'center':'end',flexDirection: isSmallScreen?'column':'row',gap:'10px'}}>
                <Typography variant="h1" style={{fontFamily:'nonoSans',fontWeight:'bold',marginRight:'10px',fontSize:'clamp(2rem, 8vw, 5rem)'}}>{t('city')}</Typography>
                <Typography variant="h5" style={{fontFamily:'nonoSans',fontWeight:'lighter'}}>{dayjs().locale(i18n.language).format('dddd, DD MMMM YYYY')}</Typography>
              </div>
              {/*== city and date ==*/}
              <hr />
              {/* weather info */}
              <div style={{display:'flex',flexDirection:isSmallScreen?'column':'row',justifyContent:'space-between',alignItems:'center'}}>
                {/* weather icon  */}
                <div><CloudIcon style={{fontSize:'clamp(7rem, 30vw, 14rem)',color:'#ffffffe1'}} /></div>
                 {/*== weather icon  ==*/}

                 {/* weather details */}
                <div style={{ display:'flex',flexDirection:'column',gap:'20px',marginTop:'20px',alignItems:'center'}}>
                  <Typography variant="h1" style={{fontFamily:'nonoSans',display:'flex',    alignItems:'start',fontSize:'clamp(3rem, 8vw, 5rem)'}} > {getWeatherIcon(skyStatus)}{theTemp}°
                     </Typography>
                     
                  <Typography variant="h5" >{t(getWeatherStatus(skyStatus))}</Typography>
                  <div style={{display:'flex'}}>
                    <Typography variant="h6" style={{fontFamily:'nonoSans',fontWeight:'bold',fontSize:'1.1rem'}}>{t('min')}: {minTemp+""}°</Typography>
                    <Typography variant="h6" style={{fontFamily:'nonoSans',fontWeight:'bold',fontSize:'1.1rem',margin:'0 10px'}}>|</Typography>
                    <Typography variant="h6" style={{fontFamily:'nonoSans',fontWeight:'bold',fontSize:'1.1rem'}}>{t('max')}: {maxTemp}°</Typography>
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
