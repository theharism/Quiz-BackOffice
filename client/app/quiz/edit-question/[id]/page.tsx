"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { QuestionForm } from "@/components/question-form-edit"
import type { Question } from "@/components/question-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the question ID from the URL
    const questionId = params.id as string

    // Load questions from localStorage
    const storedQuestions = localStorage.getItem("quizQuestions")
    if (storedQuestions) {
      const questions = JSON.parse(storedQuestions) as Question[]
      const foundQuestion = questions.find((q) => q.id === questionId)

      if (foundQuestion) {
        setQuestion(foundQuestion)
      } else {
        // Question not found, redirect to homepage
        router.push("/quiz")
      }
    } else {
      // No questions found, redirect to homepage
      router.push("/quiz")
    }

    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-lg">Loading question...</div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Question not found</h2>
          <Link href="/quiz">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/quiz">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </Link>
      </div>
      <QuestionForm question={question} />
    </div>
  )
}

