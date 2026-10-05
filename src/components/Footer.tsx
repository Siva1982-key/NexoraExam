import React from 'react';

interface FooterProps {
  onClearResponse: () => void;
  onMarkForReviewAndNext: () => void;
  onPrevious: () => void;
  onSaveAndNext: () => void;
  onSubmitExam: () => void;
  hasSelection: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onClearResponse,
  onMarkForReviewAndNext,
  onPrevious,
  onSaveAndNext,
  onSubmitExam,
  hasSelection,
  isFirstQuestion,
  isLastQuestion,
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-[#ffffff] border-t border-[#e5eeff] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] select-none">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClearResponse}
            disabled={!hasSelection}
            className={`px-3 sm:px-4 py-2 rounded-lg font-mono text-[12px] sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              hasSelection
                ? 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white'
                : 'bg-[#eff4ff] text-[#76777d] cursor-not-allowed opacity-60'
            }`}
            title="Clear selected option"
          >
            <span className="material-symbols-outlined text-[16px]">backspace</span>
            <span className="hidden sm:inline font-sans">Clear Response</span>
            <span className="sm:hidden font-sans">Clear</span>
          </button>

          <button
            onClick={onMarkForReviewAndNext}
            className="px-3 sm:px-4 py-2 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-mono text-[12px] sm:text-[13px] font-semibold hover:bg-[#dce9ff] hover:text-[#1d4ed8] transition-all flex items-center gap-1.5 border border-[#e5eeff] cursor-pointer"
            title="Flag question for later review and move to next"
          >
            <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">
              bookmark
            </span>
            <span className="hidden md:inline font-sans">Mark for Review & Next</span>
            <span className="md:hidden font-sans">Review & Next</span>
          </button>
        </div>

        {/* Right Navigation & Final Submit */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className={`px-3 sm:px-4 py-2 rounded-lg font-mono text-[12px] sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 border border-[#e5eeff] cursor-pointer ${
              isFirstQuestion
                ? 'bg-[#eff4ff] text-[#76777d] opacity-50 cursor-not-allowed'
                : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="font-sans">Previous</span>
          </button>

          <button
            onClick={onSaveAndNext}
            className="px-4 sm:px-5 py-2 rounded-lg bg-[#1d4ed8] text-white font-mono text-[12px] sm:text-[13px] font-semibold hover:bg-[#1e40af] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="font-sans">{isLastQuestion ? 'Save' : 'Save & Next'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>

          <button
            onClick={onSubmitExam}
            className="ml-1 sm:ml-2 px-3 sm:px-5 py-2 rounded-lg bg-[#000000] text-white font-mono text-[12px] sm:text-[13px] font-bold hover:bg-[#131b2e] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border border-transparent"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
              verified
            </span>
            <span className="font-sans">Final Submit Examination</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
