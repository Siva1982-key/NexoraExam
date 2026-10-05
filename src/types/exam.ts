export type SectionId = 'sec-a' | 'sec-b' | 'sec-c';

export type QuestionStatus = 
  | 'not_visited' 
  | 'not_answered' 
  | 'answered' 
  | 'marked_for_review' 
  | 'marked_and_answered';

export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  subtext?: string;
  isCorrect?: boolean;
}

export interface CodeSnippet {
  title: string;
  lang: string;
  lines: string[];
}

export interface Question {
  id: number;
  sectionId: SectionId;
  sectionName: string;
  category: string;
  stem: string;
  codeSnippet?: CodeSnippet;
  options: Option[];
  marks: number;
  negativeMarks: number;
  tags: string;
  type: string;
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface ProctorTelemetry {
  ambientNoiseDb: number;
  displayLockdown: string;
  tabInfractions: number;
  maxTabInfractions: number;
  faceVerified: boolean;
  gazeStatus: string;
  fps: number;
  isWebcamActive: boolean;
  serverSyncMs: number;
  serverHash: string;
}

export interface CandidateInfo {
  name: string;
  rollNo: string;
  deskNo: string;
  semester: string;
  courseCode: string;
  courseName: string;
  avatarUrl: string;
  invigilatorFeedUrl: string;
}
