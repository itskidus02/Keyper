import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom"; // Importing Link from react-router-dom

export default function Footer() {
  return (
    <footer className="w-full  py-6 md:py-8 lg:py-10 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Link to="/" className="text-xl font-bold">
              SecurePass
            </Link>
            <nav className="flex gap-4 sm:gap-6">
              <Link
                className="text-sm hover:underline underline-offset-4"
                to="/about"
              >
                About
              </Link>
              <Link
                className="text-sm hover:underline underline-offset-4"
                to="/features"
              >
                Features
              </Link>
              <Link
                className="text-sm hover:underline underline-offset-4"
                to="/pricing"
              >
                Pricing
              </Link>
              <Link
                className="text-sm hover:underline underline-offset-4"
                to="/contact"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">©2024 Lockbox</p>
          <nav className="flex gap-2">
            <h1
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
              to="/privacy"
            >
              Made by
            </h1>
            <Link
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
              to="/terms"
            >
              itsKidus95
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
