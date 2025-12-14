'use client';

import { joinTeam } from '@/actions/team-actions';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export function JoinTeamButton({ team, userId }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const isMember = team.members.some(m => m._id === userId || m === userId);
    const isPending = team.joinRequests && team.joinRequests.some(r => r === userId || r._id === userId);

    const handleJoin = async () => {
        setLoading(true);
        const res = await joinTeam(team._id);
        setLoading(false);
        if (res.success) {
            setStatus('sent');
        } else if (res.error) {
            alert(res.error);
        }
    };

    if (isMember) {
        return (
            <button disabled className="w-full py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/20 cursor-default">
                Member
            </button>
        );
    }

    const handleCancel = async () => {
        setLoading(true);
        const res = await import('@/actions/team-actions').then(mod => mod.cancelJoinRequest(team._id));
        setLoading(false);
        if (res.success) {
            setStatus('cancelled');
        } else if (res.error) {
            alert(res.error);
        }
    };

    if (isPending || status === 'sent') {
        if (status === 'cancelled') {
            return (
                <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Join Team
                </button>
            );
        }

        return (
            <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm font-medium border border-orange-500/20 transition-colors flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Request"}
            </button>
        );
    }

    return (
        <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2"
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Join Team
        </button>
    );
}
