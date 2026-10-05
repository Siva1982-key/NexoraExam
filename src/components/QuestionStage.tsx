import React from 'react';
import { Question, Option } from '../types/exam';

interface QuestionStageProps {
  question: Question;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  fontSizeLevel: number; // 0 = normal (16px), -1 = smaller (14px), 1 = larger (18px), 2 = extra (20px)
  onChangeFontSize: (delta: number) => void;
  onResetFontSize: () => void;
  onOpenCalculator: () => void;
  onOpenScratchpad: () => void;
  clusterNode: string;
  responseHash: string;
}

export const QuestionStage: React.FC<QuestionStageProps> = ({
  question,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  fontSizeLevel,
  onChangeFontSize,
  onResetFontSize,
  onOpenCalculator,
  onOpenScratchpad,
  clusterNode,
  responseHash,
}) => {
  // Compute stem font size
  const fontSizes = ['text-[15px]', 'text-[17px]', 'text-[19px]', 'text-[21px]'];
  const currentFontSize = fontSizes[fontSizeLevel + 1] || 'text-[17px]';

  return (
    <div className="flex flex-col gap-4">
      {/* Question Metadata Strip */}
      <div className="bg-[#ffffff] rounded-xl p-3 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Question Index Pill */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1d4ed8] text-white shadow-xs">
            <span className="font-mono text-[14px] font-bold">Q.{question.id}</span>
            <span className="font-mono text-[11px] opacity-80">/ {totalQuestions}</span>
          </div>

          {/* Question Type */}
          <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#0b1c30] font-sans text-[12px] font-medium border border-[#e5eeff]">
            {question.type}
          </span>

          {/* Scoring Scheme */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eff4ff] text-[#0b1c30] font-mono text-[12px] font-semibold border border-[#e5eeff]">
            <span className="text-[#069669]">+{question.marks.toFixed(2)}</span>
            <span className="text-[#c6c6cd]">/</span>
            <span className="text-[#ba1a1a]">-{question.negativeMarks.toFixed(2)}</span>
          </div>

          {/* Educational Tags */}
          <span className="px-2.5 py-1 rounded bg-[#dce1ff] text-[#001551] font-mono text-[11px] font-medium">
            {question.tags}
          </span>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Font Controls */}
          <div className="flex items-center rounded-lg bg-[#eff4ff] p-0.5 border border-[#e5eeff]">
            <button
              onClick={() => onChangeFontSize(-1)}
              className={`w-7 h-7 flex items-center justify-center rounded font-mono text-[12px] transition-colors cursor-pointer ${
                fontSizeLevel === -1
                  ? 'bg-white text-[#1d4ed8] font-bold shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={onResetFontSize}
              className={`w-7 h-7 flex items-center justify-center rounded font-mono text-[12px] transition-colors cursor-pointer ${
                fontSizeLevel === 0
                  ? 'bg-white text-[#1d4ed8] font-bold shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
              title="Reset Font Size"
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize(1)}
              className={`w-7 h-7 flex items-center justify-center rounded font-mono text-[12px] transition-colors cursor-pointer ${
                fontSizeLevel >= 1
                  ? 'bg-white text-[#1d4ed8] font-bold shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Calculator Trigger */}
          <button
            onClick={onOpenCalculator}
            className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff] transition-colors font-mono text-[12px] border border-[#e5eeff] cursor-pointer"
            title="Open Scientific Calculator"
          >
            <span className="material-symbols-outlined text-[17px]">calculate</span>
            <span className="hidden md:inline font-sans">Calculator</span>
          </button>

          {/* Scratchpad Trigger */}
          <button
            onClick={onOpenScratchpad}
            className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff] transition-colors font-mono text-[12px] border border-[#e5eeff] cursor-pointer"
            title="Open Rough Work Scratchpad"
          >
            <span className="material-symbols-outlined text-[17px]">draw</span>
            <span className="hidden md:inline font-sans">Scratchpad</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-[#dce1ff] text-[#1d4ed8] border-[#1d4ed8]'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#1d4ed8] hover:bg-[#dce9ff] border-[#e5eeff]'
            }`}
            title={isBookmarked ? 'Remove Flag' : 'Flag Question'}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>
        </div>
      </div>

      {/* Main Question Formulation Card */}
      <div className="bg-[#ffffff] rounded-xl p-5 sm:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e5eeff] flex flex-col gap-4">
        {/* Category Header */}
        <div className="flex items-center gap-2 text-[#45464d] font-mono text-[11px] uppercase tracking-wider">
          <span>{question.sectionName.split(':')[0]}</span>
          <span>•</span>
          <span>{question.category}</span>
        </div>

        {/* Question Stem */}
        <p className={`font-sans text-[#0b1c30] leading-relaxed ${currentFontSize}`}>
          {question.stem}
        </p>

        {/* Code Snippet Block (if present) */}
        {question.codeSnippet && (
          <div className="rounded-xl bg-[#131b2e] text-white p-4 font-mono text-[13px] shadow-inner relative overflow-hidden border border-[#1e293b]">
            <div className="flex items-center justify-between text-[#7c839b] font-mono text-[11px] pb-2 border-b border-white/10 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#85f8c4]">terminal</span>
                <span className="text-[#85f8c4] font-medium">{question.codeSnippet.title}</span>
              </span>
              <span className="text-white/60">{question.codeSnippet.lang}</span>
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Line Numbers */}
              <div className="col-span-1 select-none text-right text-[#7c839b] font-mono text-[12px] pr-2 opacity-50 space-y-1">
                {question.codeSnippet.lines.map((_, idx) => (
                  <div key={idx}>{String(idx + 1).padStart(2, '0')}</div>
                ))}
              </div>

              {/* Code lines */}
              <pre className="col-span-11 overflow-x-auto text-[13px] leading-relaxed space-y-1 font-mono">
                {question.codeSnippet.lines.map((line, idx) => {
                  let formatted = line;
                  const isComment = line.trim().startsWith('//');
                  return (
                    <code key={idx} className="block">
                      {isComment ? (
                        <span className="text-[#85f8c4]">{formatted}</span>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatted
                              .replace(/(TopoOrder|max)/g, '<span class="text-[#dce1ff] font-semibold">$1</span>')
                              .replace(/(kahn_or_dfs_toposort)/g, '<span class="text-[#b7c4ff]">$1</span>')
                              .replace(/(L\[v\])/g, '<span class="text-white font-bold">$1</span>'),
                          }}
                        />
                      )}
                    </code>
                  );
                })}
              </pre>
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="flex flex-col gap-2.5 pt-2">
          <span className="font-mono text-[11px] text-[#45464d] font-bold tracking-wider uppercase">
            Select the single correct option:
          </span>

          {question.options.map((option: Option) => {
            const isSelected = selectedOption === option.id;
            return (
              <label
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                className={`group relative flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#dce1ff]/35 border-[#1d4ed8] shadow-xs'
                    : 'bg-[#eff4ff] hover:bg-[#e5eeff] border-transparent hover:border-[#dce9ff]'
                }`}
              >
                {/* Option Badge (A, B, C, D) */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[13px] font-bold flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#1d4ed8] text-white shadow-xs'
                      : 'bg-[#d3e4fe] text-[#45464d] group-hover:bg-[#cbdbf5]'
                  }`}
                >
                  {option.id}
                </div>

                {/* Option Body & Subtext */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p
                    className={`font-sans text-[14px] sm:text-[15px] leading-relaxed ${
                      isSelected ? 'text-[#0b1c30] font-semibold' : 'text-[#0b1c30]'
                    }`}
                  >
                    {option.text}
                  </p>
                  {option.subtext && (
                    <span
                      className={`font-mono text-[11px] block mt-1 leading-snug ${
                        isSelected && option.id === 'B'
                          ? 'text-[#069669] font-bold'
                          : 'text-[#45464d]'
                      }`}
                    >
                      {option.subtext}
                    </span>
                  )}
                </div>

                {/* Radio selection circle / checkmark */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
                    isSelected ? 'bg-[#1d4ed8] text-white' : 'bg-[#d3e4fe]'
                  }`}
                >
                  {isSelected ? (
                    <span className="material-symbols-outlined text-[14px] font-bold">
                      check
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Cryptographic Sync Receipt Banner */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[#eff4ff] text-[#45464d] font-mono text-[11px] border border-[#e5eeff] mt-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#069669] text-[16px]">
              cloud_done
            </span>
            <span className="truncate">
              Current Response auto-committed to cluster node{' '}
              <span className="font-mono text-[#0b1c30] font-bold">{clusterNode}</span>
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase text-[#76777d] tracking-wider hidden sm:inline">
            HASH: {responseHash}
          </span>
        </div>
      </div>
    </div>
  );
};
