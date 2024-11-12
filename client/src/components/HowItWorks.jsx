'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { LogIn, LayoutDashboard, Key, Vault, BarChart } from 'lucide-react'

const steps = [
  {
    title: "Sign in to keyper",
    description: "If you are new to our site join us by signing up.",
    icon: LogIn
  },
  {
    title: "Navigate to Dashboard",
    description: "Create new Vaults by clicking the button. You can create as many vaults as you like.",
    icon: LayoutDashboard
  },
  {
    title: "Create Passwords",
    description: "Other than creating passwords, you can create wallet seed phrases with standard word length and copy them when needed.",
    icon: Key
  },
  {
    title: "The Vault page",
    description: "Navigate through the passwords and seeds you created.",
    icon: Vault
  },
  {
    title: "Dashboard statistics",
    description: "Manage your statistics like total vaults and total passwords.",
    icon: BarChart
  }
]

const TimelineItem = ({ step, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <step.icon className="w-8 h-8 text-primary" />
      </div>
      <div className="flex-grow md:pt-2">
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-lg">{step.description}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-gradient-to-br text-left from-background to-primary/5">
      <div className="container px-4 md:px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">How it works</h2>
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <TimelineItem step={step} index={index} />
              {index < steps.length - 1 && (
                <div className="w-0.5 h-12 bg-primary/20 mx-auto my-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}