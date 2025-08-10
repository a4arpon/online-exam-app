const bouncyCards = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 16,
    mass: 0.9,
  },
}

const bouncyButNoScaleUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 16,
    mass: 0.9,
  },
}

export const cardAnimations = {
  bouncyCards,
  bouncyButNoScaleUp,
}
