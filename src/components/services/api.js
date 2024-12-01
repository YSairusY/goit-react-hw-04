import axios from 'axios';

axios.defaults.baseURL = 'https://api.unsplash.com';
const ACCESS_KEY = 'KecNGIf-rDqfLgrhRM82RjnUsv-MSUaxJWkQh-TlEVw';

export const fetchImages = async (query, page) => {
  if (!query || query.trim() === '') {
    console.error('Query cannot be empty');
    return {
      success: false,
      images: [],
      totalPages: 0,
    };
  }
  try {
    const response = await axios.get('/search/photos', {
      params: {
        query,
        client_id: ACCESS_KEY,
        page,
        per_page: 12,
      },
      headers: {
        Accept: 'application/json',
        'Accept-Version': 'v1',
      },
    });
    return {
      success: true,
      images: response.data.results.map(image => ({
        id: image.id,
        urls: image.urls,
        description: image.description,
        likes: image.likes,
      })),
      totalPages: Math.ceil(response.data.total / 12),
    };
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return {
      success: false,
      images: [],
      totalPages: 0,
    };
  }
};

export default fetchImages;
