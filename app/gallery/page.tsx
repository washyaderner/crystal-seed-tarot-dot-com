"use client";

import Image from "next/image";

const galleryItems = [
  {
    image: "/images/Gallery-Bachelorette-party-rental-house-Portland-OR.webp",
    caption: "Bachelorette party, rental house, Portland, OR",
  },
  {
    image: "/images/Gallery-Witch-Themed-11th-B-Day-Party-Portland-OR.webp",
    caption: "Witch-themed 11th B-day party, Portland, OR",
  },
  {
    image: "/images/Gallery-14th-B-Day-Party-Lake-Oswego-OR.webp",
    caption: "14th B-day party, Lake Oswego, OR",
  },
  {
    image:
      "/images/Gallery-The-Portland-Rosey's-Advertising-Awards-Portland-OR-2017.webp",
    caption: "The Portland Rosey's 2017 – Advertising Awards – Portland, OR",
    isLandscape: true,
  },
  {
    image: "/images/Gallery-Bachelorette-Party-House-Boat-Vancouver-WA.webp",
    caption: "Bachelorette Party, House Boat, Vancouver, WA",
  },
  {
    image:
      "/images/Gallery-Next-Adventure-Employee-Party-2023-Portland-OR.webp",
    caption: "Next Adventure\nEmployee Party 2023\nPortland, OR",
  },
  {
    image:
      "/images/Gallery-Halloween-Event-2022-SDF-Collective-Gresham-OR.webp",
    caption: "Halloween Event 2022\nSDF Collective\nGresham, OR",
  },
  {
    image:
      "/images/Gallery-End-of-Year-Vendor-Party-Evergreen-Event-Center-2024.webp",
    caption: "2024 End of Year Vendor Party\nEvergreen Event Center",
    credit: "Photo credit: Dionne Krauss Photography",
  },
  {
    image:
      "/images/Gallery-End-of-Year-Vendor-Party-Evergreen-Event-Center-Close-Up-2024.webp",
    caption: "2024 End of Year Vendor Party\nEvergreen Event Center",
    credit: "Photo credit: Dionne Krauss Photography",
  },
  {
    image: "/images/Gallery-Goth-Wedding-at-the-Benson-Hotel-2024.webp",
    caption: "Goth Wedding at the Benson Hotel 2024",
    isLandscape: true,
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-black/20 backdrop-blur-md">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 text-center">
          Gallery
        </h1>

        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl text-white/90">
              Here are a few of the amazing parties and events I've done Tarot
              at over the years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min mb-16">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-md p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-white/15 hover:z-10 ${
                  item.isLandscape ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.caption}
                  width={item.isLandscape ? 800 : 564}
                  height={item.isLandscape ? 450 : 564}
                  className="rounded-lg mb-4 w-full h-auto object-cover transition-all duration-300 hover:brightness-110"
                />
                <p className="text-white/90 text-center whitespace-pre-line">
                  {item.caption}
                </p>
                {item.credit && (
                  <p className="text-white/70 text-sm text-center mt-2">
                    {item.credit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
