"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Lightbulb } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";

// Define Slide interface
export interface SlideData {
  type: "title" | "explanation" | "examples" | "tip";
  text?: string;
  sentences?: string[];
}

interface LessonWizardProps {
  slides: SlideData[];
  onComplete: () => void;
}

export function LessonWizard({ slides, onComplete }: LessonWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const currentSlide = slides[currentIndex];
  const progress = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-full bg-gray-200 h-3 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-white border-2 border-gray-100 shadow-sm rounded-3xl p-8 flex flex-col justify-center items-center min-h-[300px] text-center"
        >
          {currentSlide.type === "title" && (
            <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
              {currentSlide.text}
            </h1>
          )}

          {currentSlide.type === "explanation" && (
            <p className="text-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
              {currentSlide.text}
            </p>
          )}

          {currentSlide.type === "examples" && (
            <div className="w-full flex flex-col gap-4 text-left">
              {currentSlide.sentences?.map((sentence, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-blue-50 p-4 rounded-xl text-lg font-medium text-blue-900"
                >
                  <span className="flex-1">{sentence}</span>
                  <AudioPlayer text={sentence} />
                </div>
              ))}
            </div>
          )}

          {currentSlide.type === "tip" && (
            <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl w-full">
              <div className="flex items-center gap-2 text-yellow-600 mb-3 font-bold justify-center">
                <Lightbulb size={24} />
                <span>DICA</span>
              </div>
              <p className="text-lg text-yellow-800 font-medium whitespace-pre-wrap leading-relaxed">
                {currentSlide.text}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="w-full mt-8">
        <button
          onClick={handleNext}
          className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-xl py-4 rounded-2xl transition-all shadow-[0_4px_0_0_#16a34a] active:shadow-[0_0px_0_0_#16a34a] active:translate-y-1 flex items-center justify-center gap-2"
        >
          {currentIndex === slides.length - 1 ? (
            <>
              Concluir <Check size={24} />
            </>
          ) : (
            <>
              Continuar <ChevronRight size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
