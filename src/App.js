import {useEffect, useState} from "react";
import './App.css';
import propTypes from "prop-types";

/* image */
import searchIcon from './image/search.jpeg';
import clearIcon from './image/clear.jpeg';
import cloudIcon from './image/cloudy sun.jpeg';
import drizzleIcon from './image/cloudy rain.jpeg';
import windIcon from './image/wind.jpeg';
import snowIcon from './image/snow.jpeg';
import rainIcon from './image/rain.jpeg';
import humidityIcon from './image/humidity.jpeg';

const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind}) =>
{
  return(
  <>
  <div className="image">
    <img src={icon} alt="Image" />
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className="lat">latitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className="log">longitude</span>
      <span>{log}</span>
    </div>
  </div>
  <div className="data-container">
  <div className="element">
      <img src={humidityIcon} alt="humidity"
      className="icon" />
      <div className="data">
        <div className="humidity-percent">{humidity}%</div>
        <div className="text">humidity</div>
      </div>
      </div>
    <div className="element">
      <img src={windIcon} alt="wind"
      className="icon" />
      <div className="data">
        <div className="wind-percent">{wind} km/h</div></div>
        <div className="text">wind Speed</div>
      </div>
    </div>
  
  
  </>
  );
};
WeatherDetails.propTypes = {
  icon: propTypes.string.isRequired,
  temp: propTypes.number.isRequired,
  city: propTypes.string.isRequired,
  country: propTypes.string.isRequired,
  humidity: propTypes.number.isRequired,
  wind: propTypes.number.isRequired,
  lat: propTypes.number.isRequired,
  log: propTypes.number.isRequired,
};

function App() {
  let api_key ="c0c44b8fcdc4a979294c81f009fea701";
  const [text, setText] =useState("Kanchipuram");

  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] =useState(0);
  const [city, setCity] =useState("kanchipuram");
  const [country, setCountry] =useState("India");
  const [lat, setLat] =useState(0);
  const [log, setLog] =useState(0);
  const [humidity, setHumidity] =useState(0);
  const [wind, setWind] =useState(0);

  const [cityNotFound, setCityFound] = useState(false);
  const [loading, setLoading] =useState(false);
  const [error, setError] =useState(null);

  const WeatherIconMap ={
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":clearIcon,
    "02d":clearIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
};

  const search = async () => {
    
   let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
   
    try{
      let res = await fetch(url);
      let data = await res.json();
      //console.log(data);
      if (data.cod === "404"){
        console.error("city not found");
        setCityFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const WeatherIconCode = data.weather[0].icon;
      setIcon(WeatherIconMap[WeatherIconCode] || clearIcon);
      setCityFound(false);

    }
    catch(error){
      console.error("An error occurred:", error.message);
      setError("An error occured while fetching weather data");
    }
    finally{
      setLoading(false);

    }
  
  };

  const handleCity=(e)=>{
    setText(e.target.value);
  };
  const handleKeyDown =(e) =>{
    if(e.key === "Enter"){
      search();
    }
  };

  useEffect(function(){
    search();
  },[]);
  return (
    <>
    <div className="container">
      <div className="input-container">
        <input type="text" className="cityInput"
        placeholder="Search city" onChange={handleCity} 
        value={text} onKeyDown={handleKeyDown}/>
        <div className="search-icon" onClick={() => search()}>
          <img src={searchIcon} alt="Search" />
        </div>
      </div>
      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} 
      city={city} country={country} 
      lat={lat} log={log}
      humidity={humidity} wind={wind} />}

      {loading && <div className="loading-message">Loading..</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}

      <p className="copyright">
        Designed by <span>Kani</span>
      </p>
    </div>
    </>
  );
}

export default App;
