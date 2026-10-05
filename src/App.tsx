import React, { useState, useEffect, useRef } from 'react';
import { SectionId, QuestionStatus, ProctorTelemetry } from './types/exam';
import { INITIAL_CANDIDATE, INITIAL_QUESTIONS } from './data/questions';
import { Header } from './components/Header';
import { SectionNav } from './components/SectionNav';
import { QuestionStage } from './components/QuestionStage';
import { RightSidebar } from './components/RightSidebar';
import { Footer } from './components/Footer';
import { CalculatorModal } from './components/CalculatorModal';
import { ScratchpadModal } from './components/ScratchpadModal';
import { SubmitConfirmModal } from './components/SubmitConfirmModal';
import { ExamResultView } from './components/ExamResultView';
import { TabInfractionBanner } from './components/TabInfractionBanner';
import { PaperOverviewModal } from './components/PaperOverviewModal';

export default function App() {
  // Question & Navigation State
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(14);
  const [activeSection, setActiveSection] = useState<SectionId>('sec-a');

  // Answers State: map of question ID to selected option ('A' | 'B' | 'C' | 'D')
  // Initialize with 18 answered questions matching the screenshot:
  // Q1, Q2, Q4, Q6, Q7, Q8, Q10, Q11, Q13, Q14 (B), Q16, Q17, Q18, Q21, Q22, Q23, Q24, Q25
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({
    1: 'A',
    2: 'A',
    4: 'A',
    6: 'A',
    7: 'A',
    8: 'A',
    10: 'A',
    11: 'A',
    13: 'A',
    14: 'B', // Exact hero question
    16: 'A',
    17: 'A',
    18: 'A',
    21: 'A',
    22: 'A',
    23: 'A',
    24: 'A',
    25: 'A',
  });

  // Question Statuses map: map of question ID to QuestionStatus
  // Matches screenshot exactly: 18 Answered, 4 Marked, 8 Unanswered, 20 Not Visited
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>(() => {
    const statuses: Record<number, QuestionStatus> = {};
    // Answered (18):
    [1, 2, 4, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 21, 22, 23, 24, 25].forEach((id) => {
      statuses[id] = 'answered';
    });
    // Marked for Review (4):
    [3, 12, 19, 26].forEach((id) => {
      statuses[id] = 'marked_for_review';
    });
    // Not Answered (8):
    [5, 9, 15, 27, 28, 29, 30, 31].forEach((id) => {
      statuses[id] = 'not_answered';
    });
    // Not Visited (20): 32 to 50
    for (let i = 32; i <= 50; i++) {
      statuses[i] = 'not_visited';
    }
    return statuses;
  });

  // Bookmarked questions
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(
    new Set([3, 12, 14, 19, 26])
  );

  // Font sizing adjustment: -1 (small), 0 (normal), 1 (large), 2 (xl)
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isInfractionAlertOpen, setIsInfractionAlertOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Palette Filter in sidebar
  const [paletteFilter, setPaletteFilter] = useState<string>('all');
  const [paletteSectionTab, setPaletteSectionTab] = useState<'sec-a' | 'sec-b' | 'sec-c'>('sec-a');

  // Real-time Telemetry State
  const [telemetry, setTelemetry] = useState<ProctorTelemetry>({
    ambientNoiseDb: 38,
    displayLockdown: 'Single Monitored',
    tabInfractions: 0,
    maxTabInfractions: 3,
    faceVerified: true,
    gazeStatus: 'Gaze: Centered • Single Face Detected',
    fps: 29.8,
    isWebcamActive: false,
    serverSyncMs: 32,
    serverHash: '9F2A-8C17',
  });

  // Auto-save latency simulation
  const [saveLatencyMs, setSaveLatencyMs] = useState(32);
  const [isSaving, setIsSaving] = useState(false);
  const [responseHash, setResponseHash] = useState('E3B0-C442-98F1');

  // Video feed for real camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRealCamera, setIsRealCamera] = useState(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Get current question object
  const currentQuestion = INITIAL_QUESTIONS.find((q) => q.id === currentQuestionId) || INITIAL_QUESTIONS[13];

  // Sync active section when question changes
  useEffect(() => {
    if (currentQuestion.sectionId !== activeSection) {
      setActiveSection(currentQuestion.sectionId);
    }
  }, [currentQuestionId]);

  // Tab infraction listener (tracks window blur and visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isExamSubmitted) {
        setTelemetry((prev) => {
          const nextCount = prev.tabInfractions + 1;
          return {
            ...prev,
            tabInfractions: nextCount,
          };
        });
        setIsInfractionAlertOpen(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isExamSubmitted]);

  // Handle Fullscreen toggling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Handle Real Camera Toggle
  const toggleRealCamera = async () => {
    if (isRealCamera) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
      setIsRealCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStreamRef.current = stream;
        setIsRealCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access not granted or unavailable, retaining simulated feed:', err);
        alert('Webcam permission not granted or device not found. Using synchronized proctor stream.');
      }
    }
  };

  // Save latency simulator when user selects an answer
  const triggerAutoSave = () => {
    setIsSaving(true);
    const simulatedLatency = Math.floor(Math.random() * 15) + 24; // 24ms - 38ms
    setSaveLatencyMs(simulatedLatency);

    // Generate random mock hash
    const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const hex2 = Math.random().toString(16).substring(2, 6).toUpperCase();
    setResponseHash(`E3B0-${hex}-${hex2}`);

    setTimeout(() => {
      setIsSaving(false);
    }, 300);
  };

  // Option selection
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: optionId,
    }));

    // Update status to answered (or marked_and_answered if was marked)
    setQuestionStatuses((prev) => {
      const current = prev[currentQuestionId];
      if (current === 'marked_for_review') {
        return { ...prev, [currentQuestionId]: 'marked_and_answered' };
      }
      return { ...prev, [currentQuestionId]: 'answered' };
    });

    triggerAutoSave();
  };

  // Clear Response
  const handleClearResponse = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestionId];
      return copy;
    });

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestionId]: 'not_answered',
    }));

    triggerAutoSave();
  };

  // Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    setBookmarkedQuestions((prev) => new Set(prev).add(currentQuestionId));

    setQuestionStatuses((prev) => {
      const hasAns = !!userAnswers[currentQuestionId];
      return {
        ...prev,
        [currentQuestionId]: hasAns ? 'marked_and_answered' : 'marked_for_review',
      };
    });

    triggerAutoSave();

    // Move to next question if available
    if (currentQuestionId < INITIAL_QUESTIONS.length) {
      navigateToQuestion(currentQuestionId + 1);
    }
  };

  // Save & Next
  const handleSaveAndNext = () => {
    const hasAns = !!userAnswers[currentQuestionId];
    if (hasAns) {
      setQuestionStatuses((prev) => ({
        ...prev,
        [currentQuestionId]: 'answered',
      }));
    } else {
      setQuestionStatuses((prev) => {
        const current = prev[currentQuestionId];
        if (current === 'not_visited') {
          return { ...prev, [currentQuestionId]: 'not_answered' };
        }
        return prev;
      });
    }

    triggerAutoSave();

    if (currentQuestionId < INITIAL_QUESTIONS.length) {
      navigateToQuestion(currentQuestionId + 1);
    }
  };

  // Previous
  const handlePrevious = () => {
    if (currentQuestionId > 1) {
      navigateToQuestion(currentQuestionId - 1);
    }
  };

  // Navigate to Question
  const navigateToQuestion = (qId: number) => {
    setCurrentQuestionId(qId);
    // Mark as not_answered if it was not_visited
    setQuestionStatuses((prev) => {
      if (!prev[qId] || prev[qId] === 'not_visited') {
        return { ...prev, [qId]: 'not_answered' };
      }
      return prev;
    });
  };

  // Select section from SectionNav
  const handleSelectSection = (secId: SectionId) => {
    setActiveSection(secId);
    // Jump to the first question of that section
    if (secId === 'sec-a') navigateToQuestion(1);
    else if (secId === 'sec-b') navigateToQuestion(21);
    else if (secId === 'sec-c') navigateToQuestion(36);
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    setBookmarkedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestionId)) {
        next.delete(currentQuestionId);
      } else {
        next.add(currentQuestionId);
      }
      return next;
    });
  };

  // Calculate current counts
  const counts = {
    answered: 0,
    marked: 0,
    unanswered: 0,
    notVisited: 0,
  };
  for (let i = 1; i <= INITIAL_QUESTIONS.length; i++) {
    const s = questionStatuses[i] || 'not_visited';
    if (s === 'answered' || s === 'marked_and_answered') counts.answered++;
    else if (s === 'marked_for_review') counts.marked++;
    else if (s === 'not_answered') counts.unanswered++;
    else counts.notVisited++;
  }

  // If exam submitted, show official Result & Evaluation View
  if (isExamSubmitted) {
    return (
      <ExamResultView
        candidate={INITIAL_CANDIDATE}
        questions={INITIAL_QUESTIONS}
        userAnswers={userAnswers}
        serverHash={telemetry.serverHash}
        onReturnToExam={() => setIsExamSubmitted(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] select-none flex flex-col">
      {/* FIXED SECURITY TOP BAR */}
      <Header
        candidate={INITIAL_CANDIDATE}
        telemetry={telemetry}
        totalSecondsRemaining={6139} // 01:42:19
        onOpenOverview={() => setIsOverviewOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* FIXED RIGHT PALETTE BAR (DESKTOP >= 1440px / 2XL) */}
      <aside className="hidden 2xl:flex fixed right-0 top-16 bottom-16 w-80 bg-[#ffffff] border-l border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex-col">
        {/* Palette Header */}
        <div className="p-3.5 bg-[#eff4ff] flex items-center justify-between border-b border-[#e5eeff]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#45464d] text-[20px]">
              apps
            </span>
            <span className="font-sans font-semibold text-[15px] text-[#0b1c30]">
              Question Palette
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#d3e4fe] text-[#0b1c30] font-bold">
            50 Items
          </span>
        </div>

        {/* Section Quick Switcher Tabs */}
        <nav className="flex items-center gap-1 p-2 bg-[#ffffff] border-b border-[#e5eeff]">
          <button
            onClick={() => {
              setPaletteSectionTab('sec-a');
              handleSelectSection('sec-a');
            }}
            className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-mono font-bold transition-all cursor-pointer ${
              paletteSectionTab === 'sec-a'
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'text-[#45464d] hover:bg-[#eff4ff]'
            }`}
          >
            Sec A: Theory
          </button>
          <button
            onClick={() => {
              setPaletteSectionTab('sec-b');
              handleSelectSection('sec-b');
            }}
            className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-mono font-bold transition-all cursor-pointer ${
              paletteSectionTab === 'sec-b'
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'text-[#45464d] hover:bg-[#eff4ff]'
            }`}
          >
            Sec B: Coding
          </button>
          <button
            onClick={() => {
              setPaletteSectionTab('sec-c');
              handleSelectSection('sec-c');
            }}
            className={`flex-1 py-1.5 rounded-lg text-center text-[11px] font-mono font-bold transition-all cursor-pointer ${
              paletteSectionTab === 'sec-c'
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'text-[#45464d] hover:bg-[#eff4ff]'
            }`}
          >
            Sec C: Design
          </button>
        </nav>

        {/* Legend status indicators */}
        <div className="px-3 py-2 bg-[#eff4ff]/60 border-b border-[#e5eeff] grid grid-cols-2 gap-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#069669]" />
            <span className="text-[#45464d]">Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
            <span className="text-[#45464d]">Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]" />
            <span className="text-[#45464d]">Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c6c6cd]" />
            <span className="text-[#45464d]">Not Visited</span>
          </div>
        </div>

        {/* 10-Item sample preview grid from sidebar */}
        <div className="flex-1 p-3.5 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2 font-mono text-[12px]">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => {
              const status = questionStatuses[num] || 'not_visited';
              const isCurrent = num === currentQuestionId;

              let style = 'bg-[#eff4ff] text-[#45464d]';
              if (status === 'answered') style = 'bg-[#069669] text-white font-bold';
              else if (status === 'marked_for_review' || status === 'marked_and_answered') style = 'bg-[#1d4ed8] text-white font-bold';
              else if (status === 'not_answered') style = 'bg-[#ba1a1a] text-white font-bold';
              else if (status === 'not_visited') style = 'bg-[#dce9ff] text-[#45464d]';

              return (
                <button
                  key={num}
                  onClick={() => navigateToQuestion(num)}
                  className={`h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${style} ${
                    isCurrent ? 'ring-2 ring-[#1d4ed8] ring-offset-1 font-black shadow-xs' : ''
                  }`}
                >
                  {String(num).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Candidate Snapshot Feed Live at bottom of sidebar */}
        <div className="p-3 bg-[#eff4ff] border-t border-[#e5eeff]">
          <div className="flex items-center justify-between text-[#45464d] font-mono text-[11px] mb-1.5">
            <span>Candidate Snapshot Feed</span>
            <span className="text-[#069669] font-bold">LIVE 30fps</span>
          </div>
          <div className="w-full h-24 rounded-lg bg-[#131b2e] relative overflow-hidden flex items-center justify-center">
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
                src={INITIAL_CANDIDATE.invigilatorFeedUrl}
                alt="Proctor feed"
                className="w-full h-full object-cover opacity-80"
              />
            )}
            <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px]">
              AI Proctor Active
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN EXAM WORKSPACE */}
      <div className="2xl:pr-80 flex-1">
        <main className="pt-20 pb-24 min-h-screen w-full px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col w-full">
            {/* SECTION SELECTOR & TAB NAVIGATION */}
            <SectionNav
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              saveLatencyMs={saveLatencyMs}
              isSaving={isSaving}
            />

            {/* MAIN EXAM WORKSPACE GRID (8 Cols Question + 4 Cols Candidate/Invigilator) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              {/* LEFT & CENTER: QUESTION STAGE (8 Cols) */}
              <div className="xl:col-span-8 flex flex-col gap-4">
                <QuestionStage
                  question={currentQuestion}
                  totalQuestions={INITIAL_QUESTIONS.length}
                  selectedOption={userAnswers[currentQuestionId] || null}
                  onSelectOption={handleSelectOption}
                  isBookmarked={bookmarkedQuestions.has(currentQuestionId)}
                  onToggleBookmark={handleToggleBookmark}
                  fontSizeLevel={fontSizeLevel}
                  onChangeFontSize={(delta) => setFontSizeLevel((prev) => Math.min(2, Math.max(-1, prev + delta)))}
                  onResetFontSize={() => setFontSizeLevel(0)}
                  onOpenCalculator={() => setIsCalculatorOpen(true)}
                  onOpenScratchpad={() => setIsScratchpadOpen(true)}
                  clusterNode="IN-BLR-04#secure"
                  responseHash={responseHash}
                />
              </div>

              {/* RIGHT: CANDIDATE OVERVIEW, PALETTE MATRIX & PROCTOR FEED (4 Cols) */}
              <div className="xl:col-span-4 flex flex-col gap-4">
                <RightSidebar
                  candidate={INITIAL_CANDIDATE}
                  telemetry={telemetry}
                  totalQuestions={INITIAL_QUESTIONS.length}
                  currentQuestionId={currentQuestionId}
                  onSelectQuestion={navigateToQuestion}
                  questionStatuses={questionStatuses}
                  selectedFilter={paletteFilter}
                  onFilterChange={setPaletteFilter}
                  activeSection={activeSection}
                  onSelectSection={handleSelectSection}
                  onToggleCamera={toggleRealCamera}
                  isRealCamera={isRealCamera}
                  videoRef={videoRef}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FIXED FOOTER CONTROLS */}
      <Footer
        onClearResponse={handleClearResponse}
        onMarkForReviewAndNext={handleMarkForReviewAndNext}
        onPrevious={handlePrevious}
        onSaveAndNext={handleSaveAndNext}
        onSubmitExam={() => setIsSubmitModalOpen(true)}
        hasSelection={!!userAnswers[currentQuestionId]}
        isFirstQuestion={currentQuestionId === 1}
        isLastQuestion={currentQuestionId === INITIAL_QUESTIONS.length}
      />

      {/* MODALS */}
      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {
          setIsSubmitModalOpen(false);
          setIsExamSubmitted(true);
        }}
        counts={counts}
        courseCode={INITIAL_CANDIDATE.courseCode}
        courseName={INITIAL_CANDIDATE.courseName}
      />

      <PaperOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        courseCode={INITIAL_CANDIDATE.courseCode}
        courseName={INITIAL_CANDIDATE.courseName}
      />

      <TabInfractionBanner
        isOpen={isInfractionAlertOpen}
        infractionsCount={telemetry.tabInfractions}
        maxInfractions={telemetry.maxTabInfractions}
        onDismiss={() => setIsInfractionAlertOpen(false)}
      />
    </div>
  );
}
