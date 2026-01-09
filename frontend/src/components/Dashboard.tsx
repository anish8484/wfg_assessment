import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Edit2 } from 'lucide-react';
import { EditModal } from './EditModal';

// Dummy Data
const INITIAL_CALL_DATA = [
    { time: '09:00', calls: 120 },
    { time: '10:00', calls: 240 },
    { time: '11:00', calls: 340 }, // We will allow editing this one
    { time: '12:00', calls: 280 },
    { time: '13:00', calls: 150 },
    { time: '14:00', calls: 310 },
    { time: '15:00', calls: 450 },
];

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

export const Dashboard: React.FC = () => {
    const [callData, setCallData] = useState(INITIAL_CALL_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handling the edit
    // For simplicity, we hardcode editing the "11:00" slot which is index 2
    const targetIndex = 2;
    const targetItem = callData[targetIndex];

    const handleUpdate = (email: string, newValue: number) => {
        const newData = [...callData];
        newData[targetIndex] = { ...newData[targetIndex], calls: newValue };
        setCallData(newData);
        console.log(`Updated by ${email}: ${newValue}`);
    };

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <header className="mb-10 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-pink-500 bg-clip-text text-transparent mb-4">
                    Voice Agent Analytics
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Real-time performance metrics and call volume visualization.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

                {/* Interactive Chart */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl bg-surface p-6 border border-slate-700 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-sm transition-all"
                        >
                            <Edit2 size={16} />
                            Overwrite Data
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-6 text-slate-100 border-l-4 border-primary pl-4">
                        Hourly Call Volume
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={callData}>
                                <defs>
                                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }}
                                    itemStyle={{ color: '#38bdf8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="calls"
                                    stroke="#38bdf8"
                                    fillOpacity={1}
                                    fill="url(#colorCalls)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="rounded-2xl bg-surface p-6 border border-slate-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-slate-100">Sentiment Distribution</h2>
                    <div className="h-[250px] w-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Positive', value: 400 },
                                        { name: 'Neutral', value: 300 },
                                        { name: 'Negative', value: 300 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[0, 1, 2].map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#38bdf8]" /> Positive</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#818cf8]" /> Neutral</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#c084fc]" /> Negative</div>
                    </div>
                </div>

                {/* Agent Performance */}
                <div className="rounded-2xl bg-surface p-6 border border-slate-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-slate-100">Agent Performance (Avg Handle Time)</h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={callData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }}
                                />
                                <Bar dataKey="calls" fill="#818cf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleUpdate}
                initialValue={targetItem.calls}
                dataLabel={`Calls at ${targetItem.time}`}
            />
        </div>
    );
};
