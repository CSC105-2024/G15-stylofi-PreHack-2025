import { Outlet, useLocation } from "react-router-dom";
import WallpaperGrid from "@/components/WallpaperGrid";
import AnimatedContainer from "@/components/AnimatedContainer";
import Logo from "@/components/Logo";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <WallpaperGrid />
      <div className="relative z-20 flex justify-center items-center min-h-screen px-4">
        <AnimatedContainer key={location.pathname}>
          <Logo />
          <Outlet />
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default AuthLayout;
