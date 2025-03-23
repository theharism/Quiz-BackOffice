"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { fetchHomePage, saveHomePage } from "@/lib/api"

// Define the form schema
const formSchema = z.object({
  logo: z.any(),
  heading: z.string().min(1, "Question text is required"),
  subHeading: z.string().min(1, "Question text is required"),
  buttonText: z.string().min(1, "Question text is required"),
  completionTime: z.string().min(1, "Question text is required"),
})

type FormValues = z.infer<typeof formSchema>

export function HomePageForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: undefined,
      heading: "",
      subHeading: "",
      buttonText: "",
      completionTime: "",
    },
  })

  useEffect(()=>{
    fetchHomePage().then((homepage) => {
      form.setValue("logo", homepage.logo)
      form.setValue("heading", homepage.heading)
      form.setValue("subHeading", homepage.subHeading)
      form.setValue("buttonText", homepage.buttonText)
      form.setValue("completionTime", homepage.completionTime)
    })
  },[])

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Create the question via API
      const firstFile = data.logo[0];

      await saveHomePage({
        ...data,
        logo: firstFile
      })

      toast({
        title: "Home Page saved",
        description: "Your home page has been saved successfully.",
      })

      // Navigate back to the questions list
      router.push("/admin/homepage")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your home page.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Home Page</CardTitle>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          Save Homepage
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {/* Homepage Text */}

            <FormField
                control={form.control}
                name="logo"
                render={({ field }) => {
                    console.log(field.value)
                    const imagePreview = typeof field.value === 'string' ? field.value : !field.value ? undefined : URL.createObjectURL(field.value[0]);
                  
                    return (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                        <FormLabel className="col-span-0 text-left">Logo</FormLabel>
                        <FormControl>
                        <div className="col-span-4 flex flex-col items-center">
                            {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="logo preview"
                                className="h-20 w-20 rounded-full"
                            />
                            )}
                            <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                field.onChange(e.target.files ? Array.from(e.target.files) : [])
                            }
                            className="mt-2"
                            />
                        </div>
                        </FormControl>
                        <FormMessage className="col-span-4 col-start-2" />
                    </FormItem>
                    );
                }}
                />

            <FormField
              control={form.control}
              name="heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heading</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your heading here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Homepage Text */}
            <FormField
              control={form.control}
              name="subHeading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Heading</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your sub heading here..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Homepage Text */}
            <FormField
              control={form.control}
              name="buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your button text here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Homepage Text */}
            <FormField
              control={form.control}
              name="completionTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Time Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your completion time text here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

