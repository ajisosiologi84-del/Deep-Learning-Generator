import React, { useState, useRef } from 'react';
import { RPPInputFormState } from '../types/rpp';
import { DPL_LIST } from '../data/dplData';
import { PRESETS } from '../data/presets';
import { DEFAULT_LOGO_SEKOLAH, DEFAULT_LOGO_PEMDA } from '../data/defaultLogos';
import { KELAS_FASE_OPTIONS, JENJANG_CATEGORIES } from '../data/kelasData';
import {
  Sparkles,
  Users,
  Brain,
  MapPin,
  Check,
  GraduationCap,
  Clock,
  Loader2,
  BookmarkCheck,
  Building2,
  FileCheck2,
  CheckCircle2,
  Upload,
  RotateCcw,
  Image,
  Layers,
  BookOpen,
  Lightbulb,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';

interface RppInputFormProps {
  inputState: RPPInputFormState;
  setInputState: React.Dispatch<React.SetStateAction<RPPInputFormState>>;
  onSubmit: (state?: RPPInputFormState) => void;
  isLoading: boolean;
  onLoadPreset: (presetId: string) => void;
}

const MINAT_OPTIONS = [
  'Musik',
  'Sosial media',
  'Game',
  'Fotografi & Desain',
  'Olahraga',
  'Sains & Teknologi',
  'Alam & Lingkungan',
  'Kuliner & Wirausaha',
  'Membaca cerita / Komik',
];

const CARA_BELAJAR_OPTIONS = [
  'Visual',
  'Diskusi kelompok',
  'Kinestetik / Gerak',
  'Auditori',
  'Eksplorasi lapangan',
  'Eksperimen langsung',
];

const LINGKUNGAN_OPTIONS = [
  'Pesisir utara, nelayan, dan buruh',
  'Perdesaan, agraris, dan persawahan',
  'Perkotaan padat dan sentra industri',
  'Kawasan sentra pasar & UMKM keluarga',
  'Daerah pegunungan dan perkebunan teh/kopi',
  'Kawasan sentra pariwisata dan kerajinan seni',
  'Kawasan pinggiran kota (suburban)',
];

const ELEMEN_CP_SUGGESTIONS = [
  'Membaca dan Memirsa',
  'Menyimak',
  'Menulis Kreatif Multimodal',
  'Berbicara dan Mempresentasikan',
  'Pemahaman Konsep & Penalaran',
  'Keterampilan Proses Inkuiri Sains',
  'Analisis Data & Peluang Numerasi',
  'Dasar-dasar Literasi & STEAM',
];

export const RppInputForm: React.FC<RppInputFormProps> = ({
  inputState,
  setInputState,
  onSubmit,
  isLoading,
  onLoadPreset,
}) => {
  const [activeStep, setActiveStep] = useState<'identitas' | 'kurikulum' | 'diferensiasi' | 'profil' | 'kop_ttd'>('identitas');
  const [selectedJenjangFilter, setSelectedJenjangFilter] = useState<'ALL' | 'TK' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB'>('ALL');
  const logoKiriFileRef = useRef<HTMLInputElement>(null);
  const logoKananFileRef = useRef<HTMLInputElement>(null);

  const getDetectedFaseInfo = (kelasStr: string) => {
    if (!kelasStr) return null;
    const lower = kelasStr.toLowerCase();
    if (lower.includes('fondasi') || lower.includes('tk') || lower.includes('paud')) {
      return { jenjang: 'PAUD / TK', fase: 'Fase Fondasi', color: 'bg-amber-50 text-amber-800 border-amber-300' };
    }
    if (lower.includes('fase a') || lower.includes('kelas 1 ') || lower.includes('kelas 2 ') || lower.includes('kelas 1 sd') || lower.includes('kelas 2 sd') || lower.includes('kelas i ') || lower.includes('kelas ii ')) {
      return { jenjang: 'SD / MI', fase: 'Fase A (Kelas 1-2)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    }
    if (lower.includes('fase b') || lower.includes('kelas 3') || lower.includes('kelas 4') || lower.includes('kelas iii') || lower.includes('kelas iv')) {
      return { jenjang: 'SD / MI', fase: 'Fase B (Kelas 3-4)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    }
    if (lower.includes('fase c') || lower.includes('kelas 5') || lower.includes('kelas 6') || lower.includes('kelas v') || lower.includes('kelas vi')) {
      return { jenjang: 'SD / MI', fase: 'Fase C (Kelas 5-6)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    }
    if (lower.includes('smp') || lower.includes('fase d') || lower.includes('vii') || lower.includes('viii') || lower.includes('ix')) {
      return { jenjang: 'SMP / MTs', fase: 'Fase D (Kelas 7-9)', color: 'bg-sky-50 text-sky-800 border-sky-300' };
    }
    if (lower.includes('smk')) {
      if (lower.includes('fase e') || lower.includes('kelas x ') || lower.includes('kelas 10')) {
        return { jenjang: 'SMK / MAK', fase: 'Fase E (Kelas 10)', color: 'bg-purple-50 text-purple-800 border-purple-300' };
      }
      return { jenjang: 'SMK / MAK', fase: 'Fase F (Kelas 11-13)', color: 'bg-purple-50 text-purple-800 border-purple-300' };
    }
    if (lower.includes('sma') || lower.includes('fase e') || lower.includes('fase f') || lower.includes('xi') || lower.includes('xii') || lower.includes('x ')) {
      if (lower.includes('fase e') || lower.includes('kelas x') || lower.includes('kelas 10')) {
        return { jenjang: 'SMA / MA', fase: 'Fase E (Kelas 10)', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
      }
      return { jenjang: 'SMA / MA', fase: 'Fase F (Kelas 11-12)', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
    }
    if (lower.includes('slb')) {
      return { jenjang: 'SLB (Khusus)', fase: 'Pendidikan Khusus', color: 'bg-teal-50 text-teal-800 border-teal-300' };
    }
    return null;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, position: 'kiri' | 'kanan') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setInputState((prev) => ({
          ...prev,
          [position === 'kiri' ? 'logoKiri' : 'logoKanan']: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = (position: 'kiri' | 'kanan') => {
    setInputState((prev) => ({
      ...prev,
      [position === 'kiri' ? 'logoKiri' : 'logoKanan']: undefined,
    }));
  };

  const toggleDpl = (id: number) => {
    setInputState((prev) => {
      const exists = prev.selectedDpl.includes(id);
      if (exists) {
        if (prev.selectedDpl.length <= 1) return prev; // keep at least 1
        return {
          ...prev,
          selectedDpl: prev.selectedDpl.filter((x) => x !== id),
        };
      } else {
        if (prev.selectedDpl.length >= 4) {
          return {
            ...prev,
            selectedDpl: [...prev.selectedDpl.slice(1), id],
          };
        }
        return {
          ...prev,
          selectedDpl: [...prev.selectedDpl, id],
        };
      }
    });
  };

  const handleMinatChipClick = (tag: string) => {
    setInputState((prev) => {
      const current = prev.minat.split(',').map((s) => s.trim()).filter(Boolean);
      if (current.includes(tag)) {
        return { ...prev, minat: current.filter((s) => s !== tag).join(', ') };
      } else {
        return { ...prev, minat: current.length ? `${prev.minat}, ${tag}` : tag };
      }
    });
  };

  const handleCaraBelajarChipClick = (tag: string) => {
    setInputState((prev) => {
      const current = prev.caraBelajar.split(',').map((s) => s.trim()).filter(Boolean);
      if (current.includes(tag)) {
        return { ...prev, caraBelajar: current.filter((s) => s !== tag).join(', ') };
      } else {
        return { ...prev, caraBelajar: current.length ? `${prev.caraBelajar}, ${tag}` : tag };
      }
    });
  };

  const handleLingkunganSelect = (env: string) => {
    setInputState((prev) => ({ ...prev, lingkungan: env }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Preset Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-3.5 border-b border-emerald-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs font-semibold text-emerald-900">
              Contoh RPP Standar BSKAP:
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onLoadPreset(preset.id)}
                className="text-xs px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-medium transition-all hover:border-emerald-400 active:scale-95 inline-flex items-center gap-1.5"
                title={`${preset.label} (${preset.formInput.kelas})`}
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  {preset.badge || 'BSKAP'}
                </span>
                <span>{preset.formInput.mapel}: {preset.formInput.topik.slice(0, 18)}...</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="p-5 sm:p-6 space-y-5"
      >
        {/* Step navigation tabs (5 distinct phases) */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveStep('identitas')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              activeStep === 'identitas'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">1. Identitas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('kurikulum')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              activeStep === 'kurikulum'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">2. CP & HOTS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('diferensiasi')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              activeStep === 'diferensiasi'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">3. Diferensiasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('profil')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              activeStep === 'profil'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">4. Profil & DPL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('kop_ttd')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              activeStep === 'kop_ttd'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">5. Kop & TTD</span>
          </button>
        </div>

        {/* STEP 1: IDENTITAS */}
        {activeStep === 'identitas' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Identitas Pembelajaran & Materi Pokok
              </h3>
              <p className="text-xs text-slate-500">
                Data dasar guru pengampu, kelas, dan materi Capaian Pembelajaran (CP).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru Pengampu
                </label>
                <input
                  type="text"
                  value={inputState.namaGuru}
                  onChange={(e) => setInputState({ ...inputState, namaGuru: e.target.value })}
                  placeholder="Contoh: Rizqy Rahmat Hani, S.Pd."
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Guru Pengampu
                </label>
                <input
                  type="text"
                  value={inputState.nipGuru}
                  onChange={(e) => setInputState({ ...inputState, nipGuru: e.target.value })}
                  placeholder="Contoh: 19890615 201503 1 002 atau -"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={inputState.mapel}
                  onChange={(e) => setInputState({ ...inputState, mapel: e.target.value })}
                  placeholder="Contoh: Bahasa Indonesia, IPA, Matematika..."
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>

              {/* PILIHAN KELAS & FASE LENGKAP: TK, SD, SMP, SMA, SMK, SLB */}
              <div className="sm:col-span-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <label className="block text-xs font-bold text-slate-800">
                        Kelas & Fase (Kurikulum Merdeka BSKAP)
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Pilihan lengkap dari TK (Fondasi), SD (A, B, C), SMP (D), hingga SMA/SMK (E, F) & SLB.
                      </p>
                    </div>
                  </div>

                  {getDetectedFaseInfo(inputState.kelas) && (
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border inline-flex items-center gap-1 shrink-0 ${getDetectedFaseInfo(inputState.kelas)?.color}`}>
                      <Check className="w-3 h-3" />
                      <span>{getDetectedFaseInfo(inputState.kelas)?.jenjang} • {getDetectedFaseInfo(inputState.kelas)?.fase}</span>
                    </span>
                  )}
                </div>

                {/* Filter Jenjang Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Filter Jenjang:</span>
                  {[
                    { id: 'ALL', label: 'Semua' },
                    { id: 'TK', label: 'PAUD / TK' },
                    { id: 'SD', label: 'SD / MI' },
                    { id: 'SMP', label: 'SMP / MTs' },
                    { id: 'SMA', label: 'SMA / MA' },
                    { id: 'SMK', label: 'SMK / MAK' },
                    { id: 'SLB', label: 'SLB Khusus' },
                  ].map((tab) => {
                    const isActive = selectedJenjangFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedJenjangFilter(tab.id as any)}
                        className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Selection Pills */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                    <span>Pilih Cepat Kelas / Fase ({selectedJenjangFilter === 'ALL' ? 'Semua Jenjang' : selectedJenjangFilter}):</span>
                    <span className="text-[10px] text-slate-400">Klik tombol untuk memilih</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap max-h-36 overflow-y-auto pr-1">
                    {KELAS_FASE_OPTIONS.filter((item) =>
                      selectedJenjangFilter === 'ALL' ? true : item.jenjang === selectedJenjangFilter
                    ).map((option) => {
                      const isSelected = inputState.kelas === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setInputState({ ...inputState, kelas: option.value })}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all border inline-flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs ring-2 ring-emerald-300'
                              : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                          }`}
                          title={`${option.label} (${option.fase})`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-emerald-200" />}
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Manual + Dropdown Lengkap */}
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Atau Ketik Manual / Pilih Dropdown Lengkap:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputState.kelas}
                        onChange={(e) => setInputState({ ...inputState, kelas: e.target.value })}
                        placeholder="Contoh: Kelas 4 SD (Fase B) atau ketik manual..."
                        list="kelas-fase-datalist"
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        required
                      />
                      <datalist id="kelas-fase-datalist">
                        {KELAS_FASE_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label} ({item.fase})
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <select
                      onChange={(e) => {
                        if (e.target.value) setInputState({ ...inputState, kelas: e.target.value });
                      }}
                      value={KELAS_FASE_OPTIONS.some((o) => o.value === inputState.kelas) ? inputState.kelas : ''}
                      className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:max-w-[280px]"
                    >
                      <option value="">-- Pilih dari Daftar Lengkap --</option>
                      <optgroup label="PAUD / TK (Fase Fondasi)">
                        {KELAS_FASE_OPTIONS.filter((o) => o.jenjang === 'TK').map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="SD / MI (Fase A, B, C)">
                        {KELAS_FASE_OPTIONS.filter((o) => o.jenjang === 'SD').map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="SMP / MTs (Fase D)">
                        {KELAS_FASE_OPTIONS.filter((o) => o.jenjang === 'SMP').map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="SMA / MA (Fase E & F)">
                        {KELAS_FASE_OPTIONS.filter((o) => o.jenjang === 'SMA').map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="SMK / MAK (Fase E & F)">
                        {KELAS_FASE_OPTIONS.filter((o) => o.jenjang === 'SMK').map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Pendidikan Khusus (SLB)">
                        {KELAS_FASE_OPTIONS.filter((o) => o.jenjang === 'SLB').map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topik / Materi Pembelajaran (BSKAP)
                </label>
                <input
                  type="text"
                  value={inputState.topik}
                  onChange={(e) => setInputState({ ...inputState, topik: e.target.value })}
                  placeholder="Contoh: Karya Sastra Lama Gurindam / Ekosistem Pesisir / Statistika Pasar"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Alokasi Waktu
                </label>
                <input
                  type="text"
                  value={inputState.alokasiWaktu}
                  onChange={(e) => setInputState({ ...inputState, alokasiWaktu: e.target.value })}
                  placeholder="Contoh: 2 x 45 Menit (1 Pertemuan)"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep('kurikulum')}
                className="text-xs font-semibold px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-1"
              >
                Lanjut ke CP & HOTS →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CAPAIAN PEMBELAJARAN (CP) & PERTANYAAN PEMANTIK HOTS */}
        {activeStep === 'kurikulum' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Capaian Pembelajaran (CP) & Pertanyaan Pemantik HOTS
              </h3>
              <p className="text-xs text-slate-500">
                Pilar kurikulum mendalam: Elemen CP, Pemahaman Bermakna (Big Idea), dan pertanyaan esensial tingkat tinggi.
              </p>
            </div>

            {/* Elemen CP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Elemen Capaian Pembelajaran (Elemen CP)</span>
                <span className="text-[10px] text-slate-400 font-normal">Sesuai domain mapel</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ELEMEN_CP_SUGGESTIONS.map((tag) => {
                  const active = inputState.elemenCP?.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setInputState((prev) => ({
                          ...prev,
                          elemenCP: prev.elemenCP
                            ? prev.elemenCP.includes(tag)
                              ? prev.elemenCP.split(',').map((s) => s.trim()).filter((s) => s !== tag).join(', ')
                              : `${prev.elemenCP}, ${tag}`
                            : tag,
                        }));
                      }}
                      className={`text-xs px-2.5 py-0.5 rounded-full border transition-all ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={inputState.elemenCP || ''}
                onChange={(e) => setInputState({ ...inputState, elemenCP: e.target.value })}
                placeholder="Contoh: Membaca dan Memirsa, Menulis Kreatif Multimodal"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Capaian Pembelajaran (CP) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Rumusan Capaian Pembelajaran (CP) BSKAP</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Acuan Kompetensi Akhir Fase</span>
              </label>
              <textarea
                rows={3}
                value={inputState.capaianPembelajaran || ''}
                onChange={(e) => setInputState({ ...inputState, capaianPembelajaran: e.target.value })}
                placeholder="Tuliskan rumusan Capaian Pembelajaran (CP) resmi atau biarkan AI merumuskannya secara otomatis selaras dengan topik dan fase pilihan..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Pemahaman Bermakna (Big Idea) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Pemahaman Bermakna (Big Idea / Enduring Understanding)</span>
              </label>
              <textarea
                rows={2}
                value={inputState.pemahamanBermakna || ''}
                onChange={(e) => setInputState({ ...inputState, pemahamanBermakna: e.target.value })}
                placeholder="Gagasan besar yang menetap dalam benak murid sepanjang hayat (misal: 'Nilai moral dalam sastra klasik tetap menjadi kompas etika dalam menyelesaikan isu sosial masa kini')..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Pertanyaan Pemantik HOTS */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                  <span>Pertanyaan Pemantik HOTS (Higher-Order Thinking Skills)</span>
                </span>
                <span className="text-[10px] text-slate-400">1 baris = 1 pertanyaan</span>
              </label>
              <textarea
                rows={3}
                value={inputState.pertanyaanPemantik || ''}
                onChange={(e) => setInputState({ ...inputState, pertanyaanPemantik: e.target.value })}
                placeholder="Contoh:&#10;Mengapa petuah berima dua baris dari masa lalu masih mampu merefleksikan perilaku kita hari ini?&#10;Bagaimana kita menyulap karya klasik menjadi kampanye kontekstual yang digemari anak muda?&#10;Nilai etika apa yang paling mendesak disuarakan di lingkunganmu?"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-sans"
              />
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep('identitas')}
                className="text-xs font-medium px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                ← Kembali ke Identitas
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('diferensiasi')}
                className="text-xs font-semibold px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Lanjut ke Diferensiasi →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BLOK DIFERENSIASI PEMBELAJARAN MENDALAM & SARANA */}
        {activeStep === 'diferensiasi' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Diferensiasi Pembelajaran (Konten, Proses, Produk) & Sarana
              </h3>
              <p className="text-xs text-slate-500">
                Pilar personalisasi Kurikulum Merdeka BSKAP untuk mengakomodasi keberagaman murid.
              </p>
            </div>

            {/* Diferensiasi Konten */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>1. Diferensiasi Konten (Ragam Bahan Ajar)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Kesiapan & Modalitas</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Variasi materi berbasis modalitas visual, auditori, kinestetik, dan teks bertingkat.
              </p>
              <textarea
                rows={2}
                value={inputState.diferensiasiKonten || ''}
                onChange={(e) => setInputState({ ...inputState, diferensiasiKonten: e.target.value })}
                placeholder="Contoh: Murid visual menyimak infografis rima A-A; murid auditori mendengarkan audio rekaman berlagu; murid kinestetik mengamati langsung artefak di dermaga..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition"
              />
            </div>

            {/* Diferensiasi Proses */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>2. Diferensiasi Proses (Scaffolding & Bimbingan)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">Tingkat Dukungan</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Pendampingan intensif berjenjang (scaffolding) untuk yang baru memulai vs tantangan mandiri.
              </p>
              <textarea
                rows={2}
                value={inputState.diferensiasiProses || ''}
                onChange={(e) => setInputState({ ...inputState, diferensiasiProses: e.target.value })}
                placeholder="Contoh: Scaffolding bertingkat: Murid yang baru memulai didampingi lembar pola rima terpandu; murid cakap bekerja mandiri dalam tim; murid mahir menjadi mentor sebaya..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition"
              />
            </div>

            {/* Diferensiasi Produk */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>3. Diferensiasi Produk (Pilihan Unjuk Karya)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">Minat & Ekspresi</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Pilihan bentuk luaran hasil belajar (poster, video/podcast, esai, demonstrasi purwarupa).
              </p>
              <textarea
                rows={2}
                value={inputState.diferensiasiProduk || ''}
                onChange={(e) => setInputState({ ...inputState, diferensiasiProduk: e.target.value })}
                placeholder="Contoh: Pilihan karya: Poster digital infografis (Canva), video pendek reels berirama gurindam, atau komik strip digital bertema etika pesisir..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition"
              />
            </div>

            {/* Sarana & Prasarana */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sarana, Prasarana & Media Pembelajaran Kontekstual
              </label>
              <input
                type="text"
                value={inputState.saranaPrasarana || ''}
                onChange={(e) => setInputState({ ...inputState, saranaPrasarana: e.target.value })}
                placeholder="Contoh: Papan ide/refleksi kelas, smartphone/laptop, proyektor LCD, Canva/CapCut, lingkungan sekitar sekolah..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep('kurikulum')}
                className="text-xs font-medium px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                ← Kembali ke CP & HOTS
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('profil')}
                className="text-xs font-semibold px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Lanjut ke Profil & DPL →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROFIL MURID & DIMENSI PROFIL LULUSAN (DPL) */}
        {activeStep === 'profil' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Profil Murid & Identifikasi 8 Dimensi Profil Lulusan (DPL)
              </h3>
              <p className="text-xs text-slate-500">
                Personalisasi pembelajaran mendalam yang terhubung dengan realitas hidup murid dan dimensi BSKAP.
              </p>
            </div>

            {/* Minat Murid */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minat Murid (Kesenangan / Hobi):
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {MINAT_OPTIONS.map((tag) => {
                  const active = inputState.minat.toLowerCase().includes(tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleMinatChipClick(tag)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border transition-all ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={inputState.minat}
                onChange={(e) => setInputState({ ...inputState, minat: e.target.value })}
                placeholder="Tuliskan minat murid (misal: Musik, sosial media, game)..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>

            {/* Cara Belajar */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cara Belajar / Gaya Belajar:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {CARA_BELAJAR_OPTIONS.map((tag) => {
                  const active = inputState.caraBelajar.toLowerCase().includes(tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleCaraBelajarChipClick(tag)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border transition-all ${
                        active
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={inputState.caraBelajar}
                onChange={(e) => setInputState({ ...inputState, caraBelajar: e.target.value })}
                placeholder="Tuliskan gaya belajar (misal: Visual, diskusi kelompok)..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>

            {/* Lingkungan Tempat Tinggal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Lingkungan Tempat Tinggal & Karakter Sosial Budaya:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {LINGKUNGAN_OPTIONS.map((env) => {
                  const selected = inputState.lingkungan === env;
                  return (
                    <button
                      key={env}
                      type="button"
                      onClick={() => handleLingkunganSelect(env)}
                      className={`text-left text-xs p-2 rounded-lg border transition-all flex items-start gap-2 ${
                        selected
                          ? 'bg-emerald-50/80 border-emerald-500 text-emerald-900 font-medium ring-1 ring-emerald-500'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'}`}>
                        {selected && <Check className="w-2.5 h-2.5" />}
                      </span>
                      <span className="line-clamp-2">{env}</span>
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={inputState.lingkungan}
                onChange={(e) => setInputState({ ...inputState, lingkungan: e.target.value })}
                placeholder="Atau ketik sendiri lingkungan spesifik murid..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>

            {/* 8 Kotak Dimensi Profil Lulusan (DPL) BSKAP */}
            <div className="pt-3 border-t border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-emerald-600" />
                  Identifikasi Dimensi Profil Lulusan (DPL) BSKAP:
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                  {inputState.selectedDpl.length} DPL Terpilih
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DPL_LIST.map((dpl) => {
                  const isSelected = inputState.selectedDpl.includes(dpl.id);
                  return (
                    <div
                      key={dpl.id}
                      onClick={() => toggleDpl(dpl.id)}
                      className={`cursor-pointer p-2.5 rounded-xl border transition-all select-none relative flex flex-col justify-between min-h-[80px] ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-black text-slate-900 tracking-wide">
                          {dpl.code}
                        </span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <p className={`text-[10px] sm:text-[11px] font-semibold leading-tight ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                          {dpl.nama}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep('diferensiasi')}
                className="text-xs font-medium px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                ← Kembali ke Diferensiasi
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('kop_ttd')}
                className="text-xs font-semibold px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Lanjut ke Kop & TTD →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: KOP SEKOLAH & TTD LENGKAP NIP */}
        {activeStep === 'kop_ttd' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Kop Sekolah & Pengesahan (TTD & NIP)
              </h3>
              <p className="text-xs text-slate-500">
                Format surat resmi dinas untuk pencetakan dokumen, supervisi, dan akreditasi.
              </p>
            </div>

            {/* Toggle Tampilkan Kop */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Tampilkan Kop Surat Resmi</span>
                <span className="text-[11px] text-slate-500">Sertakan kop instansi pada halaman pertama berkas RPP</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputState.tampilkanKop}
                  onChange={(e) => setInputState({ ...inputState, tampilkanKop: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {inputState.tampilkanKop && (
              <div className="space-y-4 p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                {/* Upload Logos: Kiri & Kanan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-emerald-200/60">
                  {/* LOGO KIRI */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-blue-600" />
                        Logo Kiri (Sekolah / Lembaga)
                      </span>
                      {inputState.logoKiri && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Kustom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 shrink-0 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden">
                        <img
                          src={inputState.logoKiri || DEFAULT_LOGO_SEKOLAH}
                          alt="Logo Kiri"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          ref={logoKiriFileRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={(e) => handleLogoUpload(e, 'kiri')}
                        />
                        <button
                          type="button"
                          onClick={() => logoKiriFileRef.current?.click()}
                          className="w-full text-xs font-semibold px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          Unggah Logo Kiri
                        </button>
                        {inputState.logoKiri && (
                          <button
                            type="button"
                            onClick={() => handleResetLogo('kiri')}
                            className="w-full text-[11px] text-slate-500 hover:text-rose-600 flex items-center justify-center gap-1 transition"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Reset Standar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* LOGO KANAN */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-emerald-600" />
                        Logo Kanan (Pemda / Yayasan)
                      </span>
                      {inputState.logoKanan && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Kustom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 shrink-0 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden">
                        <img
                          src={inputState.logoKanan || DEFAULT_LOGO_PEMDA}
                          alt="Logo Kanan"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          ref={logoKananFileRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={(e) => handleLogoUpload(e, 'kanan')}
                        />
                        <button
                          type="button"
                          onClick={() => logoKananFileRef.current?.click()}
                          className="w-full text-xs font-semibold px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          Unggah Logo Kanan
                        </button>
                        {inputState.logoKanan && (
                          <button
                            type="button"
                            onClick={() => handleResetLogo('kanan')}
                            className="w-full text-[11px] text-slate-500 hover:text-rose-600 flex items-center justify-center gap-1 transition"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Reset Standar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Dinas / Yayasan Pembina
                  </label>
                  <input
                    type="text"
                    value={inputState.namaDinas}
                    onChange={(e) => setInputState({ ...inputState, namaDinas: e.target.value })}
                    placeholder="Contoh: PEMERINTAH PROVINSI JAWA TENGAH / DINAS PENDIDIKAN DAN KEBUDAYAAN"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Satuan Pendidikan / Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={inputState.satuanPendidikan}
                    onChange={(e) => setInputState({ ...inputState, satuanPendidikan: e.target.value })}
                    placeholder="Contoh: SMAN 1 PESISIR BAHARI"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Lengkap Sekolah
                    </label>
                    <input
                      type="text"
                      value={inputState.alamatSekolah}
                      onChange={(e) => setInputState({ ...inputState, alamatSekolah: e.target.value })}
                      placeholder="Contoh: Jl. Samudera Raya No. 12, Pesisir Utara"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kontak / Telepon / Laman / Pos-el
                    </label>
                    <input
                      type="text"
                      value={inputState.kontakSekolah}
                      onChange={(e) => setInputState({ ...inputState, kontakSekolah: e.target.value })}
                      placeholder="Contoh: Telp: (024) 8765432 • Web: sman1.sch.id"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bagian Lembar Tanda Tangan & Pengesahan */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                Lembar Tanda Tangan & Pengesahan (Kepala Sekolah & Guru Lengkap NIP)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat (Kota) Penetapan
                  </label>
                  <input
                    type="text"
                    value={inputState.tempatPenetapan}
                    onChange={(e) => setInputState({ ...inputState, tempatPenetapan: e.target.value })}
                    placeholder="Contoh: Semarang / Pesisir Bahari / Jakarta"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Penetapan RPP
                  </label>
                  <input
                    type="text"
                    value={inputState.tanggalPenetapan}
                    onChange={(e) => setInputState({ ...inputState, tanggalPenetapan: e.target.value })}
                    placeholder="Contoh: 15 Juli 2024"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Guru Pengampu & NIP */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Guru Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={inputState.namaGuru}
                    onChange={(e) => setInputState({ ...inputState, namaGuru: e.target.value })}
                    placeholder="Contoh: Rizqy Rahmat Hani, S.Pd."
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Guru Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={inputState.nipGuru}
                    onChange={(e) => setInputState({ ...inputState, nipGuru: e.target.value })}
                    placeholder="Contoh: 19890615 201503 1 002 atau -"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Kepala Sekolah & NIP */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={inputState.namaKepalaSekolah}
                    onChange={(e) => setInputState({ ...inputState, namaKepalaSekolah: e.target.value })}
                    placeholder="Contoh: Drs. H. Bambang Sudiro, M.Pd."
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={inputState.nipKepalaSekolah}
                    onChange={(e) => setInputState({ ...inputState, nipKepalaSekolah: e.target.value })}
                    placeholder="Contoh: 19720412 199802 1 004 atau -"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep('profil')}
                className="text-xs font-medium px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                ← Kembali ke Profil & DPL
              </button>
            </div>
          </div>
        )}

        {/* Submit Action Button */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Alur M3: <strong className="text-emerald-700">Memahami</strong> (Mindful) → <strong className="text-teal-700">Mengaplikasikan</strong> (Meaningful & Joyful) → <strong className="text-cyan-700">Merefleksikan</strong>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Merancang RPP Deep Learning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Susun RPP Deep Learning (M3)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
