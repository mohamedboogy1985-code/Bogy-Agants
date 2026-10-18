import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Pause, Mic, Radio, Sliders, Check, UserCheck } from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface NaturalVoiceStudioProps {
  isSpeaking: boolean;
  audioMuted: boolean;
  onToggleMute: () => void;
  lastSpeechText?: string;
  onSpeakSample: (text: string, voice: string) => void;
}

export const NaturalVoiceStudio: React.FC<NaturalVoiceStudioProps> = ({
  isSpeaking,
  audioMuted,
  onToggleMute,
  lastSpeechText,
  onSpeakSample,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Zephyr' | 'Puck' | 'Fenrir'>('Kore');
  const [selectedRate, setSelectedRate] = useState<number>(1.0);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const VOICES = [
    {
      id: 'Kore' as const,
      name: 'كوري (Kore)',
      gender: 'أنثوي دافئ',
      description: 'نبرة صوت بشرية دافئة وناعمة، تعبيرية وطبيعية جداً بدون أي طابع آلي',
      color: 'from-pink-500/20 to-rose-600/20 border-rose-500/40 text-rose-300',
    },
    {
      id: 'Zephyr' as const,
      name: 'زفير (Zephyr)',
      gender: 'ذكوري رزين',
      description: 'نبرة صوت رجالية هادئة واحترافية، تتميز بوقفات طبيعية ووضوح تام',
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'Puck' as const,
      name: 'باك (Puck)',
      gender: 'تفاعلي وحيوي',
      description: 'نبرة مفعمة بالحيوية والحماس، تتفاعل مع التفاصيل بنشاط بشري ملحوظ',
      color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300',
    },
  ];

  const handleSelectVoice = (voiceId: 'Kore' | 'Zephyr' | 'Puck' | 'Fenrir') => {
    setSelectedVoice(voiceId);
    voiceService.setDefaultVoice(voiceId);
  };

  const handleSelectRate = (rate: number) => {
    setSelectedRate(rate);
    voiceService.setSpeechRate(rate);
  };

  const handleTestNaturalVoice = () => {
    const sampleText =
      selectedVoice === 'Zephyr'
        ? 'مرحباً بكم ببرنامج وكلاء بوجي! أنا زفير، صوتك الذكي الطبيعي في منظومة وكلاء بوجي. يسعدني أن أنفذ معك أي أمر على ويندوز وملفات الأوفيس والإنترنت بكل أريحية ودقة.'
        : selectedVoice === 'Puck'
        ? 'مرحباً بكم ببرنامج وكلاء بوجي! أنا باك، جاهز تماماً للبدء معك وتنسيق المهام مع زملائي الوكلاء لتنجز أعمالك بسرعة وبأعلى دقة!'
        : 'مرحباً بكم ببرنامج وكلاء بوجي! أنا كوري، صوت الذكاء الاصطناعي الطبيعي هنا لمساعدتك. استمع كيف أتحدث بنبرة بشرية مريحة ودافئة بدون أي جمود آلي، وأنا جاهزة دائماً لتنفيذ كل طلباتك.';

    setIsPlayingTest(true);
    onSpeakSample(sampleText, selectedVoice);
    setTimeout(() => setIsPlayingTest(false), 8000);
  };

  const handleReplayLast = () => {
    if (lastSpeechText) {
      onSpeakSample(lastSpeechText, selectedVoice);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-cyan-900/40 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        {/* Title & Speech Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                محرّك النطق البشري الطبيعي للذكاء الاصطناعي (Natural Voice Engine)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-800/60 font-semibold">
                طبيعي وإنساني 100%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              نظام نطق ذكي بنبرة بشرية دافئة وإيقاع كلام واقعي مع أنفاس ومحطات طبيعية خالية من الآلية
            </p>
          </div>
        </div>

        {/* Live Controls & Test Trigger */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Test Voice Button */}
          <button
            onClick={handleTestNaturalVoice}
            disabled={audioMuted}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer disabled:opacity-40"
            title="استمع إلى عينة من الصوت البشري الطبيعي"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تجربة النطق البشري</span>
          </button>

          {/* Replay Last Orchestration Speech */}
          {lastSpeechText && (
            <button
              onClick={handleReplayLast}
              disabled={audioMuted}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
              title="إعادة نطق الرد الأخير بالصوت الطبيعي"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>إعادة الرد الأخير</span>
            </button>
          )}

          {/* Mute Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              audioMuted
                ? 'bg-red-950/60 border-red-800 text-red-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-400'
            }`}
            title={audioMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Voice Personas Grid & Cadence Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VOICES.map((v) => {
          const isSelected = selectedVoice === v.id;
          return (
            <div
              key={v.id}
              onClick={() => handleSelectVoice(v.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-900 border-2 ${v.color} shadow-lg`
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className={`w-4 h-4 ${isSelected ? 'text-pink-400' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-200">{v.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {v.gender}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{v.description}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">طبيعي 24kHz Mono WAV</span>
                {isSelected ? (
                  <span className="text-pink-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    الصوت المعتمد
                  </span>
                ) : (
                  <span className="text-slate-500 hover:text-slate-300">اختر هذا الصوت</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Speed & Human Pacing Slider */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>سرعة وإيقاع الحديث البشري:</span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: 'هادئ ومتأني (0.9x)', value: 0.9 },
            { label: 'طبيعي ومريح (1.0x)', value: 1.0 },
            { label: 'سريع وخفيف (1.15x)', value: 1.15 },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => handleSelectRate(r.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                selectedRate === r.value
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
