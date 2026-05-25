import React from "react";
import { Link } from "wouter";
import { Activity, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight text-white">CLEANSPORT</span>
            </Link>
            <p className="text-sm text-secondary-foreground/70 max-w-xs">
              Dedicated to preserving the integrity of sports and protecting the rights of clean athletes worldwide.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-secondary-foreground/70 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-secondary-foreground/70 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-secondary-foreground/70 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-secondary-foreground/70 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Athletes</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link href="/substances" className="hover:text-white transition-colors">Prohibited List</Link></li>
              <li><Link href="/testing" className="hover:text-white transition-colors">Testing Process</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">TUE Applications</Link></li>
              <li><Link href="/education" className="hover:text-white transition-colors">E-Learning</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Organization</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Governance</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">News & Media</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Whistleblower Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} CleanSport. All rights reserved.</p>
          <p>Compete with integrity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
