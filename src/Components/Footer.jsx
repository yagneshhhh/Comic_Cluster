import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Branding */}
          <h2 className="text-lg font-bold text-white">
            ComicCluster
          </h2>
          
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-700 my-4"></div>

        {/* Bottom Section */}
        <p className="text-center text-xs">
          © {new Date().getFullYear()} ComicCluster. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
