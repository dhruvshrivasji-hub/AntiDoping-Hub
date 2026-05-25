import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockSubstances = [
  { id: 1, name: "Pseudoephedrine", category: "Stimulants", status: "Prohibited In-Competition", limit: "Threshold: 150 mcg/mL" },
  { id: 2, name: "Testosterone", category: "Anabolic Agents", status: "Prohibited At All Times", limit: "None" },
  { id: 3, name: "Salbutamol", category: "Stimulants", status: "Prohibited In-Competition", limit: "Threshold: 1000 ng/mL" },
  { id: 4, name: "Insulin", category: "Peptide Hormones", status: "Prohibited At All Times", limit: "None" },
  { id: 5, name: "Ibuprofen", category: "Beta-2 Agonists", status: "Permitted", limit: "None" },
  { id: 6, name: "Caffeine", category: "Monitoring Program", status: "Permitted", limit: "Monitored for misuse" },
  { id: 7, name: "Erythropoietin (EPO)", category: "Peptide Hormones", status: "Prohibited At All Times", limit: "None" },
  { id: 8, name: "Cannabis / THC", category: "Cannabinoids", status: "Prohibited In-Competition", limit: "Threshold applies" },
];

const Substances = () => {
  const [query, setQuery] = useState("");

  const filtered = mockSubstances.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <section className="bg-secondary text-white pt-24 pb-16 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Prohibited List</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Search for medications, active ingredients, and substances to check their status under the current WADA Prohibited List.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container max-w-5xl">
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
            <Input 
              placeholder="Search by substance name, medication, or category..." 
              className="pl-12 h-16 text-lg rounded-none border-2 border-border focus-visible:border-primary focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="bg-card border border-border shadow-sm">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50 font-bold uppercase text-xs tracking-wider text-muted-foreground">
              <div className="col-span-4">Substance</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Notes</div>
            </div>
            
            <div className="divide-y divide-border">
              {filtered.length > 0 ? (
                filtered.map((substance, idx) => (
                  <motion.div 
                    key={substance.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-12 md:col-span-4 font-bold text-lg">{substance.name}</div>
                    <div className="col-span-12 md:col-span-3 text-muted-foreground text-sm">{substance.category}</div>
                    <div className="col-span-12 md:col-span-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase ${
                        substance.status.includes('Prohibited At All Times') ? 'bg-destructive/10 text-destructive' :
                        substance.status.includes('Prohibited In-Competition') ? 'bg-orange-500/10 text-orange-600' :
                        'bg-green-500/10 text-green-600'
                      }`}>
                        {substance.status.includes('Prohibited') ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {substance.status}
                      </span>
                    </div>
                    <div className="col-span-12 md:col-span-2 text-sm flex items-center gap-2 text-muted-foreground">
                      {substance.limit !== "None" && <Info className="h-4 w-4 text-primary" />}
                      {substance.limit}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  No substances found matching "{query}". 
                  <p className="text-sm mt-2">Check the spelling or try searching by category.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-6 rounded text-sm text-blue-900 dark:text-blue-200">
            <strong>Disclaimer:</strong> This database is for informational purposes only. The official WADA Prohibited List is the authoritative document. If in doubt, consult with your National Anti-Doping Organization or a sports medicine professional.
          </div>
        </div>
      </section>
    </div>
  );
};

export default Substances;
