import { QuestionList } from "@/components/question-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function QuizHomePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quiz Questions</h1>
        <Link href="/quiz/create-question">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Question
          </Button>
        </Link>
      </div>
      <QuestionList />
    </div>
  )
}

