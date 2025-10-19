import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../../config/api';

const CollectionGrid = ({ collections, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Une erreur est survenue lors du chargement des collections.
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        Aucune collection homme trouvée.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-12">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Collections Homme ({collections.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <Link 
              key={collection.id}
              to={`/collection/${collection.id}`}
              className="group block overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-[3/2] relative overflow-hidden bg-gray-900">
                {collection.image && (
                  <img 
                    src={getImageUrl(collection.image)} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-gray-200 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {collection.description || 'Découvrez notre collection exclusive'}
                    </p>
                  )}
                  <div className="flex items-center mt-3">
                    <span className="text-white text-sm mr-2">Découvrir</span>
                    <ArrowRight size={16} className="text-white group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionGrid;