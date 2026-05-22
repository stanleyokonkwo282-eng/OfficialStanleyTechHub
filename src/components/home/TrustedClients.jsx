const partners = [
  "Google",
  "Airbnb",
  "Facebook",
  "LinkedIn",
  "Slack",
  "Spotify",
  "GitHub",
];

export default function TrustedClients() {
  return (
    <section className="px-6 md:px-0 py-16 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
          Our Partner <span className="text-indigo-600">Companies</span>
        </h2>
        <p className="text-gray-500 mb-10 md:mb-16 text-lg">
          We are Trusted by industry leaders around the world
        </p>

        <div className="flex flex-wrap justify-center gap-5 items-center text-gray-700">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="hover:bg-amber-100 transition-all duration-500 bg-gray-100 rounded p-6 flex-1"
            >
              <p className="text-3xl md:text-5xl font-semibold">{partner}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}