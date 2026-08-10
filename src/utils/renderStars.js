const renderStars = (rating) => {
  const safeRating = Number(rating) || 0;
  const stars = Math.round(Math.min(5, Math.max(0, safeRating)));
  return "★".repeat(stars) + "☆".repeat(5 - stars);
};

export default renderStars;
