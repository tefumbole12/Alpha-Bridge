
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Ticket, Check, Share2, AlertCircle, Sparkles } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import { getEventStats } from '@/services/eventService';

function EventsPage() {
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [stats, setStats] = useState({ booked: 0, remaining: 150, total: 150 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const eventDate = "2026-04-05T11:00:00"; 

  // Countdown Logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(eventDate) - +new Date();
      let newTimeLeft = {};

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  // Fetch Stats Logic
  useEffect(() => {
    const fetchStats = async () => {
        try {
          const data = await getEventStats();
          if (data) {
            setStats(data);
          }
        } catch (error) {
          console.error("Failed to fetch stats", error);
        } finally {
          setLoadingStats(false);
        }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const launchEvent = {
    title: "ALPHA BRIDGE TECHNOLOGIES KIGALI - GRAND LAUNCHING",
    date: "April 5th 2026",
    time: "11:00 AM (Kigali Time)",
    location: "Greenland Executive Apartments, Apt 003, 20250 Kigali, Rwanda",
    description: "Join us for the official grand launching of Alpha Bridge Technologies Ltd in Kigali. Network with industry professionals, learn about our services, and celebrate our expansion into the region.",
  };

  // Color logic for progress bar
  let barColor = "bg-green-500";
  let textColor = "text-green-600";
  if (stats.remaining < 60) { barColor = "bg-yellow-500"; textColor = "text-yellow-600"; }
  if (stats.remaining < 30) { barColor = "bg-red-500"; textColor = "text-red-600"; }
  
  const percentageBooked = stats.total > 0 ? (stats.booked / stats.total) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>Events - Alpha Bridge Technologies Ltd</title>
        <meta name="description" content="Upcoming events at Alpha Bridge Technologies Ltd." />
      </Helmet>

      <EventRegistrationModal 
        isOpen={isLaunchModalOpen} 
        onClose={() => setIsLaunchModalOpen(false)} 
      />
      
      <div className="bg-white min-h-screen">
        
        {/* --- EVENT HERO & COUNTDOWN --- */}
        <section className="relative w-full overflow-hidden py-16 md:py-24 bg-[#0a0f1c]">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{
                backgroundImage: 'url(https://horizons-cdn.hostinger.com/81ef3422-3855-479e-bfe8-28a4ceb0df39/e6e37094926bef1038b30bd31899fd47.png)'
             }}></div>
             {/* Gradient Overlay for "Starry Night" feel */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#00102b]/90 via-[#001d3d]/80 to-[#003D82]/90"></div>
             {/* Decorative radial gradient */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15),transparent_70%)]"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center">
             
             {/* Badge */}
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8"
             >
                <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#002855] px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <Sparkles className="w-4 h-4" />
                  Official Countdown
                </div>
             </motion.div>

             {/* Title */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-center mb-10 max-w-4xl"
             >
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
                 Grand Launching <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F7E7CE]">Ceremony</span>
               </h1>
               <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                 Join us as we bridge technology and innovation in the heart of Kigali.
               </p>
             </motion.div>

             {/* Custom Countdown Timer */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 w-full max-w-3xl"
             >
                 {[
                   { label: 'Days', value: timeLeft.days },
                   { label: 'Hours', value: timeLeft.hours },
                   { label: 'Minutes', value: timeLeft.minutes },
                   { label: 'Seconds', value: timeLeft.seconds }
                 ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="bg-[#002855]/80 backdrop-blur-md border border-[#D4AF37]/30 w-full aspect-square rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                           {/* Shine effect */}
                           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span className="text-4xl md:text-6xl font-bold text-[#D4AF37] font-mono tracking-tighter drop-shadow-lg">
                             {String(item.value).padStart(2, '0')}
                           </span>
                        </div>
                        <span className="mt-3 text-gray-400 uppercase text-xs md:text-sm font-semibold tracking-widest">
                           {item.label}
                        </span>
                    </div>
                 ))}
             </motion.div>

             {/* CTA Button */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
             >
               <Button 
                onClick={() => setIsLaunchModalOpen(true)}
                className="bg-[#D4AF37] hover:bg-[#b5952f] text-[#002855] px-10 py-7 text-xl font-bold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform"
               >
                 <Ticket className="w-5 h-5 mr-2" />
                 Reserve Your Spot Now
               </Button>
             </motion.div>
          </div>
        </section>

        {/* --- LIVE STATS SECTION (Glassmorphism) --- */}
        <section className="relative z-30 -mt-20 px-4 mb-20">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50"
            >
                {loadingStats ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003D82] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading availability...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="text-center md:text-left">
                          <h3 className="text-2xl font-bold text-[#003D82] mb-2">Registration Status</h3>
                          <p className="text-gray-600 mb-4">Limited seats available. Secure your attendance before slots run out.</p>
                          
                          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                             <div className={`w-3 h-3 rounded-full ${stats.remaining > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                             <span className="text-sm font-medium text-gray-700">
                               {stats.remaining > 0 ? 'Registration Open' : 'Fully Booked'}
                             </span>
                          </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                          <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Available Slots</span>
                              <span className={`text-4xl font-extrabold ${textColor}`}>{stats.remaining}</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                              <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentageBooked}%` }}
                                  transition={{ duration: 1 }}
                                  className={`h-full ${barColor}`}
                              />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500 font-medium">
                              <span>{stats.booked} booked</span>
                              <span>{stats.total} total capacity</span>
                          </div>
                      </div>
                  </div>
                )}
            </motion.div>
        </section>

        {/* Event Details Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">Official Launch</span>
                  <Share2 className="w-5 h-5 text-gray-400 hover:text-[#003D82] cursor-pointer" />
                </div>
                <h2 className="text-3xl font-bold text-[#003D82] mb-6">{launchEvent.title}</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">{launchEvent.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {['Keynote Speeches', 'Product Demos', 'Networking Cocktail', 'Live Entertainment'].map((feat, i) => (
                         <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg text-gray-700">
                           <Check className="w-5 h-5 text-[#D4AF37] mr-3" /> <span>{feat}</span>
                         </div>
                     ))}
                </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-[#003D82] mb-6">Event Details</h3>
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div><p className="font-bold text-[#003D82]">{launchEvent.date}</p></div>
                  </div>
                  <div className="flex space-x-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div><p className="font-bold text-[#003D82]">{launchEvent.time}</p></div>
                  </div>
                  <div className="flex space-x-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-[#003D82]">{launchEvent.location}</p>
                      <a href="#" className="text-xs text-blue-500 flex items-center mt-1">View Map <ExternalLink className="w-3 h-3 ml-1"/></a>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button onClick={() => setIsLaunchModalOpen(true)} className="w-full bg-[#D4AF37] hover:bg-[#C19B2A] text-white py-6 font-bold shadow-lg">
                    <Ticket className="w-5 h-5 mr-2" /> Register Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <WhatsAppButton variant="floating" className="fixed bottom-6 right-6 z-50" />
    </>
  );
}

export default EventsPage;
