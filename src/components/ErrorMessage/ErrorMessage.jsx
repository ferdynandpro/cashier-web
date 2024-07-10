// ErrorMessage.js
import React from 'react';

const ErrorMessage = ({ searchTerm, filteredProducts }) => {
  const errorMessage = (searchTerm !== '' && filteredProducts.length === 0) ?
    `No products of ${searchTerm}` :
    '';

  return (
    <p className="error-message">{errorMessage}</p>
  );
};

export default ErrorMessage;
