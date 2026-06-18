import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../layout/Loader';

function Card(obj) {
  if (!obj) {
    return <Loader />
  }
  return (
    <div className="relative w-full max-w-[304px] aspect-[2/3] rounded-2xl sm:rounded-[30px] overflow-hidden shadow-lg group mx-auto">
      {/* Background image as <img> for smooth zoom */}
      <img
        src={obj.image}
        alt="card background"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark overlay (optional) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

      {/* Content */}
      <div className="absolute bottom-0 w-full p-3 sm:p-5 text-white flex flex-col gap-1.5 sm:gap-2.5 z-10">
        <Link to={`/movie/${obj.id}`}>
          <h2 className="text-sm sm:text-lg font-bold line-clamp-2 hover:text-red-500 transition-colors leading-tight">{obj.name}</h2>
        </Link>
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-300 font-semibold">
          <span>{obj.year}</span>
          {obj.rating && (
            <span className="text-yellow-500 font-extrabold flex items-center gap-0.5">
              ★ {obj.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
