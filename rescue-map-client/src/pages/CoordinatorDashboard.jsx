import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Filter, Users, Clock, AlertTriangle, CheckCircle2, ChevronRight, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CoordinatorDashboard = () => {
  const [victims, setVictims] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/victims');
      setVictims(res.data);
    } catch (err) {
      console.error('Failed to fetch victims:', err);
      setVictims([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/victims/${id}`, { status });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVictims = victims.filter(v => {
    const matchesFilter = filter === 'All' || v.severity === filter;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'Critical': return 'text-red-600';
      case 'Trapped': return 'text-orange-500';
      case 'Injured': return 'text-yellow-500';
      default: return 'text-emerald-500';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar - Priority List */}
      <div className="w-full lg:w-[400px] flex flex-col gap-5 overflow-hidden">
        <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl tracking-tighter italic text-gray-900">RESCUE FEED</h2>
            <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full animate-pulse">
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
               <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-400 text-gray-900"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All', 'Critical', 'Trapped', 'Injured', 'Safe'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === cat 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {filteredVictims.map((victim) => (
            <motion.div 
              key={victim._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                setSelectedVictim(victim);
                map.current.flyTo({ center: [victim.location.lng, victim.location.lat], zoom: 16, pitch: 60 });
              }}
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group ${
                selectedVictim?._id === victim._id 
                  ? 'bg-red-100 border-red-300 shadow-xl' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedVictim?._id === victim._id && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
              )}
              
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full uppercase ${
                   victim.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                   victim.severity === 'Trapped' ? 'bg-amber-100 text-amber-600' :
                   victim.severity === 'Injured' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {victim.severity}
                </span>
                <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1.5 uppercase tracking-widest">
                  <Clock className="w-3 h-3 text-red-600" /> {new Date(victim.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h3 className="font-display font-black text-xl mb-1 group-hover:text-red-600 transition-colors uppercase tracking-tight italic text-gray-900">{victim.name}</h3>
              <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-4">{victim.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-200 rounded-lg text-[10px] font-black text-gray-700 tracking-widest uppercase">
                    <Users className="w-3.5 h-3.5 text-red-600" /> {victim.peopleCount}
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${
                    victim.status === 'Pending' ? 'bg-red-100 text-red-600' :
                    victim.status === 'Dispatched' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {victim.status}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                  <ChevronRight className={`w-4 h-4 ${selectedVictim?._id === victim._id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </motion.div>
          ))}
          {filteredVictims.length === 0 && (
            <div className="py-20 text-center text-gray-600">No active reports found</div>
          )}
        </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 rounded-[3rem] overflow-hidden border border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl relative">
        {/* Map Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative overflow-hidden">
            {/* Static Map Background */}
            <svg className="w-full h-full" viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
              {/* Map background */}
              <defs>
                <pattern id="water" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0,50 Q25,40 50,50 T100,50" stroke="#e0f2fe" strokeWidth="2" fill="none" opacity="0.3"/>
                </pattern>
              </defs>
              
              {/* City grid */}
              <rect width="1000" height="800" fill="#f8fafc"/>
              <g stroke="#e2e8f0" strokeWidth="1">
                <line x1="0" y1="0" x2="1000" y2="0" />
                <line x1="0" y1="200" x2="1000" y2="200" />
                <line x1="0" y1="400" x2="1000" y2="400" />
                <line x1="0" y1="600" x2="1000" y2="600" />
                <line x1="0" y1="800" x2="1000" y2="800" />
                <line x1="0" y1="0" x2="0" y2="800" />
                <line x1="250" y1="0" x2="250" y2="800" />
                <line x1="500" y1="0" x2="500" y2="800" />
                <line x1="750" y1="0" x2="750" y2="800" />
                <line x1="1000" y1="0" x2="1000" y2="800" />
              </g>
              
              {/* Water features */}
              <circle cx="100" cy="700" r="60" fill="#bfdbfe" opacity="0.4"/>
              <circle cx="900" cy="150" r="80" fill="#bfdbfe" opacity="0.3"/>
              
              {/* Roads */}
              <path d="M0,350 Q250,300 500,350 T1000,350" stroke="#fbbf24" strokeWidth="8" fill="none" opacity="0.6"/>
              <path d="M400,100 L400,800" stroke="#fbbf24" strokeWidth="6" fill="none" opacity="0.5"/>
              
              {/* Buildings */}
              <rect x="150" y="100" width="60" height="80" fill="#cbd5e1" opacity="0.7"/>
              <rect x="250" y="150" width="70" height="100" fill="#cbd5e1" opacity="0.6"/>
              <rect x="150" y="250" width="80" height="90" fill="#cbd5e1" opacity="0.7"/>
              <rect x="700" y="250" width="90" height="110" fill="#cbd5e1" opacity="0.6"/>
              <rect x="750" y="450" width="75" height="95" fill="#cbd5e1" opacity="0.7"/>
            </svg>
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm">
              <div className="text-center space-y-3">
                <MapPin className="w-20 h-20 text-red-400 mx-auto opacity-40" />
                <h3 className="text-2xl font-display font-black text-gray-600">Live Rescue Map</h3>
                <p className="text-gray-500 text-sm">Connected to backend • Real-time updates</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Overlay */}
        <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-lg">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="font-bold text-gray-900">Critical: {victims.filter(v => v.severity === 'Critical').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span className="font-bold text-gray-900">Trapped: {victims.filter(v => v.severity === 'Trapped').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              <span className="font-bold text-gray-900">Safe: {victims.filter(v => v.severity === 'Safe').length}</span>
            </div>
          </div>
        </div>

        {/* Selected Victim Details Panel */}
        <AnimatePresence>
          {selectedVictim && (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-6 right-6 bottom-6 w-[400px] bg-white border border-gray-300 rounded-[2.5rem] shadow-2xl shadow-gray-300/30 z-20 flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2 block italic">Emergency Dossier</span>
                    <h2 className="text-3xl font-display font-black tracking-tight uppercase leading-none italic text-gray-900">{selectedVictim.name}</h2>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-2">{selectedVictim._id.toUpperCase()}</p>
                 </div>
                 <button onClick={() => setSelectedVictim(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                    <X className="w-5 h-5 text-gray-600" />
                 </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-5 rounded-2xl border border-gray-300">
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">Severity Index</p>
                    <p className={`font-display font-black text-xl uppercase italic ${
                       selectedVictim.severity === 'Critical' ? 'text-red-600' :
                       selectedVictim.severity === 'Trapped' ? 'text-amber-600' : 'text-blue-600'
                    }`}>{selectedVictim.severity}</p>
                  </div>
                  <div className="bg-gray-100 p-5 rounded-2xl border border-gray-300">
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">Soul Count</p>
                    <p className="text-gray-900 font-display font-black text-xl uppercase italic">{selectedVictim.peopleCount} TOTAL</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Situational Intelligence</h4>
                  <div className="text-sm leading-relaxed bg-gray-100 p-6 rounded-[1.5rem] border border-gray-300 text-gray-700 font-medium italic">
                    "{selectedVictim.description}"
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Command Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pending', 'Dispatched', 'Rescued', 'Closed'].map(status => (
                      <button 
                        key={status}
                        onClick={() => updateStatus(selectedVictim._id, status)}
                        className={`py-4 px-4 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all flex flex-col items-center gap-1 ${
                          selectedVictim.status === status 
                          ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-600/30' 
                          : 'bg-gray-200 border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {status}
                        {selectedVictim.status === status && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-5 bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all uppercase tracking-[0.2em] text-sm shadow-2xl">
                    <Navigation className="w-5 h-5 fill-white" />
                    APPROVE EXTRACTION
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
