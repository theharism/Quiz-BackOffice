"use client"

import { useState, useEffect } from "react"
import { QuestionCard } from "@/components/question-card"
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

// Define the question type
export type QuestionOption = {
  text: string
  scores: Record<string, number>
}

export type Question = {
  id: string
  questionText: string
  questionType: "text" | "multiple-choice" | "true-false" | "numeric"
  isRequired: boolean
  category: "basic-info" | "symptoms" | "lifestyle"
  allowMultipleSelections?: boolean
  options?: QuestionOption[]
  createdAt: string
}

// Sample data for demonstration
const sampleQuestions: Question[] = [
  {
    id: "1",
    questionText: "What is your age?",
    questionType: "numeric",
    isRequired: true,
    category: "basic-info",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    questionText: "Do you experience fatigue during the day?",
    questionType: "true-false",
    isRequired: true,
    category: "symptoms",
    allowMultipleSelections: false,
    options: [
      {
        text: "True",
        scores: {
          "TRT (Testosterone Replacement Therapy)": 5,
          "Build (Muscle Building)": 2,
          Peptides: 3,
          "Lean (Fat Loss / Lean Body)": 1,
          "GLP1 (Glucagon-like Peptide-1)": 0,
          "Tadalafil (Libido / Erectile Dysfunction)": 2,
        },
      },
      {
        text: "False",
        scores: {
          "TRT (Testosterone Replacement Therapy)": 0,
          "Build (Muscle Building)": 0,
          Peptides: 0,
          "Lean (Fat Loss / Lean Body)": 0,
          "GLP1 (Glucagon-like Peptide-1)": 0,
          "Tadalafil (Libido / Erectile Dysfunction)": 0,
        },
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    questionText: "Which of the following symptoms do you experience?",
    questionType: "multiple-choice",
    isRequired: false,
    category: "symptoms",
    allowMultipleSelections: true,
    options: [
      {
        text: "Low energy",
        scores: {
          "TRT (Testosterone Replacement Therapy)": 4,
          "Build (Muscle Building)": 2,
          Peptides: 3,
          "Lean (Fat Loss / Lean Body)": 1,
          "GLP1 (Glucagon-like Peptide-1)": 0,
          "Tadalafil (Libido / Erectile Dysfunction)": 0,
        },
      },
      {
        text: "Difficulty sleeping",
        scores: {
          "TRT (Testosterone Replacement Therapy)": 3,
          "Build (Muscle Building)": 1,
          Peptides: 4,
          "Lean (Fat Loss / Lean Body)": 0,
          "GLP1 (Glucagon-like Peptide-1)": 0,
          "Tadalafil (Libido / Erectile Dysfunction)": 0,
        },
      },
      {
        text: "Weight gain",
        scores: {
          "TRT (Testosterone Replacement Therapy)": 2,
          "Build (Muscle Building)": 0,
          Peptides: 1,
          "Lean (Fat Loss / Lean Body)": 5,
          "GLP1 (Glucagon-like Peptide-1)": 4,
          "Tadalafil (Libido / Erectile Dysfunction)": 0,
        },
      },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    questionText: "Describe your current exercise routine",
    questionType: "text",
    isRequired: true,
    category: "lifestyle",
    createdAt: new Date().toISOString(),
  },
]

export function QuestionList() {
  // State for questions
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)

  // Load questions from localStorage or use sample data
  useEffect(() => {
    const storedQuestions = localStorage.getItem("quizQuestions")
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions))
    } else {
      setQuestions(sampleQuestions)
      localStorage.setItem("quizQuestions", JSON.stringify(sampleQuestions))
    }
  }, [])

  // Apply filters whenever questions, search term, or filters change
  useEffect(() => {
    let result = [...questions]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((q) => q.questionText.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((q) => q.category === categoryFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((q) => q.questionType === typeFilter)
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredQuestions(result)
  }, [questions, searchTerm, categoryFilter, typeFilter])

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setQuestionToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Handle actual deletion
  const handleDelete = () => {
    if (questionToDelete) {
      const updatedQuestions = questions.filter((q) => q.id !== questionToDelete)
      setQuestions(updatedQuestions)
      localStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions))
      toast({
        title: "Question deleted",
        description: "The question has been deleted successfully.",
      })
    }
    setDeleteDialogOpen(false)
    setQuestionToDelete(null)
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
            <QuestionCard key={question.id} question={question} onDelete={() => confirmDelete(question.id)} />
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

