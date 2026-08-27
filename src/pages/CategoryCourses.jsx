import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router";
import ContentNotFound from "../components/common/ContentNotFound";
import LoaderDotted from "../components/common/LoaderDotted";
import HeadTag from "../components/common/HeadTag";
import renderStars from "../utils/renderStars";

export default function CategoryCourses() {
  const { category } = useParams();

  const displayCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const { data: response, isLoading } = useQuery({
    queryKey: ["categoryCourses", category],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses?category=${category}`
      );
      return res.data; // could be array or { courses: [...] }
    },
    enabled: !!category,
  });

  // Safely extract the courses array
  const courses = Array.isArray(response)
    ? response
    : response?.courses || [];

  if (isLoading) return <LoaderDotted />;

  return (
    <>
      <HeadTag title={`${displayCategory} Courses | Creators Hub Academy`} />
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {displayCategory} <span className="text-yellow-400">Courses</span>
          </h1>

          {courses.length === 0 ? (
            <ContentNotFound title={`No courses found in ${displayCategory}`} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow hover:shadow-yellow-400/20 transition"
                >
                  <img
                    src={course.image || course.thumbnail || "/logo.png"}
                    alt={course.title}
                    loading="lazy"
                    decoding="async"
                    className="h-48 w-full object-cover rounded mb-4"
                    onError={(e) => { e.target.src = "/logo.png"; }}
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    By{" "}
                    <span className="text-gray-300">
                      {course.instructor?.[0]?.displayName || "N/A"}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">
                      {renderStars(course.rating)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({course.rating?.toFixed(1)})
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-green-400 font-bold">₦5,000</span>
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
          )}
        </div>
      </div>
    </>
  );
}
