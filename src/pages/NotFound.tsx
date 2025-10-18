/**
 * NotFound - 404 page with animated orbit.
 */

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Zap } from "lucide-react";
import { AirButton } from "@/components/ui/air-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-gradient-cosmic-radial opacity-20" />
      
      {/* Orbiting elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary/50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent/50" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary/50" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/50" />
        </motion.div>
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Zap className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse-glow" />
          <h1 className="font-display text-8xl font-bold mb-4 glow-text-primary">404</h1>
          <p className="text-2xl text-muted-foreground mb-8">Page not found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            This route doesn't exist in our verification system. Let's get you back on track.
          </p>
          
          <Link to="/">
            <AirButton variant="hero" size="lg">
              <Home className="h-5 w-5 mr-2" />
              Return Home
            </AirButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
