import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  onComplete: () => void;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which element calls to you?",
    options: ["Water (Calm & Deep)", "Fire (Passionate & Bold)", "Earth (Grounded & Natural)", "Air (Free & Light)"]
  },
  {
    id: 2,
    question: "Your ideal Friday night looks like...",
    options: ["A gala dinner", "Cozy book reading", "Dancing with friends", "Stargazing alone"]
  },
  {
    id: 3,
    question: "Pick a color palette",
    options: ["Monochrome Chic", "Pastel Dreams", "Vibrant Sunset", "Forest Hues"]
  }
];

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => onComplete(), 500);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="w-full h-1 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="h-full bg-slate-900"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="text-center"
      >
        <h3 className="text-3xl font-serif font-bold text-slate-800 mb-8">
          {questions[currentStep].question}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className="group p-6 text-left border border-slate-200 rounded-xl hover:border-brand-pink hover:bg-brand-blue/30 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 font-sans text-slate-700 font-medium group-hover:text-slate-900">
                {option}
              </span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};