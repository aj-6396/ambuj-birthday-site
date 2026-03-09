import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cake, 
  Heart, 
  PartyPopper, 
  Flame, 
  Share2, 
  Music, 
  Music2, 
  Send, 
  MessageSquare, 
  Trophy, 
  Clock, 
  Instagram,
  Linkedin,
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  Laugh,
  Ghost
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Wish } from './types';
import { cn, RANDOM_WISHES, BALLOON_MESSAGES } from './utils';

// --- Components ---

const FloatingBalloon: React.FC<{ onPop: (msg: string) => void }> = ({ onPop }) => {
  const [isPopped, setIsPopped] = useState(false);
  const [position] = useState({
    left: Math.random() * 90 + '%',
    delay: Math.random() * 5 + 's',
    duration: 10 + Math.random() * 10 + 's',
    size: 40 + Math.random() * 40 + 'px',
    color: `hsl(${Math.random() * 360}, 70%, 60%)`
  });

  if (isPopped) return null;

  return (
    <motion.div
      initial={{ bottom: '-100px', opacity: 0 }}
      animate={{ bottom: '110vh', opacity: 1 }}
      transition={{ 
        duration: parseFloat(position.duration), 
        delay: parseFloat(position.delay),
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute cursor-pointer z-10"
      style={{ left: position.left }}
      onClick={() => {
        setIsPopped(true);
        const msg = BALLOON_MESSAGES[Math.floor(Math.random() * BALLOON_MESSAGES.length)];
        onPop(msg);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: [position.color]
        });
      }}
    >
      <div 
        className="rounded-full relative shadow-lg"
        style={{ 
          width: position.size, 
          height: `calc(${position.size} * 1.2)`, 
          backgroundColor: position.color 
        }}
      >
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[10px]" style={{ borderTopColor: position.color }}></div>
        <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[1px] h-[30px] bg-white/30"></div>
      </div>
    </motion.div>
  );
};

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      const isBirthday = distance <= 0;
      
      if (isBirthday) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isBirthday: true
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isBirthday: false
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center">
      {timeLeft.isBirthday && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl md:text-4xl font-black text-gradient animate-pulse">IT'S PARTY TIME! 🥳</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Celebration in progress</p>
        </motion.div>
      )}
      
      <div className="flex justify-center gap-4 md:gap-8 py-4">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="glass w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl mb-2">
              <span className="text-2xl md:text-4xl font-bold text-indigo-400">{item.value}</span>
            </div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-slate-400 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WishCard: React.FC<{ wish: Wish; onReact: (id: string, type: string) => void }> = ({ wish, onReact }) => {
  const isRoast = wish.type === 'roast';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "glass p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]",
        isRoast ? "border-orange-500/30 bg-orange-500/5" : "border-indigo-500/30 bg-indigo-500/5"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-lg text-slate-100">{wish.name}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock size={12} />
            {new Date(wish.timestamp).toLocaleString()}
          </div>
        </div>
        {isRoast ? (
          <Flame className="text-orange-500 animate-pulse" size={24} />
        ) : (
          <PartyPopper className="text-indigo-400" size={24} />
        )}
      </div>
      
      <p className="text-slate-300 leading-relaxed mb-6 italic">
        "{wish.message}"
      </p>

      <div className="flex gap-3">
        {isRoast ? (
          <>
            <button 
              onClick={() => onReact(wish.id, 'laugh')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Laugh size={14} className="text-yellow-400" />
              <span>{wish.reactions.laugh || 0}</span>
            </button>
            <button 
              onClick={() => onReact(wish.id, 'rofl')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Ghost size={14} className="text-purple-400" />
              <span>{wish.reactions.rofl || 0}</span>
            </button>
            <button 
              onClick={() => onReact(wish.id, 'savage')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Zap size={14} className="text-orange-500" />
              <span>{wish.reactions.savage || 0}</span>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => onReact(wish.id, 'love')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Heart size={14} className="text-pink-500" />
              <span>{wish.reactions.love || 0}</span>
            </button>
            <button 
              onClick={() => onReact(wish.id, 'celebrate')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <PartyPopper size={14} className="text-yellow-400" />
              <span>{wish.reactions.celebrate || 0}</span>
            </button>
            <button 
              onClick={() => onReact(wish.id, 'cheer')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Cake size={14} className="text-indigo-400" />
              <span>{wish.reactions.cheer || 0}</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [typed, setTyped] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Birthday Date: March 10, 2026
  const birthdayDate = new Date('2026-03-09T00:00:00');

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const response = await fetch('/api/wishes');
        if (response.ok) {
          const data = await response.json();
          setWishes(data);
        }
      } catch (error) {
        console.error('Failed to fetch wishes:', error);
      }
    };
    fetchWishes();

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.visitors);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();

    const handleKeyDown = (e: KeyboardEvent) => {
      setTyped(prev => {
        const next = (prev + e.key).slice(-6);
        if (next.toLowerCase() === 'legend') {
          triggerLegend();
        }
        return next;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerLegend = () => {
    setShowLegend(true);
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 }
    });
    setTimeout(() => setShowLegend(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      message,
      timestamp: Date.now(),
      reactions: isRoastMode 
        ? { laugh: 0, rofl: 0, savage: 0 } as any
        : { love: 0, celebrate: 0, cheer: 0 } as any,
      type: isRoastMode ? 'roast' : 'wish'
    };

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish)
      });
      if (response.ok) {
        setWishes([newWish, ...wishes]);
        setLastSubmittedName(name);
        setName('');
        setMessage('');
        setShowPopup(true);
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Failed to submit wish:', error);
    }
  };

  const handleReact = async (id: string, reactionType: string) => {
    try {
      const response = await fetch(`/api/wishes/${id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
      if (response.ok) {
        setWishes(prev => prev.map(w => {
          if (w.id === id) {
            return {
              ...w,
              reactions: {
                ...w.reactions,
                [reactionType]: ((w.reactions as any)[reactionType] || 0) + 1
              }
            };
          }
          return w;
        }));
      }
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  const generateRandomWish = () => {
    const random = RANDOM_WISHES[Math.floor(Math.random() * RANDOM_WISHES.length)];
    setMessage(random);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `I just wished Ambuj a Happy Birthday 🎂 Leave your message too! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const topWishes = [...wishes]
    .filter(w => w.type === 'wish')
    .sort((a, b) => {
      const getScore = (w: Wish) => Object.values(w.reactions).reduce((sum: number, val) => sum + (Number(val) || 0), 0);
      return getScore(b) - getScore(a);
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        
        {/* Animated Balloons */}
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingBalloon key={i} onPop={(msg) => {
            // Optional: show toast with balloon message
          }} />
        ))}
      </div>

      {/* Music Toggle */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed top-6 right-6 z-50 glass p-3 rounded-full hover:scale-110 transition-transform"
      >
        {isPlaying ? <Music2 className="text-indigo-400" /> : <Music className="text-slate-400" />}
      </button>

      {/* Legend Overlay */}
      <AnimatePresence>
        {showLegend && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Trophy size={120} className="text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-6xl font-black text-white mb-2">LEGEND DETECTED</h2>
              <p className="text-2xl text-yellow-400 font-bold">Respect +100 🎉</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-indigo-300 font-medium text-sm">
            <Sparkles size={16} />
            <span>Digital Celebration 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            Welcome to <span className="text-gradient">AJ's</span> <br />
           Birthday Celebration 🎉
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Leave a wish, drop a message, or roast me — let's make this birthday unforgettable!
          </p>

          <Countdown targetDate={birthdayDate} />

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#wish-form" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <Cake size={20} />
              🎂 Write a Birthday Wish
            </a>
            <a href="#wishes-wall" className="px-8 py-4 glass hover:bg-white/20 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <MessageSquare size={20} />
              View Wishes Wall
            </a>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10"
        >
          <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-500 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* About Me Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden glass p-4">
              <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <img 
                  src="https://kalkifoundation.in/wp-content/uploads/2025/07/aj-proffessional-300x300.webp" 
                  alt="Ambuj" 
                
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-6">About Me</h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              “Hi, I'm Ambuj. I enjoy learning new things, exploring technology, and building creative ideas. This page is a small digital celebration where friends and amazing people like you can leave birthday wishes and make the day even more special.”
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/ambujsingh07/" target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-xl hover:text-indigo-400 transition-colors"><Linkedin size={20} /></a>
              <a href="https://www.instagram.com/its._.aj_7/" target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-xl hover:text-indigo-400 transition-colors"><Instagram size={20} /></a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wish Form Section */}
      <section id="wish-form" className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Send Your Love</h2>
            <p className="text-slate-400">Whether it's a sweet wish or a spicy roast, I'm all ears!</p>
          </div>

          <motion.div 
            className="glass p-8 md:p-12 rounded-[40px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-4 mb-8 p-1 glass rounded-2xl">
              <button 
                onClick={() => setIsRoastMode(false)}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                  !isRoastMode ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Heart size={18} />
                Sweet Wish
              </button>
              <button 
                onClick={() => setIsRoastMode(true)}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                  isRoastMode ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Flame size={18} />
                Spicy Roast
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should I call you?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {isRoastMode ? "Your Roast" : "Your Message"}
                  </label>
                  <button 
                    type="button"
                    onClick={generateRandomWish}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Random Idea
                  </button>
                </div>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRoastMode ? "Don't hold back..." : "Say something nice..."}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white resize-none"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className={cn(
                  "w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3",
                  isRoastMode 
                    ? "bg-gradient-to-r from-orange-600 to-red-600 shadow-orange-600/20" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/20"
                )}
              >
                <Send size={20} />
                {isRoastMode ? "🔥 Send Roast" : "🎁 Send Birthday Wish"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Most Loved Wishes */}
      {topWishes.length > 0 && (
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-yellow-500/10 rounded-2xl">
              <Trophy className="text-yellow-500" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black">Most Loved Wishes</h2>
              <p className="text-slate-400">Community Favorites ❤️</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {topWishes.map((wish, i) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[32px] border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4">
                  <Sparkles className="text-yellow-500/50" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 font-bold">
                    {i + 1}
                  </div>
                  <span className="font-bold text-yellow-500">Top Wish</span>
                </div>
                <h4 className="font-bold text-xl mb-2">{wish.name}</h4>
                <p className="text-slate-300 italic mb-6">"{wish.message}"</p>
                <div className="flex items-center gap-2 text-yellow-500 font-bold">
                  <Heart size={16} fill="currentColor" />
                  <span>{Object.values(wish.reactions).reduce((a: number, b) => a + (Number(b) || 0), 0)} Reactions</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Wishes Wall */}
      <section id="wishes-wall" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black mb-2">🎉 Wishes Wall</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-sm font-bold">
              <PartyPopper size={14} />
              {wishes.filter(w => w.type === 'wish').length} Birthday Wishes Received
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {wishes
              .filter(w => w.type === 'wish')
              .map((wish) => (
                <WishCard key={wish.id} wish={wish} onReact={handleReact} />
              ))}
          </AnimatePresence>
        </div>

        {wishes.filter(w => w.type === 'wish').length === 0 && (
          <div className="text-center py-20 glass rounded-[40px]">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="text-slate-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-500">No wishes yet.</h3>
            <p className="text-slate-600 mt-2">Be the first one to make history!</p>
          </div>
        )}
      </section>

      {/* Roast Section */}
      <section id="roast-section" className="py-24 px-6 max-w-6xl mx-auto bg-orange-500/5 rounded-[60px] my-12 border border-orange-500/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black mb-2 text-orange-500">🔥 Roast Ambuj</h2>
            <p className="text-slate-400">Funny roasts from friends who know me too well.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {wishes
              .filter(w => w.type === 'roast')
              .map((wish) => (
                <WishCard key={wish.id} wish={wish} onReact={handleReact} />
              ))}
          </AnimatePresence>
        </div>

        {wishes.filter(w => w.type === 'roast').length === 0 && (
          <div className="text-center py-20 glass rounded-[40px] border-orange-500/20">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="text-orange-500/50" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-500">No roasts yet.</h3>
            <p className="text-slate-600 mt-2">Ambuj is safe... for now. 🔥</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-4 text-gradient">AJ's Birthday 2026</h2>
          <p className="text-slate-500 mb-8">Made with ❤️ and a lot of tea 😂.</p>
          
          {visitorCount !== null && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-400">
                <span className="text-white font-bold">{visitorCount}</span> visitors have joined the party!
              </span>
            </div>
          )}

          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowPopup(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="glass p-8 md:p-12 rounded-[40px] max-w-lg w-full relative z-10 text-center"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20">
                <PartyPopper size={48} className="text-white" />
              </div>

              <h2 className="text-3xl font-black mb-4">Thank you, {lastSubmittedName}! 🎉</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Your birthday wish truly made my day special. I appreciate you taking the time to celebrate with me!
              </p>
              
              <div className="p-4 bg-white/5 rounded-2xl mb-8 border border-white/10">
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Status</p>
                <p className="text-white">Your wish has been added to the Wishes Wall.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setShowPopup(false);
                    document.getElementById('wishes-wall')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-4 glass hover:bg-white/20 rounded-2xl font-bold transition-all"
                >
                  View Wall
                </button>
                <button 
                  onClick={shareWhatsApp}
                  className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button 
                  onClick={copyLink}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
