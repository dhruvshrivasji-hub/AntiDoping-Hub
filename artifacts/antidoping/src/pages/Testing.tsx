import React from "react";
import { motion } from "framer-motion";
import { MapPin, Beaker, Clock, FileText, CheckCircle2 } from "lucide-react";

const Testing = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <section className="bg-secondary text-white pt-24 pb-16 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">The Testing Process</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Transparent, rigorous, and respectful. Understand what happens during a doping control session and your responsibilities.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold uppercase text-primary border-b-2 border-primary pb-2 mb-6">1. Whereabouts & Notification</h2>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="prose prose-gray dark:prose-invert">
                  <p>Elite athletes in a Registered Testing Pool (RTP) must provide accurate "Whereabouts" information, including a 60-minute time slot every day where they are available for testing.</p>
                  <p>A Doping Control Officer (DCO) can notify you for a test anytime, anywhere. Upon notification, they will show identification, explain your rights, and you must stay in direct sight of the DCO until the process is complete.</p>
                </div>
                <div className="bg-muted p-6 border border-border">
                  <MapPin className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Your Rights</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
                    <li>Have a representative and/or interpreter present</li>
                    <li>Ask for additional information about the process</li>
                    <li>Request modifications if you are a minor or have an impairment</li>
                    <li>Document any concerns on the Doping Control Form</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold uppercase text-primary border-b-2 border-primary pb-2 mb-6">2. Sample Collection</h2>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-muted p-6 border border-border order-2 md:order-1">
                  <Beaker className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Collection Types</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
                    <li><strong>Urine:</strong> You must provide a minimum of 90mL under direct observation by a DCO of the same gender.</li>
                    <li><strong>Blood:</strong> Collected by a qualified Blood Collection Officer (BCO). Usually less than 2 tablespoons.</li>
                    <li><strong>Dried Blood Spot (DBS):</strong> A newer, less invasive method collecting a few drops of blood on a card.</li>
                  </ul>
                </div>
                <div className="prose prose-gray dark:prose-invert order-1 md:order-2">
                  <p>You will choose a sealed sample collection kit. You are responsible for ensuring the kit is intact and handling your own sample until it is sealed.</p>
                  <p>The sample is divided into an 'A' and 'B' bottle. Both are securely sealed. You will verify that the code numbers on the bottles match the forms.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold uppercase text-primary border-b-2 border-primary pb-2 mb-6">3. Paperwork & Analysis</h2>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="prose prose-gray dark:prose-invert">
                  <p>You will declare any medications or supplements taken in the last 7 days on the Doping Control Form. You will then sign the form, confirming the procedure was conducted properly.</p>
                  <p>The samples are sent anonymously (only the code numbers are visible) to a WADA-accredited laboratory. The 'A' sample is analyzed, and the 'B' sample is securely stored.</p>
                </div>
                <div className="bg-muted p-6 border border-border">
                  <FileText className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Results Management</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    If the 'A' sample returns an Adverse Analytical Finding (AAF), you will be notified. You have the right to request the analysis of the 'B' sample.
                  </p>
                  <div className="flex items-center text-sm font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Fair & Independent Review
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Testing;
