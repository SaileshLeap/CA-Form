"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageCircle,
  TrendingUp,
  Award,
  IndianRupee,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Zap,
  Globe,
  Linkedin,
  Star,
  Sparkles,
  Rocket,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Enhanced animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Floating animation for decorative elements
const float = {
  y: [-5, 5, -5],
  transition: {
    duration: 4,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

const floatReverse = {
  y: [5, -5, 5],
  transition: {
    duration: 5,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

export default function LeapScholarCA() {
  const [scrolled, setScrolled] = useState(false)
  // Remove the mobileMenuOpen state as it's no longer needed
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  const navItems = [
    { label: "Why Join Us", id: "why-join" },
    { label: "What You'll Do", id: "what-you-do" },
    { label: "Perks", id: "perks" },
    { label: "Apply", id: "apply" },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      {/* Mobile-First Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 shadow-lg backdrop-blur-xl border-b border-slate-200/50" : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leap-scholar-logo-5gztfsARKyifHBCntcv3zEYtsVinVB.png"
              alt="Leap Scholar Logo"
              width={140}
              height={40}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.slice(0, -1).map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className={`font-semibold hover:text-indigo-500 transition-all duration-300 relative group text-sm lg:text-base ${
                  scrolled ? "text-slate-700" : "text-slate-700"
                }`}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
          </div>

          {/* Desktop Apply Button */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block flex-shrink-0"
          >
            <Button
              onClick={() => scrollToSection("apply")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 text-sm lg:text-base lg:px-6 lg:py-3"
            >
              Apply Now
            </Button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile-First Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 via-white/30 to-gray-50/50"></div>

          {/* Mobile-optimized floating decorative elements */}
          <motion.div
            animate={float}
            className="absolute top-20 left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-sky-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={floatReverse}
            className="absolute top-40 right-4 w-20 h-20 sm:w-24 sm:h-24 lg:w-40 lg:h-40 bg-indigo-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={float}
            className="absolute bottom-40 left-1/4 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-purple-400/20 rounded-full blur-xl"
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 relative z-10 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 w-full order-2 lg:order-1"
            >
              <motion.div variants={fadeIn} className="w-full">
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 px-3 py-1.5 text-xs sm:text-sm rounded-full inline-flex items-center">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Now Recruiting Campus Ambassadors</span>
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight"
              >
                Become a Campus Ambassador with{" "}
                <span className="text-sky-400 relative inline-block">
                  Leap Scholar
                  <motion.div
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed"
              >
                Lead your campus. Help students study abroad. Upskill yourself.
              </motion.p>

              <motion.div variants={fadeIn} className="space-y-4 sm:space-y-6 w-full">
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 30px rgba(14, 165, 233, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block w-full sm:w-auto"
                >
                  <Button
                    onClick={() => (window.location.href = "/apply")}
                    size="lg"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 text-lg sm:text-xl font-bold rounded-xl shadow-xl hover:shadow-sky-500/40 transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  </Button>
                </motion.div>

                <motion.div variants={fadeIn} className="flex justify-center lg:justify-start">
                  <button
                    onClick={() => scrollToSection("why-join")}
                    className="flex items-center text-slate-500 hover:text-slate-700 transition-all duration-300 group"
                  >
                    <span className="text-sm sm:text-base">Learn more</span>
                    <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative"
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-graduate.jpg-KRVnjJciL6yuTWdEcdBGucVP3ybBVJ.jpeg"
                    alt="Campus Ambassador celebrating success with study abroad achievements"
                    width={600}
                    height={600}
                    className="rounded-2xl sm:rounded-3xl shadow-xl w-full h-auto"
                  />
                  <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-full h-full bg-gradient-to-br from-sky-400/30 to-indigo-500/30 rounded-2xl sm:rounded-3xl -z-10 blur-sm"></div>
                </motion.div>

                {/* Mobile-optimized floating badges */}
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [0, 2, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-lg"
                >
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm">Top Performer</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5], rotate: [0, -2, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-lg"
                >
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm">₹20K+ Earned</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile-optimized scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-slate-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                />
              ))}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Mobile-First Why Join Section */}
      <section id="why-join" className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            animate={float}
            className="absolute top-20 right-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-full opacity-50 blur-3xl"
          />
          <motion.div
            animate={floatReverse}
            className="absolute bottom-20 left-4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full opacity-50 blur-3xl"
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          >
            <motion.div
              variants={slideInLeft}
              className="space-y-4 sm:space-y-6 lg:space-y-8 w-full order-2 lg:order-1"
            >
              <div className="space-y-4 sm:space-y-6">
                <motion.h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight"
                  variants={fadeInUp}
                >
                  Why Join Our Ambassador Program?
                </motion.h2>
                <motion.div
                  className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full"
                  variants={scaleIn}
                />
              </div>

              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 leading-relaxed"
              >
                As a Campus Ambassador, you'll be at the forefront of helping your peers achieve their study abroad
                dreams. You'll gain invaluable leadership experience while building a personal brand that sets you apart
                in today's competitive landscape.
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 leading-relaxed"
              >
                This isn't just another campus role, it's your opportunity to make a real impact, develop professional skills, and earn recognition from India's leading study abroad platform.
              </motion.p>

              <motion.div variants={fadeInUp} className="pt-4 flex flex-wrap gap-2 sm:gap-3">
                {[
                  { label: "Leadership Development", color: "indigo" },
                  { label: "Professional Network", color: "green" },
                  { label: "Resume Enhancement", color: "sky" },
                  { label: "Monthly Rewards", color: "amber" },
                ].map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      className={`bg-${badge.color}-100 text-${badge.color}-700 hover:bg-${badge.color}-200 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-full font-semibold shadow-md whitespace-nowrap`}
                    >
                      {badge.label}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={slideInRight} whileHover={{ scale: 1.02 }} className="relative order-1 lg:order-2">
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/graduate-celebration.jpg-zVwsjpfFRUDLBHDVpw2BMFUliBVsis.jpeg"
                  alt="Students collaborating and celebrating academic achievements"
                  width={600}
                  height={500}
                  className="rounded-2xl sm:rounded-3xl shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 w-full h-full bg-gradient-to-br from-indigo-400/20 to-sky-500/20 rounded-2xl sm:rounded-3xl -z-10 blur-sm"></div>

                {/* Mobile-optimized floating stats */}
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-xl"
                >
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">500+</div>
                    <div className="text-xs sm:text-sm text-slate-600">Active Ambassadors</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile-First What You'll Do */}
      <section
        id="what-you-do"
        className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              What You'll Do
            </h2>
            <motion.div
              className="w-20 sm:w-24 lg:w-32 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Your role as a Campus Ambassador involves three key responsibilities that will help you grow
              professionally
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: Users,
                title: "Spread the Word",
                description:
                  "Promote Leap Scholar's innovative tools and exclusive events with your peers through social media, campus networks, and word-of-mouth marketing.",
                color: "blue",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: MessageCircle,
                title: "Guide Peers",
                description:
                  "Help fellow aspirants understand how to plan their study abroad journey, from test preparation to university applications and visa processes.",
                color: "green",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: TrendingUp,
                title: "Be a Catalyst",
                description:
                  "Help students discover the right Leap tools and support systems they need to make confident decisions about studying abroad.",
                color: "indigo",
                gradient: "from-indigo-500 to-purple-600",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                className="h-full group cursor-pointer"
              >
                <Card className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <CardContent className="p-0 text-center relative z-10">
                    <motion.div
                      className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6 group-hover:text-indigo-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-xs sm:text-sm lg:text-base hyphens-auto">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mobile-First Perks Section */}
      <section id="perks" className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-20 right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-indigo-100/50 to-sky-100/50 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute bottom-20 left-10 w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full blur-3xl"
        />

        <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              What You'll Get
            </h2>
            <motion.div
              className="w-20 sm:w-24 lg:w-32 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Exclusive benefits and rewards that recognize your contribution and accelerate your career
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: IndianRupee,
                title: "Earn Rewards",
                description: "Up to ₹20,000/month based on your performance and impact",
                gradient: "from-green-500 to-emerald-600",
                bgColor: "green",
              },
              {
                icon: Award,
                title: "Certificate & Recommendation",
                description: "Receive official certification and LinkedIn recommendation from Leap Scholar",
                gradient: "from-blue-500 to-indigo-600",
                bgColor: "blue",
              },
              {
                icon: Rocket,
                title: "Build Real-World Skills",
                description: "Sharpen your communication, marketing, and execution skills with hands-on tasks",
                gradient: "from-orange-500 to-red-500",
                bgColor: "orange",
              },
              {
                icon: Users,
                title: "Grow Your Peer Influence",
                description: "Become the go-to person on campus for study abroad guidance and trusted tools",
                gradient: "from-sky-500 to-blue-600",
                bgColor: "sky",
              },
            ].map((perk, index) => (
              <motion.div
                key={perk.title}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                }}
                className="h-full group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="p-4 sm:p-6 lg:p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden group">
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={false}
                  />

                  <CardContent className="p-0 text-center relative z-10">
                    <motion.div
                      className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${perk.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 shadow-lg`}
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <perk.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </motion.div>
                    <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-slate-900 mb-2 sm:mb-3 lg:mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                      {perk.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed hyphens-auto">
                      {perk.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mobile-First Who Should Apply */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={slideInLeft}
              className="order-2 lg:order-1 space-y-4 sm:space-y-6 lg:space-y-8 w-full"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">
                  Who Should Apply
                </h2>
                <motion.div
                  className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full mb-4 sm:mb-6 lg:mb-8"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 mb-4 sm:mb-6 lg:mb-10 leading-relaxed">
                  We're looking for motivated students who meet these criteria:
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {[
                  {
                    title: "Pre-final or final year students",
                    description: "Currently enrolled in your 3rd year or final year of studies.",
                  },
                  {
                    title: "Active in peer communities",
                    description: "Involved in student organizations, clubs, or campus activities.",
                  },
                  {
                    title: "Comfortable engaging and influencing peers",
                    description: "You enjoy sharing helpful opportunities with classmates, both online and in person.",
                  },
                  {
                    title: "Take initiative without being told",
                    description:
                      "You're the kind of person who spots what needs to be done and gets moving without waiting for instructions.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group w-full"
                  >
                    <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.4 }}>
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600 mt-0.5 flex-shrink-0 group-hover:text-green-500 transition-colors duration-300" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg group-hover:text-indigo-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-xs sm:text-sm lg:text-base hyphens-auto">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={slideInRight}
              className="order-1 lg:order-2"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/study-abroad-student.jpg-OfnCJOFBdstH7gvhb1lB0kWrYCDlgG.jpeg"
                  alt="Motivated students planning their study abroad journey"
                  width={600}
                  height={500}
                  className="rounded-2xl sm:rounded-3xl shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8 w-full h-full bg-gradient-to-br from-green-400/20 to-sky-500/20 rounded-2xl sm:rounded-3xl -z-10 blur-sm"></div>

                {/* Mobile-optimized floating achievement badges */}
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 bg-white/95 backdrop-blur-sm rounded-xl p-2 sm:p-3 lg:p-4 shadow-xl"
                >
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-500" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">Excellence</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [4, -4, 4], rotate: [0, -2, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 bg-white/95 backdrop-blur-sm rounded-xl p-2 sm:p-3 lg:p-4 shadow-xl"
                >
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">Achievement</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile-First CTA Section */}
      <section
        id="apply"
        className="py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-800 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-sky-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute bottom-10 right-4 w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-indigo-400/10 rounded-full blur-3xl"
        />

        <div className="w-full max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="space-y-6 sm:space-y-8 lg:space-y-10"
          >
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight"
              variants={fadeInUp}
            >
              Ready to Lead the Change on Your Campus?
            </motion.h2>

            <motion.p
              className="text-sm sm:text-base lg:text-lg xl:text-2xl mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed"
              variants={fadeInUp}
            >
              Join hundreds of ambitious students who are already making an impact as Leap Scholar Campus Ambassadors.
              The application takes less than 5 minutes to complete.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(14, 165, 233, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-block w-full sm:w-auto"
            >
              <Button
                onClick={() => (window.location.href = "/apply")}
                size="lg"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8 text-lg sm:text-xl lg:text-2xl font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-sky-500/40 transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
              >
                Start Application
                <ArrowRight className="ml-2 sm:ml-3 lg:ml-4 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
              </Button>
            </motion.div>

            <motion.p className="text-xs sm:text-sm lg:text-base opacity-75 mt-4 sm:mt-6 lg:mt-8" variants={fadeInUp}>
              No obligations. No fees. Just opportunities.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mobile-First Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leap-scholar-logo-5gztfsARKyifHBCntcv3zEYtsVinVB.png"
                alt="Leap Scholar Logo"
                width={180}
                height={50}
                className="h-8 sm:h-10 w-auto brightness-0 invert"
              />
            </motion.div>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 lg:space-x-12">
              <motion.a
                href="mailto:campus@leapscholar.com"
                className="hover:text-indigo-400 transition-colors text-sm sm:text-base lg:text-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                campus@leapscholar.com
              </motion.a>
              <div className="flex items-center space-x-4 sm:space-x-6">
                {[
                  { icon: Globe, href: "https://leapscholar.com/" },
                  { icon: Linkedin, href: "https://in.linkedin.com/company/leap-global-education" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className="border-t border-slate-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-slate-400 text-xs sm:text-sm lg:text-base">
              © {new Date().getFullYear()} Leap Scholar. All rights reserved. |
              <Link href="#" className="hover:text-indigo-400 transition-colors ml-2 hover:underline">
                Privacy Policy
              </Link>{" "}
              |
              <Link href="#" className="hover:text-indigo-400 transition-colors ml-2 hover:underline">
                Terms of Service
              </Link>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
