// API service for handling question data

export interface QuestionOption {
  _id?: string;
  text: string;
  score: Record<string, number>;
}

export interface Question {
  _id: string;
  text: string;
  type: "text" | "multiple-choice" | "true-false" | "numeric";
  allowMultipleSelections: boolean;
  options: QuestionOption[];
  isRequired: boolean;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: Question[];
}

interface HomePageFetchApiResponse {
  success: boolean;
  data: HomePage;
}

export interface HomePage {
  _id: string;
  logo: string;
  heading: string;
  subHeading: string;
  buttonText: string;
  completionTime: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const API_URL = "http://localhost:3005/api/v1";

// Fetch all questions
export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(`${API_URL}/questions`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.success) {
      throw new Error("Failed to fetch questions");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

// Create a new question
export async function createQuestion(
  question: Omit<Question, "_id">
): Promise<Question> {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to create question");
    }

    return data.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

// Update an existing question
export async function updateQuestion(
  id: string,
  question: Partial<Question>
): Promise<Question> {
  try {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to update question");
    }

    return data.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}

// Delete a question
export async function deleteQuestion(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to delete question");
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}

// Fetch homepage
export async function fetchHomePage(): Promise<HomePage> {
  try {
    const response = await fetch(`${API_URL}/landing-page-content?latest=true`,{
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: HomePageFetchApiResponse = await response.json();

    if (!data.success) {
      throw new Error("Failed to fetch homepage");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching homepage:", error);
    throw error;
  }
}

export async function saveHomePage(
  homepage: Omit<HomePage, "_id">
): Promise<HomePage> {
  try {

    const formData = new FormData();
    formData.append('logo', homepage.logo);
    formData.append('heading', homepage.heading);
    formData.append('subHeading', homepage.subHeading);
    formData.append('buttonText', homepage.buttonText);
    formData.append('completionTime', homepage.completionTime);

    const response = await fetch(`${API_URL}/landing-page-content`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to save homepage");
    }

    return data.data;
  } catch (error) {
    console.error("Error saving homepage:", error);
    throw error;
  }
}