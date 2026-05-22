import { FaFacebookF, FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About Creators Hub Academy</h2>
          <p className="text-sm text-gray-300">
            Creators Hub Academy is a premium online learning platform empowering 
            creators, designers, and tech enthusiasts to master in‑demand skills. 
            Learn. Create. Lead. – build your future with expert‑led courses.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/about" className="hover:text-yellow-400 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="/courses" className="hover:text-yellow-400 transition-colors">
                All Courses
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-yellow-400 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-yellow-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Categories – updated with real slugs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/category/web-development" className="hover:text-yellow-400 transition-colors">
                Web Development
              </a>
            </li>
            <li>
              <a href="/category/graphic-design" className="hover:text-yellow-400 transition-colors">
                Graphic Design
              </a>
            </li>
            <li>
              <a href="/category/freelancing-skills" className="hover:text-yellow-400 transition-colors">
                Freelancing Skills
              </a>
            </li>
            <li>
              <a href="/category/ui-ux-design" className="hover:text-yellow-400 transition-colors">
                UI/UX Design
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4 text-gray-300">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 text-lg transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 text-lg transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 text-lg transition-colors"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 text-lg transition-colors"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Creators Hub Academy. All rights reserved. — Learn. Create. Lead.
      </div>
    </footer>
  );
}