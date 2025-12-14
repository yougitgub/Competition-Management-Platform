import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { getCompetitionById } from '@/actions/competition-actions';
import { getParticipantsForScoring, getResults } from '@/actions/result-actions';
import CertificateManager from './certificate-manager';
import { redirect } from 'next/navigation';

export default async function CertificatePage({ params }) {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    const [competition, participants, results] = await Promise.all([
        getCompetitionById(id),
        getParticipantsForScoring(id),
        getResults(id)
    ]);

    if (!competition) return <div className="text-white">Competition not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Issue Certificates</h1>
                    <p className="text-slate-400">Generate and download certificates for {competition.title}</p>
                </div>
                <Link href="/dashboard/results/manage">
                    <Button variant="outline">Results Center</Button>
                </Link>
            </div>

            <CertificateManager
                competition={competition}
                participants={participants}
                results={results}
            />
        </div>
    );
}
