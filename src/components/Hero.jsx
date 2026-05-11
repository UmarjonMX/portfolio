import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download } from 'lucide-react';

export default function Hero() {
  const { t, lang: language, toggleLanguage } = useLanguage();

  const wordsUz = ["Umar (Muhammad Umar)", "Junior Full-Stack Dasturchi", "AI Ixlosmandi", "Startap Asoschisi", "Falsafa Qiziquvchisi", "Adabiyot Shaydosi", "Astronomiya Havaskori", "Mnemonist", "Kino Ishqibozi", "Musiqa Shaydosi", "Shaxmatchi", "Spidkuber", "Sport Ixlosmandi", "IELTS Sohibi", "Ambivert"];
  const wordsEn = ["Umar (Muhammad Umar)", "Junior Full-Stack Developer", "AI Enthusiast", "Startup Founder", "Philosophy Student", "Literature Lover", "Astronomy Buff", "Mnemonist", "Cinephile", "Melophile", "Chess Player", "Speedcuber", "Sports Enthusiast", "IELTS Holder", "Ambivert"];
  const currentWords = language === 'en' ? wordsEn : wordsUz;

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset typewriter when language changes
  useEffect(() => {
    setCurrentWordIndex(0);
    setCurrentText('');
    setIsDeleting(false);
  }, [language]);

  useEffect(() => {
    let timer;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetweenWords = 1500;
    const currentWord = currentWords[currentWordIndex];

    if (!currentWord) return;

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % currentWords.length);
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
  }, [currentText, isDeleting, currentWordIndex, currentWords]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-16 z-10 w-full">
      <div className="relative z-10 px-4 w-full max-w-4xl mx-auto pointer-events-none flex flex-col items-start justify-center">
        
        {/* Greeting Header */}
        <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-left tracking-tighter mb-4 text-primary-text dark:text-primary-text-dark flex flex-col md:flex-row md:items-center items-start justify-start gap-2 md:gap-4 w-full opacity-0 animate-fadeInUp delay-100">
          <span className="whitespace-nowrap">{language === 'en' ? "Hi, I'm" : "Salom, men"}</span>
          <div className="flex items-center min-w-[280px] md:min-w-[400px]">
            <span className="text-accent whitespace-nowrap">{currentText}</span>
            <span className="inline-block border-r-4 border-accent h-[70%] sm:h-[80%] animate-pulse ml-1 translate-y-[10%]"></span>
          </div>
        </div>

        {/* Bio Section with Toggle */}
        <div className="flex flex-col items-start w-full mb-8 opacity-0 animate-fadeInUp delay-200">
          <button 
            onClick={toggleLanguage}
            className="mb-4 px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white/30 dark:bg-black/30 backdrop-blur-sm font-bold text-xs tracking-widest text-primary-text dark:text-primary-text-dark hover:bg-accent/20 transition-colors pointer-events-auto shadow-sm"
          >
            {language === 'uz' ? '[ UZ | EN ]' : '[ EN | UZ ]'}
          </button>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter mb-6 text-left text-primary-text/70 dark:text-primary-text-dark/70 opacity-0 animate-fadeInUp delay-300 w-full">
          {language === 'uz' ? 'Junior Full-Stack Dasturchi' : 'A Junior Full-Stack Developer'}
        </h2>
        <p 
          className="text-lg sm:text-xl lg:text-2xl text-left text-primary-text/80 dark:text-primary-text-dark/80 font-medium leading-relaxed opacity-0 animate-fadeInUp delay-400 w-full"
        >
          {t('hero.subtitle')}
        </p>
        
        {/* Resume CV Download Button */}
        <div
           className="mt-12 flex justify-start w-full pointer-events-auto relative z-20 opacity-0 animate-fadeInUp delay-500"
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
