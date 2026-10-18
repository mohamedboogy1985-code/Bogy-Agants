// Audio and Voice Management Service with Natural Human Speech Engine

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private audioContext: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private lang: string = 'ar-SA';
  private defaultVoiceName: string = 'Kore'; // 'Kore' (Warm Human Female) | 'Zephyr' (Calm Human Male) | 'Puck' (Lively)
  private speechRate: number = 1.0;

  constructor() {
    this.initRecognition();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Cache voices when ready
      };
    }
  }

  private initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.lang;
    }
  }

  public setLanguage(lang: string) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public setDefaultVoice(voiceName: string) {
    this.defaultVoiceName = voiceName;
  }

  public getDefaultVoice(): string {
    return this.defaultVoiceName;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.75, Math.min(1.5, rate));
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = this.speechRate;
    }
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public isSpeechSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: any) => void,
    onStateChange?: (listening: boolean) => void
  ) {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        onError(new Error('متصفحك لا يدعم التعرف على الصوت. يمكنك استخدام الإدخال النصي.'));
        return;
      }
    }

    if (this.isListening) return;

    try {
      this.playTone('activate');
      this.recognition.lang = this.lang;

      this.recognition.onstart = () => {
        this.isListening = true;
        onStateChange?.(true);
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript.trim()) {
          onResult(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error !== 'no-speech') {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onStateChange?.(false);
      };

      this.recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      onError(err);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.error('Error stopping speech:', err);
      }
      this.isListening = false;
      this.playTone('deactivate');
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Play audio response using Gemini Natural Voice TTS or Neural Browser Voice
  public async speakText(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    voiceName?: string
  ): Promise<void> {
    this.stopSpeaking();

    const selectedVoice = voiceName || this.defaultVoiceName;

    // 1. Try server-side Gemini 3.8 Flash Lite TTS with natural human inflection
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: selectedVoice }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audio.playbackRate = this.speechRate;
          this.currentAudioElement = audio;

          audio.onplay = () => onStart?.();
          audio.onended = () => {
            this.currentAudioElement = null;
            onEnd?.();
          };
          audio.onerror = () => {
            this.fallbackClientSpeak(text, onStart, onEnd);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Server TTS failed, falling back to Web Speech API:', err);
    }

    // 2. Fallback to client browser SpeechSynthesis with natural human voice selection
    this.fallbackClientSpeak(text, onStart, onEnd);
  }

  // Browser Fallback with prioritization of Natural / Neural voices
  private fallbackClientSpeak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Find the most natural sounding Arabic voice available in the OS / Browser
    const voices = window.speechSynthesis.getVoices();
    
    // Priority: Neural/Natural Arabic > Google Arabic > Any Arabic > Default
    const naturalArabicVoice = voices.find(
      (v) =>
        v.lang.startsWith('ar') &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('online') ||
          v.name.toLowerCase().includes('neural') ||
          v.name.toLowerCase().includes('google'))
    );

    const standardArabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
    );

    if (naturalArabicVoice) {
      utterance.voice = naturalArabicVoice;
      utterance.lang = naturalArabicVoice.lang;
    } else if (standardArabicVoice) {
      utterance.voice = standardArabicVoice;
      utterance.lang = standardArabicVoice.lang;
    } else {
      utterance.lang = this.lang;
    }

    // Natural pacing parameters (slightly relaxed human rate, friendly pitch)
    utterance.rate = this.speechRate * 0.95;
    utterance.pitch = 1.02;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Futuristic Web Audio Synthesizer for feedback tones
  public playTone(type: 'activate' | 'deactivate' | 'success' | 'task_start') {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      if (type === 'activate') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'deactivate') {
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'task_start') {
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch {
      // AudioContext may be restricted before first gesture
    }
  }
}

export const voiceService = new VoiceService();
