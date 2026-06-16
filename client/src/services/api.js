import  axios from 'axios';

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL
});

export const shortenUrl = async (url) => {
  const { data } = await api.post('/api/shorten', { originalUrl:url });

  return data;
}

