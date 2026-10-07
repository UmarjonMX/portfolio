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
      viewProject: 'View Project',
      mockupPlaceholder: 'Interactive Mockup',
      detail: {
        back: 'All projects',
        overview: 'Overview',
        problem: 'The Problem',
        solution: 'The Solution',
        how: 'How It Works',
        technology: 'Technology',
        outcome: 'Outcome',
        learnings: 'What I Learned',
        next: 'Next steps',
        links: 'Links',
        live: 'Live',
        nextProject: 'Next Project',
        year: 'Year',
        status: 'Status',
        category: 'Category',
        noLink: 'No public link recorded for this project.',
        notFound: 'Project not found',
        notFoundBody: 'That project does not exist, or it has been renamed.',
      },
      items: [
        {
          slug: 'kitobiyot-12',
          title: 'Kitobiyot 12',
          type: 'hero',
          status: 'Released',
          timeline: '2024',
          previewType: 'mobile',
          summary: 'A curated Telegram channel for Uzbek literature — analysis, reviews and study material.',
          problem: 'The Uzbek literature community lacked a centralized platform for literary analysis, book reviews, and educational content.',
          solution: 'Created a dedicated Telegram channel for curated literary analysis, book reviews, and educational content about Uzbek literature.',
          impact: 'Centralized Uzbek literature discourse and created an educational resource for students and enthusiasts.',
          overview: 'A reading channel for Uzbek literature, publishing analysis, book reviews and educational material.',
          how: 'Content is written and published through the Telegram channel itself, using the platform’s native publishing and messaging rather than a separate application.',
          learnings: 'The hard part was editorial, not technical: deciding what belongs in a feed and how to frame an analysis so it is genuinely useful to a student.',
          next: 'Structure the archive so a newcomer can find fundamentals before commentary, rather than reading in reverse-chronological order.',
          engineering: 'Content-first approach with Telegram API for platform reach and native messaging features.',
          tech: ['Telegram API', 'Content Strategy']
        },
        {
          slug: 'anonymous-chat',
          title: 'Anonymous Chat',
          type: 'supporting',
          status: 'Released',
          timeline: '2023',
          previewType: 'chat',
          summary: 'A Telegram bot for private one-to-one conversations with no identity disclosure.',
          problem: 'Telegram users needed private conversations without identity disclosure. Existing options required registration or lacked privacy protections.',
          solution: 'Built a Telegram bot that enables anonymous one-on-one conversations with automatic session cleanup.',
          impact: 'Users can discuss sensitive topics without fear. Temporary sessions reduce anxiety and ensure privacy.',
          overview: 'A bot that opens a private one-to-one conversation between two Telegram users without exposing either identity, and discards the session when it ends.',
          how: 'Telegraf handles the bot interface and relays messages between participants. Redis holds session state so routing resolves in sub-millisecond time, and the bot runs on Vercel Serverless so there is no server to keep alive. Sessions expire and are deleted rather than archived.',
          learnings: 'Privacy here is a systems property, not a setting. Making a session genuinely disposable meant deciding what to store, where, and when to destroy it — expiry became the design rather than an afterthought.',
          next: 'Make the session lifetime visible to the user rather than implicit, and rate-limit per session to reduce abuse without adding friction.',
          engineering: 'Redis for sub-millisecond session management and Vercel Serverless for automatic scaling.',
          tech: ['Node.js', 'Telegraf', 'Redis', 'Vercel Serverless']
        },
        {
          slug: '3d-portfolio',
          title: '3D Portfolio',
          type: 'supporting',
          status: 'Released',
          timeline: 'Current',
          previewType: 'browser',
          summary: 'This site — an editorial portfolio built on a real-time WebGL background.',
          problem: 'Needed a portfolio that would stand out to recruiters while maintaining professionalism and accessibility.',
          solution: 'Built an interactive portfolio with Three.js 3D background and Framer Motion animations, balancing visual impact with performance.',
          impact: 'Demonstrated technical depth in graphics programming and design sensibility while maintaining accessibility.',
          overview: 'This site. An attempt at a portfolio that reads as a designed editorial object rather than a list of CV bullets, while staying fast and usable. The audience is someone who will spend about a minute on it, so the first screen has to make the point immediately and the rest has to reward scrolling.',
          how: 'The background is a single fullscreen WebGL quad running one fragment shader — no scene graph, no lights, no textures. One scroll listener writes to shared motion values so sections derive their animation from a single progress source instead of each owning an observer. Sections are code-split, and the whole narrative honours prefers-reduced-motion by rendering the same markup statically.',
          learnings: 'The difficult part was not the 3D. It was performance discipline: one scroll system, no re-render per scroll event, and treating reduced motion as a first-class path.',
          next: 'Cap the frame budget explicitly on low-end hardware, and give the project pages real imagery instead of the schematic previews they use now.',
          engineering: 'Three.js for WebGL performance and lazy loading to reduce initial bundle size.',
          tech: ['React', 'Three.js', 'Framer Motion']
        },
        {
          slug: 'umars-blog',
          title: "Muhammad Umar's Blog",
          type: 'supporting',
          status: 'Building',
          timeline: 'Current',
          previewType: 'browser',
          summary: 'A long-form writing platform spanning technology, literature and philosophy.',
          problem: 'Technical and philosophical content was scattered across platforms with no centralized space for long-form thinking.',
          solution: 'Created a blog platform using React and Tailwind CSS for fast loading, clean typography, and responsive design.',
          impact: 'Centralized content creation and distribution for IT, literature, and philosophy topics.',
          overview: 'A publishing platform for long-form writing across three subjects. The audience is readers who want to follow an argument over several thousand words rather than a headline. Still in progress.',
          how: 'Posts render through React so layout and typography stay consistent across subjects, and Tailwind carries the visual system without a separate stylesheet to maintain. Reusable components mean a new post format is a component rather than a rewrite.',
          learnings: 'Writing for three very different subjects in one place forces a single typographic system to serve all of them — that constraint is what keeps the design coherent.',
          next: 'Publish a real archive index and tag structure, and add a proper reading experience for long articles.',
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
      viewProject: "Loyihani ko'rish",
      mockupPlaceholder: 'Interaktiv Maket',
      detail: {
        back: 'Barcha loyihalar',
        overview: "Umumiy ko'rinish",
        problem: 'Muammo',
        solution: 'Yechim',
        how: 'Qanday ishlaydi',
        technology: 'Texnologiya',
        outcome: 'Natija',
        learnings: "Nima o'rgandim",
        next: 'Keyingi qadamlar',
        links: 'Havolalar',
        live: 'Jonli',
        nextProject: 'Keyingi loyiha',
        year: 'Yil',
        status: 'Holati',
        category: 'Kategoriya',
        noLink: 'Bu loyiha uchun ommaviy havola qayd etilmagan.',
        notFound: 'Loyiha topilmadi',
        notFoundBody: 'Bunday loyiha mavjud emas yoki nomi o\'zgartirilgan.',
      },
      items: [
        {
          slug: 'kitobiyot-12',
          title: 'Kitobiyot 12',
          type: 'hero',
          status: 'Chiqarilgan',
          timeline: '2024',
          previewType: 'mobile',
          summary: "O'zbek adabiyoti uchun tanlangan Telegram kanali — tahlil, taqriz va o'quv materiallari.",
          problem: "O'zbek adabiyoti jamoasi uchun adabiy tahlil, kitob taqrizlari va ta'limiy kontent uchun markazlashtirilgan platforma yo'q edi.",
          solution: "O'zbek adabiyoti haqida adabiy tahlil, kitob taqrizlari va ta'limiy kontent uchun maxsus Telegram kanal yaratdim.",
          impact: "O'zbek adabiyoti diskursini markazlashtirdim va talabalar va havaskorlar uchun ta'limiy resurs yaratdim.",
          overview: "O'zbek adabiyoti uchun o'qish kanali — tahlil, kitob taqrizlari va ta'limiy materiallar nashr etiladi.",
          how: "Kontent Telegram kanalining o'zida yoziladi va nashr qilinadi — alohida ilova yaratish o'rniga platformaning tabiiy nashrlash va xabar yuborish imkoniyatlaridan foydalaniladi.",
          learnings: "Qiyin qismi texnik emas, tahririy edi: kontentga nima kirishi va tahlil talaba uchun qanday tuzilishi kerakligini hal qilish.",
          next: "Arxivni shunday tuzilmaga keltirish kerakki, yangi o'quvchi sharhdan oldin asoslarni topsin.",
          engineering: "Kontentga yo'naltirilgan yondashuv va platformaga erishish uchun Telegram API.",
          tech: ['Telegram API', 'Kontent Strategiyasi']
        },
        {
          slug: 'anonymous-chat',
          title: 'Anonim Chat',
          type: 'supporting',
          status: 'Chiqarilgan',
          timeline: '2023',
          previewType: 'chat',
          summary: "Identifikatsiyasiz xususiy suhbatlar uchun Telegram boti.",
          problem: "Telegram foydalanuvchilari identifikatsiyasiz xususiy suhbatlar uchun ehtiyoj bor edi. Mavjud variantlar ro'yxatdan o'tishni talab qilar yoki maxfiylik himoyasiga ega emas edi.",
          solution: "Avtomatik sessiya tozalash bilan anonim bir-bir suhbatlar uchun Telegram bot yaratdim.",
          impact: "Foydalanuvchilar xavfsizlikdan qo'rqmasdan sezgir mavzular muhokasa qilishi mumkin. Vaqtinchalik sessiyalar tashvishni kamaytiradi va maxfiylikni ta'minlaydi.",
          overview: "Ikkala Telegram foydalanuvchisi o'rtasida hech kimning identifikatsiyasi oshkor qilinmaydigan xususiy suhbatni ochuvchi bot. Sessiya tugagach ma'lumot yo'q qilinadi.",
          how: "Telegraf bot interfeysini boshqaradi va xabarlarni ishtirokchilar orasida yetkazadi. Redis sessiya holatini saqlaydi, shuning uchun marshrutlash sub-millisekund bajariladi. Bot Vercel Serverless'da ishlaydi — server saqlanmaydi. Sessiyalar muddati tugagach o'chiriladi, arxivlanmaydi.",
          learnings: "Bu yerda maxfiylik tizim xususiyati, emas, sozlamadir. Sessiyani haqiqatan yo'q qilish nima saqlanishi, qayerda va qachon buzilishi kerakligini hal qilishni talab qildi.",
          next: "Sessiya umrini foydalanuvchiga ko'rsatish va zaruratsiz noqulaylik qo'shmaydigan tarzda cheklash.",
          engineering: "Tezkor sessiya boshqaruvi uchun Redis va avtomatik masshtablash uchun Vercel Serverless.",
          tech: ['Node.js', 'Telegraf', 'Redis', 'Vercel Serverless']
        },
        {
          slug: '3d-portfolio',
          title: '3D Portfolio',
          type: 'supporting',
          status: 'Chiqarilgan',
          timeline: 'Hozirda',
          previewType: 'browser',
          summary: "Bu sayt — real vaqt WebGL foni ustiga qurilgan tahririy portfolio.",
          problem: "Rekruterlarga ko'zga tashlash uchun portfolio kerak edi, shu bilan birga professionalizm va foydalanish qulayligini saqlab.",
          solution: "Three.js 3D fon va Framer Motion animatsiyalari bilan interaktiv portfolio yaratdim, vizual ta'sir va unumdorlikni muvozanatladim.",
          impact: "Grafik dasturlashda texnik chuqurlik va dizayn sezgisini namoyish etdim, foydalanish qulayligini saqlab.",
          overview: "Bu sayt. CV bandlaridan emas, tahririy obyekt sifatida o'qiladigan portfolio. O'quvchi uni taxminan bir daqiqa ko'radi — shuning uchun birinchi ekran darhol fikrni yetkazishi, qolgani esa skrollga mukofot bermishi kerak.",
          how: "Fon — bitta to'liq ekranli WebGL kvadrati, bitta fragment shderi: sahna grafigi, yorug'lik yoki tekstura yo'q. Bitta skroll tinglovchi umumiy motion qiymatlarini yozadi, bo'limlar esa har biri alohida kuzatuvchi o'rniga yagona manbadan animatsiyani oladi. Bo'limlar kod bo'lib ajratilgan, butun hikoya esa prefers-reduced-motion ga hurmat qilib bir xil belgilarni statik ko'rinishda chizadi.",
          learnings: "Qiyin qism 3D emas edi. Bu unumdorlik intizomi edi: bitta skroll tizimi, har bir skroll hodisasida render yo'q, va kamaytirilgan harakat birinchi darajali yo'l sifatida.",
          next: "Past quvvatli qurilmalarda kadr byudjetini aniq belgilash va sahifalarga sxematik o'rniga haqiqiy rasmlar qo'yish.",
          engineering: "WebGL unumdorligi uchun Three.js va boshlang'ich paket hajmini kamaytirish uchun lazy loading.",
          tech: ['React', 'Three.js', 'Framer Motion']
        },
        {
          slug: 'umars-blog',
          title: "Muhammad Umarning Blogi",
          type: 'supporting',
          status: 'Qurilmoqda',
          timeline: 'Hozirda',
          previewType: 'browser',
          summary: "Texnologiya, adabiyot va falsafani qamrab oladigan uzun matnli yozish platformasi.",
          problem: "Texnik va falsafiy kontent platformalar bo'ylab tarqalgan edi, uzoq fikrlash uchun markazlashtirilgan joy yo'q edi.",
          solution: "Tezkor yuklash, toza tipografiya va moslashuvchan dizayn uchun React va Tailwind CSS yordamida blog platformasi yaratdim.",
          impact: "IT, adabiyot va falsafa mavzulari uchun kontent yaratish va tarqatishni markazlashtirdim.",
          overview: "Uch mavzu bo'yicha uzun matnli yozish uchun nashr platformasi. O'quvchi sarlavhani emas, bir necha ming so'zlik argumentni kuzatmoqchi. Hali ishlab chiqilmoqda.",
          how: "Maqolalar React orqali chiziladi, shuning uchun mavzular bo'yicha tipografiya va layout izchil qoladi. Tailwind vizual tizimni alohida stil faylisiz yuritadi. Qayta ishlatiladigan komponentlar yangi formatni qayta yozish emas, komponent qiladi.",
          learnings: "Bir joyda uchta juda farqli mavzu uchun yozish yagona tipografik tizimni hammasiga xizmat qilishga majbur qiladi — aynan shu cheklov dizayni izchil saqlaydi.",
          next: "Haqiqiy arxiv indeksi va teg tizimini nashr qilish, uzun maqolalar uchun o'qish tajribasini yaxshilash.",
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
