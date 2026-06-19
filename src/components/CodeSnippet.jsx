import { useState } from 'react';

export default function CodeSnippet() {
  const [copied, setCopied] = useState(false);

  const codeString = `def solve_cube(state):
    """
    A Python placeholder function for Rubik's Cube solving logic.
    Based on user request.
    :param state: dict representing cube state
    :return: list of required moves
    """
    # Placeholder functions - Full Rubik's Cube solving algorithm integrating computer vision coming soon.
    # solve_cross(state)
    # solve_f2l(state)
    # orient_last_layer(state)
    # permute_last_layer(state)
    
    return ['R', 'U', "R'", "U'"]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-20 max-w-3xl mx-auto bg-[#16161a] rounded-2xl overflow-hidden shadow-2xl relative group transform transition-transform hover:scale-[1.01] duration-500 font-martian z-20">
      
      {/* Header Bar */}
      <div className="flex items-center px-5 py-4 bg-[#1f2025] border-b border-white/5 space-x-4">
        <div className="flex space-x-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="text-sm text-white/50 tracking-wider">solver.py</span>
      </div>

      {/* Code Body */}
      <div className="p-6 md:p-8 relative">
        <button 
          onClick={handleCopy} 
          className="absolute top-5 right-5 bg-white/10 hover:bg-[#08CB00]/20 hover:text-[#08CB00] text-white/80 text-xs px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold tracking-wider"
        >
          {copied ? 'COPIED!' : 'COPY CODE'}
        </button>
        
        <pre className="text-[#a9b2c3] text-sm md:text-base leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
          <code>
            <span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">solve_cube</span>(state):{'\n'}
            <span className="text-[#98c379]">    """{'\n'}</span>
            <span className="text-[#98c379]">    A Python placeholder function for Rubik's Cube solving logic.{'\n'}</span>
            <span className="text-[#98c379]">    Based on user request.{'\n'}</span>
            <span className="text-[#98c379]">    :param state: dict representing cube state{'\n'}</span>
            <span className="text-[#98c379]">    :return: list of required moves{'\n'}</span>
            <span className="text-[#98c379]">    """</span>{'\n'}
            <span className="text-[#5c6370] italic">    # Placeholder functions - Full Rubik's Cube solving algorithm integrating computer vision coming soon.</span>{'\n'}
            <span className="text-[#5c6370] italic">    # solve_cross(state)</span>{'\n'}
            <span className="text-[#5c6370] italic">    # solve_f2l(state)</span>{'\n'}
            <span className="text-[#5c6370] italic">    # orient_last_layer(state)</span>{'\n'}
            <span className="text-[#5c6370] italic">    # permute_last_layer(state)</span>{'\n\n'}
            <span className="text-[#c678dd]">    return</span> [<span className="text-[#98c379]">'R'</span>, <span className="text-[#98c379]">'U'</span>, <span className="text-[#98c379]">"R'"</span>, <span className="text-[#98c379]">"U'"</span>]{'\n'}
          </code>
        </pre>
      </div>

      {/* Decorative Glow Outline */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-[#08CB00]/40 transition-colors duration-500 rounded-2xl shadow-[0_0_0_rgba(8,203,0,0)] group-hover:shadow-[0_0_40px_rgba(8,203,0,0.15)] z-30"></div>
    </div>
  );
}
