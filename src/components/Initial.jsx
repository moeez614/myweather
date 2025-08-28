import React, { useState, useEffect, useRef, use } from 'react'
import { useForm } from 'react-hook-form'
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
const Initial = () => {

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm()

  const [weather, setWeather] = useState(null)
  const [code, setCode] = useState(null)

  const cons = async (e) => {
    console.log(e.location)
    const frame = e.location;
    const lora = await fetch(`https://api.weatherapi.com/v1/current.json?key=38e540c4df944b8ebed85236252608&q=${frame}&aqi=yes`)
    const data = await lora.json()
    console.log(data)
    return data
  }
  const onSubmit = async (e) => {
    const result = await cons(e);
    setWeather(result)
  };
  countries.registerLocale(enLocale);
  const theme = useRef(null)
  useEffect(() => {
    if (weather) {
      console.log(weather.location.country);
      console.log(weather.current.condition.text);

      const alpha2 = countries.getAlpha2Code(weather.location.country, "en"); // convert to alpha-2
      setCode(alpha2 || "Not Found");
    }
    if (!weather) return
    theme.current.style.backgroundSize = "cover"
      theme.current.style.backgroundPosition = "center"
      theme.current.style.height = "100vh"
      theme.current.style.Position = "fixed"
      theme.current.style.width = "100%"
      theme.current.style.height = "100%"
    if (weather.current?.condition?.text === "Sunny") {
      theme.current.style.backgroundImage = "url(/sunny.webp)"
    }
    else if (weather.current?.condition?.text === "Partly cloudy") {
      theme.current.style.backgroundImage = "url(/pre-cloud.jpg)"
    }
    else if (weather.current?.condition?.text === "Overcast") {
      theme.current.style.backgroundImage = "url(/pre-cloud.jpg)"
      
    }
    else if (weather.current?.condition?.text === "Mist" || weather.current?.condition?.text === "Fog") {
      theme.current.style.backgroundImage = "url(/mist.jpg)"
      
    }
    else if (weather.current?.condition?.text === "Moderate or heavy rain with thunder" || weather.current?.condition?.text === "Patchy light rain in area with thunder" || weather.current?.condition?.text === "Patchy light rain with thunder") {
      theme.current.style.backgroundImage = "url(/thunder.jpeg)"
      
    }
    else if (weather.current?.condition?.text === "Patchy rain nearby") {
      theme.current.style.backgroundImage = "url(/rainnearby.jpg)"
      
    }
    else if (weather.current?.condition?.text === "Light rain" || weather.current?.condition?.text === "Heavy rain") {
      theme.current.style.backgroundImage = "url(/rainy.jpg)"
    }
    else if (weather.current?.condition?.text === "Snow" || weather.current?.condition?.text === "Patchy snow nearby") {
      theme.current.style.backgroundImage = "url(/snow.jpeg)"
    }
    else if (weather.current?.condition?.text === "Cloudy") {
      theme.current.style.backgroundImage = "url(/sc.jpg)"
      
    }
    else if (weather.current?.condition?.text === "Clear") {
      const time = weather.location?.localtime.split(" ");

      if (time < "12:00") {
        theme.current.style.backgroundImage = "url(/clear.jpg)"
        
      }
      else {
        theme.current.style.backgroundImage = "url(/clearnight1.jpeg)"
      }
    }
    else {
      theme.current.style.backgroundColor = "antiquewhite"
      theme.current.style.height = "100vh"
    }
  }, [weather]);
  return (
    <div className='container' ref={theme}>
      <div className='location'>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <input type="Search" placeholder='Location' {...register("location", { required: { value: true, message: "Location is required" } })} />
          <button type='submit' disabled={isSubmitting}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ color: "black", width: "30px", height: "20px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

        </form>
      </div>
      {errors.location && <p style={{ border: "1px solid red", padding: "5px", borderRadius: "5px", backgroundColor: "rgba(241, 46, 46, 0.43)", margin: "5px" }}>{errors.location.message}</p>}
      <section className='mainpage'>
        {weather && (
          <div>
            <div className="weather">

              <h1 className='temp'>{weather.current.temp_c}°C <span>/{weather.current.temp_f}°F</span></h1>
              <h4>{weather.current.condition.text} <span><img src={weather.current.condition.icon} alt="" style={{ width: "50px" }} /></span></h4>
            </div>
            <div className="displayflex">
              <div className='intro block1'>
                <h2 style={{ color: "grey" }}>Location</h2>
                <h2 className="city">{weather.location.name} <span><img src={`https://flagsapi.com/${code}/flat/64.png`}></img></span></h2>
                <h3>Region: {weather.location.region}</h3>
                <h3>Country: {weather.location.country}</h3>
                <h3>Timezone: {weather.location.tz_id}</h3>
                <h3>Localtime: {weather.location.localtime}</h3>
              </div>
              <div className='intro'>
                <h2 style={{ color: "grey" }}>Latitude</h2>
                <h3>{weather.location.lat}</h3>
                <h2 style={{ color: "grey" }}>Longitude</h2>
                <h3>{weather.location.lon}</h3>
              </div>
              <div className="intro">
                <h2 style={{ color: "grey" }}>Wind</h2>
                <h3>{weather.current.wind_kph} km/h</h3>
                <h3>{weather.current.wind_dir} {weather.current.wind_degree} °</h3>
                <h3>({weather.current.wind_mph} m/h)</h3>
              </div>
              <div className="intro">
                <h2 style={{ color: "grey" }}>Humidity</h2>
                <h3>{weather.current.humidity}%</h3>
                <h2 style={{ color: "grey" }}>Pressure</h2>
                <h3>{weather.current.pressure_mb} mb</h3>
              </div>
              <div className="intro">
                <h2 style={{ color: "grey" }}>Feels Like</h2>
                <h3>{weather.current.feelslike_c}°C</h3>
                <h3>{weather.current.feelslike_f}°F</h3>
                <h2 style={{ color: "grey" }}>Heat Index</h2>
                <h3>{weather.current.heatindex_c}°C</h3>
                <h3>{weather.current.heatindex_f}°F</h3>
              </div>
              <br />
              <div className="intro">
                <h2 style={{ color: "grey" }}>Gust</h2>
                <h3>{weather.current.gust_kph} km/h</h3>
                <h2 style={{ color: "grey" }}>Precipitation</h2>
                <h3>{weather.current.precip_mm} mm</h3>
              </div>
              <div className="intro">
                <h2 style={{ color: "grey" }}>Cloud</h2>
                <h3>{weather.current.cloud}%</h3>
                <h2 style={{ color: "grey" }}>Visibility</h2>
                <h3>{weather.current.vis_km} km</h3>
                <h2 style={{ color: "grey" }}>UV</h2>
                <h3>{weather.current.uv}</h3>
              </div>
              <div className="air">
                <h2 style={{ color: "grey" }}>Air Quality</h2>
                <table>
                  <tr>
                    <td><h3>CO</h3></td>
                    <td><h3>{weather.current.air_quality.co}</h3></td>
                  </tr>
                  <tr>
                    <td><h3>NO2</h3></td>
                    <td><h3>{weather.current.air_quality.no2}</h3></td>
                  </tr>
                  <tr>
                    <td><h3>SO2</h3></td>
                    <td><h3>{weather.current.air_quality.so2}</h3></td>
                  </tr>
                  <tr>
                    <td><h3>O3</h3></td>
                    <td><h3>{weather.current.air_quality.o3}</h3></td>
                  </tr>
                  <tr>
                    <td><h3>PM2.5</h3></td>
                    <td><h3>{weather.current.air_quality.pm2_5}</h3></td>
                  </tr>
                  <tr>
                    <td><h3>PM10</h3></td>
                    <td><h3>{weather.current.air_quality.pm10}</h3></td>
                  </tr>
                </table>
              </div>


            </div>
          </div>
        )}
        <h6 className='foot'>Powered by <a href="https://www.instagram.com/moeezian_webwork/" target="_blank">Moeezian</a></h6>
      </section>

    </div>
  )
}

export default Initial
