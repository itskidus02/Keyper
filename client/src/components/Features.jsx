import { Shield, Key, RefreshCw, Share2 } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Bank-Level Encryption",
      description: "Your passwords are protected with AES-256 bit encryption, the same standard used by banks."
    },
    {
      icon: Key,
      title: "Password Generator",
      description: "Create strong, unique passwords with our built-in password generator."
    },
    {
      icon: RefreshCw,
      title: "Auto-Fill & Sync",
      description: "Automatically fill in passwords across all your devices with real-time syncing."
    },
    {
      icon: Share2,
      title: "Secure Sharing",
      description: "Safely share passwords with family members or team colleagues."
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-[25rem] ">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Why Choose Our Password Manager?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2 ">{feature.title}</h3>
              <p className="text-muted-foreground font-light text-xl">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}