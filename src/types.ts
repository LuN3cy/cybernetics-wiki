export type LabType =
  | "route-switch"
  | "fiber"
  | "capacity"
  | "random-search"
  | "memory-search"
  | "precipitation"
  | "reactor-feedback"
  | "feedback-amplifier"
  | "positive-loop"
  | "knowing-space"
  | "signal-channel"
  | "receiver-meaning"
  | "channel-capacity"
  | "filtering"
  | "storage-chain"
  | "reasoning-space"
  | "organization-space"
  | "causal-network"
  | "isolated-system"
  | "steady-structure"
  | "prediction-model"
  | "equilibrium-stability"
  | "oscillation"
  | "ultrastability"
  | "system-evolution"
  | "system-collapse"
  | "self-organization"
  | "intelligence-amplifier"
  | "qualitative-problem"
  | "leap-gradual"
  | "stable-quality"
  | "potential-well"
  | "phase-transition"
  | "detect-leap"
  | "transition-condition"
  | "catastrophe-node"
  | "overcorrection"
  | "coexistence"
  | "common-mission"
  | "black-box"
  | "epistemology-model"
  | "observability-control"
  | "theory-clarity"
  | "convergence-speed"
  | "overfeedback"
  | "decidability"
  | "science-human"
  | "poison-binary"
  | "huffman-compression";

export type SourceReference = {
  chapter: string;
  section: string;
  pages: string;
  pageNumber: number;
  pageImage: string;
  highlight: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  excerpt: string;
  note: string;
};

export type CaseStudy = {
  source: string;
  title: string;
  body: string;
  reference?: SourceReference;
};

export type LabConfig = {
  type: LabType;
  title: string;
  premise: string;
  task: string;
};

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  concept: string;
};

export type ChapterModule = {
  id: string;
  chapter: "第一章" | "第二章" | "第三章" | "第四章" | "第五章" | "趣味问题";
  index: string;
  title: string;
  question: string;
  takeaway: string;
  sourceCase: CaseStudy;
  modernCase: CaseStudy;
  theory: string[];
  operationGuide: string[];
  formula: string;
  lab: LabConfig;
  quiz: QuizQuestion[];
};
