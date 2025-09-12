import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Private Readings",
    description:
      "Get an overview of what is going on in your life at this time. Gain insight as to how you got here and where things could be stemming from. Receive validation as to what you have been through, and confirmation of where you could be headed.",
    price: "$90/hour",
    details: [
      "Can be done in person or virtually",
      "Provides a 'heads up' on areas to work on",
      "Helps create better outcomes",
    ],
  },
  {
    title: "Private Events",
    description:
      "I am available to provide Tarot services at private events such as birthday parties, corporate events, theme parties, bachelorette parties, baby showers, school events, fundraisers, and more.",
    price: "$110/hour",
    details: [
      "Readings catered to fit your event",
      "3 card readings for large-scale parties",
      "Can play along with various themes",
      "Available online or in person",
    ],
  },
  {
    title: "Tarot Lessons",
    description:
      "Get an overview of what Tarot is and the many systems within this amazing oracle. Written materials provided covering Major and Minor Arcana, resources, practices, layouts, reversals, and more.",
    price: "$50/hour",
    details: [
      "Can be done either in person or virtually",
      "Comprehensive written materials provided",
      "Learn about various Tarot systems",
    ],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen">
      <section className="py-8 md:py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 md:mb-8 text-center">
            Services
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto text-center mb-8 md:mb-12 whitespace-nowrap">
            Tarot is one of the most rewarding, memorable experiences in any setting.
          </p>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 md:mb-16">
            {services.map((service) => (
              <Card
                key={service.title}
                className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15"
              >
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-serif text-white mb-3 md:mb-4">
                    {service.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 mb-3 md:mb-4">{service.description}</p>
                  <p className="text-white font-semibold mb-3 md:mb-4">
                    {service.price}
                  </p>
                  <ul className="list-disc list-inside text-sm md:text-base text-white/80 mb-2 md:mb-4">
                    {service.details.map((detail, index) => (
                      <li key={index} className="mb-1">{detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-4 md:p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 md:mb-6">
              Pricing and Booking Information
            </h2>

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">
              What is a Tarot Reading?
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              A Tarot reading is an amazing way to better understand yourself or
              things that are happening in your life. Tarot uses an elaborate
              deck consisting of 78 cards, which all have powerful imagery,
              symbols, and meanings. As the deck is shuffled, we divinely order
              the cards to bring about your messages. A full ten-card reading
              will provide some insight into past, present and future, validates
              what you are going through, and can give you helpful information
              to help you steer your next steps in life.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              In a reading, we will both start out by taking some small steps to
              get grounded and reset our energies, and I will ask you to help me
              shuffle the cards by sending them your energy. I believe Tarot
              works best when both people are equally involved, so I encourage
              you to ask questions, confirm information, or connect the dots
              along with me. Two heads are better than one, after all.
            </p>

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">
              Private Readings – $90/hour
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Get an overview of what is going on in your life at this time.
              Gain insight as to how you got here and where things could be
              stemming from. Receive validation as to what you have been
              through, and confirmation of where you could be headed. Some
              readings can provide a 'heads up' as to what you may need to work
              on to be able to shift some energy and create better outcomes. Can
              be done in person or virtually.
            </p>

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">
              Private Events – $110/hour
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              I am available to provide Tarot services at private events
              (birthday parties, corporate events, theme parties, bachelorette
              parties, baby showers, school events, fundraisers, etc). I am more
              than happy to cater my readings to fit your event (3 card readings
              work well for large-scale parties where there are a lot of people
              to read for), and can play along with various themes upon request.
              Can be done online or in person.
            </p>

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">
              Tarot Lessons – $50/hour
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Get an overview of what Tarot is and the many systems within this
              amazing oracle. Written materials provided covering Major and
              Minor Arcana, resources, practices, layouts, reversals, and more.
              Can be done either in person or virtually.
            </p>

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">
              Rent-a-Witch Services – $110/hour + supplies cost
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-3 md:mb-4">
              Need someone to help you work some magic? Get witchy guidance and magical workings 
              to help you manifest desired outcomes, release what doesn't serve you, and feel empowered in your journey.
            </p>
            <div className="ml-4 mb-4 md:mb-6">
              <h4 className="text-lg font-serif text-white/90 mb-2">Available Services:</h4>
              <ul className="list-disc list-inside text-sm md:text-base text-white/80 space-y-1">
                <li><strong>Spell Jar Lessons:</strong> Group or individual sessions to create magical workings</li>
                <li><strong>Burn Ceremonies:</strong> Powerful burning rituals to release what doesn't serve you</li>
              </ul>
              <p className="text-sm text-white/70 mt-2">
                Previous services include: Self-Love, Money Manifestation, Self-Protection, and Create-Your-Own jar spells.
              </p>
            </div>

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">Travel Fees</h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              An additional travel fee will be requested for in-person events
              requiring more than 50 miles and 2 hours of travel time (roundtrip). Travel
              time is calculated at $30/hour. Gas is calculated at 0.70/mile
              (2025 mileage reimbursement rate).
            </p>
          </div>

          {/* Detailed Rent-a-Witch Services Description */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-4 md:p-8 rounded-lg mt-6 md:mt-8">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 md:mb-6">
              Rent-a-Witch Services
            </h2>
            
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Do you want to do something witchy but aren't sure where to start? Do you lack that one odd-ball, somewhat dark, witchy, weirdo friend and need someone to help you work some magic of some kind? May I introduce to you my new offering: Rent-a-Witch!
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              I have considered myself a witch for my entire life, since childhood. With a psychic lineage, and some badass women in the bloodline, I have played around with spell casting and general witchery since I was an adolescent. Whether you want help creating your own spell, or a lesson in how to perform various magical workings, I am happy to help however I can (within the limits of my own code of magical ethics). Magic is a great tool to harness to aid in our ability to manifest what we desire, and can help build or dispel energy to our liking, as well as making us feel empowered in our journey.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              For years, I have already offered these services but without advertising, and have helped bring some witchy fun to events like bachelorette parties, divorce parties, and even pre-teen birthday parties!
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              You can now hire me for any number of magical endeavors, including:
            </p>

            <h3 className="text-lg md:text-xl font-serif text-white mb-3 mt-6">
              Group (or individual) Spell Jar Lesson
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Let me know what kind of spell you are interested in casting and I can find or create just the right spell for you. After a brief "introduction to magick" discussion as well as an overview of the supplies we'll be working with, I'll guide you and your friends in creating your own spell jars and manifesting some magick! This activity can also be done as a create-your-own jar spell with each person free to create whatever they like for their spell jars utilizing the spell ingredients we have at our disposal. Supplies provided.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Previous jar spells I've done include Self-Love Jar Spell, Money Manifestation Jar Spell, Self-Protection Jar Spell, and "Create-Your-Own" Jar Spells.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              <strong>Pricing:</strong> $110/hour + supplies cost (and travel fees if applicable).
            </p>

            <h3 className="text-lg md:text-xl font-serif text-white mb-3 mt-6">
              Group (or individual) Burn Ceremony
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Get rid of that which does not serve you with a powerful burning ceremony. Can be done in a firepit or via my cauldron (yes, it's a travel cauldron). After cleansing our energy with Palo Santo or essential oils, we'll discuss the power of the element of fire and the intention of the burn ceremony. You'll then be guided to write down the things which no longer serve you or your life, and together we'll tear each item off of our individual burn lists, one-by-one, and cast them into the fire, sending these negative thoughts, patterns, behaviors, past traumas, and pain back to the universe, thus freeing up a layer of our energy to attract that which would serve us better at this present time in our lives. This is a powerful way to reset your energy, navigate difficult changes or transitions, set boundaries, cast out negative energies from your life, take a layer of emotional pain off, and can massively aide in your healing journey.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              <strong>Pricing:</strong> $110/hour + supplies cost (and travel fees if applicable)
            </p>

            <h3 className="text-lg md:text-xl font-serif text-white mb-3 mt-6">
              Group (or individual) Burn Ceremony with Tarot Card Pull
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Infuse your burn ceremony with wisdom from the Tarot. Each person will be given the chance to select one Tarot card to learn more about that which they may need to let go of, heal, or release. I will interpret the card for each person in a "shadow reading to learn more about which no longer serves us so that we may include those things in what we burn. This can also be done as a 3 Card reading for each person if preferred.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              <strong>Pricing:</strong> $125/hour + supplies (and travel fees if applicable)
            </p>

            <h3 className="text-lg md:text-xl font-serif text-white mb-3 mt-6">
              Pre-Teen, Teen, or Adult Witch Lesson + Jar Spell + Tarot Card Reading
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Want to add a little magic, self-empowerment, and uniqueness to your party or event? Why not have a Witch lesson taught by yours truly? I'll bring an assortment of crystals, spell making supplies, witchy books to explore, Oracle cards to play with, and other magickal goodness to help craft a one-of-a-kind event just for you! I'll introduce you and your friends to the energies of plants, crystals, and other natural items to help you each create your own jar spells, and give all party-goers a 3 card Tarot reading.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              <strong>Pricing:</strong> $125/hour + supplies (and travel if applicable)<br />
              6 People total - 2 hours (1 hour of witch lesson/jar spell + 1 hour of Tarot reading)<br />
              10 People total - 3 hours (1 hour of witch lesson/jar spell + 2 hours of Tarot reading)
            </p>

            <h3 className="text-lg md:text-xl font-serif text-white mb-3 mt-6">
              Energy Clearing (of a space)
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Have a space that just doesn't feel right or that needs some energetic cobwebs cleared out? I am happy to come cleanse the energy of your space using either Palo Santo, Sage, or essential oil spray to reset and cleanse the space. I will also infuse the space with Reiki to empower the space with safe, healing, and balanced energy.
            </p>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              <strong>Pricing:</strong> $75/hour (+ travel fees if applicable)
            </p>

            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              Have a witchy need or idea that you don't see listed here? Feel free to reach out and let's see if we can collaborate to achieve your witchy goals!
            </p>
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <h3 className="text-xl md:text-2xl font-serif text-white mb-2">
              Payment Methods
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-white/90">
              Apple Pay, Cash, Check, Credit card, PayPal, Square cash app,
              Venmo, and Zelle
            </p>
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/contact" className="text-white">Book a Service</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
