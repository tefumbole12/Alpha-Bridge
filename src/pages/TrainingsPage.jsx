import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ChevronDown, ChevronUp,
  Network, Sliders, Monitor, ArrowRight 
} from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

function TrainingsPage() {
  const [expandedModule, setExpandedModule] = useState(null);
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: "IT & NETWORKING",
      icon: <Network className="w-8 h-8 text-[#D4AF37]" />,
      items: [
        "Enterprise Network Design (Cisco / MikroTik / UniFi)",
        "Structured Cabling & Fiber Optics",
        "Wi-Fi Deployment & Optimization",
        "VoIP & Unified Communications",
        "Systems Administration Basics",
      ]
    },
    {
      id: 2,
      title: "AUDIO ENGINEERING",
      icon: <Sliders className="w-8 h-8 text-[#D4AF37]" />,
      items: [
        "Digital Mixers & Signal Flow",
        "FOH & Monitor Setup",
        "Sound Tuning & System Optimization",
        "Recording & Streaming",
      ]
    },
    {
      id: 3,
      title: "SCREENS & LIGHTING",
      icon: <Monitor className="w-8 h-8 text-[#D4AF37]" />,
      items: [
        "LED Screen Installation",
        "Video Routing & Controllers",
        "Stage Lighting Systems",
        "Live Event Production Workflow",
      ]
    }
  ];

  const toggleModule = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  const handleRegister = (moduleName, e) => {
    e.stopPropagation(); // Prevent accordion toggle if clicking button
    navigate(`/registration?module=${encodeURIComponent(moduleName)}`);
  };

  return (
    <>
      <Helmet>
        <title>Professional IT Trainings | Alpha Bridge Technologies Ltd</title>
        <meta
          name="description"
          content="Advanced technical training in IT & Networking, Audio Engineering, and Screens & Lighting. Hands-on learning in Kigali."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#003D82] pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center"
          >
             <h1 className="sr-only">Professional IT Trainings</h1>
             <img 
               src="https://horizons-cdn.hostinger.com/81ef3422-3855-479e-bfe8-28a4ceb0df39/4009e9f1072969e6ec794950d47f01a8.png"
               alt="Alpha Bridge Technologies Training Flyer"
               className="w-full max-w-4xl h-auto rounded-xl shadow-2xl border border-gray-700"
             />
             
             <div className="mt-8 text-center flex gap-4">
                <Button 
                  className="bg-[#D4AF37] hover:bg-[#C19B2A] text-white px-8 py-6 text-xl font-bold shadow-lg hover:scale-105 transition-transform"
                  onClick={() => document.getElementById('curriculum').scrollIntoView({ behavior: 'smooth' })}
                >
                  View Curriculum
                </Button>
                <Link to="/registration">
                   <Button 
                    variant="outline"
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#003D82] px-8 py-6 text-xl font-bold shadow-lg hover:scale-105 transition-transform"
                  >
                    Register Now
                  </Button>
                </Link>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#003D82] mb-4">Training Modules</h2>
            <p className="text-xl text-gray-600">Select a category to view detailed curriculum</p>
          </div>

          <div className="space-y-4">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className="bg-[#003D82]/5 p-3 rounded-lg">
                      {module.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl md:text-2xl font-bold text-[#003D82]">{module.title}</h3>
                    </div>
                  </div>
                  {expandedModule === module.id ? (
                    <ChevronUp className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedModule === module.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 bg-gray-50/50"
                    >
                      <div className="px-6 md:px-8 py-6">
                        <ul className="grid grid-cols-1 gap-4">
                          {module.items.map((item, idx) => (
                            <li 
                              key={idx} 
                              className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-gray-700"
                            >
                              <div className="flex items-start mb-3 md:mb-0">
                                <span className="mr-3 mt-1 text-[#D4AF37] flex-shrink-0">
                                  <CheckCircle2 className="w-5 h-5" />
                                </span>
                                <span className="font-medium">{item}</span>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-[#003D82] hover:bg-[#002855] text-white shrink-0 ml-0 md:ml-4"
                                onClick={(e) => handleRegister(item, e)}
                              >
                                Register for this Module <ArrowRight className="w-3 h-3 ml-2" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200/50">
                           <WhatsAppButton text="Inquire via WhatsApp" variant="secondary" />
                           <Link to="/registration">
                              <Button className="bg-[#003D82] text-white hover:bg-[#002855]">General Registration</Button>
                           </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-[#003D82] relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Spaces are limited for our next cohort. Secure your spot today.
          </p>
          
          <div className="flex flex-col items-center space-y-6">
            <Link to="/registration">
              <Button 
                className="bg-[#D4AF37] text-white hover:bg-[#C19B2A] px-10 py-5 text-xl font-bold rounded-full animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] h-auto" 
              >
                Register Now
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-8 text-gray-400 text-sm">
              <a href="mailto:info@alpha-bridge.net" className="hover:text-[#D4AF37] transition-colors">
                info@alpha-bridge.net
              </a>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a href="tel:+250794006160" className="hover:text-[#D4AF37] transition-colors">
                +250 794 006 160
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TrainingsPage;