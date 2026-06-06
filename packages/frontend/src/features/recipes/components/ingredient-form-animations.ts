import { Easing, FadeOut, LinearTransition } from 'react-native-reanimated';

export const FORM_MOTION_DURATION = 420;
export const FORM_MOTION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export const FORM_MOTION_TIMING = {
  duration: FORM_MOTION_DURATION,
  easing: FORM_MOTION_EASING,
};

export const FORM_LAYOUT_TRANSITION = LinearTransition.duration(FORM_MOTION_DURATION).easing(
  FORM_MOTION_EASING,
);

export const FORM_ROW_EXITING = FadeOut.duration(FORM_MOTION_DURATION * 0.75).easing(
  FORM_MOTION_EASING,
);
