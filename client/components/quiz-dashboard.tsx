"use client"

import { QuestionList } from "@/components/question-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, LogOut } from "lucide-react"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export function QuizDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    const result = await logout();
    if(result)
    {
        toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        })
        router.push("/admin")
    }
  }

  return (
    <div className="container mx-auto py-6 rounded border p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quiz Questions</h1>
        <div className="flex space-x-2">
          <Link href="/admin/quiz/create-question">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Question
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <QuestionList />
    </div>
  )
}

