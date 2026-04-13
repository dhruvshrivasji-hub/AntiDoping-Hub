import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Target, Award, ArrowRight, Search, FileText } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="/images/hero.png" 
            alt="Sprinters leaving starting blocks" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-20 text-center text-white px-4 md:px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 mb-6 bg-primary font-bold text-sm tracking-widest uppercase">
              Play True. Play Fair.
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6 max-w-4xl mx-auto uppercase">
              The True Measure of Greatness
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium">
              We stand for athletes who win through hard work, dedication, and natural talent. Protecting the integrity of sports worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/education" className="bg-primary text-white hover:bg-primary/90 px-8 py-4 font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2 transition-all">
                Learn the Rules <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/substances" className="bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 px-8 py-4 font-bold uppercase tracking-wide text-sm flex items-center justify-center transition-all">
                Check Medications
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Impact */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-5xl md:text-6xl font-display font-bold text-primary mb-2">350K+</h3>
              <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Tests Conducted Annually</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-5xl md:text-6xl font-display font-bold text-primary mb-2">180+</h3>
              <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Countries Compliant</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-5xl md:text-6xl font-display font-bold text-primary mb-2">1.2M</h3>
              <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Athletes Educated</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 uppercase">Our Foundation</h2>
            <p className="text-muted-foreground text-lg">
              CleanSport operates on three core pillars designed to protect the rights of clean athletes and ensure a level playing field globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-card p-8 border border-border shadow-sm flex flex-col items-start"
            >
              <div className="p-4 bg-primary/10 text-primary rounded-none mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">Prevention</h3>
              <p className="text-muted-foreground mb-6 flex-1">
                Value-based education programs and awareness campaigns targeting athletes from the grassroots level to the elite stage.
              </p>
              <Link href="/education" className="text-primary font-bold text-sm uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-card p-8 border border-border shadow-sm flex flex-col items-start"
            >
              <div className="p-4 bg-primary/10 text-primary rounded-none mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">Detection</h3>
              <p className="text-muted-foreground mb-6 flex-1">
                Intelligent, targeted, and rigorous testing programs both in and out of competition, supported by advanced scientific research.
              </p>
              <Link href="/testing" className="text-primary font-bold text-sm uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-card p-8 border border-border shadow-sm flex flex-col items-start"
            >
              <div className="p-4 bg-primary/10 text-primary rounded-none mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">Adjudication</h3>
              <p className="text-muted-foreground mb-6 flex-1">
                Fair, transparent, and independent results management and disciplinary processes protecting the rights of all athletes.
              </p>
              <Link href="/about" className="text-primary font-bold text-sm uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testing Process Callout with Image */}
      <section className="py-24 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 uppercase text-white">The Testing Process</h2>
              <p className="text-lg text-gray-300 mb-8 font-light">
                Testing is essential to protect clean sport. Understand what happens during a doping control session, your rights, and your responsibilities as an elite athlete.
              </p>
              
              <ul className="space-y-6 mb-10">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-white">1</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Notification</h4>
                    <p className="text-gray-400 text-sm mt-1">You will be notified by a Doping Control Officer (DCO) who will explain your rights.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-white">2</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Sample Collection</h4>
                    <p className="text-gray-400 text-sm mt-1">Provision of a urine and/or blood sample under direct observation.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-white">3</div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Analysis</h4>
                    <p className="text-gray-400 text-sm mt-1">Samples are sent to a WADA-accredited laboratory for analysis.</p>
                  </div>
                </li>
              </ul>
              
              <Link href="/testing" className="inline-flex bg-white text-secondary hover:bg-gray-100 px-8 py-4 font-bold uppercase tracking-wide text-sm items-center justify-center transition-all">
                Full Testing Guide
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px] border border-white/10"
            >
              <img 
                src="/images/testing.png" 
                alt="Sports medical testing facility" 
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Tools */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 uppercase">Athlete Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Essential resources for staying compliant with the World Anti-Doping Code.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link href="/substances" className="group block relative overflow-hidden bg-card border border-border hover:border-primary transition-colors">
              <div className="p-10">
                <Search className="h-10 w-10 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-2 uppercase">Prohibited List Search</h3>
                <p className="text-muted-foreground mb-6">Search medications and ingredients to verify if they are permitted in or out of competition.</p>
                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                  Search Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/resources" className="group block relative overflow-hidden bg-card border border-border hover:border-primary transition-colors">
              <div className="p-10">
                <FileText className="h-10 w-10 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-2 uppercase">TUE Applications</h3>
                <p className="text-muted-foreground mb-6">Need to take a prohibited substance for a legitimate medical condition? Apply for a Therapeutic Use Exemption.</p>
                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                  Download Forms <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial / Fair Play */}
      <section className="py-24 relative overflow-hidden flex items-center min-h-[600px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/fair-play.png" 
            alt="Athletes shaking hands" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-8" />
            <blockquote className="text-2xl md:text-4xl font-display font-medium text-white leading-tight mb-8">
              "A medal means nothing if you didn't earn it honestly. Clean sport is about respecting yourself, your competitors, and the spirit of the game."
            </blockquote>
            <cite className="block">
              <span className="text-primary font-bold text-lg uppercase tracking-wide block">Sarah Jenkins</span>
              <span className="text-gray-400 text-sm">Olympic Gold Medalist, Track & Field</span>
            </cite>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
