"use client"

import React, { useState } from "react"
import { ImageChoiceStepFields } from "@/types/lessonTypes"
import { sharedStyles } from "../sharedStyles"
import { playCorrectSound, playIncorrectSound } from "../lessonSounds"
import Image from "next/image"

interface ImageChoiceStepProps {
  step: ImageChoiceStepFields & { id: string; title?: string; description?: string }
  onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => void
  selectedImageId?: string
}

export function ImageChoiceStep({
  step,
  onAnswered,
  selectedImageId: initialSelected,
}: ImageChoiceStepProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(initialSelected)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSelect = (imageId: string) => {
    setSelectedImageId(imageId)
    const isCorrect = imageId === step.correctImageId
    setShowFeedback(true)
    
    // Play sound
    if (isCorrect) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }
    
    onAnswered({ 
      isCompleted: true, 
      isCorrect,
      answerData: { selectedImageId: imageId }
    })
  }

  const getButtonStyle = (imageId: string) => {
    const isSelected = selectedImageId === imageId
    if (!showFeedback || !isSelected) {
      return isSelected ? sharedStyles.optionSelected : ""
    }
    const isCorrect = imageId === step.correctImageId
    return isCorrect
      ? "bg-emerald-600/25 border-emerald-500 ring-2 ring-emerald-400"
      : "bg-red-600/20 border-red-500 ring-2 ring-red-500"
  }

  return (
    <div className={sharedStyles.container}>
      {step.title && <h2 className={sharedStyles.title}>{step.title}</h2>}
      {step.description && <p className={sharedStyles.description}>{step.description}</p>}
      <h3 className={sharedStyles.question}>{step.question}</h3>
      <div className={`${sharedStyles.grid2Col} mt-6`}>
        {step.imageOptions.map((imageOption) => {
          const isSelected = selectedImageId === imageOption.id
          const isCorrect = imageOption.id === step.correctImageId
          
          return (
            <button
              key={imageOption.id}
              onClick={() => handleSelect(imageOption.id)}
              disabled={showFeedback}
              className={`${sharedStyles.option} ${sharedStyles.flexCol} ${getButtonStyle(imageOption.id)} transition-all duration-300 ${
                showFeedback ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className={sharedStyles.imageContainer}>
                {/* Placeholder for image - replace with actual image loading */}
                <div className="w-full h-32 md:h-40 bg-slate-200 rounded-lg flex items-center justify-center relative">
                  <span className="text-slate-600 text-sm">Image: {imageOption.imageId}</span>
                  {showFeedback && isSelected && (
                    <span className="absolute top-2 right-2 text-3xl bg-slate-900/80 rounded-full w-10 h-10 flex items-center justify-center">
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-base md:text-lg mt-2">{imageOption.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

