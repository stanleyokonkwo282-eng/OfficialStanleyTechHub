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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background blobs */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-15 animate-pulse"
        style={{ animationDuration: "8s" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3 opacity-10 animate-pulse"
        style={{ animationDuration: "10s" }}
        aria-hidden
      />

      {/* Quote content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-8 animate-fade-in">
          <span className="text-6xl md:text-8xl font-black text-yellow-400/20 select-none">“</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="enter"
            animate="center"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <p className="text-2xl md:text-5xl font-bold text-white leading-tight mb-8 tracking-tight">
              {quote.text}
            </p>
            <p className="text-yellow-400 text-lg md:text-xl font-semibold tracking-wide">
               — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-12 flex-wrap">
          {quotes.slice(0, 20).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-yellow-400 w-6" : "bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <a
            href="/courses"
            className="inline-block bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition shadow-lg shadow-yellow-400/20"
          >
             Start Learning Now
          </a>
        </div>
      </div>
    </section>
  );
}
