import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom"; // Importing Link from react-router-dom

export default function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 lg:py-10 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Link to="/" className="text-xl font-bold">
              Secura
            </Link>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/itskidus02/LockBox"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </Button>
            </a>
            <a
              href="https://www.linkedin.com/in/kidus-asebe-952a63279/"
              target="_blank"
              rel="noopener noreferrer"
            >
            <Button variant="ghost" size="icon" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Button>
            </a>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">©2024 Secura</p>
          <nav className="flex gap-2">
            <h1
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
              to="/privacy"
            >
              Made by
            </h1>
            <a
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
              href="https://itskidus.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              itsKidus95
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
