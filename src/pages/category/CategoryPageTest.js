import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPageTest = () => {
  const { categorySlug } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">✅ Route CategoryPage fonctionne !</h1>
        <p className="text-xl">Catégorie demandée: <span className="text-blue-400">{categorySlug}</span></p>
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Routes disponibles:</h3>
          <ul className="text-left space-y-2">
            <li>• /category/basket-sport</li>
            <li>• /category/chaussures-classique</li>
            <li>• /category/mules</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageTest;