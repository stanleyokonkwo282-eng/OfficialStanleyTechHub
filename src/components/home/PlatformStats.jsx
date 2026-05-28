import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

export default function PlatformStats() {
  const { data: statistics } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/statistics`
      );
      return response.data.data;
    },
  });

  const stats = [
    {
      value: statistics?.totalUsers ? `${statistics.totalUsers}+` : "3,000+",
      label: "Students Enrolled",
      icon: "👨‍🎓",
      desc: "And growing daily",
    },
    {
      value: statistics?.totalCourses ? `${statistics.totalCourses}+` : "25+",
      label: "Digital Courses",
      icon: "📚",
      desc: "All 100% free to access",
    },
    {
      value: "90+",
      label: "Video Lessons",
      icon: "🎬",
      desc: "Step-by-step tutorials",
    },
    {
      value: statistics?.totalEnrollments
        ? `${statistics.totalEnrollments}+`
        : "5,000+",
      label: "Course Enrollments",
      icon: "🏆",
      desc: "Using coupon CREATOR",
    },
  ];

  return (
    <section className="bg-zinc-950 border-y border-zinc-800 py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Our Impact
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            Unlock Your Potential with{" "}
            <span className="text-yellow-400">Creators Hub Academy</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Nigeria's fastest growing digital skills platform — empowering
            creators to earn more, do more, and become more.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-black border border-zinc-800 rounded-2xl p-6 text-center hover:border-yellow-400/50 transition"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-4xl font-black text-yellow-400 mb-1">
                {stat.value}
              </p>
              <p className="text-white font-bold text-sm mb-1">{stat.label}</p>
              <p className="text-gray-500 text-xs">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black text-white mb-2">
            Ready to Start Learning for Free?
          </h3>
          <p className="text-gray-400 mb-6">
            Use coupon code{" "}
            <span className="text-yellow-400 font-bold text-lg">CREATOR</span>{" "}
            to enroll in any course at no cost.
          </p>
          <Link
            to="/courses"
            className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition inline-block"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
