export interface StoreReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export const MockStore = {
  name: "3D Game Store",
  tagline: "Premium 3D Prints & Custom Models",
  rating: 4.9,
  totalReviews: 384,
  starDistribution: [63, 18, 12, 5, 2],
  popularProductIds: ["1", "5", "2", "6", "7", "10", "12", "14"],
  featuredProductId: "1",
  heroProductId: "5",

  reviews: [
    {
      author: "Wangel T.",
      rating: 5,
      text: "Amazing quality on the lattice phone case. Fits perfectly and the print detail is incredible.",
      date: "2 days ago",
    },
    {
      author: "Sarah M.",
      rating: 5,
      text: "Fast shipping and the 3D model exceeded expectations. Will order again!",
      date: "1 week ago",
    },
    {
      author: "Alex K.",
      rating: 4,
      text: "Great products overall. The gaming mouse shell customization is a nice touch.",
      date: "2 weeks ago",
    },
    {
      author: "Priya S.",
      rating: 5,
      text: "Best 3D print shop I have found. Clean finish and accurate dimensions every time.",
      date: "3 weeks ago",
    },
    {
      author: "James L.",
      rating: 4,
      text: "Good communication and quality prints. Delivery was on time.",
      date: "1 month ago",
    },
  ] satisfies StoreReview[],
};
