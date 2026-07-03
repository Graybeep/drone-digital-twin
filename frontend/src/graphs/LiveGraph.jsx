import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LiveGraph({ data, lines, yDomain=['auto', 'auto'], title }) {
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-[10px] font-bold text-slate-400 mb-1 pl-2 uppercase tracking-wider">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={yDomain} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px' }}
              itemStyle={{ color: '#e2e8f0', padding: 0 }}
              labelStyle={{ display: 'none' }}
              isAnimationActive={false}
            />
            {lines.map((line, idx) => (
              <Line 
                key={idx}
                type="monotone" 
                dataKey={line.dataKey} 
                stroke={line.stroke} 
                name={line.name}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
