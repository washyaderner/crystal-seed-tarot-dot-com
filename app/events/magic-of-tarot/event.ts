// Shared config for the Magic of Tarot class funnel (page, form, API all import this).
export const EVENT = {
  id: "magic-of-tarot",
  title: "The Magic of Tarot",
  subtitle: "A Beginner's Tarot Class with Holly Cole",
  dateLabel: "Saturday, August 15, 2026",
  timeLabel: "2:00 to 4:00 PM",
  price: 30,
  venue: "Sinister Coffee & Creamery",
  address: "301 SW Morrison St, Portland, OR 97204",
  tag: "magic_of_tarot", // marks these rows in the email-list sheet
  flyer: "/images/Events-Magic-of-Tarot-Sinister.png",
  notifyEmail: "crystalseedtarot@gmail.com", // Holly gets a notification here on each signup
  path: "/events/magic-of-tarot",
} as const;
