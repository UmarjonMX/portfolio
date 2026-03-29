import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState('uz');

  const uzBio = ['Junior Dasturchi 🧑🏻💻', 'Backend⚙️ & Frontend🖌️', 'Startapchi📝', 'IT ixlosmandi🌐', 'Kontent maker💻', 'Mobilograf📱', 'Kitobxon📚', 'IELTS holder', 'Junior Full-Stack Developer, AI', 'Mnemonist', 'Art, Literature, Astronomy, Philosophy', 'Football, Volleyball, Chess, Ping pong', 'Cinema, Music, Rubik\'s cube', 'Ambivert'];
  const enBio = ['Junior Developer 🧑🏻💻', 'Backend⚙️ & Frontend🖌️', 'Startup Enthusiast📝', 'IT Fan🌐', 'Content Creator💻', 'Mobilographer📱', 'Bookworm📚', 'IELTS holder', 'Junior Full-Stack Developer, AI', 'Mnemonist', 'Art, Literature, Astronomy, Philosophy', 'Football, Volleyball, Chess, Ping pong', 'Cinema, Music, Rubik\'s cube', 'Ambivert'];
  const currentBio = language === 'uz' ? uzBio : enBio;

  const words = ['UmarjonMX', 'Developer', '11th Grade Student', 'IELTS Candidate', 'Innovator'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetweenWords = 1500;
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => setCurrentText(currentWord.slice(0, currentText.length - 1)), deleteSpeed);
      }
    } else {
      if (currentText === currentWord) {
        timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
      } else {
        timer = setTimeout(() => setCurrentText(currentWord.slice(0, currentText.length + 1)), typeSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-16 z-10 w-full">
      <div className="relative z-10 text-center px-4 w-full pointer-events-none flex flex-col items-center">
        
        {/* Dynamic Typewriter Header */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 text-primary-text dark:text-primary-text-dark flex flex-col items-center md:flex-row md:justify-center gap-2 opacity-0 animate-fadeInUp delay-100">
          <span>Hi, I'm</span>
          <span className="text-accent flex items-center min-h-[1.2em]">
            {currentText}
            <span className="inline-block border-r-4 border-accent h-[70%] sm:h-[80%] animate-pulse ml-1 translate-y-[10%]"></span>
          </span>
        </h1>

        {/* Bio Section with Toggle */}
        <div className="flex flex-col items-center max-w-3xl mx-auto w-full mb-8 opacity-0 animate-fadeInUp delay-200">
          <button 
            onClick={() => setLanguage(prev => prev === 'uz' ? 'en' : 'uz')}
            className="mb-4 px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white/30 dark:bg-black/30 backdrop-blur-sm font-bold text-xs tracking-widest text-primary-text dark:text-primary-text-dark hover:bg-accent/20 transition-colors pointer-events-auto shadow-sm"
          >
            {language === 'uz' ? '[ UZ | EN ]' : '[ EN | UZ ]'}
          </button>
          
          <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-center w-full">
            {currentBio.map((item, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-sm md:text-base font-funnel font-medium text-primary-text/90 dark:text-primary-text-dark/90 text-center shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter mb-6 text-primary-text/70 dark:text-primary-text-dark/70 opacity-0 animate-fadeInUp delay-300">
          {t('hero.title')}
        </h2>
        <p 
          className="text-lg sm:text-xl lg:text-2xl text-primary-text/80 dark:text-primary-text-dark/80 max-w-2xl mx-auto font-medium leading-relaxed opacity-0 animate-fadeInUp delay-400"
        >
          {t('hero.subtitle')}
        </p>
        
        {/* Resume CV Download Button */}
        <div
           className="mt-12 flex justify-center w-full pointer-events-auto relative z-20 opacity-0 animate-fadeInUp delay-500"
        >
          <a 
            href="/resume.pdf" 
            download 
            className="inline-flex items-center gap-4 px-8 py-4 bg-glass-light dark:bg-glass-dark border border-white/10 dark:border-white/10 backdrop-blur-md rounded-full font-funnel font-bold tracking-widest uppercase hover:bg-accent dark:hover:bg-accent hover:border-accent hover:text-white dark:hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(8,203,0,0.3)] hover:-translate-y-1"
          >
            <Download size={20} />
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </section>
  );
}
