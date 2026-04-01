import React, { useState, useEffect } from 'react';
import { Users, Shield, MapPin, CheckCircle, Bell, ArrowRight, Heart, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const VolunteerPortal = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [nearbyAlerts, setNearbyAlerts] = useState([]);
  const [stats, setStats] = useState({ helps: 3, hours: 12, points: 450 });

  useEffect(() => {
    if (isRegistered) {
      fetchAlerts();
    }
  }, [isRegistered]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('/api/victims');
      setNearbyAlerts(res.data.filter(v => v.status === 'Pending'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  const handleHelp = async (id) => {
    try {
      await axios.patch(`/api/victims/${id}`, { status: 'Dispatched' });
      setNearbyAlerts(prev => prev.filter(a => a._id !== id));
      setStats(prev => ({ ...prev, helps: prev.helps + 1, points: prev.points + 50 }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 relative"
          >
            {/* Animated background blob */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-200/20 rounded-full blur-3xl -z-10" 
            />
            
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-block p-6 bg-red-100 border border-red-200 rounded-3xl mb-8"
            >
              <Heart className="w-16 h-16 text-red-600 fill-red-200" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-display font-black mb-6 tracking-tight uppercase italic text-gray-900">
              Reserve Force
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Join the elite network of local responders. Provide critical, immediate assistance 
              in your sector while professional extraction teams are en route.
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleRegister} 
            className="card-base p-10 md:p-12 rounded-3xl space-y-10 shadow-2xl shadow-red-600/20"
          >
            {/* Personal Info */}
            <div className="space-y-6">
              <h2 className="text-label-rose flex items-center gap-2">
                <Users className="w-4 h-4" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-label text-gray-600">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Sarah Connor" 
                    className="input-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-label text-gray-600">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+1 (555) 123-4567" 
                    className="input-base"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <h2 className="text-label-rose flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Specialized Skills
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['First Aid', 'Swimming', 'Climbing', 'Medical', 'Boat Owner', 'Heavy Driving'].map(skill => (
                  <motion.label 
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 p-5 card-interactive rounded-2xl cursor-pointer group"
                  >
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-red-600 cursor-pointer" 
                    />
                    <span className="text-sm font-black uppercase tracking-tight group-hover:text-red-600 transition-colors">
                      {skill}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-glow-red-lg flex items-center justify-center gap-4 uppercase tracking-widest text-lg"
            >
              Join the Network
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-600 to-red-700 opacity-100" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full"
            />
            
            <div className="relative z-10 p-10 text-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-black tracking-tighter uppercase">Status</h2>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex justify-between items-end border-b border-white/20 pb-5 group cursor-default"
                >
                  <span className="text-[10px] font-black text-red-100 uppercase tracking-widest leading-none">Rescues</span>
                  <span className="text-5xl font-display font-black italic leading-none group-hover:scale-110 transition-transform origin-bottom-right">
                    {stats.helps}
                  </span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex justify-between items-end border-b border-white/20 pb-5 group cursor-default"
                >
                  <span className="text-[10px] font-black text-red-100 uppercase tracking-widest leading-none">Efficiency</span>
                  <span className="text-5xl font-display font-black italic leading-none group-hover:scale-110 transition-transform origin-bottom-right">
                    94%
                  </span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex justify-between items-end group cursor-default"
                >
                  <span className="text-[10px] font-black text-red-100 uppercase tracking-widest leading-none">Reputation</span>
                  <span className="text-5xl font-display font-black italic leading-none tracking-tighter group-hover:scale-110 transition-transform origin-bottom-right">
                    {stats.points}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Merit Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-base p-8 rounded-2xl"
          >
            <h3 className="text-label-rose flex items-center gap-2 mb-6">
              <Award className="w-4 h-4" />
              Achievements
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {['🚑', '🦉', '🌊', '🧗'].map((emoji, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl filter hover:grayscale-0 grayscale transition-all cursor-pointer shadow-lg"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h2 className="text-4xl font-display font-black tracking-tight uppercase text-gray-900">
                Priority Alerts
              </h2>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-2">
                Real-time distress notifications
              </p>
            </div>
            
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="badge-primary flex items-center gap-2"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-red-600 rounded-full"
              />
              <span className="text-xs text-red-600 font-black uppercase tracking-widest">
                Scanning
              </span>
            </motion.div>
          </motion.div>

          {/* Alerts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {nearbyAlerts.map((alert, idx) => (
                <motion.div 
                  key={alert._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card-base relative p-6 rounded-2xl group"
                >
                  {/* Alert indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-600/20 border border-red-600/50"
                  />

                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <h3 className="text-xl font-display font-black tracking-tighter uppercase mb-2 text-gray-900">
                        {alert.name}
                      </h3>
                      <div className="flex items-center gap-2 text-red-600 text-sm font-bold">
                        <MapPin className="w-4 h-4" />
                        0.8 km away
                      </div>
                    </div>

                    {/* Severity badge */}
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        alert.severity === 'Critical' ? 'bg-red-600/30 text-red-600 border border-red-500/50' :
                        alert.severity === 'Trapped' ? 'bg-orange-600/30 text-orange-600 border border-orange-500/50' : 
                        'bg-blue-600/30 text-blue-600 border border-blue-500/50'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-gray-200 text-gray-700 border border-gray-300`}>
                        {alert.peopleCount} person{alert.peopleCount > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 font-medium italic leading-relaxed px-3 py-2 bg-gray-100 rounded-lg border border-gray-300">
                      "{alert.description}"
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleHelp(alert._id)}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black rounded-lg transition-all shadow-lg text-sm flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <CheckCircle className="w-4 h-4" />
                        En Route
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-3 bg-gray-200 text-gray-700 hover:text-gray-900 font-black rounded-lg transition-all text-sm uppercase tracking-widest border border-gray-300"
                      >
                        Call
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {nearbyAlerts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full py-24 text-center card-base rounded-2xl border-dashed border-gray-300"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-6"
                >
                  <Shield className="w-16 h-16 text-gray-300 mx-auto" />
                </motion.div>
                <p className="text-gray-900 font-black text-xl uppercase tracking-tighter">
                  All Clear
                </p>
                <p className="text-gray-600 text-sm font-medium mt-2">
                  No active alerts in your sector
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPortal;
