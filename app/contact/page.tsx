"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import ThumbTackIcon from "@/components/icons/ThumbTackIcon";
import BashIcon from "@/components/icons/BashIcon";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Please enter at least 2 characters for your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  message: z.string().min(10, "Please provide a message of at least 10 characters")
});

type FormData = z.infer<typeof formSchema>;

// Loading spinner component
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Glowing error message component
const GlowingErrorMessage = ({ message }: { message: string }) => (
  <p className="mt-1 text-sm text-red-400 animate-pulse">{message}</p>
);

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // This function handles the form submission
  const onSubmit = async (data: FormData) => {
    // Prevent immediate form submission
    setIsSubmitting(true);
    
    // Flash the button
    if (buttonRef.current) {
      buttonRef.current.classList.add('flash-animation');
    }
    
    try {
      // Create form data for AJAX submission
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('message', data.message);
      
      // Add FormSubmit.co configuration
      formData.append('_subject', 'Contact Form Submission');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      
      // Submit directly to FormSubmit.co's AJAX endpoint
      const response = await fetch('https://formsubmit.co/ajax/crystalseedtarot@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Form submission error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Form submission failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success !== "true" && result.success !== true) {
        console.error('FormSubmit.co error:', result);
        throw new Error(result.message || "Form submission failed");
      }
      
      // Show success message without page reload
      setSubmitted(true);
      reset();
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(`There was an error sending your message. Please try emailing directly at crystalseedtarot@gmail.com\n\nError: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
    
    return false; // Prevent default form submission
  };

  const handleSendAnother = () => {
    setSubmitted(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur" // Validate on blur for better UX
  });

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
                    priority
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

          <div className="max-w-2xl mx-auto form-container">
            {submitted ? (
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg text-center">
                <h2 className="text-2xl font-serif text-white mb-4">Thank You!</h2>
                <p className="text-white/90 mb-6">
                  Your message has been sent successfully. I'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={handleSendAnother}
                  className="bg-transparent border border-white hover:bg-white/10"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form 
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white/10 backdrop-blur-md p-8 rounded-lg space-y-6"
              >
                <div className="mb-4">
                  <label htmlFor="name" className="block text-white mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    name="name"
                    autoComplete="name"
                    className={`w-full p-2 bg-white/20 border ${errors.name ? "border-red-500 animate-pulse" : "border-white/40"} rounded text-white`}
                  />
                  {errors.name && (
                    <GlowingErrorMessage message={errors.name.message || "Name is required"} />
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-white mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    name="email"
                    autoComplete="email"
                    className={`w-full p-2 bg-white/20 border ${errors.email ? "border-red-500 animate-pulse" : "border-white/40"} rounded text-white`}
                  />
                  {errors.email && (
                    <GlowingErrorMessage message={errors.email.message || "Email is required"} />
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-white mb-2">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    name="phone"
                    autoComplete="tel"
                    className={`w-full p-2 bg-white/20 border ${errors.phone ? "border-red-500 animate-pulse" : "border-white/40"} rounded text-white`}
                  />
                  {errors.phone && (
                    <GlowingErrorMessage message={errors.phone.message || "Phone is required"} />
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-white mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    name="message"
                    rows={4}
                    className={`w-full p-2 bg-white/20 border ${errors.message ? "border-red-500 animate-pulse" : "border-white/40"} rounded text-white`}
                  ></textarea>
                  {errors.message && (
                    <GlowingErrorMessage message={errors.message.message || "Message is required"} />
                  )}
                </div>
                <div className="relative">
                  <Button
                    ref={buttonRef}
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-transparent border border-white hover:bg-white/10 disabled:opacity-50 relative"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
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
