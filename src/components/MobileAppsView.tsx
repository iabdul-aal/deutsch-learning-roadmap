import React from 'react';
import { MOBILE_APPS_DATA } from '../data/mobileApps';
import { ExternalLink, Star, Wifi, WifiOff, Smartphone } from 'lucide-react';

export const MobileAppsView: React.FC = () => {
  // Fix: access the .apps array from the data object (was calling .map() on the object itself)
  const appsList = MOBILE_APPS_DATA.apps || [];

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="paper-card p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            Play Store & App Store Guide
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
          Essential Mobile Companion Apps
        </h2>
        <p className="text-xs text-stone-600 max-w-2xl">
          Curated apps for SRS flashcards, listening practice, pronunciation drills, and vocabulary — tested alongside the 8-Week curriculum.
        </p>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appsList.map((app) => (
          <div key={app.id} className="paper-card p-5 space-y-3 hover:border-amber-300 transition-colors">

            {/* App Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0">
                  📱
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-stone-900 truncate">{app.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">{app.category}</span>
                </div>
              </div>

              {/* Store Link */}
              {app.storeUrl && (
                <a
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 border border-stone-300 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500 text-stone-700 text-[10px] font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-mono font-bold text-stone-600">
                {app.platform}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800 flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {app.rating}
              </span>
              {app.freeTrial && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800">Free</span>
              )}
              {app.offline ? (
                <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-800 flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" /> Offline ✓
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-stone-50 border border-stone-200 text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" /> Online only
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-700 leading-relaxed">{app.description}</p>

            {/* Best For */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 space-y-1">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                Best For:
              </span>
              <p className="text-[11px] text-stone-700 font-medium">{app.bestFor}</p>
            </div>

            {/* Recommended Use */}
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider block">
                How to use in the 8-Week Roadmap:
              </span>
              <p className="text-[11px] text-stone-600">{app.recommendedUse}</p>
            </div>

            {/* Tags */}
            {app.tags && app.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {app.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-stone-100 text-[10px] text-stone-600 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
