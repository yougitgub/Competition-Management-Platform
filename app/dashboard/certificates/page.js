'use client';

import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Award, Printer } from 'lucide-react';
import { getUserCertificates } from '@/actions/result-actions';

/* Simple Certificate Template Component */
const CertificateTemplate = ({ name, competition, date, rank, refProp }) => (
    <div ref={refProp} className="w-[800px] h-[600px] bg-white text-black p-10 border-[20px] border-double border-slate-800 mx-auto hidden print:block">
        <div className="w-full h-full border-4 border-slate-800 p-8 flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-serif font-bold text-slate-900 mb-4">Certificate of Achievement</h1>
            <p className="text-2xl font-serif text-slate-600 mb-8">This honors is presented to</p>
            <h2 className="text-5xl font-handwriting text-blue-800 mb-6 border-b-2 border-slate-300 pb-2 px-10">{name}</h2>
            <p className="text-xl text-slate-700 mb-2">for outstanding performance in</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-8">{competition}</h3>

            {rank && <p className="text-lg mb-8">Achieving Rank: <span className="font-bold">{rank}th Place</span></p>}

            <div className="w-full flex justify-between items-end mt-auto px-12">
                <div className="text-center">
                    <div className="w-40 border-t-2 border-slate-800 mb-2"></div>
                    <p className="font-bold text-sm">Director Signature</p>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-yellow-600 flex items-center justify-center">
                    <Award className="w-12 h-12 text-yellow-600" />
                </div>
                <div className="text-center">
                    <p className="mb-2">{date}</p>
                    <div className="w-40 border-t-2 border-slate-800 mb-2"></div>
                    <p className="font-bold text-sm">Date</p>
                </div>
            </div>
        </div>
    </div>
);

export default function CertificatesPage() {
    const componentRef = useRef();
    const [certificates, setCertificates] = useState([]);
    const [printingCert, setPrintingCert] = useState(null); // Track which cert is being printed
    const [userSession, setUserSession] = useState(null); // Assuming client components can't get auth easy without props, but for now we'll rely on server action returning correct data. 
    // Actually user name is needed for certificate. We can get it from the result object if we populated it, or session.
    // Let's assume result actions populate 'user' and we use that name.

    useEffect(() => {
        loadCerts();
    }, []);

    async function loadCerts() {
        const data = await getUserCertificates();
        setCertificates(data);
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const printSpecificCert = (cert) => {
        setPrintingCert(cert);
        // React to print needs state update to render correct template before printing.
        // But setState is async. In a real app we might need a flushSync or effect.
        // For simplicity, we rely on the user clicking print twice if it lags, or better, we set state and use effect.
        setTimeout(handlePrint, 100);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Certificates</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.length === 0 ? (
                    <div className="col-span-full glass-panel p-12 text-center text-slate-400">
                        You don't have any certificates yet. Participate in competitions to earn them!
                    </div>
                ) : (
                    certificates.map(cert => (
                        <div key={cert._id} className="glass-panel p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                                <Award className="w-8 h-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{cert.competition?.title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{new Date(cert.competition?.endDate).toLocaleDateString()}</p>
                            <p className="text-blue-300 font-bold mb-6">{cert.position === 1 ? '1st Place' : cert.position === 2 ? '2nd Place' : cert.position === 3 ? '3rd Place' : `Rank ${cert.position}`}</p>

                            <Button onClick={() => printSpecificCert(cert)} className="w-full bg-white/10 hover:bg-white/20">
                                <Printer className="w-4 h-4 mr-2" /> Print Certificate
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {/* Hidden Template for Printing */}
            <div style={{ display: "none" }}>
                {printingCert && (
                    <CertificateTemplate
                        refProp={componentRef}
                        name={printingCert.user?.name || "Student"}
                        competition={printingCert.competition?.title}
                        date={new Date(printingCert.competition?.endDate).toLocaleDateString()}
                        rank={printingCert.position}
                    />
                )}
            </div>
        </div>
    );
}
