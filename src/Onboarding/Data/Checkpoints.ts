import { CheckpointDescriptor } from "../Type/Checkpoints"
import { everyone, everyoneButGuests } from "./Tags"

/**
 * All possible checkpoints for all use cases
 * @constant
 */
export const checkpoints: CheckpointDescriptor[] = [
    {
        id: "1",
        map: "town",
        title: "Arrival in Town",
        description: "Welcome to Bedrock town! You've arrived in our bustling town, ready to embark on your journey.",
        type: "direction",
        coordinates: {
            x: 50,
            y: 110
        },
        tags: everyone,
    },
    {
        id: "2",
        map: "town",
        title: "Talk with Jonas",
        description: "Meet Jonas, our CEO, near the central plaza. He'll greet you and explain the goals of our onboarding experience.",
        coordinates: {
            x: 50,
            y: 106
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "front",
        message: `Ah, welcome! You must be the newest member of our Bedrock family. I'm Jonas, the CEO. It's a real pleasure to meet you. You’re about to embark on an exciting journey that’s designed to introduce you to our culture, our achievements, and the innovative work we do here. But before we dive into all that, let me share a bit of advice with you.
        Firstly, keep an open mind. You're going to meet a lot of interesting characters today, each with their own stories and insights about our company. They represent the diversity and the spirit of Bedrock. Engage with them, ask questions, and, most importantly, enjoy the process.
        Secondly, don’t rush. While it might be tempting to breeze through all the checkpoints, the real value comes from understanding the essence of what makes Bedrock unique. The content you’ll discover has been carefully chosen to give you a well-rounded view of our company.
        Lastly, don’t hesitate to revisit any part of the onboarding experience if you feel like you missed something. Our goal is for you to feel confident and informed about your new role here at Bedrock.
        Now, if you’re ready, let’s get started. Your first checkpoint is just ahead. Oh, and one more thing - keep an eye out for me! I’ll be popping up from time to time to check in on your progress. Safe travels through Bedrock, and remember, this journey is as much about discovery as it is about finding your place in our community. Off you go!`,
        tags: everyoneButGuests,
    },
    {
        id: "3",
        map: "town",
        title: "Enter the Cave",
        description: "Explore the mysterious cave at the edge of town.",
        type: "direction",
        coordinates: {
            x: 50,
            y: 15
        },
        tags: everyoneButGuests,
    },
    {
        id: "4",
        map: "town",
        title: "Unlock the Cave Door",
        description: "Find a way to unlock the door within the cave to access the World map.",
        coordinates: {
            x: 49,
            y: 7
        },
        type: "direction",
        message: `While checking this antique PC, you discover that Jonas registered your profile, granting you access to the other side. It seems your journey is about to take a significant step forward.`,
        tags: everyoneButGuests,
    },
    {
        id: "5",
        map: "world",
        title: "Hello World!",
        description: "Enter the expansive E-learning map and discover the world o Bedrock.",
        type: "direction",
        coordinates: {
            x: 42,
            y: 198
        },
        tags: everyoneButGuests,
    },
    {
        id: "6",
        map: "world",
        title: "Talk with Jonas Again",
        description: "Speak with Jonas to receive further guidance as you prepare to leave the cave.",
        coordinates: {
            x: 24,
            y: 179
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "front",
        message: `Ah, there you are! Ready to venture further into the world of Bedrock? Let me provide you with some additional guidance as you prepare to explore beyond the cave.`,
        url: "https://drive.google.com/file/d/14xQEkRCnBRTkwCh1b4JpDmo_ejJX9Lz5/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "7",
        map: "world",
        title: "Look! A smartphone!",
        description: "Pick up Jonas' phone and watch a video showcasing the innovative products and services offered by Bedrock.",
        coordinates: {
            x: 24,
            y: 178
        },
        type: "content",
        url: "https://drive.google.com/file/d/17kxTBaUItYcfJbKSAa1CAHDU3v6UlxUE/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "8",
        map: "world",
        title: "Exit the Cave",
        description: "Leave the cave behind and begin your exploration of the vast World map.",
        type: "direction",
        coordinates: {
            x: 29,
            y: 183
        },
        tags: everyoneButGuests,
    },
    {
        id: "9",
        map: "world",
        title: "Learn about Bedrock's History",
        description: "Interact with Aria to learn about the rich history of Bedrock, detailing its journey from inception to present.",
        coordinates: {
            x: 78,
            y: 183
        },
        type: "NPC",
        npcName: "Aria",
        npcSprite: "front",
        message: `Greetings, traveler! I'm Aria, here to share with you the rich history of Bedrock. From our humble beginnings to our current endeavors, there's much to learn about our journey. Let me regale you with tales of our past. Check out this document to learn more!`,
        url: "https://drive.google.com/file/d/1j3LgdBTNldFPWhBUPOGwBLY--xO7cId0/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "10",
        map: "world",
        title: "Explore Bedrock's Achievements",
        description: "Engage with Murielle to discover the impressive achievements of Bedrock, highlighting its successes and milestones.",
        coordinates: {
            x: 78,
            y: 155
        },
        type: "NPC",
        npcName: "Murielle",
        npcSprite: "front",
        message: `Hello there! I'm Murielle, and I'm excited to tell you about the incredible achievements of Bedrock. Our journey has been filled with milestones and successes that have shaped who we are today. Let's celebrate our accomplishments together! Check out this video of the BR Day!`,
        url: "https://drive.google.com/open?id=1PKex-OnTEKfJbzPTqEeCxZOK1DysrMV9&usp=drive_fs",
        tags: everyoneButGuests,
    },
    {
        id: "11",
        map: "world",
        title: "Discover Bedrock's Values",
        description: "Chat with Charlie to uncover the core values that drive Bedrock's operations and culture, shaping its identity and direction.",
        coordinates: {
            x: 62,
            y: 136
        },
        type: "NPC",
        npcName: "Charlie",
        npcSprite: "left",
        message: `Hey, nice to meet you! I'm Charlie, and I'm here to talk to you about the core values that drive Bedrock. Our values are at the heart of everything we do, guiding us as we work towards our goals. Let's dive into what makes us tick. Check out this document to learn more!`,
        url: "https://drive.google.com/file/d/1ipdSh7YJ99YCjYrbnbUUyoTrv5ppT9oL/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "12",
        map: "world",
        title: "Understand Bedrock's Legal Structure",
        description: "Speak with Diana to access detailed information about Bedrock's legal structure and organizational setup, ensuring transparency and compliance.",
        coordinates: {
            x: 21,
            y: 98
        },
        type: "NPC",
        npcName: "Diana",
        npcSprite: "front",
        message: `Greetings, adventurer! I'm Diana, and I'm here to shed some light on the legal side of Bedrock. Understanding our legal structure and organizational setup is crucial for transparency and compliance. Let's explore this together. Check out this document to learn more!`,
        url: "https://workadventu.re/?cell=J60",
        tags: everyoneButGuests,
    },
    {
        id: "13",
        map: "world",
        title: "Talk with Jonas about Customer Success",
        description: "Jonas shares insights into Bedrock's commitment to customer success as you continue your journey.",
        coordinates: {
            x: 20,
            y: 69
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "front",
        message: `Ah, I see you've made it this far! Excellent. I've been meaning to thank you for bringing me my phone. Seems I dropped it during my last teleportation. Thank you for returning it. Now, back to business—there's much to discuss about our journey ahead.
        Before you cross that bridge, I want to share something crucial about Bedrock. You see, our customers are not just clients; they're partners, and they play a significant role in defining who we are. Our collaborations across the globe not only reflect our reach but also our commitment to delivering exceptional service and innovation.
        Pride in our work and our partners is a core part of our identity. It's something that you'll find deeply ingrained in every project, every team, and every success story at Bedrock. This is why, just beyond this bridge, you'll embark on a unique journey through four countries: France, Hungary, Belgium, and the Netherlands. Each of these represents a cornerstone of our customer base, showcasing the diverse and impactful work we've achieved together.
        Off you go, and enjoy the journey through our global footprint!`,
        tags: everyoneButGuests,
    },
    {
        id: "14",
        map: "world",
        title: "Explore France Customer: 6play (Part 1)",
        description: "In the city of Paris, interact with Pierre to learn about Bedrock's partnership with France's 6play streaming service.",
        coordinates: {
            x: 57,
            y: 56
        },
        type: "NPC",
        npcName: "Pierre",
        npcSprite: "front",
        message: `Hello! My name is Pierre. Welcome to Paris, and welcome to the world of Bedrock. Allow me to introduce you to our partnership with 6play, France's premier streaming service. Let's explore together, shall we? Check out this video to learn more!`,
        url: "https://drive.google.com/file/d/14sL8VNlrI-sX4sOvf963G3WsgvIVKMN5/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "15",
        map: "world",
        title: "Discover France Customer: 6play (Part 2)",
        description: "Continue your exploration of Bedrock's partnership with France's 6play streaming service by engaging with Emilie.",
        coordinates: {
            x: 73,
            y: 70
        },
        type: "NPC",
        npcName: "Emilie",
        npcSprite: "front",
        message: `Hi there! I'm Emilie, and I'm thrilled to share more about our collaboration with 6play. We've got some exciting things in store for you, so let's dive right in and discover what makes 6play unique. Check out this video to learn more!`,
        url: "https://drive.google.com/file/d/1g6WcLd04VLuxitxvBOlBrd0xx1LIBI9u/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "16",
        map: "world",
        title: "Explore Hungary Customer: RTL+ (Part 1)",
        description: "Chat with Eva to uncover Bedrock's collaboration with Hungary's RTL+ streaming service.",
        coordinates: {
            x: 88,
            y: 47
        },
        type: "NPC",
        npcName: "Eva",
        npcSprite: "front",
        message: `Hi! I'm Eva, and I'm here to talk to you about our partnership with RTL+. Get ready for an adventure as we explore the world of Hungarian streaming together. Check out this video to learn more!`,
        url: "https://drive.google.com/file/d/14uROluBfmphPszUB0-4MtcjCJxn1tH9_/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "17",
        map: "world",
        title: "Uncover Hungary Customer: RTL+ (Part 2)",
        description: "Speak with Gabor to delve deeper into Bedrock's partnership with Hungary's RTL+ streaming service.",
        coordinates: {
            x: 102,
            y: 47
        },
        type: "NPC",
        npcName: "Gabor",
        npcSprite: "front",
        message: `Hello! I'm Gabor, and I'm excited to tell you more about RTL+. Hungary's streaming scene is buzzing with excitement, and we're proud to be a part of it. Let's uncover the magic of RTL+. Check out this video to learn more!`,
        url: "https://drive.google.com/open?id=1BZgxdihlRBZ289dc4EiJNPbnBjdZxhtv&usp=drive_fs",
        tags: everyoneButGuests,
    },
    {
        id: "18",
        map: "world",
        title: "Learn about Belgium Customer: RTL Play (Part 1)",
        description: "In the city of Brussels, interact with Luc to explore Bedrock's collaboration with Belgium's RTL Play streaming service.",
        coordinates: {
            x: 97,
            y: 10
        },
        type: "NPC",
        npcName: "Luc",
        npcSprite: "front",
        message: `Hello there! I'm Luc, and I'm here to showcase Bedrock's collaboration with RTL Play. From Belgium to the world, let's explore the wonders of streaming together. Check out this video to learn more!`,
        url: "https://drive.google.com/file/d/1j5_133tmosFpBHL2CXj3CqPGX9YwPp-h/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "19",
        map: "world",
        title: "Discover Belgium Customer: RTL Play (Part 2)",
        description: "Continue your exploration of Bedrock's partnership with Belgium's RTL Play streaming service by engaging with Emma.",
        coordinates: {
            x: 83,
            y: 10
        },
        type: "NPC",
        npcName: "Emma",
        npcSprite: "front",
        message: `Hey! I'm Emma, and I'm thrilled to share more about RTL Play with you. Belgium's streaming landscape is diverse and vibrant, and we're at the heart of it. Let's dive in and discover what makes RTL Play special. Check out this video to learn more!`,
        url: "https://drive.google.com/file/d/14uqHR0Ri8W4tuXzswBjRVA8HztOOMvpO/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "20",
        map: "world",
        title: "Explore Netherlands Customer: Videoland (Part 1)",
        description: "Chat with Hans to uncover Bedrock's collaboration with Netherlands' Videoland streaming service.",
        coordinates: {
            x: 22,
            y: 34
        },
        type: "NPC",
        npcName: "Hans",
        npcSprite: "front",
        message: `Hi! I'm Hans, and I'm here to talk to you about Videoland. Get ready for an immersive experience as we explore the world of Dutch streaming together. Check out this video to learn more!`,
        url: "https://drive.google.com/file/d/14uUahKs0pwveQ5UrzL4QdoS2ee8rJv_H/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "21",
        map: "world",
        title: "Uncover Netherlands Customer: Videoland (Part 2)",
        description: "Speak with Ingrid to delve deeper into Bedrock's partnership with Netherlands' Videoland streaming service.",
        coordinates: {
            x: 8,
            y: 34
        },
        type: "NPC",
        npcName: "Ingrid",
        npcSprite: "front",
        message: `Hi there! I'm Ingrid, and I'm excited to tell you more about Videoland. The Netherlands is home to a wealth of streaming content, and we're here to bring it to you. Let's embark on this journey together. Check out this document to learn more!`,
        url: "https://drive.google.com/open?id=1BflS6L3E6OnPTfED_5igHaEiwyFDhjTR&usp=drive_fs",
        tags: everyoneButGuests,
    },
    {
        id: "22",
        map: "world",
        title: "Complete Airport Check-in",
        description: "Prepare for departure by completing the airport check-in process. Accessing the gates requires viewing all content checkpoints.",
        coordinates: {
            x: 55,
            y: 13
        },
        type: "NPC",
        npcName: "Vianey",
        npcSprite: "left",
        message: `Welcome to the airport! I'm Vianey, and I'll be guiding you through the check-in process. Before we proceed, let me congratulate you on completing your journey through Bedrock's onboarding experience. It seems you've traveled far and checked all contents on all previous locations. Well done! As a reward, here's your ticket that allows you to pass through the gates. Safe travel!`,
        tags: everyoneButGuests
    },
    {
        id: "23",
        map: "world",
        title: "Board the Helicopter with Jonas",
        description: "Jonas awaits you near the helicopter for a scenic journey from the airport to the rooftop of the BR Tour.",
        coordinates: {
            x: 36,
            y: 15
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "front",
        message: `Well, well, well! Look who's ready for a unique experience. It's you, and you've earned it. I've been looking forward to this moment. Come, join me. I've got something special planned.
        Why an helicopter? It's not just any helicopter. It's Bedrock's very own flying machine, reserved exclusively for our incredible employees. I figured I wouldn't need it much myself—I can teleport, after all—but I thought it'd be a fun perk for you all.
        So, let's hop in and take to the skies. Sit back, relax, and enjoy the view as we soar above the city. From up here, you'll get a whole new perspective on Bedrock and our place in the world.
        Next stop: the Bedrock Tour. Off we go!`,
        tags: everyoneButGuests,
    },
    {
        id: "24",
        map: "world",
        title: "The Bedrock Tour",
        description: "You've landed on the rooftop of the Bedrock Tour, the heart of the company. Jonas wants to speak to you before you enter the building.",
        coordinates: {
            x: 23,
            y: 114
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "back",
        message: `Before we venture inside, take a moment to appreciate the view from up here. It's quite spectacular, isn't it? From this vantage point, you can see the sprawling landscape of our company and the vibrant city beyond.
        But enough introspection for now. The real adventure lies ahead, within the walls of the Bedrock Tour. Inside, you'll discover the inner workings of our company and meet some of the people who make it all possible.
        So, when you're ready, let's step inside and begin our exploration. The CHRO floor is our first destination—a place where the heartbeat of our company, our people, comes to life.`,
        tags: everyoneButGuests,
    },
    {
        id: "25",
        map: "world",
        title: "Explore CHRO Office",
        description: "Delve into the role of Christine, the Chief Human Resources Officer (CHRO) and its contributions to Bedrock's success.",
        coordinates: {
            x: 31,
            y: 124
        },
        type: "NPC",
        npcName: "Christine",
        npcSprite: "left",
        message: `Greetings! I'm Christine, the CHRO of Bedrock. Join me as we explore the vital role of Human Resources in our company's success. Let's dive into the world of HR together. Check out this document to learn more!`,
        tags: everyoneButGuests,
    },
    {
        id: "26",
        map: "world",
        title: "Discover Departments Presentation",
        description: "Engage with the presentation on this floor to learn about the various departments within Bedrock and their functions.",
        coordinates: {
            x: 29,
            y: 129
        },
        type: "content",
        url: "https://drive.google.com/file/d/1jWuojTxm6FkXxdvm3KU0wCvLu9PGGOwY/view?usp=sharing",
        tags: everyoneButGuests,
    },
    {
        id: "27",
        map: "world",
        title: "Explore HR KPIs",
        description: "Analyze the key performance indicators (KPIs) related to human resources management, showcasing Bedrock's strategic HR approach.",
        coordinates: {
            x: 29,
            y: 137
        },
        type: "content",
        url: "https://workadventu.re/?cell=J72",
        tags: everyoneButGuests,
    },
    {
        id: "28",
        map: "world",
        title: "View Organizational Chart",
        description: "Study the organizational chart of Bedrock with Nicolas, illustrating the hierarchical structure and reporting relationships within the company.",
        coordinates: {
            x: 17,
            y: 143
        },
        type: "NPC",
        npcName: "Nicolas",
        npcSprite: "front",
        message: `Hello! I'm Nicolas, and I'll be your guide to Bedrock's organizational chart. Understanding our structure is key to navigating our company effectively. Let's map it out together. Check out this document to learn more!`,
        url: "https://airtable.com/appKpJQwbYs2xn4IS/paghiLXWHi7tWPE4O",
        tags: everyoneButGuests,
    },
    {
        id: "29",
        map: "world",
        title: "Explore Office Presentation",
        description: "Take a virtual tour of Bedrock's office spaces with Julie, showcasing the work environment and facilities available to employees.",
        coordinates: {
            x: 28,
            y: 150
        },
        type: "NPC",
        npcName: "Julie",
        npcSprite: "front",
        message: `Hey there! I'm Julie, and I'm excited to give you a virtual tour of Bedrock's office spaces. From cozy meeting rooms to vibrant break areas, we've got everything you need for a productive work environment. Let me show you around! Check out this document to learn more!`,
        url: "https://workadventu.re/?cell=J74",
        tags: everyoneButGuests,
    },
    {
        id: "30",
        map: "world",
        title: "Exit the BR Tour",
        description: "Step outside the BR Tour and prepare for your next adventure with Bedrock.",
        type: "direction",
        coordinates: {
            x: 24,
            y: 159
        },
        tags: everyoneButGuests,
    },
    {
        id: "31",
        map: "world",
        title: "Talk with Jonas at its Pickup",
        description: "Jonas awaits you near its pickup, ready to provide additional guidance and support.",
        coordinates: {
            x: 23,
            y: 165
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "back",
        message: `Ah, there you are! Ready to head back to town? Before we go, let's make sure you've absorbed everything from the BR Tour. Do you feel confident with all the information about Bedrock now? So let's continue our trip!`,
        tags: everyoneButGuests,
    },
    {
        id: "32",
        map: "world",
        title: "Return to Town with Jonas",
        description: "Head back to the town with Jonas, continuing your onboarding journey.",
        coordinates: {
            x: 23,
            y: 167
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "left",
        message: `Hop in, let's head back to town. I'll drive you there myself. It's been quite the journey, hasn't it? But we're not done yet. There's still much to explore and learn about Bedrock. Let's continue your onboarding journey together.`,
        tags: everyoneButGuests,
    },
    {
        id: "33",
        map: "town",
        title: "Talk with Jonas in the Stadium's backstage",
        description: "Jonas provides further insights into Bedrock's offerings as he prepares for a conference in the stadium.",
        coordinates: {
            x: 16,
            y: 45
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "left",
        message: `Welcome to the stadium private backstage area. Feel free to explore and make yourself comfortable. As for me, I've got a conference to prepare for. I'm afraid I must leave you here for now. Time is of the essence, and I'm running a bit behind schedule. But don't worry, you're in good hands. Enjoy your time backstage, you might find some useful information here!`,
        tags: everyoneButGuests,
    },
    {
        id: "34",
        map: "town",
        title: "Explore Backstage Content",
        description: "Take a look at the backstage content now that it's accessible.",
        coordinates: {
            x: 26,
            y: 43
        },
        type: "content",
        url: "https://workadventu.re/?cell=J75",
        tags: everyoneButGuests,
    },
    {
        id: "35",
        map: "town",
        title: "Leave Backstage Area",
        description: "Exit the backstage area and begin your exploration of Bedrock's facilities.",
        coordinates: {
            x: 29,
            y: 52
        },
        type: "direction",
        tags: everyoneButGuests,
    },
    {
        id: "36",
        map: "town",
        title: "Farewell to Jonas",
        description: "It's time to bid farewell to Jonas, the guiding presence throughout your Bedrock journey.",
        coordinates: {
            x: 19,
            y: 54
        },
        type: "NPC",
        npcName: "Jonas",
        npcSprite: "front",
        message: `Well, it seems our journey together is coming to an end. I hope this onboarding experience has been illuminating for you. Remember, every step you take here contributes to the tapestry of Bedrock's success. Now, I must attend to some final preparations for a keynote presentation. Thank you for your time, and best of luck on your endeavors ahead. Farewell!`,
        tags: everyoneButGuests,
    },
    {
        id: "37",
        map: "town",
        title: "Visit the Stadium",
        description: "Explore the stadium and its features, including a visioconference tool on the stage and front-row seats.",
        coordinates: {
            x: 19,
            y: 60
        },
        type: "direction",
        tags: everyoneButGuests,
    },
    {
        id: "38",
        map: "town",
        title: "Visit HR",
        description: "Explore the HR building. That's where you can have interviews!",
        coordinates: {
            x: 81,
            y: 67
        },
        type: "direction",
    },
    {
        id: "39",
        map: "town",
        title: "Explore the Wikitek",
        description: "Discover valuable resources in the Wikitek, a modern glass library filled with information.",
        coordinates: {
            x: 79,
            y: 103
        },
        type: "direction",
        tags: everyoneButGuests,
    },
    {
        id: "40",
        map: "town",
        title: "Your Contacts (FR)",
        description: "Access essential information about your contacts within the company.",
        coordinates: {
            x: 79,
            y: 101
        },
        type: "content",
        url: "https://workadventu.re/?cell=B29",
        tags: ["fr"],
    },
    {
        id: "41",
        map: "town",
        title: "Your Daily Tools (FR)",
        description: "Access a curated collection of productivity tools to streamline your workflow.",
        coordinates: {
            x: 88,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=B30",
        tags: ["fr"],
    },
    {
        id: "42",
        map: "town",
        title: "HR System (FR)",
        description: "Access detailed information about HR processes, policies, and procedures.",
        coordinates: {
            x: 71,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=B31",
        tags: ["fr"],
    },
    {
        id: "43",
        map: "town",
        title: "Your Contacts (PT)",
        description: "Access essential information about your contacts within the company.",
        coordinates: {
            x: 79,
            y: 101
        },
        type: "content",
        url: "https://workadventu.re/?cell=C29",
        tags: ["pt"]
    },
    {
        id: "44",
        map: "town",
        title: "Your Daily Tools (PT)",
        description: "Access a curated collection of productivity tools to streamline your workflow.",
        coordinates: {
            x: 88,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=C30",
        tags: ["pt"]
    },
    {
        id: "45",
        map: "town",
        title: "HR System (PT)",
        description: "Access detailed information about HR processes, policies, and procedures.",
        coordinates: {
            x: 71,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=C31",
        tags: ["pt"]
    },
    {
        id: "46",
        map: "town",
        title: "Your Contacts (ALT)",
        description: "Access essential information about your contacts within the company.",
        coordinates: {
            x: 79,
            y: 101
        },
        type: "content",
        url: "https://workadventu.re/?cell=D29",
        tags: ["alt"]
    },
    {
        id: "47",
        map: "town",
        title: "Your Daily Tools (ALT)",
        description: "Access a curated collection of productivity tools to streamline your workflow.",
        coordinates: {
            x: 88,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=D30",
        tags: ["alt"]
    },
    {
        id: "48",
        map: "town",
        title: "HR System (ALT)",
        description: "Access detailed information about HR processes, policies, and procedures.",
        coordinates: {
            x: 71,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=D31",
        tags: ["alt"]
    },
    {
        id: "49",
        map: "town",
        title: "Your Contacts (EXT)",
        description: "Access essential information about your contacts within the company.",
        coordinates: {
            x: 79,
            y: 101
        },
        type: "content",
        url: "https://workadventu.re/?cell=E29",
        tags: ["ext"]
    },
    {
        id: "50",
        map: "town",
        title: "Your Daily Tools (EXT)",
        description: "Access a curated collection of productivity tools to streamline your workflow.",
        coordinates: {
            x: 88,
            y: 100
        },
        type: "content",
        url: "https://workadventu.re/?cell=E30",
        tags: ["ext"]
    },
    {
        id: "51",
        map: "town",
        title: "Check out the Streaming Wall",
        description: "Visit the Streaming Wall building and watch videos showcasing Bedrock's customers and their experiences.",
        coordinates: {
            x: 70,
            y: 35
        },
        type: "direction",
        tags: everyoneButGuests,
    },
    {
        id: "52",
        map: "town",
        title: "Enjoy Arcade Games",
        description: "Visit the Arcade building and enjoy classic games like Pong and Super Mario!",
        coordinates: {
            x: 17,
            y: 104
        },
        type: "direction",
    },
    {
        id: "53",
        map: "town",
        title: "Bedrock News Billboard",
        description: "Complete your journey by discoving the latest news and updates about Bedrock!",
        coordinates: {
            x: 35,
            y: 93
        },
        type: "content",
        url: "https://workadventu.re/?cell=X",
    },
]

/**
 * All checkpoints where Jonas appears
 * @constant
 */
export const jonasCheckpointIds = ["2", "6", "13", "23", "24", "31", "32", "33", "36"]

/**
 * All checkpoints after the last onboarding checkpoint (except Jonas checkpoint)
 * @constant
 */
// We start at index 35 and we add 19 = 53
export const checkpointIdsAfterOnboarding = Array.from({ length: 19 }, (_, index) => (index + 35).toString())
