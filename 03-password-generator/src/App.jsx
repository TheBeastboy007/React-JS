import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(12);
  const [numAllowed, setNumAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*(){}[]<>?~";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    setCopied(false);
  }, [length, numAllowed, charAllowed, setPassword]);

  const copyPassToClipboard = useCallback(() => {
    passRef.current?.select();
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numAllowed, charAllowed, passwordGenerator]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#004e64] p-4">
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#00a5cf] p-6">
          <h1 className="text-2xl font-bold text-center text-white mb-2">
            Secure Password Generator
          </h1>
          <p className="text-center text-[#e0f7fa] text-sm mb-6">
            Create strong, random passwords instantly
          </p>
          
          <div className="flex rounded-lg overflow-hidden mb-6">
            <input
              type="text"
              value={password}
              className="outline-none w-full py-3 px-4 text-gray-800 bg-white font-mono"
              placeholder="Your secure password"
              readOnly
              ref={passRef}
            />
            <button
              onClick={copyPassToClipboard}
              className={`px-4 py-2 font-semibold shrink-0 transition-all ${
                copied 
                  ? "bg-[#25a18e] text-white"
                  : "bg-[#7ae582] text-[#004e64] hover:bg-[#9fffcb]"
              }`}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div className="space-y-5 bg-[#00a5cf]/90 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-white font-medium">Length: <span className="text-[#9fffcb]">{length}</span></label>
              <input
                type="range"
                min={6}
                max={50}
                value={length}
                className="w-48 h-2 bg-[#004e64] rounded-lg appearance-none cursor-pointer accent-[#7ae582]"
                onChange={(e) => setLength(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={numAllowed}
                  id="numInput"
                  onChange={() => setNumAllowed((prev) => !prev)}
                  className="w-5 h-5 rounded accent-[#7ae582] cursor-pointer"
                />
                <label htmlFor="numInput" className="ml-2 text-white cursor-pointer">
                  Numbers
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={charAllowed}
                  id="charInput"
                  onChange={() => setCharAllowed((prev) => !prev)}
                  className="w-5 h-5 rounded accent-[#7ae582] cursor-pointer"
                />
                <label htmlFor="charInput" className="ml-2 text-white cursor-pointer">
                  Special Characters
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#004e64] p-4 text-center">
          <button 
            onClick={passwordGenerator}
            className="px-6 py-2 bg-[#25a18e] text-white rounded-lg font-medium hover:bg-[#7ae582] hover:text-[#004e64] transition-colors"
          >
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;