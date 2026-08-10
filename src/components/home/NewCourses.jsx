import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import ContentNotFound from "../common/ContentNotFound";
import CourseCard from "../common/CourseCard";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-zinc-900 border border-zinc-700 shadow p-2 rounded-full hover:bg-zinc-800 transition"
    aria-label="Previous slide"
  >
    <FaArrowLeft className="text-yellow-400" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-6 top-1/2 z-10 bg-zinc-900 border border-zinc-700 shadow p-2 rounded-full hover:bg-zinc-800 transition"
    aria-label="Next slide"
  >
    <FaArrowRight className="text-yellow-400" />
  </button>
);

export default function NewCourses() {
  const { data: newCourses = [] } = useQuery({
    queryKey: ["newCourses"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/new`
      );

      return response.data.courses;
    },
  });

  const settings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  }), []);

  if (newCourses.length === 0)
    return <ContentNotFound title="No Recent Courses available" />;

  return (
    <section className="pb-16 pt-8 md:pb-32 md:pt-16 bg-black relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-10">
          Recently Added <span className="text-yellow-400">Courses</span>
        </h2>

        <Slider {...settings}>
          {newCourses.map((course, index) => (
            <CourseCard key={course._id || index} course={course} />
          ))}
        </Slider>
      </div>
    </section>
  );
}
