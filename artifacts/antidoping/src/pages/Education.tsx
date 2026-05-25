import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, FlaskConical, MapPin, Microscope, FileCheck, AlertTriangle,
  ChevronDown, CheckCircle, XCircle, Lock, Trophy, ArrowRight
} from "lucide-react";
import { useUser } from "@clerk/react";
import { completeModule, getProgress } from "@/lib/api";
import { Link } from "wouter";

// ─── Module Data ────────────────────────────────────────────────────────────

interface QuizQ {
  question: string;
  options: string[];
  correct: number;
}

interface ModuleData {
  slug: string;
  title: string;
  duration: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  sections: { heading: string; body: React.ReactNode }[];
  facts: string[];
  quiz: QuizQ[];
}

const MODULES: ModuleData[] = [
  {
    slug: "intro-anti-doping",
    title: "Anti-Doping Basics",
    duration: "30 min",
    tagline: "Understand WADA, strict liability, and your core responsibilities as an athlete.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "#DC2626",
    sections: [
      {
        heading: "What Is Doping?",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>Doping in sport refers to the use of prohibited substances or methods to gain an unfair competitive advantage. The term originates from the Dutch word <em>doop</em> — a thick grape-juice sauce used as a stimulant by ancient Zulus.</p>
            <p>Modern anti-doping efforts began in the 1960s after cyclist Tom Simpson died during the Tour de France with amphetamines in his system. The International Olympic Committee began testing in 1968, and WADA — the World Anti-Doping Agency — was founded in Lausanne, Switzerland in <strong className="text-white">1999</strong> to create one global standard.</p>
            <p>WADA manages the <strong className="text-white">World Anti-Doping Code</strong>, a document that harmonizes anti-doping policies across all sports and countries. Currently in its 2021 version, it defines 10 Anti-Doping Rule Violations (ADRVs) and the sanctions for each.</p>
          </div>
        ),
      },
      {
        heading: "Strict Liability — The Core Principle",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>The most important concept every athlete must understand is <strong className="text-white">strict liability</strong>: you are solely responsible for every substance found in your body — regardless of how it got there.</p>
            <p>It does not matter if a coach gave you a supplement, a doctor prescribed a medication, or a contaminated product caused the positive test. The <strong className="text-white">athlete bears the burden</strong> of proving how the substance entered their system and whether they bear fault or negligence.</p>
            <p>"I didn't know" is not a valid defense. "I didn't mean to" is not a valid defense. Your responsibility is to verify every product you consume using tools like Global DRO or Informed Sport before use.</p>
          </div>
        ),
      },
      {
        heading: "Your Rights as an Athlete",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>While strict liability places responsibility on you, the Code also protects your rights:</p>
            <ul className="list-none space-y-2">
              {[
                "Request analysis of your B-sample if your A-sample tests positive",
                "Be represented at a B-sample opening",
                "Have a fair hearing before a neutral panel",
                "Appeal results to the Court of Arbitration for Sport (CAS)",
                "Apply for a Therapeutic Use Exemption (TUE) for genuine medical needs",
                "Have your personal information kept confidential",
              ].map((right) => (
                <li key={right} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{right}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
    facts: [
      "WADA was founded in Lausanne, Switzerland in 1999",
      "The WADA Code currently defines 10 Anti-Doping Rule Violations",
      "Over 300 sports organizations and 190 governments follow the Code",
      "The Prohibited List is updated annually, effective 1 January each year",
    ],
    quiz: [
      {
        question: "What does WADA stand for?",
        options: ["World Athletics Doping Authority", "World Anti-Doping Agency", "Worldwide Athletic Drug Administration", "World Association of Drug Awareness"],
        correct: 1,
      },
      {
        question: "Which principle means an athlete is responsible for ANY substance found in their body, regardless of how it got there?",
        options: ["Proportional Liability", "Shared Liability", "Strict Liability", "Assumed Consent"],
        correct: 2,
      },
      {
        question: "When was WADA established?",
        options: ["1984", "1992", "1999", "2004"],
        correct: 2,
      },
      {
        question: "How many Anti-Doping Rule Violations (ADRVs) are defined in the current WADA Code?",
        options: ["5", "7", "10", "14"],
        correct: 2,
      },
      {
        question: "A coach secretly adds a prohibited substance to an athlete's drink. Under strict liability, who is responsible?",
        options: ["The coach only", "The sports federation", "Neither — it was accidental", "The athlete, regardless of how it entered their body"],
        correct: 3,
      },
      {
        question: "Which organisation is responsible for publishing the global Prohibited List?",
        options: ["The International Olympic Committee (IOC)", "The World Anti-Doping Agency (WADA)", "Each national sports federation independently", "The United Nations Office on Drugs and Crime"],
        correct: 1,
      },
    ],
  },
  {
    slug: "prohibited-substances",
    title: "Prohibited Substances & Risks",
    duration: "45 min",
    tagline: "Navigate the WADA Prohibited List — categories, risks, and supplement contamination.",
    icon: <FlaskConical className="h-6 w-6" />,
    color: "#b45309",
    sections: [
      {
        heading: "How the Prohibited List Works",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>WADA publishes the <strong className="text-white">Prohibited List</strong> annually, effective 1 January. A substance or method is prohibited if it meets two of three criteria: it enhances (or potentially enhances) performance, it represents an actual or potential health risk, or it violates the spirit of sport.</p>
            <p>The list is divided into <strong className="text-white">Substances and Methods Prohibited At All Times</strong> (S0–S5, M1–M3) and <strong className="text-white">Substances Prohibited In Competition Only</strong> (S6–S9, P1). A substance is in-competition if your sample is collected during a competition period.</p>
            <p>Key categories include: <strong className="text-white">S1 Anabolic Agents</strong> (steroids, SARMs, Clenbuterol), <strong className="text-white">S2 Peptide Hormones</strong> (EPO, HGH, IGF-1), <strong className="text-white">S3 Beta-2 Agonists</strong>, <strong className="text-white">S4 Hormone & Metabolic Modulators</strong>, and <strong className="text-white">S5 Diuretics & Masking Agents</strong>.</p>
          </div>
        ),
      },
      {
        heading: "Specified vs. Non-Specified Substances",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>This distinction affects the sanction length. <strong className="text-white">Non-Specified Substances</strong> (like anabolic steroids and EPO) carry a default 4-year ban. <strong className="text-white">Specified Substances</strong> are those more likely to be used for reasons other than performance enhancement, and carry a minimum sanction that can be reduced to a reprimand if the athlete can show no significant fault.</p>
            <p>However, <em>all</em> prohibited substances remain prohibited. The "specified" label does not make a substance safer or less serious — it only affects the range of sanctions available.</p>
          </div>
        ),
      },
      {
        heading: "Supplement Contamination Risk",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>Studies show that <strong className="text-white">up to 25% of supplements</strong> sold globally may contain prohibited substances not listed on the label. These include anabolic agents, stimulants, and hormone modulators — often from cross-contamination in manufacturing facilities.</p>
            <p>Athletes who test positive due to a contaminated supplement are still liable under strict liability. However, they may demonstrate <em>no significant fault or negligence</em> to reduce their sanction — but only if they took genuine precautions before use.</p>
            <p>Always check products on <strong className="text-white">Global DRO</strong> or use <strong className="text-white">Informed Sport certified</strong> products. Never rely on a manufacturer's claim that a product is "clean."</p>
          </div>
        ),
      },
    ],
    facts: [
      "The Prohibited List is updated annually and takes effect on 1 January",
      "EPO (erythropoietin) boosts red blood cell production, improving endurance",
      "Up to 25% of supplements may contain undisclosed prohibited substances",
      "Clenbuterol is often found in contaminated meat, especially from some countries",
    ],
    quiz: [
      {
        question: "When does the updated WADA Prohibited List take effect each year?",
        options: ["1 July", "1 January", "1 March", "1 October"],
        correct: 1,
      },
      {
        question: "Which of these is a NON-SPECIFIED substance carrying a default 4-year ban?",
        options: ["Salbutamol", "Methylhexaneamine", "Anabolic steroids", "Pseudoephedrine"],
        correct: 2,
      },
      {
        question: "What percentage of supplements may contain undisclosed prohibited substances according to studies?",
        options: ["Less than 2%", "Around 5%", "Up to 25%", "More than 50%"],
        correct: 2,
      },
      {
        question: "What does EPO (erythropoietin) primarily do to improve athletic performance?",
        options: ["Increases muscle mass and strength", "Stimulates red blood cell production, boosting endurance", "Suppresses pain signals during competition", "Accelerates recovery from muscle injury"],
        correct: 1,
      },
      {
        question: "Which tool should athletes use to check whether a specific medication is prohibited?",
        options: ["A general internet search", "Their club doctor's opinion", "Global DRO (Drug Reference Online) or Informed Sport", "The manufacturer's label alone"],
        correct: 2,
      },
      {
        question: "A substance 'prohibited in competition only' means it is banned...",
        options: ["At all times, 365 days a year", "Only when an athlete is actively racing or playing", "During the competition period defined by the relevant sport", "Only if the athlete is in the top 10 of their sport"],
        correct: 2,
      },
    ],
  },
  {
    slug: "testing-procedures",
    title: "The Testing Process",
    duration: "25 min",
    tagline: "Know what to expect from notification through sample collection and results.",
    icon: <Microscope className="h-6 w-6" />,
    color: "#1d4ed8",
    sections: [
      {
        heading: "Types of Testing",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-white">In-competition testing</strong> takes place during a competition period — typically from the day before to the day after competition. Athletes may be selected randomly, by finishing position, or by suspicion. Testing authorities include WADA, national anti-doping organizations (NADOs), and sports federations.</p>
            <p><strong className="text-white">Out-of-competition testing</strong> (OOC) can happen at any time, any place, with no advance notice. This is why top athletes in the Registered Testing Pool must file whereabouts information — so they can be located for surprise tests.</p>
            <p>The <strong className="text-white">Athlete Biological Passport (ABP)</strong> is a longitudinal profile of an athlete's biological parameters over time. Unusual variations trigger further investigation, even without finding a specific prohibited substance.</p>
          </div>
        ),
      },
      {
        heading: "The Sample Collection Procedure",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>When notified by a <strong className="text-white">Doping Control Officer (DCO)</strong>, you must:</p>
            <ul className="list-none space-y-1.5 mb-3">
              {[
                "Acknowledge the notification immediately by signing the form",
                "Remain under direct or indirect supervision at all times",
                "Go directly to the Doping Control Station (delay only with valid reason)",
                "Select a sealed collection vessel",
                "Provide a urine sample of at least 90ml under observation",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p>The sample is split into an <strong className="text-white">A-sample</strong> (analyzed first) and a <strong className="text-white">B-sample</strong> (sealed and stored). The B-sample can be analyzed later to confirm the A-sample result, and the athlete has the right to be present or represented at the B-sample opening.</p>
          </div>
        ),
      },
      {
        heading: "Results Management",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>If an Adverse Analytical Finding (AAF) is reported, the process is:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Laboratory reports AAF to the testing authority</li>
              <li>Testing authority reviews for TUE or departures from procedures</li>
              <li>Athlete is notified confidentially and may request B-sample analysis</li>
              <li>Provisional suspension may be imposed</li>
              <li>Hearing before an independent panel</li>
              <li>Sanction issued (can be appealed to CAS)</li>
            </ol>
            <p className="mt-3">The entire process typically takes 6–18 months.</p>
          </div>
        ),
      },
    ],
    facts: [
      "Athletes must provide a minimum 90ml urine sample",
      "The A-sample is analyzed; the B-sample is sealed and stored for confirmation",
      "Athletes may refuse to be tested, but refusal itself is an ADRV",
      "WADA-accredited labs follow strict ISO 17025 quality standards",
    ],
    quiz: [
      {
        question: "When an athlete is notified for doping control, what must they do immediately?",
        options: [
          "Request a 24-hour delay to consult their doctor",
          "Contact their national federation before reporting",
          "Report immediately and remain under supervision until sample is given",
          "Provide written consent before any testing begins",
        ],
        correct: 2,
      },
      {
        question: "What is the minimum urine sample volume required for doping control?",
        options: ["30ml", "60ml", "90ml", "150ml"],
        correct: 2,
      },
      {
        question: "What is the purpose of the B-sample in doping control?",
        options: [
          "It is tested immediately alongside the A-sample",
          "It allows the athlete to confirm or contest the A-sample result",
          "It is kept for 10 years and then destroyed",
          "It is shared with the athlete's national federation",
        ],
        correct: 1,
      },
      {
        question: "What is an Adverse Analytical Finding (AAF)?",
        options: [
          "A formal warning issued for a missed whereabouts appointment",
          "A laboratory report detecting a prohibited substance or method",
          "A failed application for a Therapeutic Use Exemption",
          "A notice that an athlete refused to provide a sample",
        ],
        correct: 1,
      },
      {
        question: "What is the Athlete Biological Passport (ABP)?",
        options: [
          "A travel document required for international competition",
          "A certificate confirming the athlete has never tested positive",
          "A longitudinal record of biological parameters monitored over time",
          "A complete medical history shared between NADOs and WADA",
        ],
        correct: 2,
      },
      {
        question: "Is it an anti-doping rule violation to refuse to provide a sample when notified by a Doping Control Officer?",
        options: [
          "No — athletes can refuse without consequence",
          "Only if the athlete is in a registered testing pool",
          "Yes — refusal is treated the same as a positive test",
          "Only during in-competition testing, not out-of-competition",
        ],
        correct: 2,
      },
    ],
  },
  {
    slug: "therapeutic-use-exemptions",
    title: "TUE Application Guide",
    duration: "30 min",
    tagline: "Learn how to legally use prohibited medications for genuine medical conditions.",
    icon: <FileCheck className="h-6 w-6" />,
    color: "#15803d",
    sections: [
      {
        heading: "What Is a Therapeutic Use Exemption?",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>A <strong className="text-white">Therapeutic Use Exemption (TUE)</strong> is a formal authorization that allows an athlete to use an otherwise prohibited substance or method to treat a legitimate medical condition. Without a valid TUE, an Adverse Analytical Finding for that substance constitutes an ADRV.</p>
            <p>Common conditions that may require a TUE include: asthma (corticosteroids, beta-2 agonists), ADHD (methylphenidate, amphetamines), diabetes (insulin), hypogonadism (testosterone), and inflammatory conditions requiring glucocorticoids.</p>
            <p>TUEs are reviewed by a <strong className="text-white">TUE Committee (TUEC)</strong> — at least three independent physicians. Their decisions are final unless appealed to WADA or CAS.</p>
          </div>
        ),
      },
      {
        heading: "The Four Criteria",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>ALL four criteria must be satisfied for a TUE to be granted:</p>
            <ol className="list-none space-y-3">
              {[
                { n: "1", title: "Medical necessity", desc: "The athlete has a diagnosed medical condition requiring the use of the prohibited substance." },
                { n: "2", title: "No performance enhancement", desc: "The treatment does not produce significant performance enhancement beyond restoring the athlete to normal health." },
                { n: "3", title: "No reasonable alternative", desc: "No permitted alternative treatment of equivalent therapeutic value exists." },
                { n: "4", title: "Not the result of prohibited use", desc: "The medical condition was not caused by prior use of a prohibited substance." },
              ].map((c) => (
                <li key={c.n} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600/20 text-green-400 font-black text-sm flex items-center justify-center">{c.n}</span>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">{c.title}</div>
                    <div className="text-slate-400 text-xs">{c.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ),
      },
      {
        heading: "How to Apply",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>Applications are filed through <strong className="text-white">ADAMS</strong> (Anti-Doping Administration and Management System). You will need:</p>
            <ul className="list-none space-y-1.5">
              {[
                "A completed TUE application form",
                "A diagnosis confirmed by a licensed physician",
                "Relevant medical history (test results, specialist letters, prescriptions)",
                "Documentation of why non-prohibited alternatives were insufficient",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2">Apply <em>at least 30 days before competition</em> if possible. Retroactive TUEs are only granted in genuine emergencies (e.g., surgery during competition) or when the substance is not normally subject to pre-approval.</p>
          </div>
        ),
      },
    ],
    facts: [
      "All 4 TUE criteria must be met — satisfying 3 out of 4 is not sufficient",
      "A TUE is valid for a specified time period and may need to be renewed",
      "WADA can review and reverse any TUE granted by a national anti-doping authority",
      "TUE information is kept confidential and not disclosed without the athlete's consent",
    ],
    quiz: [
      {
        question: "What is a Therapeutic Use Exemption (TUE)?",
        options: [
          "A waiver allowing athletes to skip doping tests",
          "Permission to use a prohibited substance for a genuine medical need",
          "A certificate proving an athlete is drug-free",
          "An exemption from competition rules for injured athletes",
        ],
        correct: 1,
      },
      {
        question: "How many of the four TUE criteria must be satisfied?",
        options: ["Any 2 of 4", "Any 3 of 4", "All 4", "At least 1"],
        correct: 2,
      },
      {
        question: "When should an athlete ideally submit a TUE application?",
        options: [
          "After testing positive for the substance",
          "During the competition itself",
          "At least 30 days before competition",
          "Within 24 hours of taking the medication",
        ],
        correct: 2,
      },
      {
        question: "Who reviews TUE applications and decides whether to grant them?",
        options: [
          "WADA's legal team in Lausanne",
          "A TUE Committee of at least 3 independent physicians",
          "The athlete's own team doctor",
          "A panel of fellow athletes elected by the national federation",
        ],
        correct: 1,
      },
      {
        question: "Can WADA overturn a TUE that was granted by a national anti-doping organisation?",
        options: [
          "No — national decisions are always final",
          "Only if the athlete appeals the decision first",
          "Yes — WADA has the right to review and reverse any TUE",
          "Only for Olympic sports during the Games themselves",
        ],
        correct: 2,
      },
      {
        question: "Which of these medical conditions might legitimately require a TUE?",
        options: [
          "A sprained ankle requiring ice treatment",
          "Mild dehydration during competition",
          "ADHD requiring methylphenidate (a stimulant)",
          "A headache treated with paracetamol",
        ],
        correct: 2,
      },
    ],
  },
  {
    slug: "athlete-whereabouts",
    title: "Whereabouts Requirements",
    duration: "20 min",
    tagline: "Understand the RTP, ADAMS filing, and how to avoid costly whereabouts failures.",
    icon: <MapPin className="h-6 w-6" />,
    color: "#7c3aed",
    sections: [
      {
        heading: "The Registered Testing Pool",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>The <strong className="text-white">Registered Testing Pool (RTP)</strong> consists of elite athletes who are subject to enhanced whereabouts filing requirements. Inclusion is based on your sport, your competitive level, and your testing history. You will be formally notified in writing if you are included.</p>
            <p>RTP athletes must file <strong className="text-white">quarterly whereabouts information</strong> in ADAMS (Anti-Doping Administration & Management System) at least one week before the quarter begins. This includes your overnight accommodation address for every night, your competition schedule, and your regular training schedule.</p>
            <p>Additionally, RTP athletes must provide a <strong className="text-white">60-minute daily time slot</strong> — a specific time and location each day where testers can find you for out-of-competition testing with no advance notice.</p>
          </div>
        ),
      },
      {
        heading: "Whereabouts Failures (WF)",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>A Whereabouts Failure (WF) occurs when:</p>
            <ul className="list-none space-y-1.5 mb-3">
              {[
                "A Filing Failure (FF): You failed to submit or update whereabouts information on time",
                "A Missed Test (MT): A tester arrived at your 60-minute slot and you were not there",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p><strong className="text-red-400">Three Whereabouts Failures within any 12-month period constitutes an Anti-Doping Rule Violation</strong>, carrying a sanction of up to 2 years. This is treated the same as a positive test.</p>
            <p>Always update your whereabouts as soon as plans change. If you miss your 60-minute slot due to an emergency, contact your NADO immediately and document the circumstances.</p>
          </div>
        ),
      },
      {
        heading: "ADAMS & Practical Tips",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>ADAMS is the secure online platform used to file whereabouts, TUE applications, and anti-doping results. Your NADO will provide you with login credentials when you enter the RTP.</p>
            <p>Practical tips for staying compliant:</p>
            <ul className="list-none space-y-1.5">
              {[
                "Set calendar reminders for quarterly filing deadlines",
                "Update your whereabouts immediately when travel plans change",
                "Choose a consistent, predictable 60-minute slot (e.g., morning training)",
                "Download the ADAMS mobile app for on-the-go updates",
                "Keep records of every ADAMS update in case of disputes",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
    facts: [
      "RTP athletes must file quarterly whereabouts at least 1 week before each quarter",
      "The 60-minute slot must specify an exact time AND a precise location",
      "Three WFs in any 12-month rolling period = an ADRV (up to 2-year ban)",
      "WADA, your NADO, and your international federation can all access your whereabouts",
    ],
    quiz: [
      {
        question: "Why must top-level athletes submit whereabouts information?",
        options: [
          "To track their travel for sponsorship purposes",
          "To confirm their competition schedule to federations",
          "To enable no-notice out-of-competition testing",
          "So they can receive prize money payments",
        ],
        correct: 2,
      },
      {
        question: "How many Whereabouts Failures in a 12-month period constitute an Anti-Doping Rule Violation?",
        options: ["1", "2", "3", "5"],
        correct: 2,
      },
      {
        question: "What must an RTP athlete provide every single day in their whereabouts filing?",
        options: [
          "A list of all training partners",
          "A 60-minute time slot at a specific location for testing",
          "Their full training program with weights and reps",
          "Medical records for that day",
        ],
        correct: 1,
      },
      {
        question: "What is ADAMS in the context of anti-doping?",
        options: [
          "A biometric monitoring device worn by elite athletes",
          "A WADA-accredited laboratory network across Europe",
          "An online platform for filing whereabouts, TUE applications, and results management",
          "A penalty points system that accumulates across a career",
        ],
        correct: 2,
      },
      {
        question: "How often must athletes in the Registered Testing Pool (RTP) file their whereabouts?",
        options: ["Daily", "Weekly", "Monthly", "Quarterly (every 3 months)"],
        correct: 3,
      },
      {
        question: "What are the two types of Whereabouts Failures (WF)?",
        options: [
          "Failed test and positive test",
          "Filing Failure (FF) and Missed Test (MT)",
          "Late submission and wrong location",
          "Competition failure and training failure",
        ],
        correct: 1,
      },
    ],
  },
  {
    slug: "consequences-of-doping",
    title: "Consequences of Doping",
    duration: "60 min",
    tagline: "Understand sanctions, health risks, and the lifelong impact of an anti-doping violation.",
    icon: <AlertTriangle className="h-6 w-6" />,
    color: "#DC2626",
    sections: [
      {
        heading: "Anti-Doping Rule Violations & Sanctions",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>The WADA Code defines <strong className="text-white">10 Anti-Doping Rule Violations (ADRVs)</strong>, which include: presence of a prohibited substance, use or attempted use, evading sample collection, whereabouts failures, tampering with doping control, trafficking, and more.</p>
            <p>The <strong className="text-white">standard sanction for a first violation is 4 years</strong>. However, this can be increased or reduced based on circumstances:</p>
            <ul className="list-none space-y-1.5">
              {[
                { text: "Aggravating circumstances (e.g., deliberate use, multiple violations) → up to lifetime ban", c: "text-red-400" },
                { text: "Mitigating circumstances (e.g., contamination, no fault) → reduced to 1–2 years or a reprimand", c: "text-green-400" },
                { text: "Cooperation with authorities → up to 50% reduction in some cases", c: "text-blue-400" },
              ].map((item) => (
                <li key={item.text} className={`flex items-start gap-2 text-sm ${item.c}`}>
                  <ArrowRight className="h-3.5 w-3.5 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-slate-300">All competitive results achieved from the date of the violation are <strong className="text-white">automatically disqualified</strong>, including medals, titles, records, and prize money.</p>
          </div>
        ),
      },
      {
        heading: "Health Consequences",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>Beyond the sporting sanctions, doping causes severe and often permanent health damage:</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { cat: "Anabolic Steroids", risks: "Heart enlargement, liver tumors, hormonal disruption, aggression ('roid rage'), infertility" },
                { cat: "EPO", risks: "Dangerous blood thickening, stroke, heart attack — especially during sleep (low heart rate)" },
                { cat: "HGH", risks: "Acromegaly (irreversible bone growth), joint pain, diabetes, carpal tunnel syndrome" },
                { cat: "Stimulants", risks: "Cardiac arrhythmias, hypertension, hyperthermia, seizures, sudden death during competition" },
              ].map((item) => (
                <div key={item.cat} className="bg-slate-800/60 rounded-lg p-3">
                  <div className="text-red-400 font-bold text-xs mb-1">{item.cat}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{item.risks}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        heading: "Beyond Sport — The Wider Impact",
        body: (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-white">Financial devastation:</strong> Athletes lose medals, prize money, appearance fees, and sponsorships. In many cases, repayment of prior prize money is required. Sponsor contracts typically include anti-doping clauses allowing immediate termination.</p>
            <p><strong className="text-white">Criminal liability:</strong> In some countries (UK, Germany, France, Australia), trafficking in performance-enhancing drugs is a criminal offense carrying prison sentences.</p>
            <p><strong className="text-white">Permanent reputation damage:</strong> Even after serving a ban, athletes carry the stigma of a doping violation. Coaching positions, federation roles, and endorsements may be permanently unavailable.</p>
            <p><strong className="text-white">Team impact:</strong> In team sports, a teammate's violation can result in the entire team being stripped of relay medals or championship titles — affecting athletes who competed cleanly.</p>
          </div>
        ),
      },
    ],
    facts: [
      "The standard sanction for a first ADRV is 4 years under the 2021 WADA Code",
      "All results from the date of violation through the sanction period are disqualified",
      "Several countries treat trafficking in performance-enhancing drugs as a criminal offense",
      "EPO abuse has been linked to the deaths of multiple cyclists during the 1990s",
    ],
    quiz: [
      {
        question: "What is the standard sanction for a first anti-doping rule violation under the WADA Code?",
        options: ["A warning and fine", "A 6-month suspension", "A 4-year ban", "Mandatory retirement"],
        correct: 2,
      },
      {
        question: "What happens to an athlete's competition results from the period around their violation?",
        options: [
          "They remain valid if the athlete cooperates",
          "They are reviewed case-by-case",
          "They are automatically disqualified",
          "They are suspended pending appeal",
        ],
        correct: 2,
      },
      {
        question: "Where can an athlete appeal a doping sanction if they disagree with the result?",
        options: [
          "The Court of Arbitration for Sport (CAS)",
          "The International Criminal Court (ICC)",
          "WADA's internal review board only",
          "The athlete's national court system",
        ],
        correct: 0,
      },
      {
        question: "What are 'Specified Substances' under the WADA Code?",
        options: [
          "Substances prohibited only for professional athletes, not amateurs",
          "Substances more likely to have legitimate non-performance uses, allowing a wider range of sanctions",
          "Substances that require a TUE before they can be used legally",
          "Substances that are only banned in certain sports",
        ],
        correct: 1,
      },
      {
        question: "In a team relay event, if one athlete is found to have doped, what can happen to the team?",
        options: [
          "Only the individual athlete is penalised; teammates are unaffected",
          "The entire team is banned from competition for 2 years",
          "The team's relay result may be disqualified, affecting clean teammates too",
          "The team must forfeit the following season's competition",
        ],
        correct: 2,
      },
      {
        question: "Which long-term health risk is specifically associated with anabolic steroid use?",
        options: [
          "Irreversible bone growth (acromegaly)",
          "Dangerous blood thickening leading to stroke",
          "Heart enlargement, liver tumors, and hormonal disruption",
          "Seizures and hyperthermia during competition",
        ],
        correct: 2,
      },
    ],
  },
];

// ─── Quiz Component ───────────────────────────────────────────────────────────

interface QuizProps {
  quizPool: QuizQ[];
  color: string;
  slug: string;
  isCompleted: boolean;
  isSignedIn: boolean;
  onComplete: (slug: string, score: number) => void;
}

function ModuleQuiz({ quizPool, color, slug, isCompleted, isSignedIn, onComplete }: QuizProps) {
  // Pick 3 random questions from the pool each time the quiz mounts
  const [quiz] = useState<QuizQ[]>(() => {
    const pool = Array.isArray(quizPool) ? quizPool : [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: number; passed: boolean; score: number } | null>(null);

  // Compute result eagerly inside the handler to avoid stale state
  function handleSubmit() {
    if (answers.some((a) => a === null)) return;
    const correctCount = answers.filter((a, i) => a === quiz[i].correct).length;
    const score = Math.round((correctCount / quiz.length) * 100);
    const passed = correctCount >= 2;
    setResult({ correct: correctCount, passed, score });
    setSubmitted(true);
    if (passed && isSignedIn) {
      onComplete(slug, score);
    }
  }

  function handleRetry() {
    setAnswers([null, null, null]);
    setSubmitted(false);
    setResult(null);
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-3 bg-green-900/20 border border-green-600/30 rounded-xl px-5 py-4">
        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
        <div>
          <div className="text-green-400 font-bold text-sm">Module Completed</div>
          <div className="text-slate-400 text-xs mt-0.5">You have already passed the quiz for this module.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-slate-700" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 px-3">Knowledge Check — Pass 2 of 3 (Random Questions)</span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>

      {quiz.map((q, qi) => {
        const isAnswered = submitted;
        return (
          <div key={qi} className="bg-slate-800/60 rounded-xl p-5 border border-slate-700">
            <p className="text-white font-bold text-sm mb-4 leading-snug">
              <span className="text-slate-500 mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => {
                let cls = "border-slate-700 text-slate-300 hover:border-slate-500 cursor-pointer";
                if (!isAnswered && answers[qi] === oi) cls = "border-2 text-white";
                if (isAnswered && oi === q.correct) cls = "border-green-500 bg-green-900/20 text-green-300";
                else if (isAnswered && answers[qi] === oi && oi !== q.correct) cls = "border-red-500 bg-red-900/20 text-red-300";
                else if (isAnswered) cls = "border-slate-800 text-slate-500";

                return (
                  <button
                    key={oi}
                    disabled={isAnswered}
                    onClick={() => {
                      if (!isAnswered) {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }
                    }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${cls}`}
                    style={!isAnswered && answers[qi] === oi ? { borderColor: color } : {}}
                  >
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={
                        !isAnswered && answers[qi] === oi
                          ? { background: color, color: "#fff" }
                          : { background: "#1e293b", color: "#64748b" }
                      }
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={answers.some((a) => a === null)}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: answers.some((a) => a === null) ? "#334155" : color }}
        >
          Submit Answers
        </button>
      ) : result && (
        <div className="space-y-3">
          <div className={`rounded-xl px-5 py-4 border flex items-start gap-3 ${
            result.passed ? "bg-green-900/20 border-green-600/40" : "bg-red-900/20 border-red-600/40"
          }`}>
            {result.passed ? (
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className={`font-bold text-sm ${result.passed ? "text-green-400" : "text-red-400"}`}>
                {result.passed
                  ? `Passed! ${result.correct}/${quiz.length} correct — module complete.`
                  : `${result.correct}/${quiz.length} correct — need at least 2 to pass.`}
              </div>
              {result.passed && !isSignedIn && (
                <div className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <Link href="/sign-in" className="text-white underline">Sign in</Link> to save progress to the leaderboard.
                </div>
              )}
              {result.passed && isSignedIn && (
                <div className="text-slate-400 text-xs mt-1">Progress saved to your dashboard and leaderboard.</div>
              )}
            </div>
          </div>
          {!result.passed && (
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-xl font-bold text-sm border-2 border-slate-700 text-slate-300 hover:border-slate-500 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Module Card ─────────────────────────────────────────────────────────────

function ModuleCard({
  mod,
  isCompleted,
  isSignedIn,
  onComplete,
}: {
  mod: ModuleData;
  isCompleted: boolean;
  isSignedIn: boolean;
  onComplete: (slug: string, score: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className={`border rounded-xl overflow-hidden transition-colors ${
        isCompleted ? "border-green-600/40 bg-green-900/5" : "border-slate-700 bg-slate-900/60"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-4 p-5 text-left group"
      >
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${mod.color}22`, color: mod.color }}
        >
          {mod.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-base group-hover:text-slate-200 transition-colors">{mod.title}</span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-900/20 border border-green-600/30 rounded px-2 py-0.5">
                <CheckCircle className="h-3 w-3" /> Done
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs leading-snug">{mod.tagline}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:block text-xs text-slate-500">{mod.duration}</span>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-800">
        {isCompleted && <div className="h-full" style={{ background: mod.color, width: "100%" }} />}
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 space-y-8 pt-2">
              {/* Sections */}
              {mod.sections.map((sec) => (
                <div key={sec.heading}>
                  <h4
                    className="font-display font-black uppercase text-sm tracking-wide mb-3"
                    style={{ color: mod.color }}
                  >
                    {sec.heading}
                  </h4>
                  {sec.body}
                </div>
              ))}

              {/* Key Facts */}
              <div>
                <h4 className="font-display font-black uppercase text-sm tracking-wide text-slate-500 mb-3">Key Facts</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {mod.facts.map((fact) => (
                    <div
                      key={fact}
                      className="flex items-start gap-2 rounded-lg p-3 text-xs text-slate-300"
                      style={{ background: `${mod.color}11`, border: `1px solid ${mod.color}22` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: mod.color }} />
                      {fact}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz */}
              <ModuleQuiz
                quizPool={mod.quiz}
                color={mod.color}
                slug={mod.slug}
                isCompleted={isCompleted}
                isSignedIn={isSignedIn}
                onComplete={onComplete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Education() {
  const { isSignedIn, isLoaded } = useUser();
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setProgressLoaded(true); return; }
    getProgress()
      .then((rows) => {
        setCompletedSlugs(new Set(rows.filter((r) => r.completed).map((r) => r.slug)));
      })
      .catch(() => {})
      .finally(() => setProgressLoaded(true));
  }, [isSignedIn, isLoaded]);

  async function handleComplete(slug: string, score: number) {
    try {
      await completeModule(slug, score);
      setCompletedSlugs((prev) => new Set([...prev, slug]));
    } catch (_) {}
  }

  const completed = completedSlugs.size;
  const total = MODULES.length;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800 py-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,#DC2626 40px,#DC2626 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#DC2626 40px,#DC2626 41px)" }}
        />
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <BookOpen className="h-3.5 w-3.5" /> Education & Prevention
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white uppercase tracking-tight mb-4">
              Know the <span className="text-red-500">Rules.</span><br />Protect Your <span className="text-red-500">Career.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mb-6">
              Six in-depth modules covering everything from WADA basics to whereabouts requirements. Read, learn, then take the quiz to earn your compliance score.
            </p>
            {isLoaded && progressLoaded && (
              <div className="flex items-center gap-4 max-w-sm">
                <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completed / total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-red-600 rounded-full"
                  />
                </div>
                <span className="text-white font-bold text-sm whitespace-nowrap">{completed}/{total} modules</span>
                {isSignedIn && completed === total && (
                  <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                    <Trophy className="h-4 w-4" /> 100%
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modules */}
      <div className="container px-4 md:px-6 py-12 max-w-4xl mx-auto">
        {!isSignedIn && isLoaded && (
          <div className="mb-8 flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 text-sm">
            <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">
              <Link href="/sign-in" className="text-white font-bold underline">Sign in</Link> to save quiz results, track your compliance score, and appear on the leaderboard.
            </span>
          </div>
        )}

        <div className="space-y-4">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <ModuleCard
                mod={mod}
                isCompleted={completedSlugs.has(mod.slug)}
                isSignedIn={!!isSignedIn}
                onComplete={handleComplete}
              />
            </motion.div>
          ))}
        </div>

        {isSignedIn && completed === total && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 text-center py-10 border border-yellow-500/30 bg-yellow-500/5 rounded-2xl"
          >
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-display font-black text-2xl text-white uppercase mb-2">All Modules Complete!</h3>
            <p className="text-slate-400 text-sm mb-5">You've achieved a 100% compliance score. Check your ranking on the leaderboard.</p>
            <Link href="/leaderboard" className="inline-flex items-center gap-2 bg-yellow-500 text-black font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wide hover:bg-yellow-400 transition-colors">
              <Trophy className="h-4 w-4" /> View Leaderboard
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
