import React, { useState, useEffect, useRef } from 'react';
import { CandidateInfo, ProctorTelemetry, QuestionStatus, SectionId } from '../types/exam';

interface RightSidebarProps {
  candidate: CandidateInfo;
  telemetry: ProctorTelemetry;
  totalQuestions: number;
  currentQuestionId: number;
  onSelectQuestion: (questionId: number) => void;
  questionStatuses: Record<number, QuestionStatus>;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  activeSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
  onToggleCamera: () => void;
  isRealCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  candidate,
  telemetry,
  totalQuestions,
  currentQuestionId,
  onSelectQuestion,
  questionStatuses,
  selectedFilter,
  onFilterChange,
  activeSection,
  onSelectSection,
  onToggleCamera,
  isRealCamera,
  videoRef,
}) => {
  // Compute counts
  const counts = {
    answered: 0,
    marked: 0,
    unanswered: 0,
    notVisited: 0,
  };

  for (let i = 1; i <= totalQuestions; i++) {
    const status = questionStatuses[i] || 'not_visited';
    if (status === 'answered' || status === 'marked_and_answered') {
      counts.answered++;
    } else if (status === 'marked_for_review') {
      counts.marked++;
    } else if (status === 'not_answered') {
      counts.unanswered++;
    } else {
      counts.notVisited++;
    }
  }

  // Filter questions for the grid
  const questionsList = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const filteredQuestions = questionsList.filter((qId) => {
    const status = questionStatuses[qId] || 'not_visited';
    if (selectedFilter === 'answered') {
      return status === 'answered' || status === 'marked_and_answered';
    }
    if (selectedFilter === 'review') {
      return status === 'marked_for_review' || status === 'marked_and_answered';
    }
    if (selectedFilter === 'unanswered') {
      return status === 'not_answered';
    }
    if (selectedFilter === 'not_visited') {
      return status === 'not_visited';
    }
    return true; // 'all'
  });

  // Animated noise level variation for realistic telemetry
  const [currentDb, setCurrentDb] = useState(telemetry.ambientNoiseDb);
  useEffect(() => {
    const interval = setInterval(() => {
      // slight fluctuation between 36 and 41 dB
      const delta = (Math.random() - 0.5) * 4;
      setCurrentDb(Math.round(38 + delta));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* CANDIDATE BADGE CARD */}
      <div className="bg-[#ffffff] rounded-xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e5eeff] flex items-center gap-3.5">
        <div className="relative flex-shrink-0">
          <img
            className="w-14 h-14 rounded-xl object-cover bg-[#eff4ff] ring-1 ring-[#e5eeff]"
            src={candidate.avatarUrl}
            alt={candidate.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
            }}
          />
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#069669] flex items-center justify-center text-white text-[10px] shadow-xs"
            title="Biometrically Verified"
          >
            <span className="material-symbols-outlined text-[11px] font-bold">check</span>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-semibold text-[15px] text-[#0b1c30] truncate">
              {candidate.name}
            </h3>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#e5eeff] font-bold text-[#0b1c30]">
              {candidate.semester}
            </span>
          </div>
          <p className="font-mono text-[11px] text-[#45464d]">
            Roll: {candidate.rollNo} • {candidate.deskNo}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-[#069669] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#069669] animate-ping" />
            <span>Biometric Session Synchronized</span>
          </div>
        </div>
      </div>

      {/* QUESTION MATRIX PALETTE OVERVIEW */}
      <div className="bg-[#ffffff] rounded-xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e5eeff] flex flex-col gap-3">
        {/* Header & Filter Selector */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#1d4ed8] text-[20px]">
              grid_view
            </span>
            <span className="font-sans font-semibold text-[14px] text-[#0b1c30]">
              Question Status
            </span>
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="font-mono text-[11px] bg-[#eff4ff] text-[#0b1c30] rounded-lg px-2 py-1 outline-none border border-[#e5eeff] cursor-pointer hover:bg-[#e5eeff]"
          >
            <option value="all">View All ({totalQuestions})</option>
            <option value="answered">Answered ({counts.answered})</option>
            <option value="review">For Review ({counts.marked})</option>
            <option value="unanswered">Unanswered ({counts.unanswered})</option>
            <option value="not_visited">Not Visited ({counts.notVisited})</option>
          </select>
        </div>

        {/* Legend Badges */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#069669] text-white text-[9px] flex items-center justify-center font-bold">
              ✓
            </span>
            <span className="text-[#45464d]">
              Answered (<span className="font-semibold text-[#0b1c30]">{counts.answered}</span>)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#1d4ed8] text-white text-[9px] flex items-center justify-center font-bold">
              ★
            </span>
            <span className="text-[#45464d]">
              Marked (<span className="font-semibold text-[#0b1c30]">{String(counts.marked).padStart(2, '0')}</span>)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#ba1a1a] text-white text-[9px] flex items-center justify-center font-bold">
              •
            </span>
            <span className="text-[#45464d]">
              Not Answered (<span className="font-semibold text-[#0b1c30]">{String(counts.unanswered).padStart(2, '0')}</span>)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#d3e4fe] text-[#45464d] text-[9px] flex items-center justify-center font-bold">
              -
            </span>
            <span className="text-[#45464d]">
              Not Visited (<span className="font-semibold text-[#0b1c30]">{counts.notVisited}</span>)
            </span>
          </div>
        </div>

        {/* 50 QUESTION MATRIX (5 Columns) */}
        <div className="max-h-60 overflow-y-auto pr-1">
          <div className="grid grid-cols-5 gap-1.5 font-mono text-[12px]">
            {filteredQuestions.map((qNum) => {
              const status = questionStatuses[qNum] || 'not_visited';
              const isActive = qNum === currentQuestionId;

              let bgClasses = 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]';
              if (status === 'answered') {
                bgClasses = 'bg-[#069669] text-white font-bold hover:opacity-90';
              } else if (status === 'marked_for_review') {
                bgClasses = 'bg-[#1d4ed8] text-white font-bold hover:opacity-90';
              } else if (status === 'marked_and_answered') {
                bgClasses = 'bg-[#1d4ed8] text-white font-bold ring-2 ring-[#069669] hover:opacity-90';
              } else if (status === 'not_answered') {
                bgClasses = 'bg-[#ba1a1a] text-white font-bold hover:opacity-90';
              } else if (status === 'not_visited') {
                bgClasses = 'bg-[#dce9ff] text-[#45464d] font-medium hover:bg-[#cbdbf5]';
              }

              return (
                <button
                  key={qNum}
                  onClick={() => onSelectQuestion(qNum)}
                  className={`h-8 rounded flex items-center justify-center relative transition-all cursor-pointer ${bgClasses} ${
                    isActive
                      ? 'ring-2 ring-[#1d4ed8] ring-offset-1 font-black shadow-sm'
                      : ''
                  }`}
                  title={`Question ${qNum} (${status.replace(/_/g, ' ')})`}
                >
                  {String(qNum).padStart(2, '0')}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1d4ed8]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* REAL-TIME PROCTOR SECURITY & BIOMETRIC TELEMETRY */}
      <div className="bg-[#ffffff] rounded-xl p-3.5 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-1.5 text-[#0b1c30]">
            <span className="material-symbols-outlined text-[18px] text-[#069669] animate-pulse">
              videocam
            </span>
            <span className="font-sans font-semibold text-[14px]">
              AI Invigilator Engine
            </span>
          </div>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#069669] font-bold">
            100% COMPLIANT
          </span>
        </div>

        {/* WEBCAM PREVIEW FEED WITH BOUNDING RECT */}
        <div className="relative w-full h-36 rounded-lg bg-[#131b2e] overflow-hidden flex items-center justify-center border border-[#1e293b]">
          {isRealCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              className="w-full h-full object-cover opacity-85"
              src={candidate.invigilatorFeedUrl}
              alt="Proctor Video Feed"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
              }}
            />
          )}

          {/* AI Face Detection Bounding Box Overlay */}
          <div className="absolute inset-x-12 inset-y-4 border border-[#85f8c4]/60 rounded-md pointer-events-none flex flex-col justify-between p-1">
            <div className="flex justify-between text-[8px] font-mono text-[#85f8c4] leading-none">
              <span>[FACE_01]</span>
              <span>CONF: 99.4%</span>
            </div>
            {/* Corner crosshairs */}
            <div className="w-1.5 h-1.5 border-b border-r border-[#85f8c4] self-end" />
          </div>

          {/* Biometric Overlay Tags */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[#85f8c4] font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#85f8c4] animate-pulse" />
            <span>Face Verified</span>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white font-mono text-[10px]">
            <span>Gaze: Centered • Single Face Detected</span>
          </div>

          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[#85f8c4] font-mono text-[10px]">
            FPS: {telemetry.fps.toFixed(1)}
          </div>

          {/* Camera Source Switcher Button */}
          <button
            onClick={onToggleCamera}
            className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#1d4ed8]/80 hover:bg-[#1d4ed8] text-white font-mono text-[9px] flex items-center gap-1 cursor-pointer transition-colors"
            title="Toggle user webcam feed"
          >
            <span className="material-symbols-outlined text-[11px]">
              {isRealCamera ? 'videocam_off' : 'videocam'}
            </span>
            <span>{isRealCamera ? 'Use Simulated' : 'Use WebCam'}</span>
          </button>
        </div>

        {/* Security Telemetry Metrics */}
        <div className="flex flex-col gap-1.5 font-mono text-[11px] pt-1">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[#45464d] flex items-center gap-1.5 font-sans">
              <span className="material-symbols-outlined text-[15px] text-[#1d4ed8]">
                graphic_eq
              </span>
              Ambient Noise Level
            </span>
            <div className="flex items-center gap-1.5">
              {/* Dynamic audio meter bar */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-[#069669] h-2 rounded-xs" />
                <span className="w-0.5 bg-[#069669] h-3 rounded-xs" />
                <span className="w-0.5 bg-[#069669] h-1.5 rounded-xs" />
              </div>
              <span className="text-[#069669] font-bold">{currentDb} dB (Optimal)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[#45464d] flex items-center gap-1.5 font-sans">
              <span className="material-symbols-outlined text-[15px] text-[#1d4ed8]">
                desktop_windows
              </span>
              Display Lockdown
            </span>
            <span className="text-[#0b1c30] font-bold">{telemetry.displayLockdown}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#eff4ff]">
            <span className="text-[#45464d] flex items-center gap-1.5 font-sans">
              <span className="material-symbols-outlined text-[15px] text-[#1d4ed8]">
                tab
              </span>
              Tab Switch Infractions
            </span>
            <span
              className={`px-1.5 py-0.5 rounded font-bold ${
                telemetry.tabInfractions > 0
                  ? 'bg-[#ba1a1a] text-white'
                  : 'bg-[#dce9ff] text-[#0b1c30]'
              }`}
            >
              {telemetry.tabInfractions} / {telemetry.maxTabInfractions} Allowed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
