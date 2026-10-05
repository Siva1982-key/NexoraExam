import React from 'react';

interface PaperOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseName: string;
}

export const PaperOverviewModal: React.FC<PaperOverviewModalProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#e5eeff] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1d4ed8]">description</span>
            <div>
              <h3 className="font-sans font-bold text-[18px] text-[#0b1c30]">
                Candidate Instructions &amp; Paper Specification
              </h3>
              <p className="font-mono text-[11px] text-[#45464d]">
                {courseCode}: {courseName} • Autonomous End Semester VI Examination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#eff4ff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 text-[13px] text-[#0b1c30] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <h4 className="font-sans font-bold text-[14px] text-[#001551] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">rule</span>
              1. General Regulations &amp; Scoring Matrix
            </h4>
            <ul className="list-disc pl-5 space-y-1 font-sans text-[#45464d]">
              <li>Total Duration: <strong className="text-[#0b1c30]">120 Minutes (02:00:00)</strong>. Server sync enforces strict auto-submission upon expiry.</li>
              <li>Total Questions: <strong className="text-[#0b1c30]">50 Multiple-Choice Questions</strong>.</li>
              <li>Correct Answer: <strong className="text-[#069669] font-mono">+2.00 Marks</strong>.</li>
              <li>Incorrect Answer: <strong className="text-[#ba1a1a] font-mono">-0.50 Marks (Negative Marking)</strong>.</li>
              <li>Unattempted / Cleared: <strong className="text-[#45464d] font-mono">0.00 Marks</strong>.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <h4 className="font-sans font-bold text-[14px] text-[#001551] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">category</span>
              2. Section Distribution &amp; Syllabus Weightage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg bg-white border border-[#e5eeff]">
                <strong className="text-[#1d4ed8] block">Section A (Q1–Q20)</strong>
                <span>Core Algorithmic Foundations (Asymptotics, DSU, Heaps, BSTs, DAGs)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#e5eeff]">
                <strong className="text-[#1d4ed8] block">Section B (Q21–Q35)</strong>
                <span>Dynamic Programming &amp; Graphs (Flows, Bellman-Ford, TSP, Matching)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#e5eeff]">
                <strong className="text-[#1d4ed8] block">Section C (Q36–Q50)</strong>
                <span>Advanced Complexity &amp; Heuristics (NP-Completeness, Primality, A*)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <h4 className="font-sans font-bold text-[14px] text-[#001551] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">security</span>
              3. AI Proctoring &amp; Lockdown Protocols
            </h4>
            <ul className="list-disc pl-5 space-y-1 font-sans text-[#45464d]">
              <li>The AI Invigilator Engine continuously computes face presence, bounding geometry, and gaze vector.</li>
              <li>A maximum of <strong className="text-[#ba1a1a]">3 tab switch / window minimization infractions</strong> are permitted before automated session termination.</li>
              <li>A digital scientific calculator and scratchpad are provided in-app; external computing devices are prohibited.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#131b2e] text-white font-mono text-[12px] font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Understood, Return to Exam
          </button>
        </div>
      </div>
    </div>
  );
};
