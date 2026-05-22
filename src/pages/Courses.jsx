import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import ContentNotFound from "../components/common/ContentNotFound";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import renderStars from "../utils/renderStarts";

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
    refetch();
  };

  console.log(data);

  const handleNextPage = () => {
    if (data.hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <LoaderDotted />;

  return (
    <>
      <HeadTag title="All Courses | Creators Hub Academy" />
      <div className="max-w-7xl mx-auto px-4 py-6 bg-black min-h-screen">
        <h2 className="text-3xl font-bold mb-4 text-center text-white">
          All Courses
        </h2>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6 justify-center">
          <input
            type="text"
            placeholder="Search by title..."
            className="border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 px-4 py-2 rounded w-full md:w-1/2 focus:outline-none focus:border-yellow-400"
            value={inputTerm}
            onChange={(e) => setInputTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 font-medium transition"
          >
            Search
          </button>
        </div>

        {/* Courses List */}
        {data.courses.length === 0 ? (
          <ContentNotFound title="No Courses Found" />
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-zinc-800 bg-zinc-950 p-4 rounded-xl shadow hover:shadow-yellow-400/20 transition"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-48 w-full object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <p className="text-gray-400 mb-1">
                    Created by{" "}
                    <span className="font-semibold text-gray-300">
                      {course.instructor[0]?.displayName || "N/A"}{" "}
                      <span className="text-sm text-yellow-400 mb-1">
                        {renderStars(course.rating)} (
                        {course.rating?.toFixed(1)})
                      </span>
                    </span>
                  </p>

                  <p className="text-gray-400">
                    Enrolled Students:{" "}
                    <span className="font-semibold text-yellow-400">
                      {course.totalEnrollments == 0
                        ? "No Enrollments"
                        : course.totalEnrollments.toString().padStart(2, 0)}
                    </span>{" "}
                  </p>
                  <p className="text-gray-500 mt-3 text-sm">
                    {course.description?.slice(0, 100) + " ..."}
                  </p>
                  <div className="mt-5 flex justify-between items-center">
                    <p className="text-white text-xl font-semibold">
                      Price: ${course.price}
                    </p>
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 font-medium transition"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="join mt-10 flex justify-center">
              <button
                disabled={currentPage === 1}
                onClick={handlePrevPage}
                className="join-item btn text-lg bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
              >
                «
              </button>
              <button className="join-item btn bg-zinc-900 border-zinc-700 text-white">
                Page {currentPage} of {data.totalPages}
              </button>
              <button
                disabled={!data.hasNextPage}
                onClick={handleNextPage}
                className="join-item btn text-lg bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCourses;