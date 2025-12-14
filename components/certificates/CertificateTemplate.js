'use client';

import React from 'react';

export const CertificateTemplate = React.forwardRef(({ recipientName, competitionTitle, date, rank, category, styleSettings }, ref) => {
    // Defaults if styleSettings is not passed (safe fallback)
    const settings = styleSettings || {
        primaryColor: '#1e293b',
        secondaryColor: '#ca8a04',
        fontFamily: 'serif',
        title: 'Certificate of Achievement'
    };

    return (
        <div ref={ref} className={`w-[800px] h-[600px] bg-white p-10 mx-auto relative overflow-hidden shadow-2xl font-${settings.fontFamily}`}>

            {/* Dynamic Border */}
            <div className="absolute inset-0 border-[20px] border-double pointer-events-none z-10 m-4"
                style={{ borderColor: settings.primaryColor }}></div>

            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] rounded-full border-[50px]"
                    style={{ borderColor: `${settings.secondaryColor}33` }}></div> {/* 20% opacity hex */}
            </div>

            <div className="h-full flex flex-col items-center justify-center text-center relative z-20">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl font-bold uppercase tracking-widest mb-2"
                        style={{ color: settings.primaryColor }}>Certificate</h1>
                    <h2 className="text-2xl font-light uppercase tracking-[0.5em]"
                        style={{ color: settings.secondaryColor }}>{settings.title}</h2>
                </div>

                {/* Body */}
                <div className="space-y-6 w-3/4">
                    <p className="text-xl italic text-slate-500">This certificate is proudly presented to</p>

                    <div className="border-b-2 pb-2" style={{ borderColor: settings.primaryColor }}>
                        <h3 className="text-5xl font-bold font-sans italic"
                            style={{ color: settings.primaryColor }}>{recipientName}</h3>
                    </div>

                    <p className="text-xl text-slate-600">
                        for outstanding performance and participation in
                    </p>

                    <div>
                        <h4 className="text-3xl font-bold uppercase"
                            style={{ color: settings.primaryColor }}>{competitionTitle}</h4>
                        {category && <p className="text-lg text-slate-500 mt-1">({category})</p>}
                    </div>

                    {rank && (
                        <div className="mt-4">
                            <span className="inline-block px-6 py-2 rounded-full text-xl font-bold uppercase tracking-wider border-2"
                                style={{
                                    color: settings.secondaryColor,
                                    borderColor: `${settings.secondaryColor}33`,
                                    backgroundColor: `${settings.secondaryColor}11`
                                }}>
                                {rank === 1 ? '1st Place' : rank === 2 ? '2nd Place' : rank === 3 ? '3rd Place' : `${rank}th Position`}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-20 w-full flex justify-between px-20">
                    <div className="text-center">
                        <div className="w-48 border-b border-slate-400 mb-2"></div>
                        <p className="text-sm uppercase tracking-wider text-slate-500">Date</p>
                        <p className="font-semibold text-slate-700">{new Date(date).toLocaleDateString()}</p>
                    </div>

                    <div className="text-center">
                        <div className="w-48 border-b border-slate-400 mb-2">
                            <div className="font-signature text-3xl mb-[-10px]" style={{ color: settings.primaryColor }}>Administrator</div>
                        </div>
                        <p className="text-sm uppercase tracking-wider text-slate-500">Authorized Signature</p>
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4" style={{ borderColor: `${settings.secondaryColor}80` }}></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4" style={{ borderColor: `${settings.secondaryColor}80` }}></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4" style={{ borderColor: `${settings.secondaryColor}80` }}></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4" style={{ borderColor: `${settings.secondaryColor}80` }}></div>
        </div>
    );
});

CertificateTemplate.displayName = 'CertificateTemplate';
