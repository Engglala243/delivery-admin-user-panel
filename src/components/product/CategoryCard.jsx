import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${category._id}`}
      className="group block text-center hover:shadow-lg transition-shadow duration-200"
    >
      <div className="bg-white rounded-lg p-6 border border-gray-200 group-hover:border-primary-300">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
          {/* Category icon - you can replace with actual icons */}
          <svg
            className="w-8 h-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;