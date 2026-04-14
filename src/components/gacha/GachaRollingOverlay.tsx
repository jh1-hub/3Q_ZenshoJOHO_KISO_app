import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const GachaRollingOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[700] bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
      
      {/* Particle Stream Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-[fall_2s_linear_infinite]"></div>
        <div className="absolute top-0 left-2/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-[fall_3s_linear_infinite_0.5s]"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-[fall_2.5s_linear_infinite_1s]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="w-32 h-32 border-4 border-cyan-500/30 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-cyan-400 text-2xl font-mono tracking-[0.3em] uppercase animate-pulse">
            Data Analyzing...
          </h2>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Background Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full blur-[1px] animate-ping opacity-20"></div>
        <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-purple-400 rounded-full blur-[1px] animate-ping opacity-20 [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-4/5 w-2 h-2 bg-emerald-400 rounded-full blur-[1px] animate-ping opacity-20 [animation-delay:2s]"></div>
      </div>

      {/* Final Flash Trigger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 3, times: [0, 0.9, 1] }}
        className="absolute inset-0 bg-white z-[800] pointer-events-none"
      />
    </motion.div>
  );
};
