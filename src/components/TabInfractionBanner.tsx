import React from 'react';

interface TabInfractionBannerProps {
  isOpen: boolean;
  infractionsCount: number;
  maxInfractions: number;
  onDismiss: () => void;
}

export const TabInfractionBanner: React.FC<TabInfractionBannerProps> = ({
  isOpen,
  infractionsCount,
  maxInfractions,
  onDismiss,
}) => {
  if (!isOpen) return null;

  const isDisqualified = infractionsCount >= maxInfractions;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border-2 border-[#ba1a1a] animate-bounce-short">
        <div className="flex items-center gap-3 text-[#ba1a1a]">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center flex-shrink-0 animate-pulse">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div>
            <h3 className="font-sans font-bold text-[18px] text-[#ba1a1a]">
              Proctor Security Alert!
            </h3>
            <span className="font-mono text-[11px] text-[#45464d]">
              UNAUTHORIZED WINDOW FOCUS LOSS DETECTED
            </span>
          </div>
        </div>

        <p className="font-sans text-[14px] text-[#0b1c30] leading-relaxed">
          {isDisqualified ? (
            <span className="text-[#ba1a1a] font-bold">
              You have exceeded the maximum allowable window/tab switch infractions ({infractionsCount} of {maxInfractions}). Your session has been flagged for administrative review.
            </span>
          ) : (
            <span>
              You navigated away from the locked examination window. The AI invigilator engine recorded this event. Continuous infractions will lead to automatic paper termination.
            </span>
          )}
        </p>

        <div className="p-3 bg-[#ffdad6] rounded-xl flex items-center justify-between text-[#93000a] font-mono text-[12px]">
          <span>Infractions Incurred:</span>
          <span className="font-bold text-[14px]">
            {infractionsCount} / {maxInfractions} Allowed
          </span>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onDismiss}
            className="px-5 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-mono text-[12px] font-bold transition-colors cursor-pointer shadow-sm"
          >
            I Acknowledge &amp; Return to Exam
          </button>
        </div>
      </div>
    </div>
  );
};
