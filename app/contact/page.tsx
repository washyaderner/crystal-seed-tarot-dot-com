import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Mail, Phone, Facebook, Instagram } from "lucide-react"
import ThumbTackIcon from "@/components/icons/ThumbTackIcon"
import BashIcon from "@/components/icons/BashIcon"

export default function Contact() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">I look forward to hearing from you!</h1>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-white/90 text-center mb-8">
              If you would like to schedule a reading, lesson, book an event, or just have a question, feel free to
              contact me by any of the below methods.
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
                        <a href="tel:5416352278" className="text-white text-lg flex items-center gap-2">
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
            <form className="bg-white/10 backdrop-blur-md p-8 rounded-lg">
              <div className="mb-4">
                <label htmlFor="name" className="block text-white mb-2">
                  Name
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
                  Email
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
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full p-2 bg-white/20 border border-white/40 rounded text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full p-2 bg-white/20 border border-white/40 rounded text-white"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="bg-transparent border border-white hover:bg-white/10">
                Send Message
              </Button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-serif text-white mb-4">Follow Us</h2>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline" size="icon" className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30">
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
              <Button asChild variant="outline" size="icon" className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30">
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
              <Button asChild variant="outline" size="icon" className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30">
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
              <Button asChild variant="outline" size="icon" className="rounded-full bg-transparent border border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30">
                <a 
                  href="https://www.thebash.com/tarot-card-reading/crystal-seed-tarot" 
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
  )
}

