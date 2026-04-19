"use client"

import { useCallback, useRef } from "react"

type AudioCtx = AudioContext | null

export function useCashflowSounds() {
  const audioCtxRef = useRef<AudioCtx>(null)

  const getAudioContext = () => {
    if (typeof window === "undefined") return null
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      if (!Ctx) return null
      audioCtxRef.current = new Ctx()
    }
    return audioCtxRef.current
  }

  const playDiceRoll = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const duration = 0.35
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const channel = buffer.getChannelData(0)

    for (let i = 0; i < channel.length; i++) {
      const decay = 1 - i / channel.length
      channel[i] = (Math.random() * 2 - 1) * decay * 0.6
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = 500
    filter.Q.value = 3

    const gain = ctx.createGain()
    gain.gain.value = 0.4

    noise.connect(filter).connect(gain).connect(ctx.destination)
    noise.start()
    noise.stop(ctx.currentTime + duration)
  }, [])

  const playCardReveal = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    const hit = ctx.createOscillator()
    hit.type = "triangle"
    hit.frequency.setValueAtTime(520, now)
    hit.frequency.exponentialRampToValueAtTime(760, now + 0.25)

    const bell = ctx.createOscillator()
    bell.type = "sine"
    bell.frequency.setValueAtTime(1320, now + 0.05)
    bell.frequency.exponentialRampToValueAtTime(990, now + 0.35)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)

    const panner = ctx.createStereoPanner()
    panner.pan.setValueAtTime(-0.3, now)
    panner.pan.linearRampToValueAtTime(0.35, now + 0.5)

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.25, now)
    noiseGain.gain.linearRampToValueAtTime(0, now + 0.2)

    hit.connect(gain)
    bell.connect(gain)
    gain.connect(panner).connect(ctx.destination)
    noise.connect(noiseGain).connect(ctx.destination)

    hit.start(now)
    bell.start(now + 0.05)
    noise.start(now)
    bell.stop(now + 0.5)
    hit.stop(now + 0.55)
    noise.stop(now + 0.25)
  }, [])

  const playReward = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(660, now)
    osc.frequency.exponentialRampToValueAtTime(990, now + 0.35)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

    const shimmer = ctx.createOscillator()
    shimmer.type = "sine"
    shimmer.frequency.setValueAtTime(1320, now)
    const shimmerGain = ctx.createGain()
    shimmerGain.gain.value = 0.15

    shimmer.connect(shimmerGain).connect(gain)
    osc.connect(gain).connect(ctx.destination)

    osc.start(now)
    shimmer.start(now + 0.05)
    shimmer.stop(now + 0.4)
    osc.stop(now + 0.6)
  }, [])

  const playDecision = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.2)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }, [])

  const playNegative = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.3)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.35)

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.4)
  }, [])

  const playSuccessChime = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    osc1.type = "triangle"
    osc2.type = "triangle"
    osc1.frequency.setValueAtTime(550, now)
    osc2.frequency.setValueAtTime(825, now)
    osc1.frequency.exponentialRampToValueAtTime(660, now + 0.25)
    osc2.frequency.exponentialRampToValueAtTime(990, now + 0.25)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.45)
    osc2.stop(now + 0.45)
  }, [])

  return { 
    playDiceRoll, 
    playCardReveal, 
    playReward, 
    playDecision, 
    playNegative,
    playSuccessChime
  }
}

