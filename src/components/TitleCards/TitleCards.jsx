import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGVkMmVlMzA4M2JjNmY2NmJiNTViNWY1ZWFkNmM1ZCIsIm5iZiI6MTczNTY1NzQ2My45NjQsInN1YiI6IjY3NzQwN2Y3MGYyNDhlODUwODEyYjM2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1AwDRSKARTGerTq9YmHkZtcwaX0LaYY4jAbIT3JpRvI'
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const currentRef = cardsRef.current;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.themoviedb.org/3/movie/${category || "now_playing"}?language=en-US&page=1`, options);
        const data = await res.json();
        setApiData(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    currentRef?.addEventListener('wheel', handleWheel);
    return () => {
      currentRef?.removeEventListener('wheel', handleWheel);
    };
  }, [category]);

  if (loading) {
    return (
      <div className="title-cards">
        <h2>{title || "Popular on Netflix"}</h2>
        <div className="loading-cards">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="title-cards">
        <h2>{title || "Popular on Netflix"}</h2>
        <div className="error-cards">Error loading content: {error}</div>
      </div>
    );
  }

  return (
    <div className="title-cards">
      <h2>{title || "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.length > 0 ? (
          apiData.map((card) => (
            <Link to={`/player/${card.id}`} className="card" key={card.id}>
              <img
                src={card.backdrop_path ? `https://image.tmdb.org/t/p/w500/${card.backdrop_path}` : "/placeholder-image.jpg"}
                alt={card.title || "Movie poster"}
                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
              />
              <p>{card.title || "Untitled"}</p>
            </Link>
          ))
        ) : (
          <div className="no-cards">No movies found in this category</div>
        )}
      </div>
    </div>
  );
};

export default TitleCards;
