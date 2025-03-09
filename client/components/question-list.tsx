"use client"

import { useState, useEffect } from "react"
import { QuestionCard } from "@/components/question-card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchQuestions, deleteQuestion, type Question } from "@/lib/api"

export function QuestionList() {
  // State for questions
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)

  // Load questions from API
  useEffect(() => {
    const getQuestions = async () => {
      try {
        setIsLoading(true)
        const data = await fetchQuestions()
        setQuestions(data)
        setError(null)
      } catch (err) {
        setError("Failed to load questions. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getQuestions()
  }, [])

  // Apply filters whenever questions, search term, or filters change
  useEffect(() => {
    let result = [...questions]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((q) => q.category === categoryFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((q) => q.type === typeFilter)
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    setFilteredQuestions(result)
  }, [questions, searchTerm, categoryFilter, typeFilter])

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setQuestionToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Handle actual deletion
  const handleDelete = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion(questionToDelete)

        // Update local state
        const updatedQuestions = questions.filter((q) => q._id !== questionToDelete)
        setQuestions(updatedQuestions)

        toast({
          title: "Question deleted",
          description: "The question has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the question. Please try again.",
          variant: "destructive",
        })
      }
    }
    setDeleteDialogOpen(false)
    setQuestionToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-lg">Loading questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="basic-info">Basic Info</SelectItem>
            <SelectItem value="symptoms">Symptoms</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
            <SelectItem value="true-false">True/False</SelectItem>
            <SelectItem value="numeric">Numeric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions list */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question._id} question={question} onDelete={() => confirmDelete(question._id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No questions found. Create your first question!</p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the question from your quiz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export interface QuestionOption {
  _id?: string
  text: string
  score: Record<string, number>
}

export interface Question {
  _id: string
  text: string
  type: "text" | "multiple-choice" | "true-false" | "numeric"
  allowMultipleSelections: boolean
  options: QuestionOption[]
  isRequired: boolean
  category: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

