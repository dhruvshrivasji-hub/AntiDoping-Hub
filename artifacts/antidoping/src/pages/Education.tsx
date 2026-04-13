import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, FileWarning, PlayCircle, Download } from "lucide-react";

const Education = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="bg-secondary text-white pt-24 pb-16 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Education & Prevention</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Knowledge is your first line of defense. Understand the rules, your rights, and your responsibilities under the World Anti-Doping Code.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 p-8 border border-primary/20"
            >
              <h2 className="text-2xl font-display font-bold uppercase mb-4 text-primary">Strict Liability</h2>
              <p className="text-muted-foreground mb-4">
                The principle of strict liability means that an athlete is ultimately responsible for any prohibited substance found in their body, regardless of how it got there.
              </p>
              <p className="font-bold">"I didn't know" is not a valid defense.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-muted p-8 border border-border"
            >
              <h2 className="text-2xl font-display font-bold uppercase mb-4">The WADA Code</h2>
              <p className="text-muted-foreground mb-4">
                The World Anti-Doping Code is the core document that harmonizes anti-doping policies, rules, and regulations within sport organizations and among public authorities around the world.
              </p>
              <button className="text-primary font-bold text-sm uppercase tracking-wide flex items-center gap-2 mt-4 hover:underline">
                <Download className="h-4 w-4" /> Download 2024 Code
              </button>
            </motion.div>
          </div>

          <h2 className="text-3xl font-display font-bold uppercase mb-8">E-Learning Modules</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Anti-Doping Basics", duration: "30 min", icon: <BookOpen /> },
              { title: "Supplements & Risks", duration: "45 min", icon: <FileWarning /> },
              { title: "Whereabouts Requirements", duration: "20 min", icon: <Globe /> },
              { title: "The Testing Process", duration: "25 min", icon: <PlayCircle /> },
              { title: "TUE Application Guide", duration: "30 min", icon: <FileText /> },
              { title: "Coaches & Support Staff", duration: "60 min", icon: <GraduationCap /> }
            ].map((module, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-card p-6 border border-border group cursor-pointer"
              >
                <div className="text-primary mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {module.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{module.duration} • Interactive</p>
                <div className="h-1 w-full bg-muted rounded overflow-hidden">
                  <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Add missing icon import
import { Globe, FileText } from "lucide-react";

export default Education;
