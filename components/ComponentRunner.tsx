import React, { ErrorInfo, ReactNode } from 'react';
import { GeminiService } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface ComponentRunnerProps {
  children?: ReactNode;
  componentId: string;
}

interface ComponentRunnerState {
  hasError: boolean;
  error: Error | null;
  neuralAdvice: string | null;
  isHealing: boolean;
}

/**
 * ComponentRunner acts as an Error Boundary and dynamic executor for RB-OS modules.
 * It uses the Gemini API for neural diagnostic recovery.
 */
// Fix: Explicitly use React.Component with generic types to ensure 'props' and 'setState' are correctly inherited and identified by TypeScript.
export class ComponentRunner extends React.Component<ComponentRunnerProps, ComponentRunnerState> {
  // Fix: Standard state initialization within class body.
  public state: ComponentRunnerState = {
    hasError: false,
    error: null,
    neuralAdvice: null,
    isHealing: false
  };

  public constructor(props: ComponentRunnerProps) {
    super(props);
    // Bind reset handler to maintain 'this' context for class methods
    this.handleReset = this.handleReset.bind(this);
  }

  public static getDerivedStateFromError(error: Error): Partial<ComponentRunnerState> {
    return { hasError: true, error, neuralAdvice: null, isHealing: false };
  }

  // Implementation of Error Boundary lifecycle
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component Runner caught exception:", error, errorInfo);
    // Trigger neural recovery diagnostic on catch.
    this.requestNeuralAid(error);
  }

  /**
   * Neural Aid Request: Queries Gemini for a high-tech recovery message.
   */
  // Fix: Using arrow function class property for context binding while ensuring inherited members are visible.
  private requestNeuralAid = async (error: Error) => {
    try {
      // Fix: 'this.props' is correctly identified as a member of the class inherited from React.Component.
      const advice = await GeminiService.generateText(
        `Technical System Error in module ${this.props.componentId}: ${error.message}. 
        Provide a short, professional "Neural Diagnostic" message for the user explaining that the system is auto-healing.`
      );
      // Fix: 'this.setState' is correctly identified as a member of the class inherited from React.Component.
      this.setState({ neuralAdvice: advice });
    } catch (e) {
      // Fix: 'this.setState' is correctly identified as a member of the class inherited from React.Component.
      this.setState({ neuralAdvice: "Neural matrix destabilized. Emergency reset recommended." });
    }
  };

  /**
   * Reset Handler: Attempts to re-initialize the module.
   */
  private handleReset() {
    // Fix: 'this.setState' is correctly identified as a member of the class inherited from React.Component.
    this.setState({ hasError: false, error: null, neuralAdvice: null, isHealing: true });
    setTimeout(() => {
      // Fix: 'this.setState' is correctly identified as a member of the class inherited from React.Component.
      this.setState({ isHealing: false });
    }, 1000);
  }

  public render() {
    const MotionDiv = motion.div as any;
    // Destructuring state from current instance
    const { hasError, neuralAdvice, isHealing } = this.state;
    // Fix: 'this.props' is correctly identified as a member of the class inherited from React.Component.
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-12 text-center z-[2000]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h2 className="text-white font-black text-2xl mb-4 uppercase tracking-tighter">Module Entropy Critical</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mb-10">
            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-3">Neural Advice</p>
            <p className="text-zinc-400 text-sm leading-relaxed italic">
              "{neuralAdvice || "Calculating repair strategy..."}"
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
        <AnimatePresence>
          {isHealing && (
              <MotionDiv 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[3000] bg-indigo-600 flex items-center justify-center"
              >
                  <span className="text-white font-black text-xs uppercase tracking-[1em] animate-pulse">Healing...</span>
              </MotionDiv>
          )}
        </AnimatePresence>
        {children}
      </div>
    );
  }
}

export default ComponentRunner;