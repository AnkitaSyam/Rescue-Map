import React from 'react';
import { Shield, MapPin, Heart, ArrowRight, Zap, Target, BarChart3, Navigation, Zap as Lightning, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = ({ onStart, onDash }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex-1 flex items-center justify-center px-4 py-20 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="badge-primary">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="text-label text-gray-600">Live Resilience Network</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[1.1] uppercase italic text-gray-900">
              Saving Lives <br />
              <span className="gradient-text">Through Data</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            RescueMap coordinates victims, volunteers, and emergency teams in a unified real-time ecosystem. Fast, intelligent, and mission-critical.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-glow-red-lg active:scale-95"
            >
              <span className="flex items-center gap-3">
                I Need Help Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={onDash}
              className="btn-secondary"
            >
              Live Dashboard
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase mb-4 text-gray-900">
              Why Choose RescueMap?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cutting-edge technology meets human compassion in emergency response.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Navigation, 
                title: 'GPS Reporting', 
                desc: 'One-tap emergency signal with high-precision geolocation and triage.',
                color: 'rose'
              },
              { 
                icon: BarChart3, 
                title: 'AI Triage', 
                desc: 'Proprietary engine calculates victim urgency based on depth of crisis.',
                color: 'amber'
              },
              { 
                icon: Users, 
                title: 'Citizen Network', 
                desc: 'Instantly notify nearby certified volunteers to provide immediate aid.',
                color: 'emerald'
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group card-base min-h-[280px] flex flex-col gap-6 rounded-[2rem] relative overflow-hidden"
              >
                {/* Background shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-red-50 to-transparent transition-opacity duration-500" />
                
                <div className={`icon-bg-${feat.color}`}>
                  <feat.icon className={`w-5 h-5 text-${feat.color}-600`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-display font-black uppercase italic leading-none mb-3 text-gray-900">
                    {feat.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className={`h-1 bg-gradient-to-r from-${feat.color}-600 to-transparent`} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: '2.4K', label: 'Lives Saved' },
              { number: '1.8K', label: 'Volunteers Active' },
              { number: '94%', label: 'Success Rate' },
              { number: '3.2min', label: 'Avg Response' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="card-base text-center p-6 rounded-2xl group"
              >
                <div className="text-3xl md:text-4xl font-display font-black text-red-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
