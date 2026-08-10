import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import ContentNotFound from "../components/common/ContentNotFound";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import renderStars from "../utils/renderStars";

const fetchCourses = async ({ queryKey }) => {
  const [, { page, searchTerm }] = queryKey;
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses`, {
    params: { page, limit: 9, searchTerm },
  });
  return res.data;
};

const AllCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["courses", { page: currentPage, searchTerm }],
    queryFn: fetchCourses,
  });

  const handleSearch = () => {
    setSearchTerm(inputTerm);
    setCurrentPage(1);
    refetch();
  };

  const handleNextPage = () => {
    if (data?.hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <LoaderDotted />;

  if (data?.courses?.length === 0) return <ContentNotFound title="No Courses Found" />;

  return (
    <>
      <HeadTag title="All Courses | Creators Hub Academy" />
      <div className="max-w-7xl mx-auto px-4 py-10 bg-black min-h-screen">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">All Courses</h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Use coupon code <span className="text-yellow-400 font-bold">CREATOR</span> to enroll in any course for free
        </p>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8 justify-center">
          <input
            type="text"
            placeholder="Search courses..."
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 px-4 py-2 rounded-lg w-full md:w-1/2 focus:outline-none focus:border-yellow-400"
            value={inputTerm}
            onChange={(e) => setInputTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg hover:bg-yellow-500 font-semibold transition"
          >
            Search
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.courses?.map((course) => (
            <div
              key={course._id}
              className="border border-zinc-800 bg-zinc-950 p-4 rounded-xl shadow hover:shadow-yellow-400/20 hover:border-zinc-600 transition-all duration-200 flex flex-col"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />

              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-white leading-tight">{course.title}</h3>

                <p className="text-gray-400 text-sm">
                  By{" "}
                  <span className="text-gray-300 font-medium">
                    {course.instructor?.[0]?.displayName || "Creators Hub Academy"}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">{renderStars(course.rating)}</span>
                  <span className="text-gray-400 text-xs">({course.rating?.toFixed(1)})</span>
                </div>

                <p className="text-gray-400 text-xs">
                  Enrolled:{" "}
                  <span className="text-yellow-400 font-medium">
                    {course.totalEnrollments === 0 ? "Be the first!" : `${course.totalEnrollments} students`}
                  </span>
                </p>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {course.description?.slice(0, 90)}...
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                <div>
                  <p className="text-green-400 font-bold text-lg">FREE</p>
                  <p className="text-gray-600 line-through text-sm">${course.price}</p>
                </div>
                <Link
                  to={`/courses/${course._id}`}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 font-semibold transition text-sm"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="join mt-10 flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className="join-item btn bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            «
          </button>
          <button className="join-item btn bg-zinc-900 border-zinc-700 text-white">
            Page {currentPage} of {data?.totalPages || 1}
          </button>
          <button
            disabled={!data?.hasNextPage}
            onClick={handleNextPage}
            className="join-item btn bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </>
  );
};

export default AllCourses;
