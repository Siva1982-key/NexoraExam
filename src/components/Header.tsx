import React, { useState, useEffect } from 'react';
import { CandidateInfo, ProctorTelemetry } from '../types/exam';

interface HeaderProps {
  candidate: CandidateInfo;
  telemetry: ProctorTelemetry;
  totalSecondsRemaining: number;
  onOpenOverview: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  candidate,
  telemetry,
  totalSecondsRemaining,
  onOpenOverview,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [seconds, setSeconds] = useState(totalSecondsRemaining);

  useEffect(() => {
    setSeconds(totalSecondsRemaining);
  }, [totalSecondsRemaining]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = seconds < 300; // less than 5 minutes

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#ffffff] border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Institution Logo and Exam Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#131b2e] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-[15px] sm:text-[16px] text-[#0b1c30] truncate tracking-tight">
                Apex Institute of Technology & Sciences
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#dce9ff] text-[#45464d] font-bold tracking-wider">
                AUTONOMOUS
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#45464d] font-medium truncate">
              <span className="font-mono text-[#1d4ed8] font-semibold">{candidate.courseCode}</span>
              <span>•</span>
              <span className="truncate">{candidate.courseName} • End Semester VI</span>
            </div>
          </div>
        </div>

        {/* Center: Proctor Security Badges (XL screen) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff]/60">
            <span className="w-2 h-2 rounded-full bg-[#069669] animate-pulse"></span>
            <span className="font-mono text-[11px] font-medium tracking-tight">
              Proctor Active • Fullscreen Locked • Server Sync OK
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e5eeff] text-[#45464d] font-mono text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[15px]">lock</span>
            <span>HASH: {telemetry.serverHash}</span>
          </div>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#eff4ff] text-[#1d4ed8] hover:bg-[#dce9ff] transition-colors font-mono text-[11px] font-semibold"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
            <span className="hidden xl:inline">{isFullscreen ? "Locked" : "Lock View"}</span>
          </button>
        </div>

        {/* Right: Server Synced Timer & Candidate Identity */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Question Paper Overview trigger */}
          <button
            onClick={onOpenOverview}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#c6c6cd] text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors text-[12px] font-medium"
            title="View Paper Pattern & Instructions"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Instructions</span>
          </button>

          {/* Chronometer */}
          <div 
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all shadow-sm ${
              isLowTime 
                ? 'bg-[#ba1a1a] text-white animate-pulse' 
                : 'bg-[#131b2e] text-white'
            }`}
          >
            <div className="flex flex-col text-right">
              <span className="font-mono text-[10px] text-[#7c839b] tracking-wider leading-none">
                TIME REMAINING
              </span>
              <span className="font-mono text-[18px] sm:text-[20px] font-bold tracking-wider text-[#85f8c4]">
                {formatTime(seconds)}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#85f8c4] text-[20px]">
              schedule
            </span>
          </div>

          {/* Candidate Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-[#e5eeff]">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-sans font-semibold text-[13px] text-[#0b1c30] leading-tight truncate">
                {candidate.name}
              </span>
              <span className="font-mono text-[11px] text-[#45464d]">
                {candidate.rollNo} • {candidate.deskNo}
              </span>
            </div>
            <div className="relative w-8 h-8 rounded-full bg-[#131b2e] flex items-center justify-center text-white overflow-hidden ring-2 ring-[#dce9ff]">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if avatar fails to load
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
