// src/components/ui/Breadcrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items?.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              )}
              {item?.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  {item?.label}
                </Link>
              ) : (
                <span className={`text-sm font-medium ${
                  isLast ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {item?.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;