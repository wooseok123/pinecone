// app/template.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

const animate = {
  initial: {
    transform: `translateY(50px)`,
    opacity: 0,
    transition: `transform 0.33s ease`,
  },
  animate: {
    transform: `translateY(0px)`,
    opacity: 1,
    transition: `transform 0.33s ease`,
  },
  exit: {
    transform: `translateY(50px)`,
    opacity: 0,
    transition: `transform 0.33s ease`,
  },
};

export default function Framer({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.main
        key={"page_transition"}
        exit={animate.exit}
        initial={animate.initial}
        animate={animate.animate}
        transition={{ type: "linear" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
