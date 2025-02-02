import axios from 'axios';
import '../WeatherApp.css'

const API_KEY = '86c15bbc87msh2428de2b60ecbc1p1f4531jsn548df7bf80c7';
const API_HOST = 'weatherapi-com.p.rapidapi.com';

export const fetchWeatherData = async (query: string) => {
  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {
      q: query,
      days: '3'
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};