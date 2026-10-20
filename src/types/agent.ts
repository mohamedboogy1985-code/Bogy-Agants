export type AgentId = 'master' | 'startup' | 'windows' | 'office' | 'web';

export type AgentStatus = 'idle' | 'listening' | 'planning' | 'executing' | 'completed' | 'error';

export interface AgentInfo {
  id: AgentId;
  name: string;
  nameAr: string;
  roleAr: string;
  color: 'cyan' | 'amber' | 'blue' | 'emerald' | 'violet';
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

// Mouse & Keyboard Adapter Types
export type MouseActionType = 'move' | 'click' | 'double_click' | 'right_click' | 'scroll' | 'drag';
export type KeyboardActionType = 'type' | 'press' | 'shortcut';

export interface MouseKeyboardActionPayload {
  actionCategory: 'mouse' | 'keyboard';
  actionType: MouseActionType | KeyboardActionType;
  x?: number;
  y?: number;
  deltaY?: number;
  button?: 'left' | 'right' | 'middle';
  text?: string;
  key?: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'win')[];
}

// Browser Automation Adapter Types
export interface BrowserConfig {
  headless: boolean;
  viewportWidth: number;
  viewportHeight: number;
  userAgent: string;
  javascriptEnabled: boolean;
  allowDownloads: boolean;
  blockAdsAndTrackers: boolean;
}

export type BrowserActionType =
  | 'navigate'
  | 'click'
  | 'type'
  | 'screenshot'
  | 'extract'
  | 'scroll'
  | 'close_tab';

export interface BrowserActionPayload {
  action: BrowserActionType;
  url?: string;
  selector?: string;
  text?: string;
  scrollDirection?: 'up' | 'down';
  amount?: number;
}

// Security & LLM Guardrails Types
export type SecurityLevel = 'strict' | 'balanced' | 'permissive';

export interface SecurityAuditItem {
  id: string;
  timestamp: string;
  adapter: 'mouse_keyboard' | 'browser' | 'filesystem' | 'windows';
  action: string;
  target: string;
  riskLevel: 'low' | 'medium' | 'high' | 'blocked';
  status: 'allowed' | 'confirmed_by_user' | 'blocked';
  reason?: string;
}

export interface SecurityPolicyConfig {
  level: SecurityLevel;
  requireHumanConfirmationForDestructive: boolean;
  blockSystemPaths: boolean;
  maxActionsPerMinute: number;
  allowedDomains: string[];
  blockedPatterns: string[];
}

// Ollama Local Agent Types
export interface OllamaModelOption {
  name: string;
  displayName: string;
  size: string;
  family: string;
  recommended: boolean;
}

export interface OllamaConfig {
  host: string;
  selectedModel: string;
  temperature: number;
  isConnected: boolean;
  systemPrompt: string;
  useOllamaForExecution: boolean;
}
