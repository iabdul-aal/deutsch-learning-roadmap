import React, { useState } from 'react';
import { RESOURCES_DATA } from '../data/tracks/german-a1-ar/resources';
import { ExternalLink, Search } from 'lucide-react';

export const ResourceDatabaseView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBadge, setFilterBadge] = useState('All');

  const resourcesList = RESOURCES_DATA?.resources || [];

  const filteredResources = resourcesList.filter((res) => {
    const matchesBadge = filterBadge === 'All' || res.priority === filterBadge;
    const matchesQuery = !searchQuery || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      res.creator.toLowerCase().includes(searchQuery.toLowerCase()) || 
      res.whySelected.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBadge && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            SEARCHABLE RESOURCE LIBRARY
          </span>
          <h2 className="text-lg font-extrabold text-stone-900 mt-0.5">
            Multi-Lingual German Learning Ecosystem
          </h2>
          <p className="text-xs text-stone-600">
            Curated across Arabic 🇪🇬, English 🇬🇧, and German 🇩🇪 learning communities.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-3 py-1.5 rounded bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-2 text-xs">
        {['All', 'CORE', 'HIGH VALUE', 'REFERENCE'].map((b) => (
          <button
            key={b}
            onClick={() => setFilterBadge(b)}
            className={`px-3 py-1 rounded border font-bold transition-all ${
              filterBadge === b
                ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Table View */}
      <div className="paper-card overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-600 font-extrabold border-b border-stone-200 uppercase text-[10px]">
            <tr>
              <th className="p-3 whitespace-nowrap min-w-[110px]">Priority</th>
              <th className="p-3 min-w-[200px]">Resource Title</th>
              <th className="p-3 min-w-[140px]">Creator / Source</th>
              <th className="p-3 min-w-[150px]">Ecosystem</th>
              <th className="p-3">Why Selected</th>
              <th className="p-3 text-right whitespace-nowrap min-w-[90px]">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 font-medium">
            {filteredResources.map((res) => (
              <tr key={res.id} className="hover:bg-stone-50/70">
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded border text-[10px] font-black uppercase whitespace-nowrap inline-block ${
                    res.priority === 'CORE' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                    res.priority === 'HIGH VALUE' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' :
                    'bg-stone-100 text-stone-700 border-stone-300'
                  }`}>
                    {res.priority}
                  </span>
                </td>
                <td className="p-3 font-bold text-stone-900 text-sm">{res.title}</td>
                <td className="p-3 text-stone-700">{res.creator}</td>
                <td className="p-3 font-mono text-[11px] text-stone-500">{res.sourceCommunity}</td>
                <td className="p-3 text-stone-600 leading-relaxed">{res.whySelected}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-stone-100 text-amber-900 border border-stone-300 hover:bg-amber-500 hover:text-stone-950 font-extrabold transition-all inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Visit</span> <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
