export default {
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', resume: 'Resume', contact: 'Contact' },
    hero: {
      tagline: 'Product-first engineering.',
      headline: 'Building products people actually use.',
      supporting1: 'AI & Robotics student. Software developer focused on AI, Backend and Product Engineering.',
      supporting2: 'Turning ambitious ideas into products that solve real problems.',
      primaryCTA: 'Explore Projects',
      secondaryCTA: 'Get in Touch'
    },
    about: {
      title: 'Builder Manifesto',
      introduction: 'An AI & Robotics student at the International Digital University, with a foundation in backend and full-stack development. I learn by building — through practical projects, hackathons and IT camps.',
      role: 'AI & Robotics Student · Software Developer',
      education: 'B.Sc. — Artificial Intelligence & Robotics, 2026–Present',
      manifesto: {
        focus1: { title: 'AI Products', description: 'Expanding human capability without replacing human judgment.' },
        focus2: { title: 'Developer Tools', description: 'Creating lightweight utilities that respect user privacy, attention, and time.' },
        focus3: { title: 'Education', description: 'Centralizing technical and literary discourse for students and enthusiasts.' },
        location: { title: 'Location', description: 'Namangan, Uzbekistan. Great products can start anywhere.' }
      }
    },
    projects: {
      title: 'Selected Works',
      viewDetails: 'View Details',
      mockupPlaceholder: 'Interactive Mockup',
      items: [
        {
          title: 'Kitobiyot 12',
          type: 'hero',
          status: 'Released',
          timeline: '2024',
          previewType: 'mobile',
          problem: 'The Uzbek literature community lacked a centralized platform for literary analysis, book reviews, and educational content.',
          solution: 'Created a dedicated Telegram channel for curated literary analysis, book reviews, and educational content about Uzbek literature.',
          impact: 'Centralized Uzbek literature discourse and created an educational resource for students and enthusiasts.',
          engineering: 'Content-first approach with Telegram API for platform reach and native messaging features.',
          tech: ['Telegram API', 'Content Strategy']
        },
        {
          title: 'Anonymous Chat',
          type: 'supporting',
          status: 'Released',
          timeline: '2023',
          previewType: 'chat',
          problem: 'Telegram users needed private conversations without identity disclosure. Existing options required registration or lacked privacy protections.',
          solution: 'Built a Telegram bot that enables anonymous one-on-one conversations with automatic session cleanup.',
          impact: 'Users can discuss sensitive topics without fear. Temporary sessions reduce anxiety and ensure privacy.',
          engineering: 'Redis for sub-millisecond session management and Vercel Serverless for automatic scaling.',
          tech: ['Node.js', 'Telegraf', 'Redis', 'Vercel Serverless']
        },
        {
          title: '3D Portfolio',
          type: 'supporting',
          status: 'Released',
          timeline: 'Current',
          previewType: 'browser',
          problem: 'Needed a portfolio that would stand out to recruiters while maintaining professionalism and accessibility.',
          solution: 'Built an interactive portfolio with Three.js 3D background and Framer Motion animations, balancing visual impact with performance.',
          impact: 'Demonstrated technical depth in graphics programming and design sensibility while maintaining accessibility.',
          engineering: 'Three.js for WebGL performance and lazy loading to reduce initial bundle size.',
          tech: ['React', 'Three.js', 'Framer Motion']
        },
        {
          title: "Muhammad Umar's Blog",
          type: 'supporting',
          status: 'Building',
          timeline: 'Current',
          previewType: 'browser',
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
      title: 'Builder Dashboard',
      subtitle: 'A product-focused map of active builds, focus stack, and long-term directions.',
      downloadText: 'Download CV',
      downloadSuccess: 'CV downloaded successfully.',
      downloadError: 'CV document is currently unavailable.',
      activeBuild: {
        label: 'Active Build',
        title: 'What I\'m building',
        desc: 'Designing distraction-free communication tools and lightweight developer utilities that respect user privacy, attention, and time.'
      },
      activeFocus: {
        label: 'Active Focus',
        title: 'What I\'m learning',
        desc: 'Algorithms & Data Structures, Artificial Intelligence, Robotics and Machine Learning — the core of my degree, applied to real projects.'
      },
      sandbox: {
        label: 'Mental Sandbox',
        title: 'What I\'m thinking about',
        desc: 'How software can quietly integrate into daily routines, disappearing into the background rather than competing for human focus.'
      },
      mission: {
        label: 'North Star',
        title: 'Long-Term Mission',
        desc: 'To ship reliable, accessible products that solve real human problems—proving that software that makes life simpler can start from Namangan.'
      },
      skillsTitle: 'Technical Arsenal',
      frontend: 'Programming',
      backend: 'Backend',
      otherTools: 'Tools',
      frontendTech: 'Python, JavaScript, HTML, CSS',
      backendTech: 'Django, Backend development',
      otherTech: 'Git, GitHub, Linux, Terminal, VS Code, Blender',
      credentialsTitle: 'Credentials',
      educationLabel: 'Education',
      educationSchool: 'International Digital University (IDU)',
      achievementsLabel: 'Achievements',
      achievements: [
        '1st Place — Regional Informatics Competition, 2024–2025 academic year',
        '2nd Place — TeenHack 2024 hackathon',
        'Zakovat — 3× inter-provincial winner'
      ],
      certificationsLabel: 'Certifications',
      certifications: 'IELTS Academic — Overall 5.5 · TEPS — 161'
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
    },
    finale: {
      chapter: 'Contact',
      echo: 'Umar builds',
      line1: 'Useful',
      line2: 'Software.',
      kicker: 'Product-first engineering. Built to solve a real problem, not to admire a technology.'
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
      title: 'Yaratuvchi Manifesti',
      introduction: 'International Digital Universityda AI & Robotics talabasiyman; backend va full-stack dasturlash asoslarim bor. Amaliy loyihalar, hakkoniylar va IT lagerlarida qurish orqali o\'rganaman.',
      role: 'AI & Robotics Talabasi · Dasturchi',
      education: 'B.Sc. — Artificial Intelligence & Robotics, 2026–hozir',
      manifesto: {
        focus1: { title: 'AI Mahsulotlar', description: 'Inson qobiliyatini kengaytirish, lekin inson hukmini almashtirmaslik.' },
        focus2: { title: 'Dasturchilar Uchun Vositalar', description: 'Foydalanuvchi maxfiyligi va vaqtini qadrlaydigan yengil tizimli vositalar.' },
        focus3: { title: 'Ta\'lim', description: 'Talabalar uchun texnik va adabiy resurslarni markazlashtirish.' },
        location: { title: 'Joylashuv', description: 'Namangan, O\'zbekiston. Ajoyib mahsulotlar hamma joyda boshlanishi mumkin.' }
      }
    },
    projects: {
      title: 'Tanlangan Loyihalar',
      viewDetails: "Batafsil ko'rish",
      mockupPlaceholder: 'Interaktiv Maket',
      items: [
        {
          title: 'Kitobiyot 12',
          type: 'hero',
          status: 'Chiqarilgan',
          timeline: '2024',
          previewType: 'mobile',
          problem: "O'zbek adabiyoti jamoasi uchun adabiy tahlil, kitob taqrizlari va ta'limiy kontent uchun markazlashtirilgan platforma yo'q edi.",
          solution: "O'zbek adabiyoti haqida adabiy tahlil, kitob taqrizlari va ta'limiy kontent uchun maxsus Telegram kanal yaratdim.",
          impact: "O'zbek adabiyoti diskursini markazlashtirdim va talabalar va havaskorlar uchun ta'limiy resurs yaratdim.",
          engineering: "Kontentga yo'naltirilgan yondashuv va platformaga erishish uchun Telegram API.",
          tech: ['Telegram API', 'Kontent Strategiyasi']
        },
        {
          title: 'Anonim Chat',
          type: 'supporting',
          status: 'Chiqarilgan',
          timeline: '2023',
          previewType: 'chat',
          problem: "Telegram foydalanuvchilari identifikatsiyasiz xususiy suhbatlar uchun ehtiyoj bor edi. Mavjud variantlar ro'yxatdan o'tishni talab qilar yoki maxfiylik himoyasiga ega emas edi.",
          solution: "Avtomatik sessiya tozalash bilan anonim bir-bir suhbatlar uchun Telegram bot yaratdim.",
          impact: "Foydalanuvchilar xavfsizlikdan qo'rqmasdan sezgir mavzular muhokasa qilishi mumkin. Vaqtinchalik sessiyalar tashvishni kamaytiradi va maxfiylikni ta'minlaydi.",
          engineering: "Tezkor sessiya boshqaruvi uchun Redis va avtomatik masshtablash uchun Vercel Serverless.",
          tech: ['Node.js', 'Telegraf', 'Redis', 'Vercel Serverless']
        },
        {
          title: '3D Portfolio',
          type: 'supporting',
          status: 'Chiqarilgan',
          timeline: 'Hozirda',
          previewType: 'browser',
          problem: "Rekruterlarga ko'zga tashlash uchun portfolio kerak edi, shu bilan birga professionalizm va foydalanish qulayligini saqlab.",
          solution: "Three.js 3D fon va Framer Motion animatsiyalari bilan interaktiv portfolio yaratdim, vizual ta'sir va unumdorlikni muvozanatladim.",
          impact: "Grafik dasturlashda texnik chuqurlik va dizayn sezgisini namoyish etdim, foydalanish qulayligini saqlab.",
          engineering: "WebGL unumdorligi uchun Three.js va boshlang'ich paket hajmini kamaytirish uchun lazy loading.",
          tech: ['React', 'Three.js', 'Framer Motion']
        },
        {
          title: "Muhammad Umarning Blogi",
          type: 'supporting',
          status: 'Qurilmoqda',
          timeline: 'Hozirda',
          previewType: 'browser',
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
      title: 'Yaratuvchi Paneli',
      subtitle: 'Amaldagi loyihalar, o\'rganish yo\'nalishlari va uzoq muddatli maqsadlarning mahsulotga yo\'naltirilgan xaritasi.',
      downloadText: 'CV yuklab olish',
      downloadSuccess: 'CV muvaffaqiyatli yuklab olindi.',
      downloadError: 'CV hujjati hozircha mavjud emas.',
      activeBuild: {
        label: 'Amaldagi Loyiha',
        title: 'Nima yaratyapman',
        desc: 'Foydalanuvchilarning maxfiyligi, diqqat-e\'tibor va vaqtini hurmat qiladigan, chalg\'itishdan xoli aloqa vositalari va yengil tizimli dasturlarni loyihalash.'
      },
      activeFocus: {
        label: 'Amaldagi Diqqat',
        title: 'Nima o\'rganyapman',
        desc: 'Algorithms & Data Structures, Artificial Intelligence, Robotics va Machine Learning — oliy ta\'limimning asosi, amaliy loyihalarga qo\'llanmoqda.'
      },
      sandbox: {
        label: 'Falsafiy Sandbox',
        title: 'Nima haqida o\'ylayapman',
        desc: 'Dasturiy ta\'minot odamlarning diqqatini jalb qilish uchun kurashish o\'rniga, qanday qilib kunlik hayotga ohista integratsiya bo\'lib, fonga o\'tishi mumkinligi haqida.'
      },
      mission: {
        label: 'Temir Qoziq',
        title: 'Uzoq Muddatli Missiya',
        desc: 'Haqiqiy insoniy muammolarni hal qiladigan ishonchli, sodda va qulay mahsulotlarni yaratish—hayotni soddalashtiruvchi dasturlar Namangandan boshlanishi mumkinligini isbotlash.'
      },
      skillsTitle: "Texnik Ko'nikmalar",
      frontend: 'Dasturlash',
      backend: 'Backend',
      otherTools: 'Vositalar',
      frontendTech: 'Python, JavaScript, HTML, CSS',
      backendTech: 'Django, Backend development',
      otherTech: 'Git, GitHub, Linux, Terminal, VS Code, Blender',
      credentialsTitle: 'Malakaviy hujjatlar',
      educationLabel: "Ta'lim",
      educationSchool: 'International Digital University (IDU)',
      achievementsLabel: 'Yutuqlar',
      achievements: [
        "1-o'rin — Viloyat Informatika Musobaqasi, 2024–2025 o'quv yili",
        "2-o'rin — TeenHack 2024 hakkoniysi",
        'Zakovat — 3 marta viloyatlararo g\'olib'
      ],
      certificationsLabel: 'Sertifikatlar',
      certifications: 'IELTS Academic — Overall 5.5 · TEPS — 161'
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
    },
    finale: {
      chapter: 'Aloqa',
      echo: 'Umar quradi',
      line1: 'Foydali',
      line2: 'Dasturiy taqminot.',
      kicker: "Mahsulotga yo'naltirilgan muhandislik. Texnologiyani ko'rsatish uchun emas, haqiqiy muammoni hal qilish uchun qurilgan."
    }
  }
};
