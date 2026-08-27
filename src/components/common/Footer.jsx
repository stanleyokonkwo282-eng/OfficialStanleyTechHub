import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Creators Hub Academy" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-bold text-white text-lg">
              Creators Hub <span className="text-yellow-400">Academy</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A premium online learning platform empowering creators, designers,
            and entrepreneurs to master in-demand digital skills.
          </p>
          <p className="text-yellow-400 text-xs mt-3 font-semibold tracking-wide">
            LEARN • GROW • CREATE
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-base font-bold mb-4 text-white uppercase tracking-wide">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
            <li><Link to="/courses" className="hover:text-yellow-400 transition-colors">All Courses</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link></li>
            <li><Link to="/faq" className="hover:text-yellow-400 transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
            <li><Link to="/become-teacher" className="hover:text-yellow-400 transition-colors">Become a Teacher</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-base font-bold mb-4 text-white uppercase tracking-wide">Top Categories</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to={`/category/${encodeURIComponent("Design")}`} className="hover:text-yellow-400 transition-colors">Graphic Design</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Video Production")}`} className="hover:text-yellow-400 transition-colors">Video Production</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Marketing")}`} className="hover:text-yellow-400 transition-colors">Digital Marketing</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Social Media")}`} className="hover:text-yellow-400 transition-colors">Social Media</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Business")}`} className="hover:text-yellow-400 transition-colors">Business Skills</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Content Creation")}`} className="hover:text-yellow-400 transition-colors">Content Creation</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Web Development")}`} className="hover:text-yellow-400 transition-colors">Web Development</Link></li>
            <li><Link to={`/category/${encodeURIComponent("Artificial Intelligence")}`} className="hover:text-yellow-400 transition-colors">AI Tools</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-base font-bold mb-4 text-white uppercase tracking-wide">Legal</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/refund-policy" className="hover:text-yellow-400 transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Social + WhatsApp Contact Only */}
        <div>
          <h2 className="text-base font-bold mb-4 text-white uppercase tracking-wide">Connect With Us</h2>
          <div className="flex gap-3 mb-6">
            <a href="https://wa.me/2348134438808" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-zinc-800 hover:bg-yellow-400 hover:text-black text-gray-300 rounded-full flex items-center justify-center transition-all">
              <FaWhatsapp />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-zinc-800 hover:bg-yellow-400 hover:text-black text-gray-300 rounded-full flex items-center justify-center transition-all">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-zinc-800 hover:bg-yellow-400 hover:text-black text-gray-300 rounded-full flex items-center justify-center transition-all">
              <FaYoutube />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-zinc-800 hover:bg-yellow-400 hover:text-black text-gray-300 rounded-full flex items-center justify-center transition-all">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-zinc-800 hover:bg-yellow-400 hover:text-black text-gray-300 rounded-full flex items-center justify-center transition-all">
              <FaTwitter />
            </a>
          </div>

          {/* WhatsApp CTA button only — no bank details */}
          <a
            href="https://wa.me/2348134438808"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition w-full justify-center"
          >
            <FaWhatsapp className="text-lg" />
            Chat Us on WhatsApp
          </a>
          <p className="text-gray-500 text-xs mt-3 text-center">
            For certificate payment and enquiries
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Creators Hub Academy. All rights reserved. — Skills Today • Success Tomorrow
      </div>
    </footer>
  );
}
