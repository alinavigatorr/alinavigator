export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { 
    type: "spring", 
    stiffness: 400, 
    damping: 25 
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