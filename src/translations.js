export default {
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', resume: 'Resume', contact: 'Contact' },
    hero: {
      tagline: 'Product-first engineering.',
      headline: 'Building products people actually use.',
      supporting1: 'Software Engineer focused on AI, Backend and Product Engineering.',
      supporting2: 'Turning ambitious ideas into products that solve real problems.',
      primaryCTA: 'Explore Projects',
      secondaryCTA: 'Get in Touch'
    },
    about: {
      title: 'Principles',
      introduction: 'The products we build reflect the principles we choose. These are the ideas that guide every engineering and product decision I make.',
      principles: [
        {
          title: 'Build What Matters',
          description: "I don't build software because a technology is interesting. I build products because a real problem deserves a better solution."
        },
        {
          title: 'AI With Responsibility',
          description: "AI should expand human capability. Never replace human judgment where lives, trust or dignity are at stake."
        },
        {
          title: 'Quality Creates Trust',
          description: "Fast products are useful. Reliable products are remembered. I optimize for both."
        },
        {
          title: 'Simplicity Wins',
          description: "Every feature should justify its existence. Every line of code should earn its place."
        },
        {
          title: 'Think Globally',
          description: "Great products can start anywhere. Including Namangan. What matters is the problem, not the postcode."
        },
        {
          title: 'Build With Integrity',
          description: "Not everything that can be built should be built. Technology should improve people's lives, never exploit them."
        }
      ]
    },
    projects: {
      title: 'Selected Works',
      viewDetails: 'View Details',
      mockupPlaceholder: 'Interactive Mockup',
      items: [
        {
          title: 'Kitobiyot 12',
          problem: 'The Uzbek literature community lacked a centralized platform for literary analysis, book reviews, and educational content.',
          solution: 'Created a dedicated Telegram channel for curated literary analysis, book reviews, and educational content about Uzbek literature.',
          impact: 'Centralized Uzbek literature discourse and created an educational resource for students and enthusiasts.',
          engineering: 'Content-first approach with Telegram API for platform reach and native messaging features.',
          tech: ['Telegram API', 'Content Strategy']
        },
        {
          title: 'Anonymous Chat',
          problem: 'Telegram users needed private conversations without identity disclosure. Existing options required registration or lacked privacy protections.',
          solution: 'Built a Telegram bot that enables anonymous one-on-one conversations with automatic session cleanup.',
          impact: 'Users can discuss sensitive topics without fear. Temporary sessions reduce anxiety and ensure privacy.',
          engineering: 'Redis for sub-millisecond session management and Vercel Serverless for automatic scaling.',
          tech: ['Node.js', 'Telegraf', 'Redis', 'Vercel Serverless']
        },
        {
          title: '3D Portfolio',
          problem: 'Needed a portfolio that would stand out to recruiters while maintaining professionalism and accessibility.',
          solution: 'Built an interactive portfolio with Three.js 3D background and Framer Motion animations, balancing visual impact with performance.',
          impact: 'Demonstrated technical depth in graphics programming and design sensibility while maintaining accessibility.',
          engineering: 'Three.js for WebGL performance and lazy loading to reduce initial bundle size.',
          tech: ['React', 'Three.js', 'Framer Motion']
        },
        {
          title: "Muhammad Umar's Blog",
          problem: 'Technical and philosophical content was scattered across platforms with no centralized space for long-form thinking.',
          solution: 'Created a blog platform using React and Tailwind CSS for fast loading, clean typography, and responsive design.',
          impact: 'Centralized content creation and distribution for IT, literature, and philosophy topics.',
          engineering: 'React for component reusability and Tailwind CSS for rapid styling without custom CSS.',
          tech: ['React', 'Tailwind CSS'],
          link: "https://t.me/Muhammadjonov_Umar"
        }
      ]
    },
    resume: {
      title: 'Changelog',
      subtitle: 'Weekly log of builds, learning, and architectural focus.',
      downloadText: 'Download PDF Log',
      items: [
        { type: 'build', title: 'Payload Tuning & Frame Rate Optimization', company: 'Portfolio Performance', date: 'Week 28', desc: 'Pruned custom web font files down to active WOFF2 subsets saving 98.5% payload. Relocated layout metrics out of Three.js frame render loops to eliminate forced synchronous layouts and layout thrashing.' },
        { type: 'build', title: 'In-Memory Session Caching & Scalability', company: 'Anonymous Chat Bot', date: 'Week 27', desc: 'Configured Redis key-value caching pipelines for anonymous messaging servers, optimizing query response rates for high-throughput messaging down to sub-millisecond ranges.' },
        { type: 'learn', title: 'Async Chunk Splitting & Dynamic Bundling', company: 'Three.js Visualizers', date: 'Week 26', desc: 'Implemented lazy dynamic imports for heavy three-dimensional vector graphics chunks, protecting initial DOM paints, FCP, and interactive latency metrics.' },
        { type: 'learn', title: 'Algorithmic Complexity & Build Systems', company: 'C++ Systems Architecture', date: 'Week 25', desc: 'Tuned data structures complexity in algorithm challenges, and optimized local automated compilation routines inside Linux terminal workspaces.' }
      ],
      skillsTitle: 'Technical Arsenal',
      frontend: 'Frontend',
      backend: 'Backend',
      otherTools: 'Other Tools',
      frontendTech: 'React, HTML, CSS, JavaScript, Three.js',
      backendTech: 'Python, Django, C++',
      otherTech: 'Graphic Design, 3D Modeling, No-code, AI'
    },
    contact: {
      title: 'Get in Touch',
      subtitle: "Interested in working together? Drop me a message or connect through social media.",
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      emailValue: 'umarjonmx@gmail.com',
      phoneValue: '+998-(97)-123-36-67'
    }
  },
  uz: {
    nav: { home: 'Bosh sahifa', about: 'Haqimda', projects: 'Loyihalar', resume: 'Rezyume', contact: 'Aloqa' },
    hero: {
      tagline: 'Mahsulotga yo\'naltirilgan muhandislik.',
      headline: 'Odamlar haqiqatan ham foydalanadigan mahsulotlar yarataman.',
      supporting1: 'AI, Backend va Mahsulot muhandisligiga yo\'naltirilgan Dasturiy Injiniring.',
      supporting2: 'Katta g\'oyalarni haqiqiy muammolarni hal qiladigan mahsulotlarga aylantiraman.',
      primaryCTA: 'Loyihalarni Ko\'rish',
      secondaryCTA: 'Bog\'lanish'
    },
    about: {
      title: 'Prinsiplar',
      introduction: "Quradigan mahsulotlarimiz tanlagan prinsiplarimizni aks ettiradi. Bu mening har bir muhandislik va mahsulot qarorimni yo'naltiradigan g'oyalar.",
      principles: [
        {
          title: 'Muhim Narsalarni Qur',
          description: "Men texnologiya qiziqarli bo'lgani uchun dasturiy ta'minot yozmayman. Haqiqiy muammo yaxshiroq yechimni kutgani uchun mahsulotlar yarataman."
        },
        {
          title: 'AI bilan Mas\'uliyat',
          description: "AI inson qobiliyatini kengaytirishi kerak. Hayot, ishonch yoki obro' o'yinda bo'lgan joylarda inson hukmini hech qachon almashtirmasligi kerak."
        },
        {
          title: 'Sifat Ishonch Yaratadi',
          description: "Tez mahsulotlar foydali. Ishonchli mahsulotlar esda qoladi. Men ikkalasiga ham optimallashtiraman."
        },
        {
          title: 'Soddalik G\'alaba Qiladi',
          description: "Har bir xususiyat o'z mavjudligini asoslashi kerak. Har bir kod satri o'rnini qozonishi kerak."
        },
        {
          title: 'Global O\'yla',
          description: "Ajoyib mahsulotlar hamma joyda boshlanishi mumkin. Namanganni ham o'z ichiga oladi. Muhimi muammo, pochta indeksi emas."
        },
        {
          title: 'Integratsiya bilan Qur',
          description: "Qurilishi mumkin bo'lgan hamma narsa qurilishi shart emas. Texnologiya odamlarning hayotini yaxshilashi kerak, ularni hech qachon ekspluatatsiya qilmasligi kerak."
        }
      ]
    },
    projects: {
      title: 'Tanlangan Loyihalar',
      viewDetails: "Batafsil ko'rish",
      mockupPlaceholder: 'Interaktiv Maket',
      items: [
        {
          title: 'Kitobiyot 12',
          problem: "O'zbek adabiyoti jamoasi uchun adabiy tahlil, kitob taqrizlari va ta'limiy kontent uchun markazlashtirilgan platforma yo'q edi.",
          solution: "O'zbek adabiyoti haqida adabiy tahlil, kitob taqrizlari va ta'limiy kontent uchun maxsus Telegram kanal yaratdim.",
          impact: "O'zbek adabiyoti diskursini markazlashtirdim va talabalar va havaskorlar uchun ta'limiy resurs yaratdim.",
          engineering: "Kontentga yo'naltirilgan yondashuv va platformaga erishish uchun Telegram API.",
          tech: ['Telegram API', 'Kontent Strategiyasi']
        },
        {
          title: 'Anonim Chat',
          problem: "Telegram foydalanuvchilari identifikatsiyasiz xususiy suhbatlar uchun ehtiyoj bor edi. Mavjud variantlar ro'yxatdan o'tishni talab qilar yoki maxfiylik himoyasiga ega emas edi.",
          solution: "Avtomatik sessiya tozalash bilan anonim bir-bir suhbatlar uchun Telegram bot yaratdim.",
          impact: "Foydalanuvchilar xavfsizlikdan qo'rqmasdan sezgir mavzular muhokasa qilishi mumkin. Vaqtinchalik sessiyalar tashvishni kamaytiradi va maxfiylikni ta'minlaydi.",
          engineering: "Tezkor sessiya boshqaruvi uchun Redis va avtomatik masshtablash uchun Vercel Serverless.",
          tech: ['Node.js', 'Telegraf', 'Redis', 'Vercel Serverless']
        },
        {
          title: '3D Portfolio',
          problem: "Rekruterlarga ko'zga tashlash uchun portfolio kerak edi, shu bilan birga professionalizm va foydalanish qulayligini saqlab.",
          solution: "Three.js 3D fon va Framer Motion animatsiyalari bilan interaktiv portfolio yaratdim, vizual ta'sir va unumdorlikni muvozanatladim.",
          impact: "Grafik dasturlashda texnik chuqurlik va dizayn sezgisini namoyish etdim, foydalanish qulayligini saqlab.",
          engineering: "WebGL unumdorligi uchun Three.js va boshlang'ich paket hajmini kamaytirish uchun lazy loading.",
          tech: ['React', 'Three.js', 'Framer Motion']
        },
        {
          title: "Muhammad Umarning Blogi",
          problem: "Texnik va falsafiy kontent platformalar bo'ylab tarqalgan edi, uzoq fikrlash uchun markazlashtirilgan joy yo'q edi.",
          solution: "Tezkor yuklash, toza tipografiya va moslashuvchan dizayn uchun React va Tailwind CSS yordamida blog platformasi yaratdim.",
          impact: "IT, adabiyot va falsafa mavzulari uchun kontent yaratish va tarqatishni markazlashtirdim.",
          engineering: "Komponent qayta ishlatilishi uchun React va maxsus CSSsiz tezkor uslublash uchun Tailwind CSS.",
          tech: ['React', 'Tailwind CSS'],
          link: "https://t.me/Muhammadjonov_Umar"
        }
      ]
    },
    resume: {
      title: 'Changelog',
      subtitle: 'Haftalik ishlanmalar, o\'rganish va arxitekturaviy markaz.',
      downloadText: 'PDF Hisobotini Yuklab Olish',
      items: [
        { type: 'build', title: 'Shrift yuklamalarini qisqartirish va optimallashtirish', company: 'Portfolio unumdorligi', date: 'Iyul (28-hafta)', desc: 'Custom shrift fayllarini WOFF2 formatiga o\'tkazib, 98.5% hajmni tejab qoldim. Three.js loopidagi reflow yukini kamaytirish uchun scroll tracking tizimini qurdik.' },
        { type: 'build', title: 'Redis kesh integratsiyasi va masshtablashtirish', company: 'Anonim chat boti', date: 'Iyun (27-hafta)', desc: 'Anonim xabar almashish serverlari uchun Redis kesh tizimini integratsiya qildim va ma\'lumot uzatish tezligini millisekund darajasiga tushirdim.' },
        { type: 'learn', title: 'Vite asinxron kod-ajratish va chunklarni boshqarish', company: 'Three.js vizualizatsiyasi', date: 'Iyun (26-hafta)', desc: 'Og\'ir WebGL va 3D grafika modullarini dinamik import yordamida yuklash tizimini qurdim. Bu dastlabki renderlash va FCP vaqtini saqlab qolishga yordam berdi.' },
        { type: 'learn', title: 'Algoritmik murakkablik va build tizimlarini sozlash', company: 'C++ tizimlar arxitekturasi', date: 'May (25-hafta)', desc: 'Algoritmlarning vaqt va xotira murakkabligini optimallashtirdim, hamda Linux terminal muhitida ishlash uchun build tizimini sozladim.' }
      ],
      skillsTitle: "Texnik Ko'nikmalar",
      frontend: 'Frontend',
      backend: 'Backend',
      otherTools: 'Boshqa Vositalar',
      frontendTech: 'React, HTML, CSS, JavaScript, Three.js',
      backendTech: 'Python, Django, C++',
      otherTech: "Grafik Dizayn, 3D Modellashtirish, No-code, AI"
    },
    contact: {
      title: "Bog'lanish",
      subtitle: "Hamkorlikda ishlashga qiziqasizmi? Menga xabar yozing yoki ijtimoiy tarmoqlar orqali bog'laning.",
      name: 'Ism',
      email: 'Elektron pochta',
      message: 'Xabar',
      send: 'Xabarni Yuborish',
      emailValue: 'umarjonmx@gmail.com',
      phoneValue: '+998-(97)-123-36-67'
    }
  }
};
