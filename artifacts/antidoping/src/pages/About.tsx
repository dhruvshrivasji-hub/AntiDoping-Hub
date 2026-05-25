import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Users, Globe, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <section className="bg-secondary text-white pt-24 pb-16 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">About CleanSport</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              We are the independent organization dedicated to protecting the rights of clean athletes and preserving the integrity of sport worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-display font-bold uppercase mb-6 text-primary">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To lead a collaborative worldwide movement for doping-free sport. We believe that athletes have a fundamental right to participate in sport free from the use of performance-enhancing drugs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through education, scientific research, intelligent testing, and transparent results management, we aim to eliminate doping from competition and ensure a level playing field for all.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative h-[400px]"
            >
              <img 
                src="/images/preparation.png" 
                alt="Athlete preparation" 
                className="w-full h-full object-cover shadow-xl"
              />
              <div className="absolute inset-0 bg-primary/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide our decisions, our operations, and our commitment to the athletic community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Integrity",
                desc: "We operate with absolute transparency, honesty, and ethical conduct in all our operations and adjudications."
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Excellence",
                desc: "We employ world-class scientific research, cutting-edge intelligence, and rigorous testing protocols."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Respect",
                desc: "We respect the rights of athletes, honoring their dedication to their sport and their commitment to fair play."
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-8 border border-border"
              >
                <div className="text-primary mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold uppercase mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
