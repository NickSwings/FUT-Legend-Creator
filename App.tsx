import React, { useState, useEffect, useCallback } from 'react';
import PlayerCard from './components/PlayerCard';
import { PlayerData, Position, INITIAL_ATTRIBUTES, COUNTRIES } from './types';
import { generateAttributes, generatePlayerImage, fetchClubLogoUrl } from './services/geminiService';

const App: React.FC = () => {
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [playerData, setPlayerData] = useState<PlayerData>({
    name: 'Deblina Mondal',
    rating: 95,
    position: Position.ST,
    clubName: 'Real Madrid',
    clubLogoUrl: null,
    kitName: 'MONDAL',
    jerseyNumber: 5,
    nationality: 'IN', // India default
    attributes: { ...INITIAL_ATTRIBUTES },
    playerImage: null,
  });

  // Effect: Fetch Stats
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const stats = await generateAttributes(playerData.position, playerData.rating);
        if (isMounted) {
          setPlayerData(prev => ({ ...prev, attributes: stats }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    const timeoutId = setTimeout(() => {
        fetchStats();
    }, 800);

    return () => {
        isMounted = false;
        clearTimeout(timeoutId);
    };
  }, [playerData.position, playerData.rating]);

  // Effect: Fetch Club Logo
  useEffect(() => {
    let isMounted = true;
    const updateLogo = async () => {
        if (!playerData.clubName) return;
        setLoadingLogo(true);
        try {
            const url = await fetchClubLogoUrl(playerData.clubName);
            if (isMounted && url) {
                setPlayerData(prev => ({ ...prev, clubLogoUrl: url }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (isMounted) setLoadingLogo(false);
        }
    };

    const timeoutId = setTimeout(() => {
        updateLogo();
    }, 1500); // Longer debounce for search

    return () => {
        isMounted = false;
        clearTimeout(timeoutId);
    };
  }, [playerData.clubName]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAiImage = async () => {
    if (!uploadedImage) {
      setError("Please upload a face image first.");
      return;
    }
    setLoadingImage(true);
    setError(null);
    try {
      const generatedImg = await generatePlayerImage(
          uploadedImage, 
          playerData.kitName, 
          playerData.jerseyNumber, 
          playerData.clubName
      );
      setPlayerData(prev => ({ ...prev, playerImage: generatedImg }));
    } catch (err: any) {
      setError("Failed to generate image. Ensure your API key is valid and the model supports image generation.");
      console.error(err);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleInputChange = (field: keyof PlayerData, value: any) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f8b500] to-[#fceabb] mb-2 font-['Oswald'] tracking-wider">
          FUT LEGEND CREATOR
        </h1>
        <p className="text-slate-400">Build your legacy. Generate your card.</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Controls */}
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm shadow-xl">
          <h2 className="text-2xl font-bold text-[#f8b500] mb-6 border-b border-slate-700 pb-2">Player Details</h2>
          
          <div className="space-y-6">
            
            {/* 1. Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={playerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all uppercase font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kit Name</label>
                <input 
                  type="text" 
                  value={playerData.kitName}
                  onChange={(e) => handleInputChange('kitName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all uppercase font-semibold"
                />
              </div>
            </div>

            {/* 2. Club & Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex justify-between">
                    <span>Club Name</span>
                    {loadingLogo && <span className="text-yellow-500 animate-pulse text-[10px]">Finding Logo...</span>}
                </label>
                <input 
                  type="text" 
                  value={playerData.clubName}
                  onChange={(e) => handleInputChange('clubName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Jersey Number</label>
                <input 
                  type="number" 
                  value={playerData.jerseyNumber}
                  onChange={(e) => handleInputChange('jerseyNumber', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 3. Stats Control */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rating</label>
                <input 
                  type="number" 
                  min="1" max="99"
                  value={playerData.rating}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value) || 75)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all font-mono text-lg text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Position</label>
                <select 
                  value={playerData.position}
                  onChange={(e) => handleInputChange('position', e.target.value as Position)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all text-center appearance-none"
                >
                  {Object.values(Position).map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nationality</label>
                 <select 
                   value={playerData.nationality}
                   onChange={(e) => handleInputChange('nationality', e.target.value)}
                   className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b500] focus:outline-none transition-all text-sm"
                 >
                   {COUNTRIES.map(c => (
                     <option key={c.code} value={c.code}>{c.name}</option>
                   ))}
                 </select>
              </div>
            </div>

            {/* 4. Image Upload & Generation */}
            <div className="pt-6 border-t border-slate-700">
               <h3 className="text-lg font-bold text-[#f8b500] mb-4">Visuals</h3>
               
               <div className="flex flex-col gap-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Upload Face Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-slate-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#f8b500] file:text-black
                        hover:file:bg-[#d49a00]
                        cursor-pointer"
                    />
                  </div>

                  {uploadedImage && (
                    <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
                       <img src={uploadedImage} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-slate-500" />
                       <div className="flex-1">
                          <p className="text-sm text-slate-300">Face uploaded. Ready to generate card art.</p>
                       </div>
                    </div>
                  )}

                  <button 
                    onClick={handleGenerateAiImage}
                    disabled={loadingImage || !uploadedImage}
                    className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all shadow-lg
                      ${loadingImage || !uploadedImage 
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#f8b500] to-[#eeb318] text-black hover:scale-[1.02] hover:shadow-[#f8b500]/20'
                      }`}
                  >
                    {loadingImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Dreaming up Legend...
                      </span>
                    ) : 'Generate AI Player Card'}
                  </button>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center">
                      {error}
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Preview */}
        <div className="flex flex-col items-center justify-start pt-4 relative">
          
          <div className="relative z-10 scale-100 md:scale-110 lg:scale-125 transform transition-transform origin-top">
            <PlayerCard data={playerData} loading={loadingImage} />
          </div>

          <div className="mt-24 lg:mt-32 text-center space-y-2">
             <div className="bg-slate-800 px-4 py-2 rounded-full inline-flex items-center gap-2 border border-slate-700">
               <span className={`w-2 h-2 rounded-full ${loadingStats ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
               <span className="text-xs text-slate-400 uppercase font-semibold">
                 {loadingStats ? 'AI Calculating Attributes...' : 'Attributes Synced'}
               </span>
             </div>
             <p className="text-slate-500 text-sm max-w-md mx-auto">
               The AI will now match the jersey to the club and attempt to blend the background seamlessly.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;