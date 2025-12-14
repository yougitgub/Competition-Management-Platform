'use client';

import { useState } from 'react';
import { updateUserRole } from '@/actions/user-actions';
import { Loader2 } from 'lucide-react';

export default function UserRoleSelect({ userId, currentRole }) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(currentRole);

    const handleChange = async (e) => {
        const newRole = e.target.value;
        setLoading(true);
        const res = await updateUserRole(userId, newRole);
        setLoading(false);
        if (res.success) {
            setRole(newRole);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <select
                disabled={loading}
                value={role}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-slate-300 focus:bg-slate-800 outline-none"
            >
                <option value="student">Student</option>

                <option value="admin">Admin</option>
            </select>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
        </div>
    );
}
