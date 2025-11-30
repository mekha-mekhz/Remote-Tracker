import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-lime-400">
            Quick Links
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-lime-300 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/tasks" className="hover:text-lime-300 transition">
                Tasks
              </Link>
            </li>
            <li>
              <Link to="/apply-leave" className="hover:text-lime-300 transition">
                Apply Leave
              </Link>
            </li>
            <li>
              <Link to="/leave-status" className="hover:text-lime-300 transition">
                Leave Status
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-lime-300 transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-lime-400">
            Support
          </h2>
          <p className="mb-1">📞 +91 98765 43210</p>
          <p className="mb-1">📧 support@remotetracker.com</p>
          <p className="text-gray-400">Available Mon–Sat (9 AM – 6 PM)</p>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-lime-400">
            Connect with Us
          </h2>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-lime-300 transition">
              🌐 Website
            </a>
            <a href="#" className="hover:text-lime-300 transition">
              🐦 Twitter
            </a>
            <a href="#" className="hover:text-lime-300 transition">
              💼 LinkedIn
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-gray-400 border-t border-white/20 pt-6">
        © {new Date().getFullYear()} Remote Work Tracker. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
