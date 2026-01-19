import React from 'react';
import { PlayerData, COUNTRIES } from '../types';

interface PlayerCardProps {
  data: PlayerData;
  loading: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ data, loading }) => {
  // Find flag URL
  const country = COUNTRIES.find(c => c.code === data.nationality);
  const flagUrl = country 
    ? `https://flagcdn.com/w80/${data.nationality.toLowerCase()}.png` 
    : 'https://flagcdn.com/w80/un.png';

  // Fallback image if none generated yet
  const displayImage = data.playerImage || "https://picsum.photos/400/500?grayscale";

  return (
    <div className="relative w-[340px] h-[520px] group perspective-1000 transition-all duration-500 ease-in-out">
      
      {/* Card Container (Shape & Border) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fceabb] via-[#f8b500] to-[#fceabb] p-[6px] rounded-t-[50px] rounded-b-[50px] shadow-[0_0_40px_rgba(251,191,36,0.6)] clip-shield border-2 border-[#bf953f]">
        
        {/* Inner Card Background (Dark Gold/Black texture) */}
        <div className="relative w-full h-full bg-[#1a160e] rounded-t-[44px] rounded-b-[44px] overflow-hidden flex flex-col items-center">
            
            {/* Background Effects (Sparkles/Rays) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5e4922] via-[#241c0e] to-black opacity-80 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0"></div>

            {/* Top Left Info (Rating, Position, Flag, Club) */}
            <div className="absolute top-10 left-6 z-20 flex flex-col items-center gap-1">
                <span className="text-5xl font-bold text-[#fceabb] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none font-['Oswald']">
                    {data.rating}
                </span>
                <span className="text-2xl font-bold text-[#fceabb] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] border-b border-[#fceabb]/30 pb-1 mb-1 font-['Oswald']">
                    {data.position}
                </span>
                
                {/* Nationality Flag */}
                <img 
                    src={flagUrl} 
                    alt="Nation" 
                    className="w-8 h-5 object-cover rounded shadow border border-[#fceabb]/40 mt-1" 
                />
                
                {/* Club Logo */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-2 shadow-lg border border-[#fceabb]/40 overflow-hidden backdrop-blur-sm">
                    {data.clubLogoUrl ? (
                         <img src={data.clubLogoUrl} alt="Club" className="w-full h-full object-contain p-0.5" />
                    ) : (
                         <span className="text-[#fceabb] font-bold text-xs">{data.clubName.substring(0,2).toUpperCase()}</span>
                    )}
                </div>
            </div>

            {/* Player Image */}
            <div className="absolute top-8 right-[-20px] w-[280px] h-[300px] z-10 transition-transform duration-500">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f8b500]"></div>
                    </div>
                ) : (
                    <>
                         <img 
                             src={displayImage} 
                             alt="Player" 
                             className="w-full h-full object-cover object-top mask-image-gradient drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                             style={{ 
                                 maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
                                 WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
                             }}
                         />
                         {/* Vignette Overlay for Blending */}
                         <div className="absolute inset-0 bg-gradient-to-r from-[#1a160e] via-transparent to-transparent opacity-60 mix-blend-multiply pointer-events-none"></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#1a160e] via-transparent to-transparent opacity-40 pointer-events-none"></div>
                    </>
                )}
            </div>

            {/* Bottom Section: Name & Stats */}
            <div className="absolute bottom-0 w-full h-[38%] bg-gradient-to-t from-[#1a160e] via-[#1a160e]/95 to-transparent z-20 flex flex-col items-center justify-end pb-8">
                
                {/* Player Name */}
                <h2 className="text-3xl font-bold text-[#fceabb] uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-4 text-center px-2 font-['Oswald']">
                    {data.name}
                </h2>

                {/* Divider */}
                <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-[#f8b500] to-transparent mb-3 opacity-60"></div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-[80%] text-[#fceabb]">
                    <div className="flex justify-start gap-2 items-center">
                        <span className="font-bold text-xl">{data.attributes.PAC}</span>
                        <span className="text-sm font-light tracking-widest opacity-80">PAC</span>
                    </div>
                    <div className="flex justify-start gap-2 items-center">
                        <span className="font-bold text-xl">{data.attributes.DRI}</span>
                        <span className="text-sm font-light tracking-widest opacity-80">DRI</span>
                    </div>
                    <div className="flex justify-start gap-2 items-center">
                        <span className="font-bold text-xl">{data.attributes.SHO}</span>
                        <span className="text-sm font-light tracking-widest opacity-80">SHO</span>
                    </div>
                    <div className="flex justify-start gap-2 items-center">
                        <span className="font-bold text-xl">{data.attributes.DEF}</span>
                        <span className="text-sm font-light tracking-widest opacity-80">DEF</span>
                    </div>
                    <div className="flex justify-start gap-2 items-center">
                        <span className="font-bold text-xl">{data.attributes.PAS}</span>
                        <span className="text-sm font-light tracking-widest opacity-80">PAS</span>
                    </div>
                    <div className="flex justify-start gap-2 items-center">
                        <span className="font-bold text-xl">{data.attributes.PHY}</span>
                        <span className="text-sm font-light tracking-widest opacity-80">PHY</span>
                    </div>
                </div>
            </div>

            {/* Bottom Ornament */}
            <div className="absolute bottom-3 w-4 h-4 rotate-45 border border-[#f8b500]/50"></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;