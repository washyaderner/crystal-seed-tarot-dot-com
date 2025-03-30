"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import ThumbTackIcon from "@/components/icons/ThumbTackIcon";
import BashIcon from "@/components/icons/BashIcon";
import { useState, FormEvent } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      // Use FormSubmit.co API
      const response = await fetch('https://formsubmit.co/ajax/crystalseedtarot@gmail.com', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success === "true" || data.success === true) {
        form.reset();
        setSubmitted(true);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("There was an error sending your message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">
            I look forward to hearing from you!
          </h1>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-white/90 text-center mb-8">
              If you would like to schedule a reading, lesson, book an event, or
              just have a question, feel free to contact me by any of the below
              methods.
            </p>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg mb-12">
              <div className="flex flex-col items-center">
                <div className="w-full mb-6">
                  <Image
                    src="/images/About-Holly-Nicole-Laughing-2022.jpeg"
                    alt="Holly Nicole laughing"
                    width={800}
                    height={800}
                    className="rounded-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/30 hover:scale-[1.02] w-full h-auto"
                  />
                </div>
                <div className="text-center w-full">
                  <div className="space-y-4">
                    <p>
                      <Button asChild variant="ghost" size="default">
                        <a
                          href="mailto:crystalseedtarot@gmail.com"
                          className="text-white text-lg flex items-center gap-2"
                        >
                          <Mail className="h-5 w-5" />
                          crystalseedtarot@gmail.com
                        </a>
                      </Button>
                    </p>
                    <p>
                      <Button asChild variant="ghost" size="default">
                        <a
                          href="tel:5416352278"
                          className="text-white text-lg flex items-center gap-2"
                        >
                          <Phone className="h-5 w-5" />
                          Call/Text (541) 635-2278
                        </a>
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg text-center">
                <h2 className="text-2xl font-serif text-white mb-4">Thank You!</h2>
                <p className="text-white/90 mb-6">
                  Your message has been sent successfully. I'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="bg-transparent border border-white hover:bg-white/10"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-lg">
                {/* FormSubmit.co configuration */}
                <input type="hidden" name="_subject" value="New Contact Form Submission" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-white">
                    {error}
                  </div>
                )}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-white mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 bg-white/20 border border-white/40 rounded text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-white mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 bg-white/20 border border-white/40 rounded text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-white mb-2">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-2 bg-white/20 border border-white/40 rounded text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-white mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full p-2 bg-white/20 border border-white/40 rounded text-white"
                    required
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-transparent border border-white hover:bg-white/10 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <a
                  href="https://www.facebook.com/CrystalSeedTarot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <a
                  href="https://www.instagram.com/crystal_seed_tarot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <a
                  href="https://www.thumbtack.com/or/beaverton/tarot-card-readings/crystal-seed-tarot/service/89656832633660551"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  aria-label="Thumbtack"
                >
                  <ThumbTackIcon className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <a
                  href="https://www.thebash.com/tarot-card-reader/crystal-seed-tarot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  aria-label="The Bash"
                >
                  <BashIcon className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
