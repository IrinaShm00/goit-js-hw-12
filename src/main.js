import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/styles.css';
import { fetchImages as pixabayFetchImages } from './js/pixabay-api.js'; // Импорт API-запросов
import { displayImages } from './js/render-functions.js';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const loadMoreBtn = document.getElementById('load-more');
const endMessage = document.getElementById('end-message'); // Для сообщения о конце результатов

let query = '';
let page = 1;
let totalHits = 0; // Общее количество изображений для данного поиска

// для управления загрузчиком
function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

// для загрузки изображений
async function fetchImages(query, page) {
  try {
    showLoader();
    const response = await pixabayFetchImages(query, page, 15);
    return response;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  } finally {
    hideLoader();
  }
}

// для отображения кнопки лоад мор
function toggleLoadMoreButton(show) {
  loadMoreBtn.style.display = show ? 'block' : 'none';
}

// для отображения сообщения о конце результатов
function showEndMessage() {
  endMessage.textContent = "We're sorry, but you've reached the end of search results.";
  endMessage.style.display = 'block';
}

// Плавный скролл
function smoothScroll() {
  const cardHeight = document.querySelector('.gallery-item')?.getBoundingClientRect().height || 0;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

// Обработчик сабмита формы
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  query = searchForm.elements.query.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
    });
    return;
  }

  // Очистка галереи и сброс страницы
  gallery.innerHTML = '';
  page = 1;
  totalHits = 0; // Сбрасываем общее количество изображений
  toggleLoadMoreButton(false);
  endMessage.style.display = 'none'; // Скрываем сообщение о конце

  try {
    const images = await fetchImages(query, page);
    totalHits = images.totalHits; // Обновляем общее количество изображений
    displayImages(images, gallery, lightbox);
    lightbox.refresh();
    toggleLoadMoreButton(images.hits.length === 15);

    if (images.hits.length < 15 || page * 15 >= totalHits) {
      toggleLoadMoreButton(false);
      showEndMessage();
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch images.' });
  }
});

// Обработчик кнопки лоад мор
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  try {
    const images = await fetchImages(query, page);
    gallery.insertAdjacentHTML('beforeend', images.hits.map(img => `<a href="${img.largeImageURL}" class="gallery-item"><img src="${img.webformatURL}" alt="${img.tags}"></a>`).join(''));
    lightbox.refresh();
    smoothScroll(); // Плавный скролл после загрузки

    if (images.hits.length < 15 || page * 15 >= totalHits) {
      toggleLoadMoreButton(false);
      showEndMessage();
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch more images.' });
  }
});
