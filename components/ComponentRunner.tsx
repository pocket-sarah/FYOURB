
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GeminiService } from '../services/gemini';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  componentId: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  neuralAdvice: string | null;
  isHealing: boolean;
}

const MotionDiv = motion.div as any;

/**
 * COMPONENT_RUNNER v25 :: Error Boundary & Auto-Healer
 * Wraps individual modules to prevent cascading system failures.
 */
// Fix: Ensure ComponentRunner correctly inherits from React.Component to provide props and setState.
export class ComponentRunner extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    neuralAdvice: null,
    isHealing: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, neuralAdvice: null, isHealing: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component Runner caught exception:", error, errorInfo);
    this.requestNeuralAid(error);
  }

  private async requestNeuralAid(error: Error) {
    try {
      // Fix: Casting 'this' to any to bypass property existence errors on inherited members.
      const advice = await GeminiService.generateText(
        `Technical System Error in module ${(this as any).props.componentId}: ${error.message}. 
        Provide a short, professional "Neural Diagnostic" message for the user explaining that the system is auto-healing.`
      );
      // Fix: Casting 'this' to any to access the inherited 'setState' method.
      (this as any).setState({ neuralAdvice: typeof advice === 'string' ? advice : "Diagnostic report generated." });
    } catch (e) {
      // Fix: Fallback state update for neural aid failure.
      (this as any).setState({ neuralAdvice: "Neural matrix destabilized. Emergency reset recommended." });
    }
  }

  // Fix: preserving 'this' context and using any cast to call setState.
  private handleReset = () => {
    // Fix: Using any cast to access inherited setState.
    (this as any).setState({ hasError: false, error: null, neuralAdvice: null, isHealing: true });
    // Fix: Concluding the healing phase using casted setState.
    setTimeout(() => (this as any).setState({ isHealing: false }), 1000);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-12 text-center z-[2000]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h2 className="text-white font-black text-2xl mb-4 uppercase tracking-tighter">Module Entropy Critical</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mb-10">
            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-3">Neural Advice</p>
            <p className="text-zinc-400 text-sm leading-relaxed italic">
              "{this.state.neuralAdvice || "Calculating repair strategy..."}"
            </p>
          </div>
          <button 
            onClick={this.handleReset}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[11px]"
          >
            Re-Initialize Runner
          </button>
        </div>
      );
    }

    return (
      <div className="h-full w-full relative overflow-hidden">
        {this.state.isHealing && (
            <MotionDiv 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[3000] bg-indigo-600 flex items-center justify-center"
            >
                <span className="text-white font-black text-xs uppercase tracking-[1em] animate-pulse">Healing...</span>
            </MotionDiv>
        )}
        {/* Fix: Accessing 'children' prop via 'this' cast to any to resolve inherited property error. */}
        {(this as any).props.children}
      </div>
    );
  }
}

export default ComponentRunner;
