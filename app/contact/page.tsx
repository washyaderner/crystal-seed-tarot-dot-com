import { Button } from "@/components/ui/button"

export default function Contact() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">Contact Us</h1>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-white/90 text-center mb-8">
              If you would like to schedule a reading, lesson, book an event, or just have a question, feel free to
              contact me by any of the below methods.
            </p>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg mb-12">
              <h2 className="text-3xl font-serif text-white mb-6 text-center">Get in Touch</h2>
              <div className="text-center space-y-4">
                <p>
                  <a
                    href="mailto:crystalseedtarot@gmail.com"
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    crystalseedtarot@gmail.com
                  </a>
                </p>
                <p>
                  <a href="tel:5416352278" className="text-white hover:text-white/80 transition-colors">
                    Call/Text (541) 635-2278
                  </a>
                </p>
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
              <Button type="submit" className="bg-white/20 text-white border border-white/40 hover:bg-white/30">
                Send Message
              </Button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-serif text-white mb-4">Additional Contact Information</h2>
            <div className="space-x-4">
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

