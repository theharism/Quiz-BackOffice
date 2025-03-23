import { QuizDashboard } from "@/components/quiz-dashboard";
import { Sidebar } from "@/components/ui/sidebar";

export default function QuizHomePage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 container mx-auto py-6">
        <QuizDashboard />
      </div>
    </div>
  );
}