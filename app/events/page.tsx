import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Events | Crystal Seed Tarot",
  description: "Upcoming events, workshops, and gatherings with Crystal Seed Tarot.",
  openGraph: {
    title: "Events | Crystal Seed Tarot",
    description: "Upcoming events, workshops, and gatherings with Crystal Seed Tarot.",
  },
};

// Sample event data structure - this could be replaced with a CMS similar to blog posts
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
}

export default function Events() {
  // Sample events - to be replaced with real data
  const events: Event[] = [
    {
      id: "9",
      title: "Oregon Ghost Conference 2026",
      description: "The Oregon Ghost Conference returns March 27–29, 2026 at the Seaside Convention Center! I'm excited to announce that I'll be there this year — tickets and the full schedule are coming soon.\n\nMore details about my specific events at the conference will follow in the coming weeks. Stay tuned!\n\nIf you've never been to the OGC, it's one of the biggest annual paranormal events in Oregon, featuring guest speakers, psychic readings, paranormal vendors, breakout classes, and evening ghost hunts at the most haunted locations in town. It's always an incredible weekend and I can't wait to be part of it again this year.",
      date: new Date("2026-03-27"),
      location: "Seaside Convention Center, Seaside, Oregon",
      imageUrl: "/images/Events-Oregon Ghost Conference 2026.png",
      linkUrl: "http://www.oregonghostconference.com/",
      buttonText: "Visit Conference Site",
    },
    {
      id: "8",
      title: "The Empowered Empath (4-Week Course)",
      description: "A brand-new **4-week course** designed to help you understand and thrive as an Empath!\n\n## Course Schedule\n\n**Saturdays**: February 28, March 7, 14 & 21, 2026\n**3:00 PM – 5:00 PM PST** | Online via Zoom\n\nVideo playback will be available for anyone who can't attend a live session.\n\n## What You'll Learn\n\nThis course goes deep into what it means to live as an Empath in today's world. We'll cover:\n\n- Empathy in relationships — navigating connection without losing yourself\n- How empathic energy manifests in daily life\n- Building and maintaining healthy empathy boundaries\n- Practical tools, checklists, and journal prompts you can use every day\n\n## Pricing\n\n**$144** for the full 4-week course.\n\nUse discount code **Insta25** or **FB25** for **$25 off**!\n\n## Registration\n\nSpaces are limited — reserve your spot today!",
      date: new Date("2026-02-28T15:00:00-08:00"),
      location: "Online",
      imageUrl: "/images/Events-Empowered-Empath.jpeg",
      linkUrl: "https://www.eventbrite.com/e/the-empowered-empath-understanding-thriving-as-an-empath-tickets-1982605808343?aff=oddtdtcreator",
      buttonText: "Register for Course",
    },
    {
      id: "7",
      title: "FREE TALK: The Empowered Empath",
      description: "Join me for a **free 1-hour talk and open discussion** about what it truly means to be an Empath — and how to turn your sensitivity into your greatest strength.\n\n## What We'll Cover\n\n- What it really means to be an Empath\n- Why Empaths often feel drained and overwhelmed\n- How to reframe empathy as a powerful strength\n- Protection tools and techniques to shield your energy\n- **Live Q&A** — bring your questions!\n\n## Special Offer\n\nAll attendees will receive an **exclusive $28 discount** toward the full 4-week Empowered Empath course starting February 28th.\n\n## Event Details\n\n**Monday, February 23, 2026**\n**6:00 PM PST** | Online\n\nThis talk is completely free — come learn, share, and connect with fellow Empaths!",
      date: new Date("2026-02-23T18:00:00-08:00"),
      location: "Online",
      imageUrl: "/images/Events-Empowered-Empath.jpeg",
      linkUrl: "https://www.eventbrite.com/e/free-talk-the-empowered-empading-thriving-as-an-empath-tickets-1982735831245?aff=oddtdtcreator",
      buttonText: "Register for Free",
    },
    {
      id: "6",
      title: "Psychic Development Practice Session",
      description: "Join me for a **free monthly Psychic Development Practice Session** through Kumara Academy!\n\nThis is an open, supportive space for anyone looking to strengthen their intuitive and psychic abilities. Whether you read Tarot, Oracle cards, use pendulums, or work with any other divination modality — you're welcome here.\n\n## What to Expect\n\n- Practice readings with other students and readers\n- Receive a free reading from a fellow practitioner\n- Share techniques and learn from each other\n- All skill levels welcome — beginners and seasoned readers alike\n\n## What to Bring\n\nBring your Tarot or Oracle cards, pendulum, runes, or whatever divination tools you work with. If you don't have tools yet, that's okay too — come receive a reading and soak in the experience!\n\n## Event Details\n\n**Thursday, February 19, 2026**\n**6:00 PM PST** | Online via Kumara Academy\n\nThis event is **completely free** — no registration fee!",
      date: new Date("2026-02-19T18:00:00-08:00"),
      location: "Online - Kumara Academy",
      imageUrl: "/images/Events-Psychic-Practice-Feb-2026.jpg",
      linkUrl: "https://lp.constantcontactpages.com/ev/reg/76330aa5-3c78-4fb5-8ca2-7276d17fe32a",
      buttonText: "Register for Free",
    },
    {
      id: "5",
      title: "Intermediate–Advanced Tarot Mastery 4-Week Certification Course!",
      description: "**A 4-Week Kumara Academy Accredited Certification Course**\n\nDive into the deeper wisdom of the Tarot and elevate your readings from good… to **transformational**. Whether you're looking to strengthen your intuitive flow or refine your professional practice, this is your chance to learn from a seasoned expert with over 17 years of Tarot experience.\n\n## Course Overview\n\nTake your Tarot practice to the next level in this **Kumara Academy Accredited Certification course** taught by professional Tarot reader **Holly Cole**, who brings over **17 years of Tarot experience** and a gift for making complex spreads and symbolism come alive.\n\nWhile it's one thing to memorize the basic card meanings, it's another to weave them into insightful, accurate, and empowering readings. This 4-week live course will guide you through the deeper layers of Tarot interpretation and practical application—so you can step confidently into your power as a reader.\n\n## In this hands-on class, you will learn:\n\n- Best practices for your personal or professional Tarot work\n- Multiple methods to interpret reversed cards with nuance\n- How to transform \"unhappy ending\" cards into empowering outcomes\n- Recognizing patterns and themes that reveal the bigger picture\n- Finding and telling the \"storyline\" in any reading\n- Fresh, non-traditional interpretations for a modern age\n\n## Advanced Reading Techniques:\n\n- 6 & 7 Card Couple's Reading\n- 10 Card Celtic Cross\n- 6 Card Mini–Celtic Cross\n- 5 Card Situational Reading for decision-making\n\n## What's Included:\n\n- Printable class materials for lifelong use\n- Partner practice in every session and in between classes\n- Real-life case study examples from Holly's own readings\n- **Accredited Kumara Academy Certificate of Completion**\n- **Practitioners Certification** upon request\n\n## Course Schedule\n\n**Saturdays**, September 6, 13, 20 & 27, 2025  \n**4 PM – 6 PM PDT** (Pacific) | Online via Zoom\n\n## Special Offers\n\nUse Early-Bird Discount Promo Code **EarlyBird** for **$25** off the regular course fee. Early-Bird offer expires August 31.\n\nAfter August 31st, email kumara.academy@gmail.com for another discount code and to join the Kumara Academy email list for future course updates.\n\n## Important Details\n\n- **Limited Attendance** - Reserve your spot now!\n- Course will be recorded for those unable to attend live classes\n- No refunds unless the course is canceled by the facilitator\n- Sponsored by [Kumara Academy of Transformation](https://www.kumaraacademy.com/)\n\n**Take the first step toward Tarot mastery and transform your readings forever!**",
      date: new Date("2025-09-06"),
      location: "Online - Kumara Academy",
      imageUrl: "/images/Events-Intermediate-Advanced-Kumara.png",
      linkUrl: "https://www.eventbrite.com/e/intermediateadvanced-tarot-mastery-4-week-certification-course-tickets-1592932777819?aff=oddtdtcreator",
      buttonText: "Register for Course",
    },
    {
      id: "4",
      title: "McMenamins 25th Annual UFO Festival",
      description: "I'm thrilled to announce that I'll be offering tarot readings at the 25th Annual McMenamins UFO Festival in McMinnville, Oregon! Join me for this cosmic celebration where the veil between worlds feels just a little thinner.\n\n## About the Festival\n\nThe UFO Festival began 25 years ago to commemorate the famous 1950 Trent sighting, when a local McMinnville couple spotted a flying disc over their farm and made national news. Now in its quarter-century milestone year, this event has become one of the most beloved gatherings for both skeptics and believers alike.\n\nThis year's festival features renowned UAP experts, an alien parade, street fair, live music, costume contests, and much more. The entire downtown transforms into a celebration of cosmic curiosity and extraterrestrial wonder!\n\n## Tarot Readings with Crystal Seed Tarot\n\nI'll be offering intuitive tarot readings throughout both days of the festival:\n- **Friday, May 16th**: 3:00 PM - 8:00 PM\n- **Saturday, May 17th**: 10:00 AM - 6:00 PM\n\nMy readings at this special event blend cosmic awareness with practical guidance, perfect for those seeking answers about their path forward or connections to something beyond our ordinary understanding. Whether you're a festival regular or a curious first-timer, a tarot reading can provide unexpected insights during this unique weekend of cosmic exploration.\n\n## Booking Information\n\nReadings will be available on a first-come, first-served basis during the festival. If you'd like to reserve a specific time slot in advance, please contact me at crystalseedtarot@gmail.com with \"UFO Festival Reading\" in the subject line.\n\nLook for my booth among the vendors along 3rd Street in downtown McMinnville. I can't wait to explore the cosmic currents with you at this extraordinary gathering!",
      date: new Date("2025-05-16"),
      location: "McMenamins Hotel Oregon, 310 NE Evans St, McMinnville, OR",
      imageUrl: "/images/Events-UFO-Fest.JPG",
      linkUrl: "/contact",
      buttonText: "Book a festival reading",
    },
    {
      id: "2",
      title: "Be Love Fed!",
      description: "Love is the essence that nourishes us—in the air we breathe, the connections we share, and the gifts we give. Be Love Fed is your invitation to gather in a space where love flows freely, where you're reminded of your wholeness, and where community becomes medicine. Join me, Holly Cole of Crystal Seed Tarot, alongside WReN: Wellness ReSource Network and a vibrant roster of local practitioners for a day of soulful exploration and healing.\n\n## About the Event\n\nPresented by WReN: Wellness ReSource Network, this one‑day fair combines immersive sound healing, handcrafted herbal elixirs, and a heart‑centered marketplace. Wander through our Sound Healing Chamber, sip botanical tonics at the Elixir & Tea Bar, and discover organic skincare, crystal therapies, and more from soul-aligned vendors. Whether you're a seasoned seeker or new to holistic wellness, there's something here to nourish your body, mind, and spirit.\n\n## Tarot Readings with Holly Cole\n\nI'll be offering intuitive tarot sessions throughout the day. Receive personalized guidance, clarity, and inspiration as we explore your next steps together. To reserve your reading, email me at crystalseedtarot@gmail.com—or simply stop by the Crystal Seed Tarot booth between sessions.\n\n## Experience Highlights\n\n- **Opening Circle & Community Blessing** at 11 am\n- **Sound Healing Chamber** open all day—drop in anytime\n- **Elixir & Tea Bar** by Fehu Farm Apothecary & Natalie Olson\n- **Local Wellness Vendors** featuring herbal crafts, oracle cards, bodywork, and more\n- **Closing Circle & Angel Wash** at 5:30 pm\n\nCome to explore, to shop, to heal—or simply to be. You belong here. Let yourself be fed.",
      date: new Date("2025-05-03"),
      location: "133 SE Madison St, Portland, OR",
      imageUrl: "/images/Events-Be-Love-Fed.jpg",
      linkUrl: "/contact",
      buttonText: "Reserve a reading",
    },
    {
      id: "3",
      title: "NEW!! Tarot Classes ONLINE!!!",
      description: "It's finally here! My very first online Tarot course presented through Kumara Academy!!! I have been wanting to get the opportunity to do online courses for years, so this is a long time coming and I am very excited!\n\n## Course Details\n\nThis online beginner's Tarot course will be 4 weeks long with classes occurring every Sunday in February from 4:00 – 6:00 pm. No matter what level you are at with Tarot, this course will help you understand the full meanings of the cards, and how to work with them all together in a spread.\n\n## What's Included\n\nThere will be lots of hands on practice through the magic of breakout rooms, class material you get to keep and refer to whenever you'd like, and each class will be recorded and posted so you can watch them later in case you aren't able to make a class.\n\n## Future Classes\n\nThe best part is: this will be one of a series of three Tarot classes I'll be doing through Kumara this year! So the intermediate and advanced courses will be coming later in the year! If you start your Tarot journey with me now, you'll be able to proceed with the rest of the courses later in the year!\n\n## Registration\n\nClasses start on 02/02/25. There is a coupon code also if you register using the link below. Hope to see you in class!!",
      date: new Date("2025-02-02"),
      location: "Online - Kumara Academy",
      imageUrl: "/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp",
      linkUrl: "/contact",
      buttonText: "Sign Up For Class",
    },
    {
      id: "1",
      title: "Ghost Week!",
      description: "Join me for the first ever VIRTUAL  \nOregon Ghost Conference!\n\nIt's March which means it's time for my favorite event of the year: The Oregon Ghost Conference! The OGC is the biggest annual paranormal event in the state, going on since 2011. Although the event had to be cancelled last year due to Covid, this year they have decided to move the event online and do a VIRTUAL Oregon Ghost Conference and I could not be more excited! **(See information below for booking a reading with me)**\n\n## About the Oregon Ghost Conference\n\nIf you've never been to the OGC, it's a 3 day long round-the-clock event which takes place at the Seaside Convention Center. There is always an amazing array of guest speakers who give presentations on everything from paranormal experiences, to spirit communication, haunted history, and pretty much anything you could imagine in the realm of the paranormal and metaphysical. The entire convention center is PACKED with paranormal teams, psychics, readers, artists, pop-up shops selling creepy-jewelry, dowsing rods, crystals, oils, and anything one might need in their witchcraft pantry. Each day is also filled with break-out classes taking place in the spacious classrooms outlining the entire convention center. Here, you can take any class from How to Read Tarot Cards to Practicums on the best tools and tech gadgets to use for ghost hunting. There are usually a couple of bigger events in the evenings also for which you can purchase tickets; gallery readings with psychic mediums and real actual ghost hunts at the most haunted locations in town!\n\n## This Year's Virtual Format\n\nGranted, this year will be different. We won't be able to ghost hunt in person together, or casually stroll through the rows of eclectic vendors, but we can still have a Ghost Conference….of sorts! Rocky and his team are putting together an entire week of virtual events with many of participants of the OGC from years past, including yours truly. You can find an official line up of virtual events, including guest speakers, private readings, and even virtual classes at the link below.\n\n## Book a Reading with Me\n\n**I will be doing $30 30-minute readings during this year's first ever virtual Oregon Ghost Conference, this year titled \"Ghost Week\", in the evenings from 3/21/21 – 3/25/21, and all day on 3/26/21 – 3/28/21. If you'd like to book a reading with me, you can contact me at: crystalseedtarot@gmail.com**",
      date: new Date("2021-03-08"),
      location: "Virtual - Oregon Ghost Conference",
      imageUrl: "/images/Blog-Ghost-Week-2021.webp",
      linkUrl: "/contact",
      buttonText: "Learn more & RSVP",
    }
  ];
  
  // Sort events: upcoming first (soonest at top), then past events (newest first)
  const now = new Date();
  const sortedEvents = [...events].sort((a, b) => {
    const aUpcoming = a.date >= now;
    const bUpcoming = b.date >= now;
    if (aUpcoming && bUpcoming) return a.date.getTime() - b.date.getTime();
    if (aUpcoming) return -1;
    if (bUpcoming) return 1;
    return b.date.getTime() - a.date.getTime();
  });

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center">
            Upcoming Events
          </h1>
          
          {/* Show message if no events are available */}
          {sortedEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white text-xl">
                I'm currently planning new events! Check back soon for updates or contact me for private bookings.
              </p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/contact" className="text-white">
                    Contact me →
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Events feed */}
          {sortedEvents.length > 0 && (
            <div className="space-y-12 max-w-4xl mx-auto">
              {sortedEvents.map((event) => (
                <article 
                  key={event.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 md:frosted-card p-4 md:p-6 rounded-lg transform transition duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15"
                >
                  {/* Event image */}
                  <div className="mb-6">
                    <div className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-lg">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-all duration-300 hover:brightness-110"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  </div>
                  
                  {/* Event content */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-serif mb-3 md:mb-4 text-white">
                      {event.title}
                    </h1>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
                      <span className="text-white text-sm md:text-base font-bold">
                        <strong>Date:</strong> {format(event.date, "MMMM d, yyyy")}
                      </span>
                      <span className="text-white text-sm md:text-base font-bold">
                        <strong>Location:</strong> {event.location}
                      </span>
                    </div>
                    <div className="text-white text-sm md:text-base mb-6 prose prose-lg max-w-none text-white prose-headings:text-white prose-a:text-blue-300 hover:prose-a:text-blue-200 prose-strong:text-white">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} 
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          // Ensure headers get proper styling and stand out
                          h1: ({node, ...props}) => <h1 className="text-2xl font-serif mb-4 mt-6" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-serif mb-3 mt-5" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-serif mb-2 mt-4" {...props} />,
                          // Ensure paragraphs render with proper spacing
                          p: ({node, ...props}) => <p className="mb-4 whitespace-pre-line" {...props} />
                        }}
                      >
                        {event.description}
                      </ReactMarkdown>
                    </div>
                    <div className="flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={event.linkUrl ?? "/contact"}
                          className="text-white"
                        >
                          {event.buttonText ?? "Learn more & RSVP"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 