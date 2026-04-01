"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/50 shadow-lg backdrop-blur-xl transition-colors hover:text-white md:bottom-32"
          aria-label="Back to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
