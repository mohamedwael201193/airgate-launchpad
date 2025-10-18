/**
 * Footer - Site footer with links and branding.
 */

import { Link } from 'react-router-dom';
import { Zap, Github, Twitter } from 'lucide-react';

const footerSections = [
  {
    title: 'Product',
    links: [
      { to: '/product', label: 'Features' },
      { to: '/demos', label: 'Demos' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/docs', label: 'Documentation' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/partners', label: 'Partners' },
      { to: '/blog', label: 'Blog' },
      { to: '/careers', label: 'Careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold">
                AirGate <span className="text-accent">OS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Privacy-first eligibility and verification, powered by AIR credentials.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AirGate OS. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built on <span className="text-accent font-semibold">AIR Protocol</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
