"use client"

import React, { useState } from "react"
import { LessonScreen, StickyFooterButton, sharedStyles } from "./index"
import { LessonStep } from "@/types/lessonTypes"

/**
 * Example usage of LessonScreen component
 * This demonstrates how to use the responsive lesson UI shell
 */
export function LessonScreenExample() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})

  // Example lesson steps
  const lessonSteps: LessonStep[] = [
    {
      id: "step-1",
      stepType: "info",
      title: "Welcome to Lesson 1",
      body: "In this lesson, you'll learn about basic business concepts. Let's get started!",
      description: "Introduction to the lesson",
      isAssessment: false,
    },
    {
      id: "step-2",
      stepType: "mcq",
      question: "What is the primary goal of a business?",
      options: [
        {
          id: "opt-1",
          label: "To make a profit",
          isCorrect: true,
          explanation: "Correct! The primary goal of most businesses is to generate profit.",
        },
        {
          id: "opt-2",
          label: "To provide free services",
          isCorrect: false,
        },
        {
          id: "opt-3",
          label: "To avoid customers",
          isCorrect: false,
        },
        {
          id: "opt-4",
          label: "To lose money",
          isCorrect: false,
        },
      ],
      isAssessment: true,
      recordIncorrect: true,
    },
  ]

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = lessonSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === lessonSteps.length - 1

  const renderStepContent = () => {
    if (!currentStepData) return null

    switch (currentStepData.stepType) {
      case "info":
        return (
          <div className={sharedStyles.container}>
            <h2 className={sharedStyles.title}>{currentStepData.title}</h2>
            <p className={sharedStyles.body}>{currentStepData.body}</p>
          </div>
        )

      case "mcq":
        return (
          <div className={sharedStyles.container}>
            <h2 className={sharedStyles.question}>{currentStepData.question}</h2>
            <div className={sharedStyles.grid1Col}>
              {currentStepData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelectedAnswers({ ...selectedAnswers, [currentStepData.id]: option.id })
                  }
                  className={`${sharedStyles.option} ${
                    selectedAnswers[currentStepData.id] === option.id
                      ? sharedStyles.optionSelected
                      : ""
                  }`}
                >
                  <span className="text-base md:text-lg">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Step type not implemented yet</div>
    }
  }

  return (
    <LessonScreen
      currentStep={currentStep + 1}
      totalSteps={lessonSteps.length}
      footerContent={
        <div className="flex gap-3 md:gap-4">
          {!isFirstStep && (
            <StickyFooterButton
              variant="secondary"
              onClick={handlePrevious}
              className="flex-1 max-w-none"
            >
              Previous
            </StickyFooterButton>
          )}
          <StickyFooterButton
            variant="primary"
            onClick={handleNext}
            disabled={isLastStep}
            className={isFirstStep ? "w-full" : "flex-1 max-w-none"}
          >
            {isLastStep ? "Complete Lesson" : "Next"}
          </StickyFooterButton>
        </div>
      }
    >
      {renderStepContent()}
    </LessonScreen>
  )
}

