import React, { useState } from 'react';
import { CandidateInfo, Question } from '../types/exam';

interface ExamResultViewProps {
  candidate: CandidateInfo;
  questions: Question[];
  userAnswers: Record<number, string>;
  onReturnToExam: () => void;
  serverHash: string;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  candidate,
  questions,
  userAnswers,
  onReturnToExam,
  serverHash,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'review'>('summary');
  const [filterReview, setFilterReview] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  // Compute marks
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const sectionScores: Record<string, { total: number; scored: number; correct: number; totalQ: number }> = {
    'sec-a': { total: 0, scored: 0, correct: 0, totalQ: 0 },
    'sec-b': { total: 0, scored: 0, correct: 0, totalQ: 0 },
    'sec-c': { total: 0, scored: 0, correct: 0, totalQ: 0 },
  };

  questions.forEach((q) => {
    const section = sectionScores[q.sectionId] || { total: 0, scored: 0, correct: 0, totalQ: 0 };
    section.total += q.marks;
    section.totalQ += 1;

    const answer = userAnswers[q.id];
    if (!answer) {
      unattemptedCount++;
    } else if (answer === q.correctOptionId) {
      correctCount++;
      totalScore += q.marks;
      section.scored += q.marks;
      section.correct += 1;
    } else {
      incorrectCount++;
      totalScore -= q.negativeMarks;
      section.scored -= q.negativeMarks;
    }
  });

  const maxPossibleScore = questions.reduce((acc, q) => acc + q.marks, 0);
  const percentage = Math.max(0, Math.round((totalScore / maxPossibleScore) * 100));

  const filteredQuestions = questions.filter((q) => {
    const ans = userAnswers[q.id];
    if (filterReview === 'correct') return ans === q.correctOptionId;
    if (filterReview === 'incorrect') return ans && ans !== q.correctOptionId;
    if (filterReview === 'unattempted') return !ans;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col gap-6">
        {/* Certificate / Official Header */}
        <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#131b2e] flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-sans font-bold text-[20px] sm:text-[22px] text-[#0b1c30]">
                  Apex Institute of Technology & Sciences
                </h1>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#dce9ff] text-[#001551] font-bold">
                  AUTONOMOUS
                </span>
              </div>
              <p className="font-mono text-[13px] text-[#45464d] mt-1">
                {candidate.courseCode}: {candidate.courseName} • Final Evaluation Report
              </p>
              <div className="flex items-center gap-3 font-mono text-[11px] text-[#069669] mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                  Cryptographically Locked
                </span>
                <span>•</span>
                <span>HASH: {serverHash}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end p-4 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
            <span className="font-mono text-[11px] text-[#45464d]">OVERALL EVALUATED SCORE</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-3xl sm:text-4xl font-black text-[#1d4ed8]">
                {totalScore.toFixed(2)}
              </span>
              <span className="font-mono text-[14px] text-[#76777d]">/ {maxPossibleScore.toFixed(2)}</span>
            </div>
            <span className="font-mono text-[11px] text-[#069669] font-bold mt-1">
              {percentage}% • Grade: {percentage >= 85 ? 'O (Outstanding)' : percentage >= 70 ? 'A+ (Excellent)' : 'A (Very Good)'}
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e5eeff] pb-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-lg font-mono text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
            }`}
          >
            Performance Overview
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-lg font-mono text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
            }`}
          >
            Question Solutions & Key ({questions.length})
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div className="flex flex-col gap-6">
            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col">
                <span className="font-mono text-[11px] text-[#45464d]">CORRECT ANSWERS</span>
                <span className="font-mono text-2xl font-bold text-[#069669] mt-1">
                  {correctCount}
                </span>
                <span className="font-mono text-[10px] text-[#069669] mt-0.5">
                  +{(correctCount * 2).toFixed(2)} marks
                </span>
              </div>

              <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col">
                <span className="font-mono text-[11px] text-[#45464d]">INCORRECT ANSWERS</span>
                <span className="font-mono text-2xl font-bold text-[#ba1a1a] mt-1">
                  {incorrectCount}
                </span>
                <span className="font-mono text-[10px] text-[#ba1a1a] mt-0.5">
                  -{(incorrectCount * 0.5).toFixed(2)} marks
                </span>
              </div>

              <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col">
                <span className="font-mono text-[11px] text-[#45464d]">UNATTEMPTED</span>
                <span className="font-mono text-2xl font-bold text-[#76777d] mt-1">
                  {unattemptedCount}
                </span>
                <span className="font-mono text-[10px] text-[#76777d] mt-0.5">
                  0 penalty
                </span>
              </div>

              <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] shadow-xs flex flex-col">
                <span className="font-mono text-[11px] text-[#45464d]">ACCURACY RATE</span>
                <span className="font-mono text-2xl font-bold text-[#1d4ed8] mt-1">
                  {correctCount + incorrectCount > 0
                    ? `${Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%`
                    : '0%'}
                </span>
                <span className="font-mono text-[10px] text-[#1d4ed8] mt-0.5">
                  {correctCount + incorrectCount} attempted
                </span>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-xs flex flex-col gap-4">
              <h3 className="font-sans font-bold text-[16px] text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8]">analytics</span>
                Section-wise Mark Breakdown
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-semibold text-[13px] text-[#0b1c30]">
                      Sec A: Algorithmic Foundations
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#d3e4fe] font-bold">
                      Q1–Q20
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-xl font-bold text-[#1d4ed8]">
                    {sectionScores['sec-a'].scored.toFixed(2)} / {sectionScores['sec-a'].total.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-mono text-[#45464d] mt-1">
                    {sectionScores['sec-a'].correct} of {sectionScores['sec-a'].totalQ} questions correct
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-semibold text-[13px] text-[#0b1c30]">
                      Sec B: Dynamic Prog & Graphs
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#d3e4fe] font-bold">
                      Q21–Q35
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-xl font-bold text-[#1d4ed8]">
                    {sectionScores['sec-b'].scored.toFixed(2)} / {sectionScores['sec-b'].total.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-mono text-[#45464d] mt-1">
                    {sectionScores['sec-b'].correct} of {sectionScores['sec-b'].totalQ} questions correct
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-semibold text-[13px] text-[#0b1c30]">
                      Sec C: Advanced Complexity
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#d3e4fe] font-bold">
                      Q36–Q50
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-xl font-bold text-[#1d4ed8]">
                    {sectionScores['sec-c'].scored.toFixed(2)} / {sectionScores['sec-c'].total.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-mono text-[#45464d] mt-1">
                    {sectionScores['sec-c'].correct} of {sectionScores['sec-c'].totalQ} questions correct
                  </div>
                </div>
              </div>
            </div>

            {/* Invigilator Audit Log */}
            <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#069669]">verified_user</span>
                  <h3 className="font-sans font-bold text-[15px] text-[#0b1c30]">
                    AI Proctor Integrity & Compliance Audit Log
                  </h3>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#85f8c4]/30 text-[#005137] font-bold">
                  VERIFIED: 100% COMPLIANT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[#45464d]">
                <div className="p-2.5 rounded-lg bg-[#eff4ff]">
                  <span className="text-[#0b1c30] font-semibold block">Continuous Face Recognition:</span>
                  <span className="text-[#069669]">99.8% Gaze Centered Coverage</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#eff4ff]">
                  <span className="text-[#0b1c30] font-semibold block">Browser Sandbox Lockdown:</span>
                  <span className="text-[#069669]">0 Unauthorized Tab Switches</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#eff4ff]">
                  <span className="text-[#0b1c30] font-semibold block">Audio Acoustic Telemetry:</span>
                  <span className="text-[#069669]">Within Quiet Threshold (&lt;42 dB)</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={onReturnToExam}
                className="px-5 py-2.5 rounded-xl bg-[#131b2e] text-white font-mono text-[13px] font-semibold hover:bg-black transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Return to Examination Workspace</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-mono text-[13px] font-semibold hover:bg-[#e5eeff] transition-all flex items-center gap-2 cursor-pointer border border-[#e5eeff]"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Score Sheet</span>
              </button>
            </div>
          </div>
        ) : (
          /* Question Solutions Review View */
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-mono text-[12px]">
                <span className="text-[#45464d]">Filter:</span>
                {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterReview(filter)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      filterReview === filter
                        ? 'bg-[#1d4ed8] text-white font-bold'
                        : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredQuestions.map((q) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctOptionId;
                const isUnattempted = !userAns;

                return (
                  <div
                    key={q.id}
                    className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#131b2e] text-white font-mono text-[12px] font-bold">
                          Q.{q.id}
                        </span>
                        <span className="font-mono text-[11px] text-[#45464d]">
                          {q.sectionName.split(':')[0]} • {q.category}
                        </span>
                      </div>

                      <div>
                        {isUnattempted ? (
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#76777d]">
                            Unattempted (0.00)
                          </span>
                        ) : isCorrect ? (
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#85f8c4]/30 text-[#005137] font-bold">
                            Correct (+2.00)
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-bold">
                            Incorrect (-0.50)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="font-sans text-[15px] text-[#0b1c30] leading-relaxed">
                      {q.stem}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isChosen = userAns === opt.id;
                        const isTheCorrect = q.correctOptionId === opt.id;

                        let borderStyle = 'border-[#e5eeff] bg-[#eff4ff]';
                        if (isTheCorrect) {
                          borderStyle = 'border-[#069669] bg-[#dce9ff]/40 text-[#001551] font-medium';
                        } else if (isChosen && !isTheCorrect) {
                          borderStyle = 'border-[#ba1a1a] bg-[#ffdad6]/40 text-[#ba1a1a]';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl border flex items-start gap-3 ${borderStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 ${
                                isTheCorrect
                                  ? 'bg-[#069669] text-white'
                                  : isChosen
                                  ? 'bg-[#ba1a1a] text-white'
                                  : 'bg-[#d3e4fe] text-[#45464d]'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <div className="flex-1 text-[13px]">
                              <span>{opt.text}</span>
                              {isTheCorrect && (
                                <span className="block text-[11px] text-[#069669] font-bold mt-0.5 font-mono">
                                  ✓ Correct Solution
                                </span>
                              )}
                              {isChosen && !isTheCorrect && (
                                <span className="block text-[11px] text-[#ba1a1a] font-bold mt-0.5 font-mono">
                                  ✗ Candidate Response
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[12px] text-[#0b1c30]">
                      <strong className="text-[#1d4ed8] font-mono mr-1">Explanation:</strong>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
