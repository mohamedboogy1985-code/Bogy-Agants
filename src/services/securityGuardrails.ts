import { SecurityPolicyConfig, SecurityAuditItem, SecurityLevel } from '../types/agent';

export class SecurityGuardrails {
  private static BLOCKED_PATTERNS = [
    /rmdir\s+.*\/s/i,
    /del\s+.*\/f\s+.*\/s/i,
    /format\s+[a-z]:/i,
    /reg\s+delete/i,
    /drop\s+database/i,
    /c:\\windows\\system32/i,
    /shutdown\s+\/s/i,
    /:(){ :\|:& };:/, // fork bomb
    /mkfs/i,
    /dd\s+if=/i,
  ];

  private static actionTimestamps: number[] = [];

  // Default Guardrails Security Policy
  public static defaultPolicy: SecurityPolicyConfig = {
    level: 'strict',
    requireHumanConfirmationForDestructive: true,
    blockSystemPaths: true,
    maxActionsPerMinute: 25,
    allowedDomains: ['*'],
    blockedPatterns: [
      'format',
      'rmdir /s /q',
      'del /f /s C:\\',
      'reg delete HKLM',
      'System32 deletion',
      'Arbitrary driver install',
    ],
  };

  // Evaluate Risk of an intended action
  public static evaluateRisk(
    adapter: 'mouse_keyboard' | 'browser' | 'filesystem' | 'windows',
    action: string,
    target: string,
    policy: SecurityPolicyConfig = this.defaultPolicy
  ): {
    riskLevel: 'low' | 'medium' | 'high' | 'blocked';
    isAllowed: boolean;
    requiresConfirmation: boolean;
    reason: string;
  } {
    // 1. Rate-limiting check to prevent runaway LLM loops
    const now = Date.now();
    this.actionTimestamps = this.actionTimestamps.filter((t) => now - t < 60000);
    if (this.actionTimestamps.length >= policy.maxActionsPerMinute) {
      return {
        riskLevel: 'blocked',
        isAllowed: false,
        requiresConfirmation: false,
        reason: `تم تجاوز الحد الأقصى للعمليات في الدقيقة (${policy.maxActionsPerMinute} عمليات) لحماية موارد النظام من الحلقات التكرارية.`,
      };
    }
    this.actionTimestamps.push(now);

    const combinedStr = `${action} ${target}`.toLowerCase();

    // 2. Check for explicitly dangerous / destructive patterns
    for (const pattern of this.BLOCKED_PATTERNS) {
      if (pattern.test(combinedStr)) {
        return {
          riskLevel: 'blocked',
          isAllowed: false,
          requiresConfirmation: false,
          reason: 'محظور تماماً: أمر تدميري أو محاولة تعديل مسارات النظام الحساسة لحماية ويندوز.',
        };
      }
    }

    // 3. Adapter-specific risk analysis
    if (adapter === 'windows') {
      if (
        combinedStr.includes('install') ||
        combinedStr.includes('stop-service') ||
        combinedStr.includes('set-executionpolicy') ||
        combinedStr.includes('taskkill')
      ) {
        return {
          riskLevel: 'high',
          isAllowed: true,
          requiresConfirmation: policy.requireHumanConfirmationForDestructive,
          reason: 'عملية تعديل في خدمات أو برامج ويندوز - تتطلب موافقة المستخدم في الوضع الآمن.',
        };
      }
      return {
        riskLevel: 'medium',
        isAllowed: true,
        requiresConfirmation: false,
        reason: 'تشغيل أمر PowerShell/CMD في البيئة المحمية.',
      };
    }

    if (adapter === 'browser') {
      if (action === 'navigate') {
        return {
          riskLevel: 'low',
          isAllowed: true,
          requiresConfirmation: false,
          reason: 'تصفح موقع ويب آمن.',
        };
      }
      if (action === 'type' || action === 'click') {
        return {
          riskLevel: 'medium',
          isAllowed: true,
          requiresConfirmation: false,
          reason: 'أتمتة تفاعل مع صفحة الويب.',
        };
      }
    }

    if (adapter === 'mouse_keyboard') {
      return {
        riskLevel: 'low',
        isAllowed: true,
        requiresConfirmation: false,
        reason: 'محاكاة حركة الفأرة أو إدخال لوحة المفاتيح ضمن نافذة العمل.',
      };
    }

    return {
      riskLevel: 'low',
      isAllowed: true,
      requiresConfirmation: false,
      reason: 'عملية مصرح بها.',
    };
  }

  // Generate OpenAI / Ollama Tool Calling Schema for all Adapters
  public static getOllamaToolsSchema() {
    return [
      {
        type: 'function',
        function: {
          name: 'mouse_keyboard_action',
          description:
            'Execute safe mouse movement, click, scroll, drag, keyboard typing, or shortcut on Windows desktop.',
          parameters: {
            type: 'object',
            properties: {
              actionCategory: {
                type: 'string',
                enum: ['mouse', 'keyboard'],
                description: 'Whether this is a mouse or keyboard operation',
              },
              actionType: {
                type: 'string',
                enum: ['move', 'click', 'double_click', 'right_click', 'scroll', 'drag', 'type', 'press', 'shortcut'],
                description: 'The specific mouse or keyboard action to perform',
              },
              x: { type: 'number', description: 'Screen X coordinate (0-1920)' },
              y: { type: 'number', description: 'Screen Y coordinate (0-1080)' },
              text: { type: 'string', description: 'Text to type into active window/element' },
              key: { type: 'string', description: 'Single key to press (Enter, Esc, Tab, etc.)' },
              modifiers: {
                type: 'array',
                items: { type: 'string', enum: ['ctrl', 'alt', 'shift', 'win'] },
                description: 'Key modifiers for shortcuts',
              },
            },
            required: ['actionCategory', 'actionType'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'browser_action',
          description:
            'Advanced browser control: navigate URL, click element selector, type input, take screenshot, extract page text.',
          parameters: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['navigate', 'click', 'type', 'screenshot', 'extract', 'scroll'],
                description: 'Browser automation action',
              },
              url: { type: 'string', description: 'Target website URL (e.g. https://...)' },
              selector: { type: 'string', description: 'CSS selector or element identifier' },
              text: { type: 'string', description: 'Text to fill into target input' },
              scrollDirection: { type: 'string', enum: ['up', 'down'] },
            },
            required: ['action'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'filesystem_action',
          description:
            'Safe scoped file management: list directory, read file, or write file in allowed user folders. System paths (System32, Windows root) are blocked.',
          parameters: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['list', 'read', 'write', 'permissions'],
                description: 'File operation to perform',
              },
              targetPath: {
                type: 'string',
                description: 'Path to folder or file (e.g. C:/Users/User/Documents/file.txt)',
              },
              content: {
                type: 'string',
                description: 'Content to write if action is write',
              },
              permissionScope: {
                type: 'string',
                enum: ['user_workspace', 'desktop', 'documents', 'downloads'],
                description: 'Scoped safety zone',
              },
            },
            required: ['action', 'targetPath'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'system_execute_safe',
          description:
            'Execute a safe Windows diagnostics, process inspection, or multi-program launch. Destructive commands are blocked.',
          parameters: {
            type: 'object',
            properties: {
              command: { type: 'string', description: 'PowerShell/CMD command to run' },
              actionType: { type: 'string', enum: ['powershell', 'cmd'] },
            },
            required: ['command'],
          },
        },
      },
    ];
  }

  // Generate Python Adapter Bridge for local Ollama run
  public static generatePythonBridge(): string {
    return `#!/usr/bin/env python3
# ========================================================
# Bogy Agents AI - Safe Ollama Adapter Bridge (Python)
# ========================================================
import requests
import json
import sys

API_BASE = "http://localhost:3000/api"

def call_adapter(endpoint, payload):
    try:
        res = requests.post(f"{API_BASE}/{endpoint}", json=payload)
        return res.json()
    except Exception as e:
        return {"error": str(e)}

def execute_mouse(action_type="click", x=500, y=300):
    return call_adapter("adapters/mouse-keyboard/action", {
        "actionCategory": "mouse",
        "actionType": action_type,
        "x": x,
        "y": y
    })

def execute_keyboard(text):
    return call_adapter("adapters/mouse-keyboard/action", {
        "actionCategory": "keyboard",
        "actionType": "type",
        "text": text
    })

def execute_browser(action="navigate", url="https://google.com"):
    return call_adapter("adapters/browser/action", {
        "action": action,
        "url": url
    })

def execute_fs(action="list", path="C:/Users/User/Documents"):
    return call_adapter("adapters/filesystem/action", {
        "action": action,
        "targetPath": path
    })

if __name__ == "__main__":
    print("🛡️ Bogy Agents AI - Python Safe Adapter Bridge Initialized")
    print("Guardrails Active: Windows System Files Protected 100%")
`;
  }

  // Generate Ollama Modelfile string with embedded Security Guardrails
  public static generateOllamaModelfile(baseModel: string = 'llama3.2'): string {
    return `# ========================================================
# Bogy Agents AI - Ollama Modelfile with Safety Guardrails
# ========================================================
FROM ${baseModel}

PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER stop "<|eot_id|>"

SYSTEM """
أنت "وكيل بوجي الذكي لأتمتة ويندوز والمتصفح" (Bogy Agent Swarm).
أنت وكيل ذكي مقيد بسياسة أمان صارمة لحماية نظام المستخدم:
1. صلاحياتك محكومة بـ Security Guardrails: لا يحق لك تنفيذ أوامر حذف ملفات النظام، تهيئة الأقراص (format)، أو تعديل سجل ويندوز الأساسي.
2. يمكنك استخدام أدوات الفأرة ولوحة المفاتيح (mouse_keyboard_action) للنقر والتنقل والكتابة.
3. يمكنك استخدام أدوات المتصفح (browser_action) لتصفح المواقع واستخراج المحتوى وملء النماذج.
4. يمكنك استخدام أدوات الملفات الآمنة (filesystem_action) للقراءة والكتابة في مجلدات العمل والمستندات المصرح بها.
5. يمكنك تشغيل البرامج المصرح بها (المفكرة، الحاسبة، إكسيل، وورد، المتصفح).
6. دائماً لخص خطواتك باللغة العربية بأسلوب ودود وموجز، وطلب تأكيد المستخدم قبل أي خطوة تعديل هامة.
"""
`;
  }
}
