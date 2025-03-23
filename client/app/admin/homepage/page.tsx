import { HomePageForm } from "@/components/homepage-form";
import { Sidebar } from "@/components/ui/sidebar";

export default function CreateHomePage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 container mx-auto py-6">
        <HomePageForm />
      </div>
    </div>
  );
}