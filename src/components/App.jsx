import { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import Loader from './Loader/Loader';
import LoadMoreBtn from './LoadMoreBtn/LoadMoreBtn';
import fetchImages from './services/api';
import ImageGallery from './ImageGallery/ImageGallery';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import ImageModal from './ImageModal/ImageModal';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const handleImageSubmit = async query => {
    setImages([]);
    setError(false);
    setLoader(true);
    setPage(1);
    const result = await fetchImages(query, 1);
    setLoader(false);

    if (result.success) {
      setImages(result.images);
      setQuery(query);
      setTotalPages(result.totalPages);
    } else {
      setError(true);
    }
  };

  const loadMoreImages = async () => {
    if (!query) {
      console.error('Query is empty on load more.');
      return;
    }

    setLoadingMore(true);
    const result = await fetchImages(query, page + 1);
    setLoadingMore(false);

    if (result.success) {
      setImages(prevImages => [...prevImages, ...result.images]);
      setPage(prevPage => prevPage + 1);
      setTotalPages(result.totalPages);

      if (page + 1 >= totalPages) {
        toast.error('No more images to load!');
      }
    } else {
      setError(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };
  return (
    <>
      <SearchBar onSubmit={handleImageSubmit} />
      {loader && <Loader />}
      {error && <ErrorMessage />}
      {!loader && images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}

      {!loader && images.length > 0 && page < totalPages && (
        <div>
          <LoadMoreBtn onClick={loadMoreImages} />
          {loadingMore && <Loader />}
        </div>
      )}
      <ImageModal
        modalIsOpen={modalIsOpen}
        onRequestClose={closeModal}
        image={selectedImage}
      />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
    </>
  );
}

export default App;
