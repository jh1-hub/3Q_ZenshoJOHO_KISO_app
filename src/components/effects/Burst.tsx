import React from 'react';
import { motion } from 'framer-motion';

export const Burst = ({ color, count }: { color: string, count: number }) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      targetX: 50 + (Math.random() - 0.5) * 200,
      targetY: 50 + (Math.random() - 0.5) * 200,
      delay: Math.random() * 0.2
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0,
            opacity: 1,
            left: 0,
            top: 0
          }}
          animate={{ 
            x: `${p.targetX}%`,
            y: `${p.targetY}%`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            delay: p.delay
          }}
          className={`absolute w-2 h-2 rounded-full ${color} blur-[1px]`}
        />
      ))}
    </div>
  );
};
