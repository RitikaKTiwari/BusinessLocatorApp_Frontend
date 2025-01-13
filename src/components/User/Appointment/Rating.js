import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Rating.css'; // Ensure the CSS for the popup is applied

const Rating = ({ userId, businessServiceId, hasRating, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [starDescription, setStarDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing rating on component mount if hasRating is true
  useEffect(() => {
    if (hasRating) {
      const fetchExistingRating = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5196/api/Rating/${userId}/${businessServiceId}`
          );
          const { star, comment, starDescription } = response.data;
          setRating(star);
          setComment(comment);
          setStarDescription(starDescription);
        } catch (err) {
          setError('Failed to fetch existing rating.');
        }
      };

      fetchExistingRating();
    }
  }, [userId, businessServiceId, hasRating]);

  // Handle rating submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5196/api/Rating', {
        userId,
        businessServiceId,
        star: rating,
        starDescription,
        comment,
      });
      onClose();
    } catch (err) {
      setError('Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-popup-overlay">
      <div className="rating-popup">
        <button className="close-ratingpopup" onClick={onClose}>
          X
        </button>
        <h2>{hasRating ? 'View Review' : 'Give Review'}</h2>
        {error && <p className="error">{error}</p>}

        {hasRating ? (
          <div className="existing-rating">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p>{starDescription}</p>
            <p>{comment}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} onClick={() => setRating(star)}>
                  <span className={`star ${rating >= star ? 'filled' : ''}`}>
                    ★
                  </span>
                </label>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your comment here"
            />
            <button className="ratingbutton" type="submit" disabled={loading}>
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Rating;
