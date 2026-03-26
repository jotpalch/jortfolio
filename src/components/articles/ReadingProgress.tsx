"use client";

import { useSyncExternalStore } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-terracotta"
      style={{ scaleX }}
    />
  );
}
