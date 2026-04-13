import React from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, HelpCircle, FileText } from "lucide-react";

const Resources = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <section className="bg-secondary text-white pt-24 pb-16 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Resources & Support</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Essential documents, forms, and links to support clean athletes and support personnel.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4">
          
          {/* TUE Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-display font-bold uppercase mb-8 border-b border-border pb-4">Therapeutic Use Exemptions (TUE)</h2>
            <div className="bg-muted/50 p-8 border border-border flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg mb-4">
                  Athletes may have illnesses or conditions that require them to take medications. If the medication an athlete is required to take falls under the Prohibited List, a Therapeutic Use Exemption (TUE) may give that athlete the authorization to take the needed medicine.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase text-sm flex items-center gap-2">
                    <Download className="h-4 w-4" /> TUE Application Form
                  </button>
                  <button className="bg-card border border-border text-foreground px-6 py-3 font-bold uppercase text-sm flex items-center gap-2 hover:bg-muted transition-colors">
                    <FileText className="h-4 w-4" /> TUE Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-2xl font-display font-bold uppercase mb-6 flex items-center gap-2">
                <ExternalLink className="text-primary" /> Key Organizations
              </h2>
              <ul className="space-y-4">
                {[
                  { name: "World Anti-Doping Agency (WADA)", desc: "Global independent agency governing anti-doping." },
                  { name: "Court of Arbitration for Sport (CAS)", desc: "Independent institution facilitating the settlement of sports-related disputes." },
                  { name: "Global DRO", desc: "Drug Reference Online tool for checking medication status." },
                  { name: "International Olympic Committee (IOC)", desc: "Supreme authority of the Olympic movement." }
                ].map((link, i) => (
                  <li key={i} className="group">
                    <a href="#" className="block p-4 border border-border hover:border-primary transition-colors">
                      <h4 className="font-bold uppercase text-primary group-hover:underline">{link.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold uppercase mb-6 flex items-center gap-2">
                <HelpCircle className="text-primary" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  { q: "What is strict liability?", a: "The principle that athletes are responsible for any prohibited substance found in their body, regardless of intent." },
                  { q: "Can I refuse a doping test?", a: "Refusing or failing to submit to sample collection without compelling justification is an Anti-Doping Rule Violation (ADRV)." },
                  { q: "Are nutritional supplements safe?", a: "No supplement is 100% safe. They carry a high risk of contamination with prohibited substances." },
                  { q: "How long is a TUE valid?", a: "TUEs have a specific duration indicated on the certificate, usually between 1 to 4 years depending on the condition." }
                ].map((faq, i) => (
                  <div key={i} className="p-4 bg-card border border-border">
                    <h4 className="font-bold mb-2">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Resources;
