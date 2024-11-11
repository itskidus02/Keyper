import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"; // Importing Link from react-router-dom

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
      <div className="absolute rotate-12 rounded bg-accent px-2 text-sm">
        Page Not Found
      </div>
      <Button asChild className="mt-8">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  )
}