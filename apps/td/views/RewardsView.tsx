import React from 'react';

interface RewardsViewProps {
    points: number;
}

const RewardsView: React.FC<RewardsViewProps> = ({ points }) => {
    const categories = [
        { id: 'travel', label: 'Travel', icon: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' },
        { id: 'shop', label: 'Shop', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z M3 6h18 M16 10a4 4 0 0 1-8 0' },
        { id: 'gift', label: 'Gift Cards', icon: 'M20 12V8H4v4 M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' },
        { id: 'cash', label: 'Cash Back', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f4f7f6] animate-in fade-in font-sans">
            <div className="bg-[#008A00] pt-14 pb-8 px-6 text-white shrink-0 shadow-sm">
                <h1 className="text-xl font-bold tracking-tight">TD Rewards</h1>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Points Card */}
                <div className="p-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#008A00]/5 rounded-bl-[120px]"></div>
                        <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-3">Available Points Balance</p>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{points.toLocaleString()}</h2>
                        <p className="text-[#008A00] font-bold text-sm">Estimated Value: ${ (points / 200).toFixed(2) }</p>
                        
                        <button className="mt-8 w-full py-4 bg-[#008A00] text-white font-bold rounded-full shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
                            Redeem Points
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="px-5 space-y-4 pb-20">
                    <h3 className="text-gray-800 font-black text-[13px] uppercase tracking-widest px-1">Redemption Categories</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map(cat => (
                            <button key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-4 active:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-[#008A00]/5 flex items-center justify-center text-[#008A00]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={cat.icon}/></svg>
                                </div>
                                <span className="font-bold text-gray-800 text-[14px]">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-4">
                        <h4 className="font-bold text-gray-800 mb-4">Partner Offers</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg shrink-0 flex items-center justify-center text-white font-black">EXP</div>
                                <div>
                                    <p className="font-bold text-sm">Expedia for TD</p>
                                    <p className="text-xs text-gray-500">Book and earn more points</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center pt-4 border-t border-gray-50">
                                <div className="w-12 h-12 bg-black rounded-lg shrink-0 flex items-center justify-center text-white font-black text-xs">Amazon</div>
                                <div>
                                    <p className="font-bold text-sm">Amazon.ca Shop with Points</p>
                                    <p className="text-xs text-gray-500">Use points directly at checkout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsView;