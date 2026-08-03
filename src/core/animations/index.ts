// src/core/animations/index.ts

const transitionConfig = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] 
};

export const slideUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: transitionConfig
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export const hoverLift = {
  whileHover: { 
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  whileTap: { 
    y: 0,
    transition: { duration: 0.1 }
  }
};

export const viewportConfig = {
  once: true,
  margin: "-50px",
  amount: 0.2
};