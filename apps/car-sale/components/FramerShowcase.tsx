"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Car } from "@/data/cars"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface FramerShowcaseProps {
  car: Car
}

export function FramerShowcase({ car }: FramerShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (!isAutoPlay || car.images.length <= 1) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % car.images.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlay, car.images.length])

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % car.images.length)
    setIsAutoPlay(false)
  }

  const goToPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
    setIsAutoPlay(false)
  }

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45,
    }),
  }

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-zinc-950 via-black to-zinc-900 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl group">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)]"
        />
      </div>

      {/* Image carousel with AnimatePresence */}
      <div className="relative h-full" style={{ perspective: "1200px" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              rotateY: { duration: 0.5 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={car.images[currentIndex] || car.image}
              alt={`${car.make} ${car.model} - View ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Top badges */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-3 md:top-6 right-3 md:right-6 space-y-2 md:space-y-3 z-20"
      >
        <Badge className="bg-black/90 backdrop-blur-xl text-primary border-primary/30 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 shadow-lg">
          ✨ PREMIUM
        </Badge>
        <Badge className="bg-black/90 backdrop-blur-xl text-white border-zinc-700 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 shadow-lg">
          {car.condition}
        </Badge>
      </motion.div>

      {/* Auto-play control */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute top-3 md:top-6 left-3 md:left-6 z-20 flex items-center gap-1.5 md:gap-2 bg-black/90 backdrop-blur-xl border border-zinc-700 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all hover:border-primary hover:scale-105"
      >
        {isAutoPlay ? (
          <>
            <Pause className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">AUTO-PLAY ON</span>
            <span className="sm:hidden">ON</span>
          </>
        ) : (
          <>
            <Play className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">AUTO-PLAY OFF</span>
            <span className="sm:hidden">OFF</span>
          </>
        )}
      </motion.button>

      {/* Feature highlights - Hidden on mobile, subtle on larger screens */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden lg:block absolute top-32 right-6 bg-black/70 backdrop-blur-md border border-zinc-800/50 rounded-lg p-3 z-20 max-w-[220px]"
      >
        <p className="text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">Features</p>
        <div className="space-y-1.5">
          {car.features.slice(0, 4).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-primary/70 mt-1 flex-shrink-0"></div>
              <span className="text-[11px] text-zinc-400 leading-tight">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigation arrows */}
      {car.images.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 backdrop-blur-xl border border-zinc-700 hover:border-primary flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 backdrop-blur-xl border border-zinc-700 hover:border-primary flex items-center justify-center transition-colors"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
        </>
      )}

      {/* Dot indicators - Bottom center, highly visible */}
      {car.images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-40"
        >
          {car.images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-4 rounded-full transition-all ${index === currentIndex
                  ? "w-20 bg-primary shadow-[0_0_20px_rgba(255,215,0,1)]"
                  : "w-4 bg-white/70 hover:bg-white"
                }`}
              aria-label={`View ${index + 1}`}
            />
          ))}
        </motion.div>
      )}

      {/* Current view label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30"
      >
        <Badge className="bg-black/80 backdrop-blur-xl border-zinc-700 px-4 py-2 text-xs">
          VIEW {currentIndex + 1} OF {car.images.length}
        </Badge>
      </motion.div>
    </div>
  )
}
