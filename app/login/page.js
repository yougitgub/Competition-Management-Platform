"use client";
export default function LoginPage() {
  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email');
    const password = fd.get('password');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (res.ok) window.location.href = '/dashboard';
    else alert('Login failed');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-panel animate-enter">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8">Sign in to continue to your dashboard</p>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" className="glass-input placeholder-slate-500 text-slate-200" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="glass-input placeholder-slate-500 text-slate-200" required />
          </div>

          <button className="w-full py-3 mt-4 glass-button rounded-lg font-semibold text-white tracking-wide">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
