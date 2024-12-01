import React from 'react';
import s from './SearchBar.module.css';
import { MdOutlineImageSearch } from 'react-icons/md';
import fetchImages from '../services/api';
import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const formRef = useRef();
  const handleChange = evt => {
    setQuery(evt.target.value);
  };

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (query.trim() === '') {
      toast.error('Please enter a search term.');
      return;
    }
    onSubmit(query);
    setQuery('');
    formRef.current.reset();
  };

  return (
    <header>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />

      <form onSubmit={handleSubmit} className={s.searchForm} ref={formRef}>
        <input
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          className={s.searchInput}
          onChange={handleChange}
        />
        <button type="submit" className={s.btn}>
          <MdOutlineImageSearch size={42} />
        </button>
      </form>
    </header>
  );
};

export default SearchBar;
