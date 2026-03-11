import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import { LessonClient } from "./LessonClient"

export default async function LessonPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  // Custom interactive pages
  if (['vocabulary', 'dialogue', 'ai_conversation'].includes(id)) {
      return <LessonClient id={id} initialData={null} />
  }

  // JSON driven lessons
  const contentPath = path.join(process.cwd(), "content", "block1", `${id}.json`)
  
  try {
    const fileContents = fs.readFileSync(contentPath, "utf8")
    const lessonData = JSON.parse(fileContents)
    return <LessonClient id={id} initialData={lessonData} />
  } catch (err) {
    notFound()
  }
}
