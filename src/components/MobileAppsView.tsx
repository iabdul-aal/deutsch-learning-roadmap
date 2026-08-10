import React from 'react';
import { MOBILE_APPS_DATA } from '../data/mobileApps';

export const MobileAppsView = () => {
  const appsList = MOBILE_APPS_DATA || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            PLAY STORE & APP STORE GUIDE
          </span>
          <h2 className="text-lg font-extrabold text-stone-900 mt-0.5">
            Essential Mobile Apps for Germany Survival
          </h2>
          <p className="text-xs text-stone-600">
            Recommended companion apps for SRS flashcards, Deutsche Bahn train bookings, emergency alerts, and native speaking.
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appsList.map((app) => (
          <div key={app.id} className="paper-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-stone-100 border border-stone-300 flex items-center justify-center text-amber-700 text-lg font-bold">
                  📱
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900">{app.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold">{app.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {app.storeUrlAndroid && (
                  <a
                    href={app.storeUrlAndroid}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded bg-stone-100 border border-stone-300 hover:bg-amber-500 hover:text-stone-950 text-amber-900 text-[10px] font-bold transition-all"
                  >
                    Android ↗
                  </a>
                )}
                {app.storeUrlIos && (
                  <a
                    href={app.storeUrlIos}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded bg-stone-100 border border-stone-300 hover:bg-amber-500 hover:text-stone-950 text-amber-900 text-[10px] font-bold transition-all"
                  >
                    iOS ↗
                  </a>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">{app.keyBenefit}</p>

            <div className="p-3 rounded bg-stone-50 border border-stone-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Note:  How to use in 8-Week Roadmap:</span>
              <p className="text-stone-700 text-[11px]">{app.workflowUsage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
