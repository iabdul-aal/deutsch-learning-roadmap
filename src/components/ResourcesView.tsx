import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CONTENT_DB, rankContent, type ContentSource,
  type SkillType, type CEFRLevel, type ContentTier, type ContentLang,
  getYouTubeEmbedUrl, getYouTubeWatchUrl
} from '../data/contentRanking';
import {
  Volume2, Mic, BookOpen, PenLine, Brain, BookMarked,
  Play, ExternalLink, FileText, Zap, Star, Trophy,
  ChevronDown, ChevronUp, Globe, Filter, Award, Users
} from 'lucide-react';

// ── Skill display metadata ──────────────────────────────────────
const SKILLS: { id: SkillType; label: string; labelDE: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'HOEREN',    label: 'Listening',  labelDE: 'Hören',     icon: Volume2,   color: 'text-blue-500',   bg: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'SPRECHEN',  label: 'Speaking',   labelDE: 'Sprechen',  icon: Mic,       color: 'text-emerald-500',bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: 'LESEN',     label: 'Reading',    labelDE: 'Lesen',     icon: BookOpen,  color: 'text-violet-500', bg: 'bg-violet-500/10 border-violet-500/20' },
  { id: 'SCHREIBEN', label: 'Writing',    labelDE: 'Schreiben', icon: PenLine,   color: 'text-rose-500',   bg: 'bg-rose-500/10 border-rose-500/20' },
  { id: 'GRAMMATIK', label: 'Grammar',    labelDE: 'Grammatik', icon: Brain,     color: 'text-amber-500',  bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'VOCAB',     label: 'Vocabulary', labelDE: 'Wortschatz',icon: BookMarked,color: 'text-teal-500',   bg: 'bg-teal-500/10 border-teal-500/20' },
];

const TIER_CONFIG: Record<ContentTier, { label: string; color: string; icon: React.ElementType }> = {
  PRIMARY:       { label: '#1 Primary',     color: 'text-amber-600 bg-amber-50 border-amber-200',   icon: Trophy },
  SECONDARY:     { label: '#2 Secondary',   color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Star   },
  SUPPLEMENTARY: { label: 'Bonus',          color: 'text-stone-500 bg-stone-50 border-stone-200',    icon: Zap    },
};

const LANG_FLAGS: Record<ContentLang, string> = {
  AR: ' AR', EN: ' EN', DE: ' DE', BILINGUAL: ' Bilingual'
};

// ── Helpers ─────────────────────────────────────────────────────
function formatViews(n?: number): string {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

function getRankColor(score: number): string {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-amber-600';
  return 'text-stone-500';
}

function getEmbedUrl(source: ContentSource): string | null {
  if (source.type === 'VIDEO') {
    return getYouTubeEmbedUrl(source.resourceId);
  }
  return null;
}

function getExternalUrl(source: ContentSource): string {
  if (source.type === 'VIDEO') {
    return getYouTubeWatchUrl(source.resourceId);
  }
  return source.resourceId; // PDF / interactive URL
}

// ── Resource Card ────────────────────────────────────────────────
const ResourceCard: React.FC<{
  source: ContentSource;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ source, rank, isExpanded, onToggle }) => {
  const scored = { ...source, rankScore: rankContent(source, 'arabic') };
  const tier = TIER_CONFIG[source.tier];
  const TierIcon = tier.icon;
  const embedUrl = getEmbedUrl(source);
  const extUrl = getExternalUrl(source);

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${
      rank === 0 
        ? 'border-amber-300 shadow-md shadow-amber-100/50' 
        : 'border-stone-200 hover:border-stone-300'
    } bg-white`}>
      {/* Card Header */}
      <div
        className="p-3 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          {/* Rank badge */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-sm ${
            rank === 0 ? 'bg-amber-500 text-white' :
            rank === 1 ? 'bg-indigo-100 text-indigo-700' :
            'bg-stone-100 text-stone-500'
          }`}>
            {rank + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-stone-900 leading-snug truncate pr-2">
                  {source.title}
                </p>
                {source.titleAR && (
                  <p className="text-[11px] text-stone-500 mt-0.5 truncate" dir="rtl">{source.titleAR}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={extUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-[11px] font-bold transition-all shadow-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{source.type === 'VIDEO' ? 'Watch' : 'Open'}</span>
                </a>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-100 ${getRankColor(scored.rankScore ?? 0)}`}>
                   {scored.rankScore}
                </span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tier.color}`}>
                <TierIcon className="w-2.5 h-2.5 inline mr-0.5" />{tier.label}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">{source.channelOrAuthor}</span>
              <span className="text-[10px] text-stone-400">{LANG_FLAGS[source.language]}</span>
              {source.viewsApprox ? (
                <span className="text-[10px] text-stone-400">{formatViews(source.viewsApprox)}</span>
              ) : null}
              {source.durationMin ? (
                <span className="text-[10px] text-stone-400">{source.durationMin} min</span>
              ) : null}
              {/* Type badge */}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                source.type === 'VIDEO' ? 'bg-red-50 text-red-600' :
                source.type === 'PDF' ? 'bg-rose-50 text-rose-700' :
                'bg-teal-50 text-teal-700'
              }`}>
                {source.type === 'VIDEO' ? '▶ Video' : source.type === 'PDF' ? ' PDF' : ' Interactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded: Score breakdown + Embed/Link */}
      {isExpanded && (
        <div className="border-t border-stone-100">
          {/* Ranking Score Breakdown */}
          <div className="px-3 py-2.5 bg-stone-50/80 space-y-1.5">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Ranking Signals</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                { label: 'Views (40%)', val: source.viewsApprox
                    ? Math.min(100, (Math.log10(Math.max(source.viewsApprox, 1)) / 8) * 100)
                    : 30 },
                { label: 'Community (20%)', val: source.communityScore ?? 50 },
                { label: 'Content Match (20%)', val: source.contentMatchScore ?? 60 },
                { label: 'Pedagogy (20%)', val: source.pedagogyScore ?? 50 },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[9px] text-stone-500 w-28 shrink-0">{label}</span>
                  <div className="flex-1 bg-stone-200 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-amber-500 transition-all"
                      style={{ width: `${Math.round(val)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-stone-600 w-6">{Math.round(val)}</span>
                </div>
              ))}
            </div>
            {source.language === 'AR' && (
              <p className="text-[9px] text-emerald-600 font-bold mt-1">+10 Arabic instruction bonus applied</p>
            )}
          </div>

          {/* Embedded player or action */}
          <div className="p-3">
            {embedUrl && source.type === 'VIDEO' && (
              <div className="rounded-lg overflow-hidden bg-black aspect-video w-full mb-2">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  title={source.title}
                />
              </div>
            )}
            <a
              href={extUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-700 text-white text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {source.type === 'VIDEO' ? 'Watch Video on YouTube' :
               source.type === 'PDF' ? 'Download PDF' : 'Open Resource'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Skill Panel ──────────────────────────────────────────────────
const SkillPanel: React.FC<{
  skill: (typeof SKILLS)[0];
  level: CEFRLevel;
  filterLang: string;
}> = ({ skill, level, filterLang }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sources = useMemo(() => {
    const raw = CONTENT_DB
      .filter(s => {
        const levelMatch = s.level === level || s.level === 'ALL';
        const skillMatch = s.skills.includes(skill.id);
        const langMatch = filterLang === 'ALL' || s.language === filterLang;
        return levelMatch && skillMatch && langMatch;
      })
      .map(s => ({ ...s, rankScore: rankContent(s, 'arabic') }))
      .sort((a, b) => (b.rankScore ?? 0) - (a.rankScore ?? 0));

    // Deduplicate by resourceId to eliminate resource redundancy
    const seen = new Set<string>();
    const deduplicated: typeof raw = [];
    for (const item of raw) {
      if (!seen.has(item.resourceId)) {
        seen.add(item.resourceId);
        deduplicated.push(item);
      }
    }
    return deduplicated.slice(0, 5); // top 5 unique resources
  }, [skill.id, level, filterLang]);

  const SkillIcon = skill.icon;

  return (
    <div className={`rounded-xl border ${skill.bg} overflow-hidden`}>
      {/* Skill header */}
      <div className="px-4 py-3 flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
          <SkillIcon className={`w-4 h-4 ${skill.color}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-stone-900">{skill.label}</h3>
            <span className="text-[10px] font-bold text-stone-400 italic">{skill.labelDE}</span>
          </div>
          <p className="text-[10px] text-stone-500">
            {sources.length > 0
              ? `${sources.length} resources ranked · #1 pick: ${sources[0]?.channelOrAuthor}`
              : 'No resources for current filter'}
          </p>
        </div>
      </div>

      {/* Resource list */}
      <div className="px-3 pb-3 space-y-2">
        {sources.length === 0 && (
          <div className="text-center py-6 text-xs text-stone-400">
            No resources match this filter. Try switching language or level.
          </div>
        )}
        {sources.map((s, i) => (
          <ResourceCard
            key={s.id}
            source={s}
            rank={i}
            isExpanded={expandedId === s.id}
            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ── Main View ───────────────────────────────────────────────────
export const ResourcesView: React.FC = () => {
  const { currentTrackId } = useApp();

  // Derive CEFR level from track ID
  const level: CEFRLevel =
    currentTrackId === 'german-a2-ar' ? 'A2' :
    currentTrackId === 'german-b1-ar' ? 'B1' : 'A1';

  const [filterLang, setFilterLang] = useState<string>('ALL');
  const [activeSkills, setActiveSkills] = useState<Set<SkillType>>(
    new Set(['HOEREN', 'SPRECHEN', 'LESEN', 'SCHREIBEN'])
  );

  function toggleSkill(id: SkillType) {
    setActiveSkills(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev; // always keep at least 1
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Total content DB stats
  const totalVideos = CONTENT_DB.filter(c => c.type === 'VIDEO').length;
  const totalPDFs   = CONTENT_DB.filter(c => c.type === 'PDF').length;
  const totalTools  = CONTENT_DB.filter(c => c.type === 'INTERACTIVE').length;
  const channels    = new Set(CONTENT_DB.map(c => c.channelOrAuthor)).size;

  const LANG_OPTIONS = [
    { id: 'ALL', label: 'All Languages' },
    { id: 'AR',  label: ' Arabic' },
    { id: 'EN',  label: ' English' },
    { id: 'DE',  label: ' German' },
    { id: 'BILINGUAL', label: ' Bilingual' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Hero Header ── */}
      <div className="paper-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
              AI Content Engine · {level} Level
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight">
              Ranked Resource Library
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-lg">
              Every resource ranked by a 4-signal algorithm: views (40%) · community recommendations (20%) · content match (20%) · pedagogy quality (20%). Arabic-instruction bonus applied.
            </p>
          </div>
          {/* Stats strip */}
          <div className="flex gap-3 shrink-0">
            {[
              { icon: Play, val: totalVideos, label: 'Videos' },
              { icon: FileText, val: totalPDFs, label: 'PDFs' },
              { icon: Globe, val: totalTools, label: 'Tools' },
              { icon: Users, val: channels, label: 'Channels' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="text-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 min-w-[52px]">
                <Icon className="w-3.5 h-3.5 text-amber-600 mx-auto mb-0.5" />
                <div className="text-sm font-black text-stone-900">{val}</div>
                <div className="text-[9px] text-stone-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm explanation */}
        <div className="bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-start gap-2.5">
            <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 space-y-1">
              <p className="font-bold text-stone-900">How the Ranking Works</p>
              <p>Each resource is scored 0-100. Verified channels include: <strong>Deutsch mit Hend</strong> (primary Arabic channel), <strong>Shehata Deutsch</strong> (certified Goethe examiner), <strong>DW Nicos Weg</strong> (18M+ views), <strong>Easy German</strong>, <strong>Taleek</strong>, <strong>lingoni GERMAN</strong>, <strong>Learn German with Anja</strong>, and <strong>Goethe Institut</strong> official PDFs. Community data sourced from Reddit r/German, r/languagelearning, and Medium articles.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Language filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterLang(opt.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition-all border ${
                filterLang === opt.id
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Skill toggles */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none sm:ml-auto">
          {SKILLS.map(s => {
            const SkillIcon = s.icon;
            const active = activeSkills.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSkill(s.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition-all border ${
                  active
                    ? `${s.bg} ${s.color} border-current/30`
                    : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                <SkillIcon className="w-3 h-3" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Skill Panels Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {SKILLS.filter(s => activeSkills.has(s.id)).map(skill => (
          <SkillPanel
            key={skill.id}
            skill={skill}
            level={level}
            filterLang={filterLang}
          />
        ))}
      </div>

      {/* ── Official Exam Resources Strip ── */}
      <div className="paper-card p-4 space-y-3">
        <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-600" />
          Official Exam Resources - Goethe-Zertifikat {level}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONTENT_DB
            .filter(c => (c.level === level || c.level === 'ALL') && c.channelOrAuthor === 'Goethe Institut')
            .map(c => (
              <a
                key={c.id}
                href={c.resourceId}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 bg-white transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-stone-900 leading-snug truncate">{c.title}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{c.type} · Official Goethe Institut</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-500 shrink-0 ml-auto transition-colors" />
              </a>
            ))
          }
        </div>
      </div>

    </div>
  );
};
