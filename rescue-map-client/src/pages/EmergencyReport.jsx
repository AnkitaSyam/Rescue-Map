import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, Send, CheckCircle2, Camera, Mic, MapPin, Loader, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const EmergencyReport = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [severity, setSeverity] = useState('Safe');
  const [peopleCount, setPeopleCount] = useState(1);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const severityLevels = [
    { id: 'Safe', label: 'Safe', color: 'bg-emerald-600', border: 'border-emerald-600', bg: 'bg-emerald-100', text: 'text-emerald-700', desc: 'Situation is under control, just reporting status' },
    { id: 'Injured', label: 'Injured', color: 'bg-amber-600', border: 'border-amber-600', bg: 'bg-amber-100', text: 'text-amber-700', desc: 'Minor injuries, needs medical assistance' },
    { id: 'Trapped', label: 'Trapped', color: 'bg-orange-600', border: 'border-orange-600', bg: 'bg-orange-100', text: 'text-orange-700', desc: 'Stuck or blocked by obstacles' },
    { id: 'Critical', label: 'Critical', color: 'bg-red-600', border: 'border-red-600', bg: 'bg-red-100', text: 'text-red-700', desc: 'Life-threatening emergency' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalLocation = location || { lat: 40.7128 + Math.random()*0.1, lng: -74.006 + Math.random()*0.1 };
      
      await axios.post(`${API_BASE_URL}/api/victims`, {
        name: name || 'Anonymous Victim',
        phone: phone || 'N/A',
        severity,
        peopleCount,
        description,
        location: finalLocation,
        timestamp: new Date()
      });
      
      setSubmitted(true);
      setTimeout(() => onComplete(), 3000);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-32 text-center px-4">
        <motion.div 
          initial={{ scale: 0, rotate: -45 }} 
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full"
          />
          <div className="bg-emerald-100 p-8 rounded-[2.5rem] border border-emerald-300 relative z-10">
            <CheckCircle2 className="w-24 h-24 text-emerald-600 fill-emerald-200 mx-auto" />
          </div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-display font-black mb-6 tracking-tight uppercase text-gray-900"
        >
          SOS Signal Sent
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-8"
        >
          Rescue coordinators have been notified. We have your exact location. 
          Keep your phone charged and stay in a safe spot.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-block px-6 py-3 bg-red-100 border border-red-400 rounded-xl"
        >
          <span className="text-red-600 font-black uppercase tracking-widest text-sm italic">Help is on the way</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/50 flex-shrink-0">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase text-gray-900">
              Distress Report
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
              Step {step} of 2 • Priority Classification
            </p>
          </div>
        </div>

        <div>
          {step === 1 ? (
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-black uppercase tracking-wide text-gray-900">
                  Classify Your Emergency Level
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {severityLevels.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setSeverity(lvl.id)}
                      className={`p-6 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-300 group ${
                        severity === lvl.id 
                          ? `${lvl.border} ${lvl.bg} ring-2 ring-offset-2 ring-offset-white ${lvl.border}` 
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                      }`}
                    >
                      <div className="flex gap-5 items-center flex-1">
                        <div className={`w-3 h-12 rounded-full transition-all ${lvl.color} ${severity === lvl.id ? 'shadow-lg' : ''}`} />
                        <div>
                          <h3 className={`font-display font-black text-lg leading-none mb-2 transition-colors ${severity === lvl.id ? lvl.text : 'text-gray-900'}`}>
                            {lvl.label}
                          </h3>
                          <p className="text-gray-600 text-sm font-medium">{lvl.desc}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${severity === lvl.id ? `${lvl.border} ${lvl.bg}` : 'border-gray-300'}`}>
                        {severity === lvl.id && <div className={`w-3 h-3 rounded-full ${lvl.color}`} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-glow-red-lg uppercase tracking-widest text-lg"
              >
                Continue to Details
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* People Count */}
              <div className="card-base rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="icon-bg-rose">
                      <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-display font-black text-lg uppercase tracking-tight text-gray-900">Total Persons</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-100 px-6 py-3 rounded-xl border border-gray-300">
                    <button 
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="text-2xl font-black text-red-600 hover:scale-125 transition-transform"
                    >
                      −
                    </button>
                    <span className="text-2xl font-display font-black min-w-[2rem] text-center text-gray-900">{peopleCount}</span>
                    <button 
                      onClick={() => setPeopleCount(peopleCount + 1)}
                      className="text-2xl font-black text-red-600 hover:scale-125 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card-base rounded-2xl p-8 space-y-6">
                <h3 className="text-label-rose">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-label text-gray-600">Full Name <span className="text-red-600">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="input-base" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label text-gray-600">Phone Number <span className="text-red-600">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone"
                      className="input-base" 
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card-base rounded-2xl p-8 space-y-4">
                <label className="text-label-rose flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Situation Details <span className="text-red-600 font-bold ml-1">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your situation: water rising? Trapped? Medical needs?"
                  className="input-base h-32 resize-none placeholder:text-gray-400"
                />
              </div>

              {/* GPS Status */}
              <div className="card-base rounded-2xl p-6 flex items-center gap-4 border border-emerald-300 bg-emerald-50">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/30 blur-lg rounded-full" />
                    <MapPin className="w-5 h-5 text-emerald-600 relative z-10" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 leading-none mb-1 block">
                    GPS Location
                  </span>
                  <span className="text-sm font-bold text-emerald-700 truncate">
                    {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Scanning for signal...'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  ← Back
                </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-400 disabled:to-gray-400 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-glow-red-lg uppercase tracking-widest text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-white" />
                      Submit
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyReport;
