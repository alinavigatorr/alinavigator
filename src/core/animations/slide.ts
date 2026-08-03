const transitionConfig = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier (Linear/Vercel style)
};

export const slideUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: transitionConfig
};

export const slideDown = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: transitionConfig
};

export const slideLeft = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: transitionConfig
};