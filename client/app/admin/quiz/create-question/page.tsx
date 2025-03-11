import { QuestionForm } from "@/components/question-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateQuestionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/admin/quiz">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </Link>
      </div>
      <QuestionForm />
    </div>
  )
}

