/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NewsArticle, NewsCategory, VideoReport } from "./types";

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: "breaking-1",
    category: NewsCategory.ENTERTAINMENT,
    title: "The Cinematic Evolution: News Verse Exclusive Interview with Acclaimed Director",
    summary: "As global cinemas embrace virtual production stages, we sit down with the visionary filmmaker shaping the future of high-concept storytelling.",
    content: `In an exclusive sit-down with News Verse in London, the acclaimed director shared insight into how next-generation virtual sets—using LED walls similar to those pioneered in sci-fi classics—are revolutionizing the creative freedom of independent cinema.

"We are no longer bound by schedules or climate constraints," the director remarked, gesturing to the massive 3D ambient screens surrounding us. "An artist can now conceptualize a sunset in Lahore or a futuristic skyline in Tokyo and place their characters directly into that atmosphere with live, reactive lighting. It is a canvas without limits."

### Breaking Creative Barriers
Virtual stage technologies have fundamentally shifted how cinematography works. Traditionally, visual effects are applied during post-production. But with real-time rendering engines, directors, camera operators, and actors can see exactly how the environment interacts with them.

This changes everything for actors too, who previously spoke to green screens and tennis balls. Now, they see the lush forests or neon streetscapes in real time. It induces a level of authenticity that translates directly to the silver screen.

### Entertainment's Rapid Global Shakeup
In the interview, we also delved into the shifting metrics of global cinema distribution. The rise of hybrid multi-tier releases has expanded international access for filmmakers from underdeveloped regions like South Asia. Lollywood has particularly felt this wave, with recent critical successes premiering to packed festival audiences in Cannes and Toronto.

As News Verse continues to follow the golden era of visual cinema, this merger of interactive engineering and raw narrative heart stands out as a lighthouse of what's to come.`,
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    publishedAt: "2026-06-13T06:00:00Z",
    readTime: "5 min read",
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    viewCount: 14205,
    author: "Alizeh Shah, Senior Arts Critic"
  },
  {
    id: "entertainment-2",
    category: NewsCategory.ENTERTAINMENT,
    title: "Retro Revival: Behind the Beats of Pakistan's Indie Synthwave Wave",
    summary: "Young Pakistani musicians are fusing traditional subcontinent instruments with 80s synth basslines, sparking an international cultural phenomenon.",
    content: `Lahore, Pakistan — A quiet revolution is spinning on the turntables of Lahore's underground music culture. In small, independent recording studios across Gulberg, artists are synthesizing vintage analog synthesizers with traditional instruments like the harmonium and sitar.

The output is a glowing, fast-tempo retro fusion called 'Sufi-Wave' or 'Indie-Synth.' Combining the emotional, layered poetry of classic Eastern lyrics with the driving, electronic pulse of 1980s neon soundtracks, it has found an immense audience among global streaming communities.

### The global appeal of localized sound
Local bands are noticing that over 60% of their streaming audience resides in European and North American metropolitan areas. "Music is mathematical and emotional, both at the same time," says a 22-year-old multi-instrumentalist whose latest single hit the viral global charts. "When you take a traditional high-pitch melodic hook and drive it with a custom Roland drum machine, the kinetic energy transcends language barriers."

In this feature, News Verse examines how independent streaming channels have given voice to bedroom producers who are now filling arenas overseas. This modern renaissance represents an authentic, visual, and highly premium artistic export that represents the best of Lollywood's evolving indie scene.`,
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-13T05:30:00Z",
    readTime: "4 min read",
    isTrending: true,
    viewCount: 8943,
    author: "Zayn Hashmi, Music Correspondent"
  },
  {
    id: "entertainment-3",
    category: NewsCategory.ENTERTAINMENT,
    title: "Global Red Carpet Highlight: Exploring the Future of Green Fashion Design",
    summary: "How sustainable bio-textiles and localized artisanal crafts dominated the visual displays at the latest international film exhibitions.",
    content: `The spotlight at this year's seasonal film galas wasn't just on the cinema, but on the fabric worn of the red carpets. Designers presented collections crafted strictly from plant-derived leather alternatives, ocean-recovered polymers, and vintage upcycled heirlooms.

"Fashion is the second largest industrial polluter," explained a renowned designer to News Verse. "We must pivot. Creative luxury shouldn't come at the cost of the environment." The visual detail of these garments was magnificent, showcasing structured silhouettes that rivaled historic high-fashion archives.

This extensive editorial details the breakthroughs in bio-textile engineering making luxury fashion sustainable.`,
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-12T18:15:00Z",
    readTime: "3 min read",
    viewCount: 5214,
    author: "Sarah Jenkins, Culture Editor"
  },
  {
    id: "entertainment-4",
    category: NewsCategory.ENTERTAINMENT,
    title: "Lollywood Rising: Box Office Records Shattered in Cultural Renaissance",
    summary: "A new wave of collaborative screenwriting and high-fidelity production values drives an unprecedented domestic box office surge.",
    content: `Domestic films in Karachi and Islamabad are drawing immense lines stretching around downtown multiplexes. New feature movies, ranging from gritty social realism to high-octane romantic epics, are breaking historic records set a decade ago.

Industry experts point to premium color grading, tight pacing, and native narrative hooks that resonate deeply with youth audiences. News Verse tracks the financial and cultural effects of this box office boom, proving that localized stories can command premium cinema pricing.`,
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-12T14:45:00Z",
    readTime: "4 min read",
    viewCount: 11090,
    author: "Faisal Bilal, Entertainment Desk"
  },
  {
    id: "pakistan-1",
    category: NewsCategory.PAKISTAN,
    title: "Islamabad Pioneers Green Urban Corridor Initiative to Combat Heatwaves",
    summary: "With smart high-density planting and responsive urban cooling grids, Pakistan's capital sets a benchmark for smart climate adaptation.",
    content: `Islamabad, Pakistan — The Capital Development Authority alongside climate engineers has initiated the 'Islamic Green Canopy.' This massive undertaking utilizes structural urban forestry to lower surface urban temperatures across central commercial sectors by up to 4 degrees Celsius.

By implementing smart water spray lattices fueled by treated recycled greywater, the corridors will provide safe, ventilated pedestrian avenues.

This marks a crucial step in Pakistan's proactive environmental planning. News Verse outlines the scientific roadmap behind this microclimate architecture.`,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800", // Soft nature beachy feel but let's use gorgeous city/nature placeholder
    publishedAt: "2026-06-13T04:15:00Z",
    readTime: "6 min read",
    isTrending: true,
    viewCount: 9410,
    author: "Kamran Khan, Climate Correspondent"
  },
  {
    id: "pakistan-2",
    category: NewsCategory.PAKISTAN,
    title: "Karachi's Digital Harbor: Tech Exports Surpass Bilateral Targets",
    summary: "A surge in high-value software services, custom enterprise cloud, and remote workforce platforms drives Karachi's thriving trade sector.",
    content: `Karachi is rapidly cementing its reputation as South Asia's digital harbor. Statistics released by the Ministry of Information Technology show software engineering exports surged by 38% year-on-year, driven largely by cloud-native infrastructure engineering, mobile fintech solutions, and enterprise SaaS systems developed locally.

Hundreds of startups operating in shared tech co-working spaces near Clifton and DHA are sealing agreements with Silicon Valley talent partners, establishing Pakistan's tech footprint on the global stage.`,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-12T09:00:00Z",
    readTime: "4 min read",
    viewCount: 7821,
    author: "Zarah Shah, Business tech Editor"
  },
  {
    id: "world-1",
    category: NewsCategory.WORLD,
    title: "Global Summit Agrees on New Strict Space Debris Management Framework",
    summary: "Seventeen countries sign the historic Kepler Accord, mandating active structural orbital cleanup protocols and tracking networks.",
    content: `Geneva — In a significant milestone for international orbital protection, delegates have agreed upon the 'Kepler Space Integrity Protocol.' The agreement establishes financial liabilities for orbital debris and legally binds sat-companies to install self-deorbit thrusters.

As orbital paths become increasingly crowded with commercial communications grids, the safety of crewed scientific stations has turned critical. News Verse breaks down the technological requirements for magnetic sweeping satellites scheduled to launch next autumn.`,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-13T02:00:00Z",
    readTime: "5 min read",
    viewCount: 15302,
    author: "Marcus Vance, Aerospace Correspondent"
  },
  {
    id: "technology-1",
    category: NewsCategory.TECHNOLOGY,
    title: "The Superconductivity Milestone: Ambient Pressure Materials Verified",
    summary: "Independent physics groups validate a sustainable ambient-temperature superconductor, unlocking ultra-efficient grid capabilities.",
    content: `A quiet revolution in physics has just been validated. Laboratories in Tokyo and Berlin have confirmed that a synthesized copper-doped crystal displays zero electrical resistance at ambient air pressures and standard room temperatures.

This discovery is anticipated to eliminate power transmission losses, shrink computer chips, and revolutionize MRI and maglev engineering. News Verse provides a comprehensive breakdown of the mineral compound and commercial manufacturing timelines.`,
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-12T16:00:00Z",
    readTime: "5 min read",
    isTrending: true,
    viewCount: 22105,
    author: "Dr. Rachel Thorne, Science Editor"
  },
  {
    id: "business-1",
    category: NewsCategory.BUSINESS,
    title: "Global Supply Re-Routing: Multi-Hub High-Speed Freight Lines Open",
    summary: "A massive logistics consortium unveils alternative intercontinental rail bypasses, reducing reliant maritime delivery costs.",
    content: `In response to rising ocean-freight tariffs and critical locks bottlenecks, global shippers are turning to next-generation steel tracks. A high-speed electric freight corridor spanning Central Asia to Eastern European centers has cut transit times down to a guaranteed 9 days, compared to the standard 28-day maritime voyage.

News Verse analyzes the economic shifts and industrial real-estate booms happening along these newly fortified inland ports.`,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-12T11:20:00Z",
    readTime: "3 min read",
    viewCount: 6412,
    author: "Thomas Sterling, Logistics Analyst"
  },
  {
    id: "sports-1",
    category: NewsCategory.SPORTS,
    title: "The Next Era of Cricket: High-Tech Biometric Sensors Shake Up Matches",
    summary: "How precision inertial wearables and sub-millimeter tracking radars have shifted training methods for elite international teams.",
    content: `From training nets in Rawalpindi to international venues in Melbourne, cricket coaching has entered the telemetry age. Elite fast bowlers now wear specialized biometric harnesses containing high-G accelerators that measure skeletal twists and release-velocities in real-time.

Physiotherapists claim these micro-sensors are preventing joint injuries by flagging fatigue spikes before they manifest as critical tears. News Verse explores this athletic tech horizon.`,
    imageUrl: "https://images.unsplash.com/photo-1531415080294-4404b53e511a?auto=format&fit=crop&q=80&w=800",
    publishedAt: "2026-06-11T19:30:00Z",
    readTime: "4 min read",
    viewCount: 4210,
    author: "Imran Raza, Sports Desk"
  }
];

export const BREAKING_TICKER_STORIES = [
  "BREAKING: Academic institutions in Islamabad announce joint AI & quantum computing research grant.",
  "CORONATION: Renowned director wins Lifetime Achievement at the European Cinema Gala in Cannes.",
  "TECH: Global scientific consensus verifies ambient-temperature superconductor mineral compound.",
  "MARKETS: Karachi Stock Exchange reaches historic high index amid surging tech software exports.",
  "WORLD: Space debris accord signed by seventeen countries in Geneva establishing orbital sweeping mandates."
];

export const INITIAL_VIDEOS: VideoReport[] = [
  {
    id: "vid-1",
    title: "Future of Film: Building Massive Real-Time Virtual LED Production Stages",
    youtubeId: "Y3WvYvX3gX4", // Dynamic cinematic virtual production stage
    duration: "4:15",
    category: "Entertainment",
    thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600",
    views: "128K views",
    publishedAt: "Yesterday"
  },
  {
    id: "vid-2",
    title: "Islamabad Urban Greening: The Technical Battle Against Intense Summer Heatwaves",
    youtubeId: "p9_itk04-1U", // Urban heat island explanation/solutions
    duration: "3:40",
    category: "Pakistan",
    thumbnailUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600",
    views: "45K views",
    publishedAt: "2 days ago"
  },
  {
    id: "vid-3",
    title: "Generative AI & Journalism: Behind the Scenes of News Verse's AI-Assisted Writing",
    youtubeId: "scYMyfX-yIs", // AI journalism discussion
    duration: "5:12",
    category: "Technology",
    thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600",
    views: "92K views",
    publishedAt: "3 days ago"
  }
];
