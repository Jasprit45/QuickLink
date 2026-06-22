import  axios from 'axios';

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL
});

export const shortenUrl = async (url, customAlias) => {
  const { data } = await api.post('/api/shorten', { originalUrl:url ,customAlias });

  return data;
}

export const getClicks = async (code) => {
  const {data} = await api.get(`/api/analytics/${code}`);
  return data;
}

export const getBulkClicks = async (codes) => {
  const {data} = await api.post('/api/analytics', {codes});
  return data;
}

export const deleteUrls = async (codes) => {
  const {data} = await api.delete('/api/url', {
    data: {codes}});
  return  data;
}