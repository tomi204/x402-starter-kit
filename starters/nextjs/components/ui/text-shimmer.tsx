'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3';
  className?: string;
  duration?: number;
  spread?: number;
  baseColor?: string;
  gradientColor?: string;
}

// Pre-create motion components
const MotionP = motion.p;
const MotionSpan = motion.span;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionH3 = motion.h3;

export function TextShimmer({
  children,
  as = 'p',
  className,
  duration = 2,
  spread = 2,
  baseColor = '#a1a1aa',
  gradientColor = '#000',
}: TextShimmerProps) {
  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  const components = {
    p: MotionP,
    span: MotionSpan,
    div: MotionDiv,
    h1: MotionH1,
    h2: MotionH2,
    h3: MotionH3,
  };

  const Component = components[as];

  return (
    <Component
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent',
        '[background-repeat:no-repeat,padding-box]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          '--base-color': baseColor,
          '--base-gradient-color': gradientColor,
          backgroundImage: `linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--base-gradient-color), transparent calc(50% + var(--spread))), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </Component>
  );
}
