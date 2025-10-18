/**
 * Navbar - Global navigation with animated logo and links.
 */

import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AirButton } from '@/components/ui/air-button';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/product', label: 'Product' },
  { to: '/demos', label: 'Demos' },
  { to: '/docs', label: 'Docs' },
  { to: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Zap className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
            <div className="absolute inset-0 blur-md bg-primary/20 group-hover:bg-accent/30 transition-colors" />
          </div>
          <span className="font-display text-xl font-bold">
            AirGate <span className="text-accent">OS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          
          <AirButton variant="hero" size="sm">
            Get Started
          </AirButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto py-4 px-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              <AirButton variant="hero" size="sm" className="w-full mt-2">
                Get Started
              </AirButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
