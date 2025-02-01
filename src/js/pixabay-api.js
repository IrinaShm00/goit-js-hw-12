import axios from 'axios';

const API_KEY = '47542274-6332373665e9da78801fe67b7';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15; // По заданию 

export async function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`;

  try {
    const { data } = await axios.get(url);
    return data; 
  } catch (error) {
    console.error('Error fetching images:', error.message);
    throw error;
  }
}