import { useState, useRef } from 'react';

export default function CodeSnippet() {
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const inputRef = useRef(null);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const val = input.trim().toLowerCase();
      if (val === 'python solver.py' || val === './solver.py') {
        setOutput('> Initialization complete. Stack loaded: React, Node.js, AI, Linux. Ready to build the future.');
      } else if (val === '') {
        // Do nothing
      } else {
        setOutput('> Command not found. Try: python solver.py');
      }
      setInput('');
    }
  };

  return (
    <div className="mt-20 max-w-3xl mx-auto bg-slate-950 rounded-xl border border-primary-text dark:border-primary-text-dark overflow-hidden shadow-hard-light dark:shadow-hard-dark relative group font-martian z-20">
      
      {/* Header Bar (Blueprint reference style) */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-primary-text/20 dark:border-primary-text-dark/20">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-accent"></div>
          <span className="text-[10px] text-primary-text-dark/50 tracking-wider font-bold">LEDGER_CONSOLE // solver.py</span>
        </div>
        <span className="text-[9px] text-accent/80 font-bold uppercase tracking-widest">[ ACTIVE_LINK_TERMINAL ]</span>
      </div>

      {/* Code Body */}
      <div className="p-6 md:p-8 relative flex flex-col h-full bg-slate-950">
        <button 
          onClick={handleCopy} 
          className="absolute top-5 right-5 bg-white/10 hover:bg-accent/20 hover:text-accent text-white text-xs px-4 py-2 rounded border border-white/25 hover:border-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold tracking-wider z-10"
        >
          {copied ? 'COPIED!' : 'COPY CODE'}
        </button>
        
        <pre className="text-[#a9b2c3] text-sm md:text-base leading-relaxed overflow-x-auto whitespace-pre-wrap break-words pb-4">
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

        {/* Interactive Terminal Line */}
        <div className="border-t border-primary-text-dark/10 mt-auto pt-4 flex flex-col space-y-2">
          {output && (
            <div className="text-xs text-accent font-bold animate-pulse">
              {output}
            </div>
          )}
          <div className="flex items-center text-[#a9b2c3] text-sm font-mono w-full cursor-text" onClick={() => inputRef.current?.focus()}>
            <span className="text-accent mr-2 shrink-0">umar@umarjonmx:~$</span>
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoComplete="off"
                className="bg-transparent outline-none flex-1 text-[#a9b2c3] min-w-0 caret-transparent"
              />
              {/* Custom breathing terracotta cursor */}
              <span 
                className="absolute w-2 h-[1em] bg-accent/80 animate-pulse pointer-events-none"
                style={{
                  left: `calc(${input.length} * 0.6em)`
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
