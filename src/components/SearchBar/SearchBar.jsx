import React from 'react';
import '../../assest/styles/components/search-bar.css'
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="wew--wew">
    <input
    className='search--bar'
    type="text"
    placeholder="Search product..."
    value={value}
    onChange={onChange}
    />
    </div>
  );
};

export default SearchBar;
