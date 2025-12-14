'use client';

import { useState } from 'react';
import { updateCompetition } from '@/actions/competition-actions'; // Not ideal as updateComp takes formData.
// Need a specific action or use updateCompetition adapted.
// Let's create `endCompetition` action in competition-actions.js first? 
// Or use a hypothetical one. I will add setCompetitionStatus to actions.

import { Button } from '@/components/ui/button';
import { Loader2, Flag } from 'lucide-react';
import { setCompetitionStatus } from '@/actions/competition-actions'; // New action

export default function ClientEndCompetition({ competitionId }) {
    const [loading, setLoading] = useState(false);

    const handleEnd = async () => {
        if (!confirm('Are you sure you want to end this competition? usage will be locked to results.')) return;
        setLoading(true);
        await setCompetitionStatus(competitionId, 'completed');
        setLoading(false);
    };

    return (
        <Button
            onClick={handleEnd}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Flag className="w-4 h-4 mr-2" /> End Competition</>}
        </Button>
    );
}
