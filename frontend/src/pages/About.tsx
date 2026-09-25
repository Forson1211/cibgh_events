import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, Award, Users, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { CIB_LOGO_URL } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Sleek Banner for About (Green to Yellow Gradient & Left-aligned) */}
      <section className="w-full bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] text-white py-10 sm:py-14 relative overflow-hidden shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-2 sm:space-y-3 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white/90">
            <ShieldCheck className="w-4 h-4" />
            <span>Chartered Mandate &bull; Act 991</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase leading-tight">
            About CIB Ghana
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-white/95 leading-relaxed font-medium">
            The Chartered Institute of Bankers, Ghana is the statutory professional regulatory body governing banking education, ethical practice, and executive development.
          </p>
        </motion.div>
      </section>

      {/* Main Narrative & Values */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="lg:col-span-6 space-y-5"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
              OUR MISSION & PURPOSE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-cib-charcoal-900 font-display leading-tight">
              Promoting World-Class Standards in Financial Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Established to promote the study of banking and regulate the practice of the banking profession in Ghana, CIB Ghana serves as the intellectual and ethical anchor for financial institutions across the nation.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Through our dedicated <strong>Events Platform</strong>, we convene national conferences, risk workshops, and leadership masterclasses that equip practitioners with the competencies demanded by a modern, digital global economy.
            </p>

            <div className="pt-2">
              <Button variant="primary" size="lg" showArrow onClick={() => navigate('/events')}>
                Explore Upcoming Conferences
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="lg:col-span-6 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <h3 className="text-xl font-bold text-cib-charcoal-900 font-display">
              Core Pillars of CIB Ghana Events
            </h3>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  title: 'Ethical Integrity & Governance',
                  desc: 'Fostering unwavering adherence to the Ghana Banking Code of Ethics and fiduciary accountability.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Continuing Professional Development (CPD)',
                  desc: 'Delivering accredited hours recognized across all licensed commercial and universal banks.',
                  icon: Award,
                },
                {
                  title: 'High-Level Policy Discourse',
                  desc: 'Providing an open forum between Bank of Ghana supervisory bodies and institutional executives.',
                  icon: Users,
                },
                {
                  title: 'Digital Banking Innovation',
                  desc: 'Examining artificial intelligence, cybersecurity, instant payment switches, and fintech collaboration.',
                  icon: BookOpen,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={cardVariant}
                    whileHover={{ x: 6, transition: { duration: 0.2 } }}
                    className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/60 transition-colors"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-cib-green-700 shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-cib-charcoal-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CIB Ecosystem Architecture - Requirement #44 */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="space-y-2 max-w-2xl mx-auto"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-cib-green-700">
              CIB DIGITAL ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-cib-charcoal-900 font-display">
              Dedicated Platforms for Professional Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The CIB Ghana Events Platform integrates seamlessly alongside our member information and educational systems.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left"
          >
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-3"
            >
              <h4 className="text-base font-bold text-cib-charcoal-900">Member MIS</h4>
              <p className="text-xs text-slate-600">
                Official portal for membership verification, annual dues payment, charter renewals, and CPD tracking.
              </p>
              <a
                href="https://mis.cibgh.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-cib-green-700 hover:underline pt-2"
              >
                Launch Member MIS <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>

            <motion.div
              variants={cardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-3 ring-2 ring-cib-green-600/30"
            >
              <span className="text-[10px] font-bold text-cib-green-800 bg-cib-green-50 px-2 py-0.5 rounded">
                CURRENT PLATFORM
              </span>
              <h4 className="text-base font-bold text-cib-charcoal-900">Events Platform</h4>
              <p className="text-xs text-slate-600">
                The centralized portal for discovering conferences, booking masterclasses, Paystack tickets, and QR check-in.
              </p>
              <Link to="/events" className="inline-flex items-center gap-1 text-xs font-bold text-cib-green-700 hover:underline pt-2">
                Browse Calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            <motion.div
              variants={cardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-3"
            >
              <h4 className="text-base font-bold text-cib-charcoal-900">E-Learning LMS</h4>
              <p className="text-xs text-slate-600">
                Self-paced online certification coursework, lecture modules, and mock exams for student candidates.
              </p>
              <a
                href="https://elearning.cibgh.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-cib-green-700 hover:underline pt-2"
              >
                Access E-Learning <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
