import { Outlet, useLocation } from "react-router-dom";
import WallpaperGrid from "@/components/WallpaperGrid";
import Logo from "@/components/Logo";
import { AnimatePresence, motion } from "framer-motion";

import { useRef } from "react";

const AuthLayout = () => {
  const location = useLocation();
  const containerRef = useRef(null);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <WallpaperGrid />
      <div className="relative z-20 flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              ref={containerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background/90 p-8 rounded-2xl shadow-lg"
            >
              <Logo />
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
