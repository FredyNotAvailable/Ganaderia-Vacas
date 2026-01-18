import { chakra, type HTMLChakraProps } from '@chakra-ui/react';
import { motion, type HTMLMotionProps } from 'framer-motion';

// Combined type for Motion + Chakra props
export type MotionBoxProps = Omit<HTMLChakraProps<'div'>, 'transition'> & HTMLMotionProps<'div'>;

// Explicit cast to ensure TS Happy
import React from 'react';
export const MotionBox = chakra(motion.main, {
    shouldForwardProp: (prop) => prop !== 'transition',
}) as React.FC<MotionBoxProps>;
