import React from 'react';
import { SectionId } from '../types/exam';

interface SectionNavProps {
  activeSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
  saveLatencyMs: number;
  isSaving: boolean;
}

export const SectionNav: React.FC<SectionNavProps> = ({
  activeSection,
  onSelectSection,
  saveLatencyMs,
  isSaving,
}) => {
  const sections = [
    {
      id: 'sec-a' as SectionId,
      title: 'Sec A: Core Algorithmic Foundations',
      range: 'Q1–Q20',
    },
    {
      id: 'sec-b' as SectionId,
      title: 'Sec B: Dynamic Programming & Graphs',
      range: 'Q21–Q35',
    },
    {
      id: 'sec-c' as SectionId,
      title: 'Sec C: Advanced Complexity & Heuristics',
      range: 'Q36–Q50',
    },
  ];

  return (
    <div className="w-full bg-[#ffffff] rounded-xl p-2 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e5eeff]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[12px] sm:text-[13px] font-medium transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#131b2e] text-white shadow-sm font-semibold'
                    : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-[#85f8c4]' : 'bg-[#c6c6cd]'
                  }`}
                />
                <span className="font-sans font-medium">{sec.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-[#85f8c4] font-bold'
                      : 'bg-[#d3e4fe] text-[#45464d]'
                  }`}
                >
                  {sec.range}
                </span>
              </button>
            );
          })}
        </div>

        {/* Real-time Cloud Node Sync Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#45464d] px-3 py-1 rounded-lg bg-[#eff4ff] border border-[#e5eeff]">
            <span
              className={`w-2 h-2 rounded-full ${
                isSaving ? 'bg-[#1d4ed8] animate-ping' : 'bg-[#069669]'
              }`}
            />
            <span>
              Auto-Save:{' '}
              <span className="text-[#069669] font-bold">
                Active ({saveLatencyMs}ms)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
