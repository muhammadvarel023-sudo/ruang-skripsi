/**
 * Consistent Apple-style motion curves and physics for TelisikRiset.
 * Smooth deceleration with zero bounce or overshoot on UI state.
 */
export const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

export const APPLE_EXIT_EASE = [0.7, 0, 0.84, 0] as const;

export const APPLE_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
};

export const APPLE_TRANSITION = {
  duration: 0.48,
  ease: APPLE_EASE,
};

export const APPLE_FAST_TRANSITION = {
  duration: 0.26,
  ease: APPLE_EASE,
};

export const APPLE_VIEWPORT = {
  once: true,
  amount: 0.18,
} as const;
