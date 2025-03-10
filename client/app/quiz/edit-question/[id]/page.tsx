"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { QuestionFormEdit } from "@/components/question-form-edit"
import { type Question, fetchQuestions } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get the question ID from the URL
    const questionId = params.id as string

    const getQuestion = async () => {
      try {
        setLoading(true)
        const questions = await fetchQuestions()
        const foundQuestion = questions.find((q) => q._id === questionId)

        if (foundQuestion) {
          setQuestion(foundQuestion)
          setError(null)
        } else {
          setError("Question not found")
          // Question not found, redirect to homepage after a delay
          setTimeout(() => router.push("/quiz"), 2000)
        }
      } catch (err) {
        setError("Failed to load question. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getQuestion()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-lg">Loading question...</div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{error || "Question not found"}</h2>
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
      <QuestionFormEdit question={question} />
    </div>
  )
}

