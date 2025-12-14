'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function RegisterIndividual({ competitionId }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleRegister() {
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ competition_id: competitionId })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Successfully registered!');
            } else {
                setMessage(data.error || 'Failed to register');
            }
        } catch (error) {
            setMessage('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500"
            >
                {loading ? 'Registering...' : 'Register for Competition'}
            </Button>
            {message && (
                <p className={`text-sm mt-2 ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
