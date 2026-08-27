import HeadTag from "../components/common/HeadTag";

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <HeadTag title="Contact Us | Creators Hub Academy" />
        <h1 className="text-4xl font-black text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 mb-8">
          Creators Hub Academy is operated by Stanley Chukwunonso Okonkwo. Reach out for support, partnerships, or general enquiries.
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Email</h2>
            <p className="text-gray-300">support@creatorshubacademy.com</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">WhatsApp</h2>
            <p className="text-gray-300">+234 813 443 8808</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Business Hours</h2>
            <p className="text-gray-300">Monday – Friday, 9:00 AM – 6:00 PM (WAT)</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Operator</h2>
            <p className="text-gray-300">Stanley Chukwunonso Okonkwo</p>
            <p className="text-gray-400 text-sm">Lagos, Nigeria</p>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <h2 className="text-xl font-bold text-white mb-4">Send us a message</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We will contact you shortly.");
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Your name"
                required
                className="w-full border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400"
              />
              <input
                type="email"
                placeholder="Your email"
                required
                className="w-full border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400"
              />
              <textarea
                placeholder="How can we help?"
                rows="5"
                required
                className="w-full border border-zinc-700 bg-zinc-900 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
