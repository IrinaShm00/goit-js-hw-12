export function displayImages(images, galleryElement, lightbox) {
  galleryElement.innerHTML = ''; // Очищення галереї перед додаванням нових зображень

  if (images.hits.length === 0) {
    iziToast.info({
      title: 'Info',
      message: 'Sorry, there are no images matching your search query. Please try again!',
    });
    return;
  }

  const markup = images.hits
    .map(
      (image) => `
      <div class="gallery-item">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" class="gallery-image" />
        </a>
        <div class="image-info">
        <p><strong>Tags:</strong> ${image.tags}</p>
          <p>Likes: ${image.likes}</p>
          <p>Views: ${image.views}</p>
          <p>Comments: ${image.comments}</p>
          <p>Downloads: ${image.downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  galleryElement.insertAdjacentHTML('beforeend', markup);

  // Оновлення lightbox
  setTimeout(() => {
    lightbox.refresh();
  }, 0);
}


 