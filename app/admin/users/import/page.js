"use client";
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import Papa from 'papaparse';

export default function ImportUsers() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [log, setLog] = useState([]);
    const [importing, setImporting] = useState(false);

    function handleFile(e) {
        const f = e.target.files[0];
        setFile(f);
        Papa.parse(f, {
            header: true,
            complete: (results) => {
                setPreview(results.data.slice(0, 5)); // Preview first 5
            }
        });
    }

    async function doImport() {
        if (!file) return;
        setImporting(true);
        setLog([]);

        Papa.parse(file, {
            header: true,
            step: async (row) => {
                const user = row.data;
                if (!user.email || !user.name) return; // Skip empty

                // Defaults
                if (!user.password) user.password = 'password123';
                if (!user.role) user.role = 'student';

                try {
                    const res = await fetch('/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    });
                    const json = await res.json();
                    if (res.ok) {
                        setLog(prev => [...prev, `✅ Imported: ${user.email}`]);
                    } else {
                        setLog(prev => [...prev, `❌ Failed: ${user.email} - ${json.error}`]);
                    }
                } catch (err) {
                    setLog(prev => [...prev, `❌ Error: ${user.email}`]);
                }
            },
            complete: () => {
                setImporting(false);
                alert('Import finished!');
            }
        });
    }

    return (
        <Layout>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8 text-white">Bulk Import Users</h1>

                <div className="glass-panel p-8 animate-enter">
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-2">1. Upload CSV</h3>
                        <p className="text-slate-400 mb-4 text-sm">Required columns: <code className="bg-slate-800 px-1 rounded">name</code>, <code className="bg-slate-800 px-1 rounded">email</code>. Optional: <code className="bg-slate-800 px-1 rounded">role</code>, <code className="bg-slate-800 px-1 rounded">password</code>.</p>
                        <input type="file" accept=".csv" onChange={handleFile} className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 input-file" />
                    </div>

                    {preview.length > 0 && (
                        <div className="mb-8 animate-enter">
                            <h3 className="text-xl font-semibold text-white mb-2">2. Preview</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="text-xs uppercase bg-white/5 text-slate-400">
                                        <tr>
                                            {Object.keys(preview[0]).map(k => <th key={k} className="px-4 py-2">{k}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5">
                                                {Object.values(row).map((v, j) => <td key={j} className="px-4 py-2">{v}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={doImport}
                                    disabled={importing}
                                    className={`glass-button px-8 py-2 text-white font-bold rounded-lg ${importing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20'}`}
                                >
                                    {importing ? 'Importing...' : 'Start Import'}
                                </button>
                            </div>
                        </div>
                    )}

                    {log.length > 0 && (
                        <div className="mt-8 p-4 bg-black/30 rounded-lg max-h-[300px] overflow-y-auto font-mono text-xs">
                            {log.map((l, i) => (
                                <div key={i} className={l.startsWith('✅') ? 'text-emerald-400' : 'text-red-400'}>{l}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
