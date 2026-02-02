"use client";

import Image from "next/image";

const reviews = [
  {
    name: "Elizabeth S.",
    date: "Oct 4, 2025",
    body: "Holly was an absolute delight to have at our wedding weekend welcome dinner, and my spouse and I are SO glad we decided to book her to read tarot for us and our guests! Her in-depth, expert tarot readings were thoughtful, personal, and heartfelt, and absolutely never rushed. Our guests (and us!!) came away from Holly's readings feeling inspired and revitalized—and with some conversational Holly knew exactly how to communicate with guests who already knew a ton about tarot, as well as those who knew absolutely nothing about it. She also went above and beyond by creating an attractive and atmospheric space at the table where she was set up, and was just overall so lovely to work with. We couldn't be happier with our choice to hire her for our party, and we highly recommend others do the same!",
    type: "Tarot Card Reading",
  },
  {
    name: "Ashly M.",
    date: "Aug 5, 2025",
    body: "Holly was wonderful! Very warm, kind, & professional. All of our guests were very impressed with her and her way of being. She had such an ease of making everyone feel comfortable before, during and after each reading. We definitely will ask to be at our next event. Thank you Holly!",
    type: "Tarot Card Reading",
    reply: "Thank you so much Ashly! I so look forward to getting to see you all again! What an amazing family, friend group, and party! You guys have great taste in everything!",
  },
  {
    name: "Cason W.",
    date: "Jul 17, 2025",
    body: "Crystal Seed Tarot was the perfect addition to my birthday celebration! I had never had a reading before and they walked me through everything and were so nice and sooooo great with the chaos of the party around! Then I added an extra two hours and no complaints or hesitation! 1,000% would hire again!! Vibes were 10/10!!!",
    type: "Tarot Card Reading",
    reply: "Thank you Cason! The vibes were amazing at your party! Hope we can connect again someday.",
  },
  {
    name: "Melissa S.",
    date: "Jun 9, 2025",
    body: "Holly was great! We had her and another tarot reader for our daughter's high school graduation party. The teens really enjoyed talking with Holly and gaining some insights on their lives. We would definitely use Holly again.",
    type: "Tarot Card Reading",
  },
  {
    name: "Arin C.",
    date: "Apr 21, 2025",
    body: "Holly Cole was incredible!!! not only was she so kind she was so prepared and dressed to the nines for our event!! people left in tears and screaming that they loved her and knew what to do with their life now. we will definitely bring her back for any event we have and you should too! Thank you Holly for your kindness and positivity and greeting our customers and making them feel seen and heard! we had so much fun with you and you are so talented!",
    type: "Tarot Card Reading",
    reply: "Thank you so much for this glowing feedback! Stop making me blush! I had such an amazing time getting to be part your event and connecting with all the fantastic people I got to read for. Can't wait to see you all again next time!!!",
  },
  {
    name: "Gina G.",
    date: "Jan 13, 2025",
    body: "Holly came to the house last night to read for me and my partner. Our experience was thoroughly positive. Holly's pre-event communications with me were engaging and positive. She was very kind and sensitive to my ADHD—I was late in responding several times and in answering the door for her! She was unbothered and validating each time and that gave me extra comfort with her. When she arrived, she set up beautifully and seamlessly—a total pro! She was genuinely engaged and spirited about our readings. She delivered information clearly and confidently, which inspired our trust. We both felt comfortable, open and vulnerable to share and receive. Overall, it was the very best experience we could have had with our readings and we are extremely grateful to Holly. I highly recommend hiring her for an awesome date night reading.",
    details:
      "Don't have prior experience • 2 people • 60 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Deanna P.",
    date: "Dec 16, 2024",
    body: "Holly was absolutely amazing! We hired her for a company holiday party and the feedback received throughout the event were all raving reviews. She was set up in a side room to separate from the loud music and party noise and repeatedly people would be seen leaving the room with huge smiles on their faces, rushing to discuss the reading with their friends. I would absolutely recommend. She has incredible talent.",
    type: "Tarot Card Reading",
    reply: "Thank you so much Deanna! I had a wonderful time getting to meet and read for so many amazing people! Way to throw a fantastic party!",
  },
  {
    name: "Madison W.",
    date: "Nov 9, 2024",
    body: "Holly was amazing! I felt bad because the wedding was a bit chaotic and busy, but she rolled with it flawlessly. She created such a comfortable, calming atmosphere during the reading and everyone could tell she was the real deal. Thank you so much Holly!!",
    details:
      "Have prior experience • Small group • 90 minutes • My home, venue, etc.",
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
    name: "Amy S.",
    date: "Oct 31, 2024",
    body: "Holly from Crystal Seed Tarot was absolutely amazing! She made everyone very comfortable, explained her process and even went the extra mile when some readings went long to make sure everyone who wanted to participate had a chance to have their cards read. Everyone at our function was impressed and had an incredible time. We can't recommend hiring Holly enough!",
    type: "Tarot Card Reading",
    reply: "Thank you so much Amy! I had a blast getting to read for your office Halloween party! Love what a fun group of people you have! Thank you for having me!",
  },
  {
    name: "Brittney L.",
    date: "Sep 30, 2024",
    body: "Holly was absolutely incredible! Not only did she match her set up to the vibe/theme of the bachelorette wedding weekend, her reading's were incredibly intimate and accurate for the whole party. Our entire party including the bride and maid of honor felt like their readings really brought up some deep personal experiences and current feelings. Most of our fellow ladies were in tears listening to each others reading, and Holly was incredibly sensitive and supportive to each of us. She guided us through every step, asked if we had questions, and made real connections with all of us. HIGHLY recommend her!!! Thank you again for a truly touching experience!",
    type: "Tarot Card Reading",
    reply: "Thank you so much Brittney! I had a truly lovely authentic connection with each of you and am grateful for the time we got to share together. Thank you for including me in such a wonderful lifelong memory! I look forward to our paths crossing again in the future!\n-Holly",
  },
  {
    name: "Elaine L.",
    date: "Aug 14, 2024",
    body: "Holly was extremely accommodating and a wonderful tarot reader! She did an amazing job at our wedding and folks were clamoring to get a reading from her. We really appreciate her going above and beyond (showing up to our event even though she was losing her voice!). Holly was an absolute hit at our wedding and we couldn't have imagined our day without her :)",
    type: "Tarot Card Reading",
    reply: "Thank you so much Elaine and Bradley for having me at your fun, vibrant, and colorful wedding! I had a fantastic time getting to read for your guests. What a fun group of family and friends you have! Congrats again and all the best to you both & your future!",
  },
  {
    name: "Patrick W.",
    date: "Feb 15, 2024",
    body: "I reached out to Holly to ask about her working our company holiday party and she was extremely responsive and easy to work with. Once the party night arrived, Holly was ready to go at our agreed upon time and provided a great atmosphere and experience for our team. Everyone who received readings from her enjoyed their time. I hight recommend her services, and will be looking for an opportunity down the line to hire her again.",
    details:
      "Have prior experience • Small group • 15 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Briita V.",
    date: "Dec 4, 2023",
    body: "Holly was amazing. We had her come and do tarot readings for our wedding and we got nothing but rave reviews from everyone. She was also so quick to help us find another reader to come as well who was also so great! We felt energized by what she read off to us and ready for what's coming. Thanks again Holly!!",
    type: "Tarot Card Reading",
    reply: "Hi Briita! Thank you so much for your kind review! What an absolutely lovely wedding and fun people! So glad my friend and I (Li'l Wolf Tarot was the other reader, she's also on The Bash) we're able to be part of your magical day! Thank you again!",
  },
  {
    name: "Dawn S.",
    date: "Oct 16, 2023",
    body: "Amazing how Holly can both read my mind about the past and present, while shining a light on pathways forward. She had such a calm, worldly and kind demeanor and I instantly felt comfortable and at ease around her. I received my reading quickly and it was very thorough. It helped me to see my situation from a different perspective, rather than trying to understand it through my own eyes. I have already recommended Holly to those who have asked me about a tarot reader, and I will continue to do so! Would definitely hire again. All my reception party guests raved about their readings and overall experience. Very impressive.",
    type: "Tarot Card Reading",
    reply: "Thank you so much Dawn! I had such a wonderful time getting to be part of your wedding day! Lovely friends and family you all have, loved getting to read for everyone. Cheers to you guys and your new chapter!",
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
    name: "Erica E.",
    date: "Sep 24, 2023",
    body: "Holly did an amazing job making our party and unforgettable event. Everyone who met with her was super impressed and she even did readings for the kids, which they were fascinated by.",
    type: "Tarot Card Reading",
    reply: "Thank you so much for your feedback, Erica! I absolutely loved getting to read for so many clever and precocious kids! Great party and group of awesome parents! Thank you for letting me a part of it!",
  },
  {
    name: "Hilary U.",
    date: "Jun 26, 2023",
    body: "We had such a great experience with Holly! She came to my bachelorette party to give readings throughout the day to those who wanted one. She was punctual, professional, & personable. I especially appreciated how accommodating she was - I gave her a heads up beforehand that it was a pool party, and she was totally fine to set up poolside and roll with the vibe.",
    type: "Tarot Card Reading",
  },
  {
    name: "Jennifer S.",
    date: "Jun 25, 2023",
    body: "Holly was superb!",
    type: "Tarot Card Reading",
  },
  {
    name: "Connor C.",
    date: "Feb 2, 2023",
    body: "Holly is amazing! This was a last-minute holiday party for our staff to celebrate getting through the business winter season. Holly was super flexible, and accommodating. She brought a peaceful, fun energy to our party. More employees wanted a chance to talk with Holly, so she stayed longer than was asked. I appreciated her wiliness to stay and have fun with our employees. She was a hit! We will definitely have Holly again :)",
    type: "Tarot Card Reading",
    reply: "Thank you so much for your positive feedback! I had such a blast getting to read for so many lovely people! What a fun, varied, and interesting group of people to get to work with! I would love to be part of your celebrations again in the future!",
  },
  {
    name: "Lisa R.",
    date: "Nov 20, 2022",
    body: "Our teenagers loved their readings. They all said she was right on and they had a blast! Would definitely recommend Crystal Seed Tarot.",
    type: "Tarot Card Reading",
    reply: "Thank you so much Lisa! Such an awesome group of young ladies to get to read for!",
  },
  {
    name: "Bree R.",
    date: "Jun 29, 2022",
    body: "She was great and I plan on making an appointment with her when we get back home. She made the party enjoyable.",
    type: "Tarot Card Reading",
  },
  {
    name: "Cara M.",
    date: "Mar 13, 2022",
    body: "This was an awesome addition to our Barrister's Ball formal. She was professional, showed up early, was very personable, and gave great readings. Our event had over 350+ people and she was very accommodating for the max number of people possible. We will definitely reach out in the future for similar events, thank you!",
    type: "Tarot Card Reading",
    reply: "Thank you so much for your feedback, Cara! I had a blast at the Barrister's Ball and look forward to working with you again in the future!",
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
    reply:
      "Thank you so much Kristi! I had a lovely time getting to read for all of you!",
  },
  {
    name: "Michelle C.",
    date: "May 23, 2023",
    body: "Such a great addition to our wedding. Guest kept approaching us and telling us what an amazing reading they had. Professional, fun and friendly. Highly recommend for your party or wedding.",
    details:
      "Tarot Card Reading • Wedding • 51 - 100 guests • 18 years old and older • Need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      "Thank you so much Michelle! I'm so grateful to have been part of such an amazing wedding! 🤩",
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
    name: "Stephanie A.",
    date: "Oct 30, 2021",
    body: "I cannot say enough good things about Holly. She is amazing, to the extent I've hired her for a second party with a different group of friends. Holly was incredibly flexible in accommodating our time requested (8pm-10pm on a Fri evening) and was spot on in all our readings. She was funny, empathetic and totally in tune with each of the guests and their responses. I will be using her on my own in addition as she is truly gifted and was able to give me insight into a personal situation my therapist wasn't even able to provide. Overall, I would not hesitate to recommend her to both family and friends.",
    type: "Tarot Card Reading",
    reply: "Thank you so much, Stephanie, for your heart-felt comments! I truly loved getting to read for you and your friends and I look forward to getting to see you and read for you again soon!",
  },
  {
    name: "Veronica P.",
    date: "Oct 28, 2021",
    body: "Holly was amazing! She is incredibly sweet and understanding. She explained things very well and made me feel so comfortable during the reading. I highly recommend her to anyone!",
    details:
      "Have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Alex B.",
    date: "Sep 20, 2021",
    body: "Holly was super professional and even came to us for a bachelorette party we had! We all enjoyed her vibe and personality! I would definitely recommend booking her!",
    details:
      "Don't have prior experience • Small group • 30 minutes • At the pro's location • My home, venue, etc.",
    type: "Tarot Card Reading",
    reply:
      "Thank you so much, Alex! I had a fabulous time getting to read for you all! Hope the wedding is amazing!",
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
    details:
      "Have prior experience • 1 person • 60 minutes • Remotely (phone or internet)",
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
    details:
      "Don't have prior experience • 1 person • 30 minutes • My home, venue, etc.",
    type: "Tarot Card Reading",
  },
  {
    name: "Julie D.",
    date: "May 22, 2021",
    body: "I had such an amazing reading with Holly. It's not just her work quality, but also by her spirit, you can tell she is genuine, and is trying to help. I had gain so much clarity and confidence from my reading. She was honest, upbeat, patient, and did not rush the reading at all. She was also responsive, communicates well, and if you do a zoom reading, you also get pictures of your card spreads. I highly recommend her for anyone who is in need of a reading and I will also be reaching out to Holly for my future ones!",
    details:
      "Have prior experience • 1 person • 60 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply:
      "Thank you so much Julie! I immensely appreciate your kind words and very much am looking forward to our next reading 💜 Keep kicking a** in the meantime! 🙌🏻",
  },
  {
    name: "Elsa L.",
    date: "Apr 3, 2021",
    body: "It seemed meant to be the minute I opened up to Holly. She lead me through the whole reading and was patient enough to answer my follow up questions She was able to analyze all perspectives but tune into the messages that really mattered. Thank you again!",
    details:
      "Have prior experience • 1 person • 60 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Drew D.",
    date: "Nov 18, 2019",
    body: "Really enjoyed our reading. Extremely thorough and patient - and we were astounded on how accurate it was. Would highly recommend!!!!",
    details:
      "Don't have prior experience • 2 people • 15 minutes • At the pro's location",
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
    details:
      "Don't have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
  },
  {
    name: "Marie Y.",
    date: "Apr 25, 2022",
    body: "She was fantastic! Everyone at party really enjoyed talking with her. She was a hit.",
    details:
      "Tarot Card Reading • Palm Reading • Special Event / Party / Other • 21 - 50 guests • 31 - 50 years old • Need reader to provide table & chairs",
    type: "Tarot and Psychic Reader Entertainment",
    reply:
      "Thank you Maria! I had a fantastic time getting to read for everyone and meeting so many wonderful people!",
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
    details:
      "Don't have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply:
      "Thank you Michelle! Sending you and your future all the good energy!",
  },
  {
    name: "Fatima I.",
    date: "May 28, 2021",
    body: "Very profesional and felt all positive vibes from her .",
    details:
      "Don't have prior experience • 1 person • 30 minutes • Remotely (phone or internet)",
    type: "Tarot Card Reading",
    reply: "Thank you so much! 💜💜💜",
  },
];

export default function Reviews() {
  // Sort reviews by date in descending order (newest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -left-10 top-20 rotate-[-15deg]">
            <Image
              src="/images/Services-Tarot-Readings-10-Card-Spread.webp"
              alt=""
              width={300}
              height={300}
              className="opacity-30"
            />
          </div>
          <div className="absolute right-10 bottom-5 rotate-[10deg]">
            <Image
              src="/images/Services-Tarot-Classes-Evergreen-Spreading-Cards.webp"
              alt=""
              width={280}
              height={280}
              className="opacity-30"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 text-center">
            Client Reviews
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto text-center mb-8 md:mb-12">
            Read what clients have to say about their experiences with Crystal
            Seed Tarot's readings, events, and services.
          </p>

          <div className="text-center mb-12 bg-gradient-to-r from-purple-500/20 via-white/20 to-purple-500/20 p-6 rounded-lg shadow-inner transform transition-all duration-2000 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/30 hover:via-white/30 hover:to-purple-500/30">
            <h2 className="text-2xl font-serif text-white mb-2">
              Achieved Top Pro Status On Thumbtack For 2025
            </h2>
            <p className="text-xl text-white/90">
              Top Pros are among the highest-rated, most popular professionals
              on Thumbtack.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sortedReviews.map((review, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15"
              >
                <h3 className="text-xl font-serif text-white mb-2">
                  {review.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">{review.date}</p>
                <p className="text-white/90 mb-4">{review.body}</p>
                {review.reply && (
                  <div className="bg-white/5 p-4 rounded-lg mt-4 transition-all duration-300 hover:bg-white/10">
                    <p className="text-white/90 italic">
                      Crystal Seed Tarot's reply:
                    </p>
                    <p className="text-white/80 mt-2">{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
