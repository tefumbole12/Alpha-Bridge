
import React from 'react';
import { Helmet } from 'react-helmet';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Laptop, Wifi, Camera, Mic, Lightbulb, Zap, FileAudio as AudioWaveform, Music, Cloud, Phone, Wrench, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

function ServicesPage() {
  const servicesData = [
    {
      id: 1,
      icon: <Laptop className="w-10 h-10" />,
      title: 'IT Consultancy',
      description: 'Strategic IT planning, digital transformation, and expert advisory for robust technology infrastructure.',
    },
    {
      id: 2,
      icon: <Wifi className="w-10 h-10" />,
      title: 'Enterprise Networks',
      description: 'Design, deployment, and management of secure and scalable networks for businesses of all sizes.',
    },
    {
      id: 3,
      icon: <Camera className="w-10 h-10" />,
      title: 'CCTV & Security Systems',
      description: 'Advanced surveillance, access control, and integrated security solutions to protect your assets.',
    },
    {
      id: 4,
      icon: <Mic className="w-10 h-10" />,
      title: 'Sound & Audio Engineering',
      description: 'Professional audio system design, installation, and live sound engineering for events and venues.',
    },
    {
      id: 5,
      icon: <Lightbulb className="w-10 h-10" />,
      title: 'Screens & Lighting',
      description: 'High-definition LED screens, projectors, and dynamic lighting solutions for immersive experiences.',
    },
    {
      id: 6,
      icon: <Wrench className="w-10 h-10" />,
      title: 'Repairs & Maintenance',
      description: 'Reliable troubleshooting, repair, and preventive maintenance for all your IT and AV equipment.',
    },
    {
      id: 7,
      icon: <GraduationCap className="w-10 h-10" />,
      title: 'IT Trainings',
      description: 'Hands-on training and certification programs in networking, cybersecurity, and IT infrastructure.',
    },
    {
      id: 8,
      icon: <Zap className="w-10 h-10" />,
      title: 'Fiber Optic Services',
      description: 'High-speed fiber optic installation, splicing, and network optimization for superior connectivity.',
    },
    {
      id: 9,
      icon: <AudioWaveform className="w-10 h-10" />,
      title: 'Live Audio Engineering',
      description: 'Expert live sound mixing, system tuning, and technical support for concerts, conferences, and events.',
    },
    {
      id: 10,
      icon: <Music className="w-10 h-10" />,
      title: 'Musical Equipment Rentals',
      description: 'Top-tier rental of digital mixers, PA systems, microphones, and stage equipment for any event.',
    },
    {
      id: 11,
      icon: <Cloud className="w-10 h-10" />,
      title: 'Cloud Computing',
      description: 'Scalable cloud infrastructure, migration, and management to enhance your business operations.',
    },
    {
      id: 12,
      icon: <Phone className="w-10 h-10" />,
      title: 'Intercom Solutions',
      description: 'Reliable communication systems for offices, events, and secure access control points.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Our Services | Alpha Bridge Technologies Ltd</title>
        <meta
          name="description"
          content="Comprehensive IT consultancy, networking, CCTV, audio engineering, fiber optics, and training services in Kigali, Rwanda. Professional technology solutions for businesses and events."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#003D82] via-[#0066CC] to-[#003D82] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Our <span className="text-[#D4AF37]">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-200"
          >
            Comprehensive technology solutions tailored to your needs
          </motion.p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#003D82]">Explore Our Expertise</h2>
            <p className="text-xl text-gray-600 mt-4">From IT infrastructure to immersive AV experiences, we've got you covered.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col"
              >
                <div className="text-[#D4AF37] mb-4 flex-shrink-0">{service.icon}</div>
                <h3 className="text-2xl font-bold text-[#003D82] mb-3">{service.title}</h3>
                <p className="text-gray-700 text-sm flex-grow mb-4">{service.description}</p>
                <WhatsAppButton text="Get a Quote" className="bg-[#003D82] hover:bg-[#002855] text-white px-6 py-3 self-start" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#003D82] to-[#0066CC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Contact us today to discuss your project requirements and receive a customized quote.
          </p>
          <div className="flex justify-center">
            <WhatsAppButton className="px-8 py-6 text-lg rounded-lg shadow-xl hover:shadow-2xl" />
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
