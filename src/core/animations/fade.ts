export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { 
    duration: 0.3, 
    ease: [0.25, 0.1, 0.25, 1] // Apple-like ease (Fast out, Slow in)
  }
};