import { getUsers } from '@/actions/user-actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import UserRoleSelect from '@/components/users/UserRoleSelect';
import { Users, Shield, Calendar, Mail } from 'lucide-react';

export default async function UsersPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        redirect('/dashboard');
    }

    const users = await getUsers();

    return (
        <div className="w-full space-y-6">
            <div className="flex w-full items-center gap-4">
                <div className="p-3 bg-pink-600 rounded-xl shadow-lg shadow-pink-500/20">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400">View and update user roles</p>
                </div>
            </div>

            <div className="glass-panel overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="hover:bg-white/5 transition-colors group"
                            >
                                <td className="p-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-4 text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <UserRoleSelect userId={user._id} currentRole={user.role} />
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(user.createdAt).toISOString().split('T')[0]}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
