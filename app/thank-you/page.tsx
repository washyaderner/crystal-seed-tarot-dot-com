import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <div className="text-center max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-lg mt-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">
              Thank You!
            </h1>
            
            <p className="text-white/90 text-lg mb-8">
              Your message has been sent successfully. I'll get back to you as soon as possible.
            </p>
            
            <Button asChild className="bg-transparent border border-white hover:bg-white/10">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 