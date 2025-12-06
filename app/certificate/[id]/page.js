import React from 'react';
import Layout from '../../../components/Layout';

export default async function CertificatePage({ params }) {
  const res = await fetch(`/api/certificates/${params.id}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok || !data.certificate) return (
    <Layout>
      <div className="p-8">Certificate not found.</div>
    </Layout>
  );
  const cert = data.certificate;
  return (
    <Layout>
      <div className="p-8 bg-white dark:bg-zinc-900 border rounded max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Certificate</h1>
        <p>Result ID: {cert.result_id}</p>
        <p>Created at: {cert.created_at}</p>
        <a className="mt-4 inline-block px-4 py-2 bg-black text-white rounded" href={cert.pdf_url} target="_blank">Download PDF</a>
      </div>
    </Layout>
  );
}
