import React from 'react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  counts: {
    answered: number;
    marked: number;
    unanswered: number;
    notVisited: number;
  };
  courseCode: string;
  courseName: string;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  counts,
  courseCode,
  courseName,
}) => {
  if (!isOpen) return null;

  const totalUnattempted = counts.unanswered + counts.notVisited;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-[#e5eeff] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center gap-3 text-[#ba1a1a]">
          <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <h3 className="font-sans font-bold text-[18px] sm:text-[20px] text-[#0b1c30]">
              End Examination?
            </h3>
            <span className="font-mono text-[11px] text-[#45464d]">
              SESSION FINALIZATION VERIFICATION
            </span>
          </div>
        </div>

        {/* Informative text */}
        <p className="font-sans text-[14px] text-[#45464d] leading-relaxed">
          You are about to submit your End Semester assessment for{' '}
          <span className="font-semibold text-[#0b1c30]">
            {courseCode}: {courseName}
          </span>
          . Once submitted, your responses will be cryptographically locked and evaluated by the automated grading engine.
        </p>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#eff4ff] rounded-xl text-center border border-[#e5eeff]">
          <div className="flex flex-col p-2 bg-white rounded-lg shadow-xs">
            <span className="font-mono text-2xl font-bold text-[#069669]">
              {counts.answered}
            </span>
            <span className="font-mono text-[11px] text-[#45464d] mt-0.5">
              Answered
            </span>
          </div>

          <div className="flex flex-col p-2 bg-white rounded-lg shadow-xs">
            <span className="font-mono text-2xl font-bold text-[#1d4ed8]">
              {String(counts.marked).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] text-[#45464d] mt-0.5">
              Under Review
            </span>
          </div>

          <div className="flex flex-col p-2 bg-white rounded-lg shadow-xs">
            <span className="font-mono text-2xl font-bold text-[#ba1a1a]">
              {totalUnattempted}
            </span>
            <span className="font-mono text-[11px] text-[#45464d] mt-0.5">
              Unanswered
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-lg bg-[#ffdad6] text-[#93000a] font-mono text-[11px] leading-relaxed border border-[#ffdad6]">
          <strong>Attention:</strong> {totalUnattempted} questions remain unvisited or unanswered. Marked for review questions without a selected answer will not be scored. Negative marking applies only to incorrect selections.
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] font-mono text-[12px] font-semibold hover:bg-[#e5eeff] transition-colors cursor-pointer border border-[#e5eeff]"
          >
            Return to Exam
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg bg-[#000000] text-white font-mono text-[12px] font-bold hover:bg-[#131b2e] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">lock</span>
            <span>Confirm & Finalize</span>
          </button>
        </div>
      </div>
    </div>
  );
};
