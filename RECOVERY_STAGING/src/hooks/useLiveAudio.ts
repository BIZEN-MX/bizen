"use client"

import { useEffect, useRef } from "react"

/**
 * URLs for BIZEN Live sounds (Kahoot-style vibe)
 * These are chiptune/game sounds from open sources.
 */
export const BIZEN_LIVE_SOUNDS = {
  lobby: "", // Upbeat chiptune loop
  thinking: "", // Rhythmic thinking/wait
  correct: "", // Happy success ding
  wrong: "", // Fail buzz
  finished: "", // Upbeat chiptune for results
}

export function useLiveAudio(status: string, isHost: boolean = false) {
  const lobbyAudio = useRef<HTMLAudioElement | null>(null)
  const thinkingAudio = useRef<HTMLAudioElement | null>(null)
  const correctAudio = useRef<HTMLAudioElement | null>(null)
  const wrongAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio objects
    lobbyAudio.current = new Audio(BIZEN_LIVE_SOUNDS.lobby)
    lobbyAudio.current.loop = true
    
    thinkingAudio.current = new Audio(BIZEN_LIVE_SOUNDS.thinking)
    thinkingAudio.current.loop = true

    correctAudio.current = new Audio(BIZEN_LIVE_SOUNDS.correct)
    wrongAudio.current = new Audio(BIZEN_LIVE_SOUNDS.wrong)

    return () => {
      // Cleanup
      lobbyAudio.current?.pause()
      thinkingAudio.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (!lobbyAudio.current || !thinkingAudio.current) return

    // Stop everything first
    lobbyAudio.current.pause()
    thinkingAudio.current.pause()

    if (isHost) {
      // Host side sounds
      if (status === "lobby") {
        lobbyAudio.current.currentTime = 0
        lobbyAudio.current.play().catch(() => {})
      } else if (status === "in_question") {
        thinkingAudio.current.currentTime = 0
        thinkingAudio.current.play().catch(() => {})
      } else if (status === "finished") {
        lobbyAudio.current.currentTime = 0
        lobbyAudio.current.play().catch(() => {})
      }
    } else {
      // Player side sounds
      if (status === "in_question") {
        // usually players don't hear thinking music unless host is not sharing, 
        // but let's add a light version or skip to avoid double audio if in same room
      }
    }
  }, [status, isHost])

  const playFeedback = (isCorrect: boolean) => {
    if (isCorrect) {
      if (correctAudio.current) {
        correctAudio.current.currentTime = 0
        correctAudio.current.play().catch(() => {})
      }
    } else {
      if (wrongAudio.current) {
        wrongAudio.current.currentTime = 0
        wrongAudio.current.play().catch(() => {})
      }
    }
  }

  return { playFeedback }
}
