"use client"

import type { Question } from "@/components/question-list"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface QuestionCardProps {
  question: Question
  onDelete: () => void
}

export function QuestionCard({ question, onDelete }: QuestionCardProps) {
  // Format the creation date
  const formattedDate = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })

  // Get the question type display text
  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case "text":
        return "Text Input"
      case "multiple-choice":
        return "Multiple Choice"
      case "true-false":
        return "True/False"
      case "numeric":
        return "Numeric"
      default:
        return type
    }
  }

  // Get the category display text
  const getCategoryText = (category: string) => {
    switch (category) {
      case "basic-info":
        return "Basic Info"
      case "symptoms":
        return "Symptoms"
      case "lifestyle":
        return "Lifestyle"
      default:
        return category
    }
  }

  // Get badge color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic-info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "symptoms":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "lifestyle":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return ""
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium line-clamp-2">{question.questionText}</h3>
            <div className="flex space-x-2">
              <Badge variant="outline" className={getCategoryColor(question.category)}>
                {getCategoryText(question.category)}
              </Badge>
              <Badge variant="secondary">{getQuestionTypeText(question.questionType)}</Badge>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {formattedDate}</span>
            {question.isRequired ? (
              <div className="ml-4 flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Required</span>
              </div>
            ) : (
              <div className="ml-4 flex items-center text-amber-600 dark:text-amber-400">
                <XCircle className="h-4 w-4 mr-1" />
                <span>Optional</span>
              </div>
            )}
          </div>

          {question.questionType === "multiple-choice" && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-1">
                {question.options?.length || 0} options •
                {question.allowMultipleSelections ? " Multiple selections allowed" : " Single selection only"}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {question.options?.slice(0, 3).map((option, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {option.text}
                  </Badge>
                ))}
                {(question.options?.length || 0) > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(question.options?.length || 0) - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex justify-between w-full">
          <Link href={`/quiz/edit-question/${question.id}`} passHref>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

