import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGVkMmVlMzA4M2JjNmY2NmJiNTViNWY1ZWFkNmM1ZCIsIm5iZiI6MTczNTY1NzQ2My45NjQsInN1YiI6IjY3NzQwN2Y3MGYyNDhlODUwODEyYjM2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1AwDRSKARTGerTq9YmHkZtcwaX0LaYY4jAbIT3JpRvI'
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options);
        const data = await res.json();
        const trailer = data.results?.find(
          (vid) => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
        );
        setApiData(trailer || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading trailer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading trailer</h3>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back button"
        onClick={() => navigate(-1)}
        className="back-button"
      />
      {apiData ? (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title={apiData.name || 'Movie Trailer'}
            width="90%"
            height="90%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="player-info">
            <p>{apiData.published_at?.slice(0, 10)}</p>
            <p>{apiData.name}</p>
            <p>{apiData.type}</p>
          </div>
        </>
      ) : (
        <div className="no-trailer">
          <h3>No trailer available for this movie</h3>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default Player;
