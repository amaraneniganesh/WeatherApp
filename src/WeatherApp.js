import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, Wind, Droplets, Sun, ThermometerSun, MapPin, Search, Gauge, Eye, Sunrise, Sunset, Moon, CloudRain, Snowflake, Compass, CloudFog } from 'lucide-react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeForecastIndex, setActiveForecastIndex] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true); // Default to Celsius

  const fetchWeatherWithQuery = async (locationQuery) => {
    setLoading(true);
    setError(null);
    try {
      const options = {
        method: 'GET',
        url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
        params: {
          q: locationQuery,
          days: '3'
        },
        headers: {
          'x-rapidapi-key': '86c15bbc87msh2428de2b60ecbc1p1f4531jsn548df7bf80c7',
          'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setWeather(response.data);
      setActiveForecastIndex(null);
      setSelectedHour(null);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    }
    setLoading(false);
  };

  const fetchWeather = async () => {
    if (!query.trim()) return;
    fetchWeatherWithQuery(query);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locationQuery = `${position.coords.latitude},${position.coords.longitude}`;
        setQuery(locationQuery); // Update state
        fetchWeatherWithQuery(locationQuery); // Fetch weather immediately
      }, () => {
        setError("Unable to retrieve location. Please try again.");
      });
    }
  };

  const toggleForecast = (index) => {
    setActiveForecastIndex(activeForecastIndex === index ? null : index);
    setSelectedHour(null);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  const renderDetailCard = (icon, title, value, unit = '') => (
    <div className="detail-card">
      {icon}
      <h3>{title}</h3>
      <p>{value}{unit}</p>
    </div>
  );

  const renderHourlyForecast = (hours) => (
    <div className="hourly-forecast">
      {hours.map((hour, index) => (
        <div
          key={hour.time_epoch}
          className="hour-card"
          onClick={() => setSelectedHour(selectedHour === index ? null : index)}
        >
          <p>{new Date(hour.time).getHours()}:00</p>
          <img src={hour.condition.icon} alt={hour.condition.text} />
          <p>{isCelsius ? Math.round(hour.temp_c) : Math.round(convertToFahrenheit(hour.temp_c))}°{isCelsius ? 'C' : 'F'}</p>
        </div>
      ))}
    </div>
  );

  const renderAstroInfo = (astro) => (
    <div className="astro-info">
      <div className="astro-card">
        <Sunrise size={24} />
        <h3>Sunrise</h3>
        <p>{astro.sunrise}</p>
      </div>
      <div className="astro-card">
        <Sunset size={24} />
        <h3>Sunset</h3>
        <p>{astro.sunset}</p>
      </div>
      <div className="astro-card">
        <Moon size={24} />
        <h3>Moon Phase</h3>
        <p>{astro.moon_phase}</p>
      </div>
    </div>
  );

  return (
    <div className="weather-app">
      <div className="container">
        <form onSubmit={handleSubmit} className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city name or coordinates..."
          />
          <button type="submit"><Search size={20} /></button>
          <button type="button" onClick={getLocationWeather}><MapPin size={20} /></button>
          <button type="button" onClick={toggleTemperatureUnit}>
            {isCelsius ? '°F' : '°C'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {weather && (
          <div className="weather-info">
            <div className="current-weather">
              <h2>{weather.location.name}, {weather.location.country}</h2>
              <div className="temperature">
                {isCelsius
                  ? `${Math.round(weather.current.temp_c)}°C`
                  : `${Math.round(convertToFahrenheit(weather.current.temp_c))}°F`}
              </div>
              <div className="condition">
                <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
                {weather.current.condition.text}
              </div>

              <div className="details">
                {renderDetailCard(<ThermometerSun size={24} />, 'Feels Like', `${Math.round(isCelsius ? weather.current.feelslike_c : convertToFahrenheit(weather.current.feelslike_c))}°${isCelsius ? 'C' : 'F'}`)}
                {renderDetailCard(<Wind size={24} />, 'Wind', `${weather.current.wind_kph}`, 'km/h')}
                {renderDetailCard(<Compass size={24} />, 'Wind Direction', weather.current.wind_dir)}
                {renderDetailCard(<Droplets size={24} />, 'Humidity', `${weather.current.humidity}%`)}
                {renderDetailCard(<Cloud size={24} />, 'Cloud Cover', `${weather.current.cloud}%`)}
                {renderDetailCard(<Gauge size={24} />, 'Pressure', `${weather.current.pressure_mb}`, 'mb')}
                {renderDetailCard(<Eye size={24} />, 'Visibility', `${weather.current.vis_km}`, 'km')}
                {renderDetailCard(<Sun size={24} />, 'UV Index', weather.current.uv)}
                {renderDetailCard(<CloudFog size={24} />, 'Dew Point', `${Math.round(isCelsius ? weather.current.dewpoint_c : convertToFahrenheit(weather.current.dewpoint_c))}°${isCelsius ? 'C' : 'F'}`)}
                {renderDetailCard(<Wind size={24} />, 'Gust', `${weather.current.gust_kph}`, 'km/h')}
              </div>
            </div>

            <div className="forecast">
              {weather.forecast.forecastday.map((day, index) => (
                <div
                  key={day.date}
                  className={`forecast-card ${activeForecastIndex === index ? 'active' : ''}`}
                  onClick={() => toggleForecast(index)}
                >
                  <div className="forecast-header">
                    <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                    <div>
                      <img src={day.day.condition.icon} alt={day.day.condition.text} />
                      <p>
                        {isCelsius
                          ? `${Math.round(day.day.maxtemp_c)}°C / ${Math.round(day.day.mintemp_c)}°C`
                          : `${Math.round(convertToFahrenheit(day.day.maxtemp_c))}°F / ${Math.round(convertToFahrenheit(day.day.mintemp_c))}°F`}
                      </p>
                    </div>
                  </div>
                  
                  {activeForecastIndex === index && (
                    <div className="forecast-details">
                      <div className="details">
                        {renderDetailCard(<Wind size={20} />, 'Max Wind', `${day.day.maxwind_kph}`, 'km/h')}
                        {renderDetailCard(<CloudRain size={20} />, 'Precipitation', `${day.day.totalprecip_mm}`, 'mm')}
                        {renderDetailCard(<Snowflake size={20} />, 'Snow', `${day.day.totalsnow_cm}`, 'cm')}
                        {renderDetailCard(<Eye size={20} />, 'Avg Visibility', `${day.day.avgvis_km}`, 'km')}
                        {renderDetailCard(<Droplets size={20} />, 'Avg Humidity', `${day.day.avghumidity}%`)}
                        {renderDetailCard(<Sun size={20} />, 'UV Index', day.day.uv)}
                      </div>
                      
                      {renderAstroInfo(day.astro)}
                      {renderHourlyForecast(day.hour)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;