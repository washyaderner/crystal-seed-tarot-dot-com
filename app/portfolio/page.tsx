"use client"

import Image from "next/image"

const portfolioItems = [
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/bachelorette-party-portland.webp?w=564",
    caption: "Bachelorette party, rental house, Portland, OR",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/11-yo-birthday-party.webp?w=564",
    caption: "Witch-themed 11th B-day party, Portland, OR",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/14-yo-birthday-party.jpeg?w=564",
    caption: "14th B-day party, Lake Oswego, OR",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/rosey-award-overhead-shot-2017.webp?w=564",
    caption: "The Portland Rosey's 2017 – Advertising Awards – Portland, OR",
    isLandscape: true,
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/bachelorette-party-house-boat-2021.jpg?w=959",
    caption: "Bachelorette Party, House Boat, Vancouver, WA",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/next-adventure-work-party-2023.jpg?w=768",
    caption: "Next Adventure\nEmployee Party 2023\nPortland, OR",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2023/01/sdf-collective-halloween-2022.jpg?w=768",
    caption: "Halloween Event 2022\nSDF Collective\nGresham, OR",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2025/02/img_8190.jpeg?w=683",
    caption: "2024 End of Year Vendor Party\nEvergreen Event Center",
    credit: "Photo credit: Dionne Krauss Photography",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2025/02/img_8194.jpeg?w=683",
    caption: "2024 End of Year Vendor Party\nEvergreen Event Center",
    credit: "Photo credit: Dionne Krauss Photography",
  },
  {
    image: "https://crystalseedtarot.com/wp-content/uploads/2025/02/img_9538.jpeg?w=750",
    caption: "Goth Wedding at the Benson Hotel 2024",
    isLandscape: true,
  },
]

const reviews = [
  {
    name: "Gina G.",
    date: "Jan 13, 2025",
    body: "Holly came to the house last night to read for me and my partner. Our experience was thoroughly positive. Holly's pre-event communications with me were engaging and positive. She was very kind and sensitive to my ADHD—I was late in responding several times and in answering the door for her! She was unbothered and validating each time and that gave me extra comfort with her. When she arrived, she set up beautifully and seamlessly—a total pro! She was genuinely engaged and spirited about our readings. She delivered information clearly and confidently, which inspired our trust. We both felt comfortable, open and vulnerable to share and receive. Overall, it was the very best experience we could have had with our readings and we are extremely grateful to Holly. I highly recommend hiring her for an awesome date night reading.",
    details: "Don't have prior experience • 2 people • 60 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Madison W.",
    date: "Nov 9, 2024",
    body: "Holly was amazing! I felt bad because the wedding was a bit chaotic and busy, but she rolled with it flawlessly. She created such a comfortable, calming atmosphere during the reading and everyone could tell she was the real deal. Thank you so much Holly!!",
    details: "Have prior experience • Small group • 90 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Patrick W.",
    date: "Feb 15, 2024",
    body: "I reached out to Holly to ask about her working our company holiday party and she was extremely responsive and easy to work with. Once the party night arrived, Holly was ready to go at our agreed upon time and provided a great atmosphere and experience for our team. Everyone who received readings from her enjoyed their time. I hight recommend her services, and will be looking for an opportunity down the line to hire her again.",
    details: "Have prior experience • Small group • 15 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Angela H.",
    date: "Nov 20, 2024",
    body: "So much fun! It was a great way to get to know your friends more and such a fun girls night!",
    details:
      "Tarot Card Reading • Palm Reading • Fortune Telling • Astrology Reading • Other (e.g., Crystal Ball/Pendulum) • Special Event / Party / Other • 1 - 20 guests • 31 - 50 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
  },
  {
    name: "Amee C.",
    date: "Oct 31, 2023",
    body: "OMG, I cannot try and convince you to hire Crystal MORE. I have used her for two years now and intend you again and again. My guests LOVE getting their cards read by her and her interpretations are spooky spot on. No matter the theme, no matter the request she always seems to be able to deliver. Thank you Crystal for being such a fun addition to our annual scholarship fundraiser! We are blessed by you.",
    details:
      "Tarot Card Reading • Palm Reading • Fortune Telling • Special Event / Party / Other • 21 - 50 guests • 18 - 30 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
  },
  {
    name: "Tandy W.",
    date: "Oct 9, 2023",
    body: "I had a party and Crystal came and read for about 40 people for 3 1/2 hours. Everyone loves the opportunity and experience. Many were skeptical but did it since it was part of the party vibe and were very surprised by the reading and the outcome. Some guests even reported. Early crying because the reading was so accurate and helped them so much. Crystal was easy and fun and made herself comfortable. She set the space and had a system to filter guests through that was easy. It was well worth the money and I would definitely do this again. If you want a unique experience hire Crystal. 5 stars all the way.",
    details:
      "Palm Reading • Tarot Card Reading • Special Event / Party / Other • 21 - 50 guests • 31 years old and older • Need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
  },
  {
    name: "Lisa R.",
    date: "Jan 22, 2021",
    body: "This was my first experience with Tarot reading. I'm just beginning my journey of finding my way back to myself. I had a great conversation with Holly before we made the appointment. She gave me several great resources to look into right off the bat. And I did. I've learned so much from her already and I feel very prepared to explore my areas of energy and self healing. I'll be a regular customer for sure. The appointment doesn't have any time constraints so she's willing to give you what you need and not have time restrictions. She's great!",
    details: "Alternative Healing",
    reply:
      "Thanks so much Lisa! I look forward to our future readings and conversations! And I'm excited for your journey into the world of metaphysics and self healing! 💚",
  },
  {
    name: "Georgie K.",
    date: "Sep 22, 2023",
    body: "We hosted a crystal themed birthday party and had Holly do individual and couples readings in a private area during the event. Everyone absolutely loved it!! Thank you again for your professionalism and added fun spirit!",
    details:
      "Tarot Card Reading • Palm Reading • Fortune Telling • Birthday party • 21 - 50 guests • 31 - 50 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      "Thank you so much Georgie! I thoroughly enjoyed getting to be part of the crystal party! Awesome group of people!",
  },
  {
    name: "Kristi D.",
    date: "May 8, 2024",
    body: "Very accommodating, entire party had a great experience",
    details:
      "Tarot Card Reading • Palm Reading • Fortune Telling • Astrology Reading • Birthday party • 1 - 20 guests • 18 - 30 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply: "Thank you so much Kristi! I had a lovely time getting to read for all of you!",
  },
  {
    name: "Michelle C.",
    date: "May 23, 2023",
    body: "Such a great addition to our wedding. Guest kept approaching us and telling us what an amazing reading they had. Professional, fun and friendly. Highly recommend for your party or wedding.",
    details:
      "Tarot Card Reading • Wedding • 51 - 100 guests • 18 years old and older • Need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply: "Thank you so much Michelle! I'm so grateful to have been part of such an amazing wedding! 🤩",
  },
  {
    name: "Danika D.",
    date: "May 1, 2022",
    body: "I planned the time for my mother, sister and myself to have a reading as part of an event. The experience exceeded out expectations and created a really positive memory for the three of us. Thank you for your insights, help, and for creating such a fantastic effect for us!",
    details:
      "Tarot Card Reading • Fortune Telling • Astrology Reading • Other (e.g., Crystal Ball/Pendulum) • Special Event / Party / Other • 1 - 20 guests • 31 years old and older • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      "Thank you so much for allowing me to be part of such a special day! I truly enjoyed getting to read for all of you!",
  },
  {
    name: "Lipi M.",
    date: "Jan 18, 2022",
    body: 'I had a great experience because she was excellent at explaining what the cards actually mean and then narrowed it to what it meant in my reading . Which was very helpful . She was patient , and supportive. I think for a tarot card reader , the way they present the reading is very crucial , and Holly doesn\'t exactly that. As the receiver , it was nice to not hear " a dead end " analogy rather know that " it\'s the energy that\'s speaking to us " . See ya soon !',
    details:
      "Don't have prior experience • 1 person • 60 minutes • At the pro's location • My home, venue, etc. • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply:
      "Thank you for your heartfelt and thorough review, Lipi! I appreciate your feedback immensely! Take care until the next time we meet!",
  },
  {
    name: "Suzanne D.",
    date: "Jan 1, 2022",
    body: "Outstanding!! Holly came for my NYE party and did readings for the adults & a few kids. She made the party so special and everyone had a NYE party to remember. I will definitely hire her again.",
    details:
      "Tarot Card Reading • Palm Reading • Astrology Reading • Special Event / Party / Other • 1 - 20 guests • 31 - 50 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      "Thank you so much Suzanne! You have such lovely family and friends! I especially loved getting to read for the kids, so adorable!",
  },
  {
    name: "Veronica P.",
    date: "Oct 28, 2021",
    body: "Holly was amazing! She is incredibly sweet and understanding. She explained things very well and made me feel so comfortable during the reading. I highly recommend her to anyone!",
    details: "Have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Alex B.",
    date: "Sep 20, 2021",
    body: "Holly was super professional and even came to us for a bachelorette party we had! We all enjoyed her vibe and personality! I would definitely recommend booking her!",
    details: "Don't have prior experience • Small group • 30 minutes • At the pro's location • My home, venue, etc.",
    type: "Tarot Card Reading",
    reply: "Thank you so much, Alex! I had a fabulous time getting to read for you all! Hope the wedding is amazing!",
  },
  {
    name: "Polly Z.",
    date: "Sep 15, 2021",
    body: "As an event professional, I highly recommend Crystal Seed Tarot for your events. She was the hit of my birthday party, and connected with every guest during their readings in a meaningful way that left lasting impressions. She was responsive, kind and FUN - I'll be hiring her again for more parties in the future.",
    details:
      "Astrology Reading • Other (e.g., Crystal Ball/Pendulum) • Tarot Card Reading • Fortune Telling • Birthday party • 51 - 100 guests • 31 years old and older • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      "Thank you so much, Polly! I had an amazing time at your astrology party! What a fun crowd and fantastic party! I look forward to our paths crossing again in the future!",
  },
  {
    name: "Lauren S.",
    date: "Aug 22, 2021",
    body: "She was amazing! Kind, flexible, enthusiastic, and on time! I loved her energy and the girls and I enjoyed her expertise at our bachelorette party. Would definitely use her again.",
    details:
      "Astrology Reading • Tarot Card Reading • Palm Reading • Fortune Telling • Special Event / Party / Other • 1 - 20 guests • 18 - 30 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      'Thank you so much Lauren! I had an amazing time getting to be part of your fantastic party ("The Witch is Getting Hitched" is the best bachelorette theme I think I\'ve ever seen)! 🔮 great group of witchy women! 💜',
  },
  {
    name: "Brian M.",
    date: "Jun 30, 2021",
    body: "I wish I could select more than three highlights because then it would actually embody the entire experience. Holly was excellent and encouraged me to express myself so that we could corroborate on understanding the cards. Too many people assume tarot is a fortune reader but there requires honesty in self to truly understand and Holly is excellent at bringing this out. She will be my tarot reader going forward.",
    details: "Have prior experience • 1 person • 60 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Kylie F.",
    date: "Jun 16, 2021",
    body: "This was my first professional tarot reading, and I'll definitely be returning for future readings! From the very beginning, the reading was spot on and resonated with what's going on in my life perfectly. Holly was super friendly and did an excellent job walking me through the cards. I never felt like she was making generalities, and I really felt that the reading was tailored to me and my life. I highly recommend for anyone seeking guidance, clarification, or affirmation!",
    details:
      "Have prior experience • 1 person • 30 minutes • Remotely (phone or internet) • At the pro's location • My home, venue, etc.",
    type: "Tarot Card Reading",
    reply: "Thank you so much Kylie! 💜",
  },
  {
    name: "Dina Y.",
    date: "Jun 4, 2021",
    body: "She was awesome! Made us feel very comfortable. She had a great sense of humor and was very personable. Will definitely use her again!",
    details: "Don't have prior experience • 1 person • 30 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Julie D.",
    date: "May 22, 2021",
    body: "I had such an amazing reading with Holly. It's not just her work quality, but also by her spirit, you can tell she is genuine, and is trying to help. I had gain so much clarity and confidence from my reading. She was honest, upbeat, patient, and did not rush the reading at all. She was also responsive, communicates well, and if you do a zoom reading, you also get pictures of your card spreads. I highly recommend her for anyone who is in need of a reading and I will also be reaching out to Holly for my future ones!",
    details: "Have prior experience • 1 person • 60 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply:
      "Thank you so much Julie! I immensely appreciate your kind words and very much am looking forward to our next reading 💜 Keep kicking a** in the meantime! 🙌🏻",
  },
  {
    name: "Elsa L.",
    date: "Apr 3, 2021",
    body: "It seemed meant to be the minute I opened up to Holly. She lead me through the whole reading and was patient enough to answer my follow up questions She was able to analyze all perspectives but tune into the messages that really mattered. Thank you again!",
    details: "Have prior experience • 1 person • 60 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Drew D.",
    date: "Nov 18, 2019",
    body: "Really enjoyed our reading. Extremely thorough and patient - and we were astounded on how accurate it was. Would highly recommend!!!!",
    details: "Don't have prior experience • 2 people • 15 minutes • At the pro's location",
    type: "Tarot Card Reading",
  },
  {
    name: "Katerina M.",
    date: "Oct 15, 2019",
    body: "Holly was amazing. I instantly fell in love with her. She definitely brought entertainment-value to my Phantom of the Opera party. Holly was so friendly, affable, flexible and so perfect in her role. Aside from bringing another level of entertainment to the evening, my friends and I were blown away by her readings. She was spot on and so perceptive. Holly is a true intuitive, old soul and so passionate at what she does. She gave each of us the time that was needed. Even some of our skeptic husbands were left pondering over what transpired and now lean towards being believers in her. She also had no problem welcoming in the curious little ones for a reading. It really inspired them and brought smiles to their faces. Holly is gifted and genuine. I would recommend her in a heartbeat. I definitely plan to book her again for future occasions. p.s. Holly even took the time to go above and beyond by summarizing everyone's readings in written format so that we can reflect and not forget the details.",
    details:
      "Tarot Card Reading • Fortune Telling • Other (e.g., Crystal Ball/Pendulum) • Birthday party • 1 - 20 guests • 31 - 50 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
  },
  {
    name: "Michelle A.",
    date: "Oct 3, 2016",
    body: "Holly was excellent, she responded to my email inquiry, and we scheduled a reading. She was extremely likeable person!! We instantly connected, and I will definitely call her for another reading. Thank you Holly!!",
    type: "Tarot Card Reading",
  },
  {
    name: "Andrew T.",
    date: "Mar 14, 2012",
    body: "Holly was amazing. My friends and I all received a great reading and had a wonderful experience with Holly. She was professional, engaging, approachable and friendly. I would recommond her to anyone and will see her again for future readings.",
    type: "Tarot Card Reading",
  },
  {
    name: "Wynne S.",
    date: "Nov 17, 2011",
    body: "I give this experience a five star rating for a variety of reasons. Holly was easy to get in touch with. She responded quickly to my emails and then gave me her phone number. She was also willing to chat via text message prior to voice contact which made things really easy. Holly has a friendly personality. She is talkitive but also a really open listener. She did an amazing job at reading for me and my wife. I was stunned when she began my reading because she started saying things about my life issues that nobody just guesses. Another reason she deserves a five star rating is because of her pricing. She was really reasonable with the cost of her service and she could be charging more. I give her props for reasonable pricing. I did tip her big though. Thanks Holly-",
    type: "Tarot Card Reading",
  },
  {
    name: "Chioma u.",
    date: "Jun 23, 2021",
    body: "did a birthday reading over zoom and she was very good at explaining and answering my questions about our session before and during.",
    details: "Don't have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Marie Y.",
    date: "Apr 25, 2022",
    body: "She was fantastic! Everyone at party really enjoyed talking with her. She was a hit.",
    details:
      "Tarot Card Reading • Palm Reading • Special Event / Party / Other • 21 - 50 guests • 31 - 50 years old • Need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply: "Thank you Maria! I had a fantastic time getting to read for everyone and meeting so many wonderful people!",
  },
  {
    name: "Sharr S.",
    date: "Dec 12, 2021",
    body: "She did a reading for everyone at the holiday party. They loved it!",
    details:
      "Tarot Card Reading • Palm Reading • Special Event / Party / Other • 1 - 20 guests • 31 - 50 years old • Don't need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
  },
  {
    name: "Michelle S.",
    date: "Aug 24, 2021",
    body: "Thanks for reading for me and helping me gain clarity. I will definitely work towards my future happiness.",
    details: "Don't have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply: "Thank you Michelle! Sending you and your future all the good energy!",
  },
  {
    name: "Fatima I.",
    date: "May 28, 2021",
    body: "Very profesional and felt all positive vibes from her .",
    details: "Don't have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply: "Thank you so much! 💜💜💜",
  },
]

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 text-center">Portfolio</h1>

        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl text-white/90">
              Here are a few of the amazing parties and events I've done Tarot at over the years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min mb-16">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-md p-4 rounded-lg ${
                  item.isLandscape ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.caption}
                  width={item.isLandscape ? 800 : 564}
                  height={item.isLandscape ? 450 : 564}
                  className="rounded-lg mb-4 w-full h-auto object-cover"
                />
                <p className="text-white/90 text-center whitespace-pre-line">{item.caption}</p>
                {item.credit && <p className="text-white/70 text-sm text-center mt-2">{item.credit}</p>}
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-white mb-2">Top Pro status on Thumbtack</h2>
            <p className="text-xl text-white/90">
              Top Pros are among the highest-rated, most popular professionals on Thumbtack.
            </p>
          </div>

          <div className="border-t border-white/20 pt-12 mt-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-8 text-center">Client Reviews</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
                  <h3 className="text-xl font-serif text-white mb-2">{review.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{review.date}</p>
                  <p className="text-white/90 mb-4">{review.body}</p>
                  {review.details && <p className="text-white/70 text-sm mb-2">Details: {review.details}</p>}
                  {review.type && <p className="text-white/70 text-sm mb-4">Type: {review.type}</p>}
                  {review.reply && (
                    <div className="bg-white/5 p-4 rounded-lg mt-4">
                      <p className="text-white/90 italic">Crystal Seed Tarot's reply:</p>
                      <p className="text-white/80 mt-2">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

