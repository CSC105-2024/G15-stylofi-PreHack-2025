import { Outlet, useLocation } from "react-router-dom";
import WallpaperGrid from "@/components/WallpaperGrid";
import Logo from "@/components/Logo";
import { AnimatePresence, motion } from "framer-motion";

import { useRef, useState } from "react";

const AuthLayout = () => {
  const location = useLocation();
  const containerRef = useRef(null);
  const [height, setHeight] = useState("auto");

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <WallpaperGrid />
      <div className="relative z-20 flex justify-center items-center min-h-screen px-4">
        <motion.div
          animate={{ height }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden w-full max-w-md"
        >
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              if (containerRef.current) {
                setHeight(`${containerRef.current.offsetHeight}px`);
              }
            }}
          >
            <motion.div
              key={location.pathname}
              ref={containerRef}
              transition={{ duration: 0.3 }}
              className="bg-background/80 p-8 rounded-2xl shadow-lg"
              onAnimationComplete={() => {
                if (containerRef.current) {
                  setHeight(`${containerRef.current.offsetHeight}px`);
                }
              }}
            >
              <Logo />
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
