"use client"

import { useState } from "react"
import { Filter, Plus, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Sample data for prompts
const initialPrompts = [
  {
    id: 1,
    title: "Creative Story Generator",
    description: "Generate a creative short story based on a few keywords",
    promptText:
      "Write a short story that includes the following elements: [KEYWORDS]. The story should be approximately 500 words and have a surprising twist at the end.",
    niche: "Creative Writing",
    likes: 42,
    dislikes: 5,
  },
  {
    id: 2,
    title: "Technical Blog Post Outline",
    description: "Create an outline for a technical blog post",
    promptText:
      "Create a detailed outline for a technical blog post about [TOPIC]. Include an introduction, at least 5 main sections with 2-3 subsections each, and a conclusion. For each section, provide a brief description of what should be covered.",
    niche: "Technical Writing",
    likes: 38,
    dislikes: 3,
  },
  {
    id: 3,
    title: "Product Description Generator",
    description: "Generate compelling product descriptions for e-commerce",
    promptText:
      "Write a compelling product description for [PRODUCT]. The description should be approximately 200 words, highlight the key features and benefits, and include a strong call to action. The tone should be [TONE].",
    niche: "Marketing",
    likes: 65,
    dislikes: 8,
  },
  {
    id: 4,
    title: "Code Refactoring Assistant",
    description: "Get suggestions for refactoring code",
    promptText:
      "Review the following code and suggest ways to refactor it for better readability, performance, and maintainability: [CODE]. Explain your reasoning for each suggestion and provide examples of the refactored code.",
    niche: "Programming",
    likes: 87,
    dislikes: 4,
  },
  {
    id: 5,
    title: "Email Newsletter Template",
    description: "Generate a template for email newsletters",
    promptText:
      "Create a template for a [TYPE] email newsletter. Include sections for introduction, main content (at least 3 sections), and conclusion. Provide placeholder text for each section and suggestions for subject lines.",
    niche: "Marketing",
    likes: 51,
    dislikes: 7,
  },
  {
    id: 6,
    title: "Interview Question Generator",
    description: "Generate interview questions for specific roles",
    promptText:
      "Generate 10 interview questions for a [POSITION] role. Include a mix of technical questions, behavioral questions, and situational questions. For each question, provide what a good answer might include.",
    niche: "HR",
    likes: 29,
    dislikes: 2,
  },
]

// Available niches for filtering
const niches = ["All", "Creative Writing", "Technical Writing", "Marketing", "Programming", "HR"]

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [filteredPrompts, setFilteredPrompts] = useState(initialPrompts)
  const [selectedNiche, setSelectedNiche] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  // Form state for creating a new prompt
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    description: "",
    promptText: "",
    niche: "",
  })

  // Handle creating a new prompt
  const handleCreatePrompt = () => {
    const createdPrompt = {
      ...newPrompt,
      id: prompts.length + 1,
      likes: 0,
      dislikes: 0,
    }

    setPrompts([createdPrompt, ...prompts])
    setFilteredPrompts([createdPrompt, ...filteredPrompts])

    // Reset form
    setNewPrompt({
      title: "",
      description: "",
      promptText: "",
      niche: "",
    })
  }

  // Handle filtering prompts
  const filterPrompts = (niche: string, sort: string) => {
    let filtered = [...prompts]

    // Filter by niche
    if (niche !== "All") {
      filtered = filtered.filter((prompt) => prompt.niche === niche)
    }

    // Sort prompts
    if (sort === "mostLiked") {
      filtered = filtered.sort((a, b) => b.likes - a.likes)
    } else if (sort === "newest") {
      filtered = filtered.sort((a, b) => b.id - a.id)
    }

    setFilteredPrompts(filtered)
  }

  // Handle like/dislike
  const handleVote = (id: number, type: "like" | "dislike") => {
    const updatedPrompts = prompts.map((prompt) => {
      if (prompt.id === id) {
        if (type === "like") {
          return { ...prompt, likes: prompt.likes + 1 }
        } else {
          return { ...prompt, dislikes: prompt.dislikes + 1 }
        }
      }
      return prompt
    })

    setPrompts(updatedPrompts)
    filterPrompts(selectedNiche, sortBy)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Prompt Library</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Discover, create, and share effective prompts</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Prompt
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create a new prompt</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to create a new prompt. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a descriptive title"
                        value={newPrompt.title}
                        onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Brief description of what this prompt does"
                        value={newPrompt.description}
                        onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="promptText">Prompt Text</Label>
                      <Textarea
                        id="promptText"
                        placeholder="Enter the actual prompt text here"
                        className="min-h-[100px]"
                        value={newPrompt.promptText}
                        onChange={(e) => setNewPrompt({ ...newPrompt, promptText: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="niche">Niche</Label>
                      <Select
                        onValueChange={(value) => setNewPrompt({ ...newPrompt, niche: value })}
                        value={newPrompt.niche}
                      >
                        <SelectTrigger id="niche">
                          <SelectValue placeholder="Select a niche" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Niches</SelectLabel>
                            {niches
                              .filter((niche) => niche !== "All")
                              .map((niche) => (
                                <SelectItem key={niche} value={niche}>
                                  {niche}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleCreatePrompt}
                      disabled={!newPrompt.title || !newPrompt.promptText || !newPrompt.niche}
                    >
                      Save Prompt
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Niche</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {niches.map((niche) => (
                    <DropdownMenuItem
                      key={niche}
                      onClick={() => {
                        setSelectedNiche(niche)
                        filterPrompts(niche, sortBy)
                      }}
                    >
                      {niche}
                      {selectedNiche === niche && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select
              onValueChange={(value) => {
                setSortBy(value)
                filterPrompts(selectedNiche, value)
              }}
              defaultValue="newest"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="mostLiked">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedNiche !== "All" && (
            <Badge variant="outline" className="text-sm">
              {selectedNiche}
              <button
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => {
                  setSelectedNiche("All")
                  filterPrompts("All", sortBy)
                }}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{prompt.title}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{prompt.description}</p>
                  </div>
                  <Badge variant="outline">{prompt.niche}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm">
                  <p className="line-clamp-6 font-mono">{prompt.promptText}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => handleVote(prompt.id, "like")}
                  >
                    <ThumbsUp className="h-4 w-4" fill="#50C878" />
                    <span>{prompt.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => handleVote(prompt.id, "dislike")}
                  >
                    <ThumbsDown className="h-4 w-4" fill="red" />
                    <span>{prompt.dislikes}</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
              <Filter className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No prompts found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try changing your filters or create a new prompt.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">{/* Same dialog content as above */}</DialogContent>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  )
}
