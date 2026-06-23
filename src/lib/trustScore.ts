import Review from "../models/Review.model";

export async function getTrustScore(userId: string) {
  const reviews = await Review.find({
    reviewee: userId,
  });

  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
    };
  }

  const total = reviews.reduce((sum, review) => {
    const reviewAverage =
      (review.communication +
        review.technicalSkills +
        review.reliability +
        review.teamwork) /
      4;

    return sum + reviewAverage;
  }, 0);

  return {
    average: Number((total / reviews.length).toFixed(1)),
    count: reviews.length,
  };
}