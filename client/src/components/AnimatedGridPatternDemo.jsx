import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { Button } from "./ui/button";

export function AnimatedGridPatternDemo() {
  return (
    <div className="relative flex justify-center h-screen w-full p-2">
      <div className="z-10 whitespace-pre-wrap mt-[10rem] text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-primary">Secure.</span>{" "}
          <span className="text-primary">Simple.</span>{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Safe.
          </span>
        </h1>{" "}
        <p className="text-lg flex  md:text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-700">
          Your digital fortress in an uncertain world. Advanced encryption meets
          effortless password management for ultimate peace of mind.
        </p>
        <div className="flex flex-col justify-center mt-[2rem] sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-16 duration-700">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            Dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-white/20 hover:bg-white/10"
          >
            See How It Works
          </Button>
        </div>
      </div>
      <AnimatedGridPattern
        numSquares={900}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={9}
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
    </div>
  );
}
