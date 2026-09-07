import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "A smooth sea never made a skilled sailor.", author: "Unknown" },
];

const QUOTE_DISPLAY_MS = 10000;

const fadeVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export default function QuotesHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, QUOTE_DISPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  const quote = quotes[index];

  return (
    <section className="relative overflow-hidden bg-[#030b17] text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" aria-hidden />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-[140px]" aria-hidden />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "54px 54px" }} aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-400/30 bg-white/5 px-4 py-2 backdrop-blur-md"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(253,224,71,0.8)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Growth mindset
          </span>
        </motion.div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-10">
          <div className="mb-6 text-center">
            <span className="text-6xl font-black text-amber-300/30 md:text-8xl">“</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
             key={index}
             initial="enter"
             animate="center"
             exit="exit"
             variants={fadeVariants}
             transition={{ duration: 0.7, ease: "easeInOut" }}
             className="text-center"
            >
             <p className="mb-6 text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
               {quote.text}
             </p>
             <p className="text-base font-semibold tracking-[0.26em] text-amber-300 md:text-lg">
               — {quote.author}
             </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {quotes.slice(0, 20).map((_, i) => (
             <button
               key={i}
               onClick={() => setIndex(i)}
               className={`h-2.5 rounded-full transition-all duration-300 ${
                 i === index ? "w-8 bg-amber-300" : "w-2.5 bg-zinc-600 hover:bg-zinc-400"
               }`}
               aria-label={`Go to quote ${i + 1}`}
             />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
             href="/courses"
             className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-8 py-4 text-base font-black text-slate-950 shadow-[0_18px_40px_rgba(250,204,21,0.28)] transition-transform hover:-translate-y-0.5"
            >
             Start Learning Now
             <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
