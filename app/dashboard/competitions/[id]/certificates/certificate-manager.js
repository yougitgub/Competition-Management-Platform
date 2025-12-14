'use client';

import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CertificateTemplate } from '@/components/certificates/CertificateTemplate';
import { Button } from '@/components/ui/button';
import { FileText, Download, X } from 'lucide-react';

export default function CertificateManager({ competition, participants, results }) {
    const [previewData, setPreviewData] = useState(null);
    const [styleSettings, setStyleSettings] = useState({
        primaryColor: '#1e293b', // slate-800
        secondaryColor: '#ca8a04', // yellow-600
        fontFamily: 'serif',
        title: 'Certificate of Achievement'
    });

    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Certificate - ${previewData?.recipientName || 'Participant'}`,
    });

    const getRank = (pid) => {
        const result = results.find(r => {
            const itemsId = competition.type === 'team' ? r.team?._id : r.user?._id;
            return itemsId === pid;
        });
        return result ? result.position : null;
    };

    const handlePreview = (participant) => {
        const pid = competition.type === 'team' ? participant.team._id : participant.user._id;
        const name = competition.type === 'team' ? participant.team?.name : participant.user?.name;

        setPreviewData({
            recipientName: name,
            competitionTitle: competition.title,
            category: competition.category,
            date: competition.endDate,
            rank: getRank(pid)
        });
    };

    return (
        <div>
            {/* List */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                            <tr>
                                <th className="p-4">Participant</th>
                                <th className="p-4">Email / Info</th>
                                <th className="p-4">Rank</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {participants.map((p) => {
                                const pid = competition.type === 'team' ? p.team?._id : p.user?._id;
                                const name = competition.type === 'team' ? p.team?.name : p.user?.name;
                                const email = competition.type === 'team' ? `${p.team?.members?.length || 0} Members` : p.user?.email;
                                const rank = getRank(pid);

                                return (
                                    <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{name}</td>
                                        <td className="p-4 text-slate-400">{email}</td>
                                        <td className="p-4 text-slate-400">
                                            {rank ? <span className="text-yellow-400 font-bold">#{rank}</span> : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePreview(p)}
                                                className="gap-2"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Certificate
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {participants.length === 0 && (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No participants found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Preview Modal */}
            {previewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex">

                        {/* Settings Panel */}
                        <div className="w-80 bg-slate-950 p-6 border-r border-white/10 space-y-6 overflow-y-auto">
                            <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4">Customize Design</h3>

                            <div className="space-y-3">
                                <label className="text-slate-400 text-sm">Certificate Title</label>
                                <input
                                    type="text"
                                    value={styleSettings.title}
                                    onChange={(e) => setStyleSettings({ ...styleSettings, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-slate-400 text-sm">Theme Color (Text)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={styleSettings.primaryColor}
                                        onChange={(e) => setStyleSettings({ ...styleSettings, primaryColor: e.target.value })}
                                        className="h-10 w-full rounded cursor-pointer bg-transparent"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-slate-400 text-sm">Accent Color (Borders)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={styleSettings.secondaryColor}
                                        onChange={(e) => setStyleSettings({ ...styleSettings, secondaryColor: e.target.value })}
                                        className="h-10 w-full rounded cursor-pointer bg-transparent"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-slate-400 text-sm">Font Style</label>
                                <select
                                    value={styleSettings.fontFamily}
                                    onChange={(e) => setStyleSettings({ ...styleSettings, fontFamily: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                                >
                                    <option value="serif">Elegant Serif</option>
                                    <option value="sans">Modern Sans</option>
                                    <option value="mono">Technical Mono</option>
                                </select>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-800">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
                                <h3 className="text-lg font-bold text-white">Preview</h3>
                                <button onClick={() => setPreviewData(null)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-auto p-12 flex justify-center items-center">
                                <div className="scale-75 origin-center shadow-2xl">
                                    <CertificateTemplate
                                        ref={printRef}
                                        {...previewData}
                                        styleSettings={styleSettings}
                                    />
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-slate-900">
                                <Button variant="ghost" onClick={() => setPreviewData(null)}>Cancel</Button>
                                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 gap-2">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
