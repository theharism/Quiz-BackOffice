"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Save, Trash2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/hooks/use-toast"

// Define the score categories
const SCORE_CATEGORIES = [
  "TRT (Testosterone Replacement Therapy)",
  "Build (Muscle Building)",
  "Peptides",
  "Lean (Fat Loss / Lean Body)",
  "GLP1 (Glucagon-like Peptide-1)",
  "Tadalafil (Libido / Erectile Dysfunction)",
]

// Define the option schema
const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  scores: z.record(
    z.string(),
    z.number().or(
      z.string().transform((val) => {
        const parsed = Number.parseFloat(val)
        if (isNaN(parsed)) return 0
        return parsed
      }),
    ),
  ),
})

// Define the form schema
const formSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["text", "multiple-choice", "true-false", "numeric"]),
  isRequired: z.boolean().default(true),
  category: z.enum(["basic-info", "symptoms", "lifestyle"]),
  allowMultipleSelections: z.boolean().optional(),
  options: z.array(optionSchema).optional(),
})

type FormValues = z.infer<typeof formSchema>

export function QuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      questionType: "text",
      isRequired: true,
      category: "basic-info",
      allowMultipleSelections: false,
      options: [],
    },
  })

  const questionType = form.watch("questionType")
  const options = form.watch("options") || []

  // Add a new option
  const addOption = () => {
    const currentOptions = form.getValues("options") || []
    const scoreObj: Record<string, number> = {}

    // Initialize scores for all categories to 0
    SCORE_CATEGORIES.forEach((category) => {
      scoreObj[category] = 0
    })

    form.setValue("options", [...currentOptions, { text: "", scores: scoreObj }])
  }

  // Remove an option
  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options") || []
    form.setValue(
      "options",
      currentOptions.filter((_, i) => i !== index),
    )
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Here you would typically send the data to your API
      console.log("Form data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Question saved",
        description: "Your question has been saved successfully.",
      })

      // Reset form
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your question.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialize true/false options if needed
  const initializeTrueFalseOptions = () => {
    if (questionType === "true-false" && (!options || options.length === 0)) {
      const scoreObj: Record<string, number> = {}

      // Initialize scores for all categories to 0
      SCORE_CATEGORIES.forEach((category) => {
        scoreObj[category] = 0
      })

      form.setValue("options", [
        { text: "True", scores: { ...scoreObj } },
        { text: "False", scores: { ...scoreObj } },
      ])
    }
  }

  // Effect to initialize true/false options
  if (questionType === "true-false") {
    initializeTrueFalseOptions()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Create Quiz Question</CardTitle>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          Save Question
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {/* Question Text */}
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your question here..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question Type */}
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="numeric">Numeric</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Required */}
              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Required</FormLabel>
                      <FormDescription>Is this question required?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic-info">Basic Info</SelectItem>
                        <SelectItem value="symptoms">Symptoms</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Multiple Selection Option (for multiple-choice and true-false) */}
            {(questionType === "multiple-choice" || questionType === "true-false") && (
              <FormField
                control={form.control}
                name="allowMultipleSelections"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allow multiple selections</FormLabel>
                      <FormDescription>Enable users to select multiple options as their answer</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Options for multiple-choice and true-false */}
            {(questionType === "multiple-choice" || questionType === "true-false") && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Options</h3>
                  {questionType === "multiple-choice" && (
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                {options.map((option, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <FormField
                        control={form.control}
                        name={`options.${index}.text`}
                        render={({ field }) => (
                          <FormItem className="flex-1 mr-4">
                            <FormLabel>Option Text</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter option text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {questionType === "multiple-choice" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="mt-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Scores</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SCORE_CATEGORIES.map((category) => (
                          <FormField
                            key={category}
                            control={form.control}
                            name={`options.${index}.scores.${category}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">{category}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                    value={field.value || 0}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

