const testimonials = [
  {
    name: "Chioma Okafor",
    role: "Graphic Designer",
    location: "Lagos, Nigeria",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
    rating: 5,
    text: "Creators Hub Academy changed my life. I started with zero design skills and now I earn 150,000 monthly doing freelance Canva work for clients.",
  },
  {
    name: "Emeka Nwosu",
    role: "Content Creator",
    location: "Abuja, Nigeria",
    avatar: "https://randomuser.me/api/portraits/men/90.jpg",
    rating: 5,
    text: "The CapCut and video editing courses are incredibly detailed. I grew my TikTok from 0 to 50,000 followers in 3 months using what I learned here.",
  },
  {
    name: "Fatima Aliyu",
    role: "Digital Marketer",
    location: "Kano, Nigeria",
    avatar: "https://randomuser.me/api/portraits/women/91.jpg",
    rating: 5,
    text: "I enrolled with the CREATOR coupon and got full access to everything for free. The Digital Marketing course alone is worth millions. Highly recommended!",
  },
  {
    name: "Oluwaseun Adeyemi",
    role: "Freelancer",
    location: "Ibadan, Nigeria",
    avatar: "https://randomuser.me/api/portraits/men/92.jpg",
    rating: 5,
    text: "The certificate is recognized everywhere. I showed it to a client in the UK and got hired immediately. This platform is the real deal for Nigerian creators.",
  },
  {
    name: "Blessing Eze",
    role: "Social Media Manager",
    location: "Port Harcourt, Nigeria",
    avatar: "https://randomuser.me/api/portraits/women/93.jpg",
    rating: 5,
    text: "The progress tracking system is amazing. I can pick up exactly where I stopped and the Mark Complete feature keeps me motivated to finish every lesson.",
  },
  {
    name: "Tunde Fashola",
    role: "UI/UX Designer",
    location: "Lagos, Nigeria",
    avatar: "https://randomuser.me/api/portraits/men/94.jpg",
    rating: 5,
    text: "From Canva to Figma to Photoshop — Creators Hub Academy covers everything a modern designer needs. The quality of the video lessons is world class.",
  },
];

export default function Feedback() {
  return (
    <section className="bg-black py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Student Success Stories
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            What Our Students <span className="text-yellow-400">Say</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real results from real Nigerian students who transformed their
            careers with Creators Hub Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/40 transition flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar with Nigerian flag overlay */}
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center text-white font-black text-lg"
                    style={{
                      background: "linear-gradient(135deg, #1a6b1a 0%, #008000 50%, #1a6b1a 100%)",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-yellow-400 text-xs">{t.role}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <span>🇳🇬</span> {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            Join thousands of Nigerian creators already learning at Creators Hub Academy
          </p>
          <p className="text-yellow-400 font-bold mt-1">
            Enroll FREE today — Use coupon code: CREATOR
          </p>
        </div>
      </div>
    </section>
  );
}
