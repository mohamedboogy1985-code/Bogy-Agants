export type AgentId = 'master' | 'windows' | 'office' | 'web';

export type AgentStatus = 'idle' | 'listening' | 'planning' | 'executing' | 'completed' | 'error';

export interface AgentInfo {
  id: AgentId;
  name: string;
  nameAr: string;
  roleAr: string;
  color: 'cyan' | 'blue' | 'emerald' | 'violet';
  status: AgentStatus;
  currentTask?: string;
  completedTasksCount: number;
}

export interface OrchestratorPlanTask {
  agentId: AgentId;
  taskTitle: string;
  instruction: string;
  expectedArtifact?: string;
  status: 'pending' | 'in_progress' | 'done' | 'failed';
  result?: any;
}

export interface OrchestrationResult {
  planSummary: string;
  speechResponse: string;
  delegatedTasks: OrchestratorPlanTask[];
}

export interface WindowsCommandLog {
  id: string;
  timestamp: string;
  command: string;
  output: string;
  status: 'success' | 'warning' | 'error';
  script?: string;
}

export interface WindowsProcess {
  pid: number;
  name: string;
  cpu: number;
  ramMb: number;
  status: 'Running' | 'Suspended';
}

export interface ExcelSheetData {
  title: string;
  sheetName: string;
  fileName: string;
  headers: string[];
  rows: (string | number)[][];
  summaryRow?: (string | number)[];
  formulaDescription?: string;
}

export interface WordSection {
  heading: string;
  content: string;
}

export interface WordDocumentData {
  title: string;
  fileName: string;
  subtitle?: string;
  author: string;
  date: string;
  sections: WordSection[];
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface DownloadItem {
  id: string;
  name: string;
  extension: string;
  size: string;
  progress: number;
  speed: string;
  status: 'downloading' | 'completed' | 'paused';
  description?: string;
  directDownloadContent?: string;
}

export interface AgentMessage {
  id: string;
  senderId: AgentId | 'user';
  senderName: string;
  text: string;
  timestamp: string;
  audioUrl?: string;
  taskData?: any;
}
