import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Private Readings",
    description:
      "Get an overview of what is going on in your life at this time. Gain insight as to how you got here and where things could be stemming from. Receive validation as to what you have been through, and confirmation of where you could be headed.",
    price: "$80/hour",
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

          <div
            id="tarot-classes"
            className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-4 md:p-8 rounded-lg mb-8 md:mb-16 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-white/15"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
                  alt="Tarot cards being spread with candlelight"
                  fill
                  className="object-cover rounded-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
                />
                <p className="text-white/60 text-xs md:text-sm mt-2 absolute bottom-0 left-0 p-2">
                  Photo credit: Dionne Krauss Photography
                </p>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-3 md:mb-4">
                  NEW!! Tarot Classes ONLINE!!!
                </h2>
                <div className="space-y-3 md:space-y-4 text-sm md:text-base text-white/80">
                  <p>
                    It's finally here! My very first online Tarot course
                    presented through Kumara Academy!!! I have been wanting to
                    get the opportunity to do online courses for years, so this
                    is a long time coming and I am very excited!
                  </p>
                  <p>
                    This online beginner's Tarot course will be 4 weeks long
                    with classes occurring every Sunday in February from 4:00 –
                    6:00 pm. No matter what level you are at with Tarot, this
                    course will help you understand the full meanings of the
                    cards, and how to work with them all together in a spread.
                    There will be lots of hands on practice through the magic of
                    breakout rooms, class material you get to keep and refer to
                    whenever you'd like, and each class will be recorded and
                    posted so you can watch them later in case you aren't able
                    to make a class.
                  </p>
                  <p>
                    The best part is: this will be one of a series of three
                    Tarot classes I'll be doing through Kumara this year! So the
                    intermediate and advanced courses will be coming later in
                    the year! If you start your Tarot journey with me now,
                    you'll be able to proceed with the rest of the courses later
                    in the year!
                  </p>
                  <p>
                    Classes start on 02/02/25. There is a coupon code also if
                    you register using the link below. Hope to see you in
                    class!!
                  </p>
                  <div className="pt-3 md:pt-4">
                    <Button asChild variant="outline">
                      <a href="/contact" className="inline-flex items-center">
                        Sign Up For Class
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
              Private Readings – $80/hour
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

            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-4">Travel Fees</h3>
            <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
              An additional travel fee will be requested for in-person events
              requiring more than 2 hours of travel time (roundtrip). Travel
              time is calculated at $30/hour. Gas is calculated at 0.67/mile
              (2024 mileage reimbursement rate).
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
