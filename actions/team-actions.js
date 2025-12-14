'use server';

import dbConnect from '@/lib/db';
import Team from '@/models/Team';
import User from '@/models/User';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createTeam(prevState, formData) {
    const session = await auth();
    if (!session) return { error: 'Unauthorized' };

    const name = formData.get('name');
    const competitionId = formData.get('competitionId');
    const description = formData.get('description');

    // If student creates team, they are leader
    const leaderId = session.user.id;

    try {
        await dbConnect();
        await Team.create({
            name,
            competition: competitionId,
            leader: leaderId,
            members: [leaderId], // Leader is first member
            description,
        });
        revalidatePath(`/dashboard/competitions/${competitionId}`);
        revalidatePath('/dashboard/teams');
        return { success: 'Team created successfully' };
    } catch (error) {
        return { error: 'Failed to create team' };
    }
}

export async function joinTeam(teamId) {
    const session = await auth();
    if (!session) return { error: 'Unauthorized' };

    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        if (!team) return { error: "Team not found" };

        const userId = session.user.id;

        // Check if already a member or pending
        const isMember = team.members.some(m => m.toString() === userId);
        if (isMember) return { error: "Already a member" };

        if (!team.joinRequests) team.joinRequests = [];
        const isPending = team.joinRequests.some(r => r.toString() === userId);
        if (isPending) return { error: "Join request already sent" };

        // Add to requests instead of members
        team.joinRequests.push(userId);
        await team.save();

        revalidatePath(`/dashboard`);
        revalidatePath(`/dashboard/teams`);
        return { success: "Join request sent to team leader" };
    } catch (e) {
        console.error('joinTeam error:', e.message);
        return { error: "Failed to join team" };
    }
}

export async function handleJoinRequest(teamId, userId, action) {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        if (!team) return { error: "Team not found" };

        // Verify leader
        if (team.leader.toString() !== session.user.id) {
            return { error: "Only team leader can manage requests" };
        }

        // Remove from requests in either case
        team.joinRequests = team.joinRequests.filter(id => id.toString() !== userId);

        if (action === 'accept') {
            // Add to members if accepting and not already there
            if (!team.members.some(m => m.toString() === userId)) {
                team.members.push(userId);
            }
        }

        await team.save();
        revalidatePath('/dashboard/teams');
        revalidatePath('/dashboard/teams/my-team');
        return { success: `Request ${action}ed` };
    } catch (e) {
        console.error('handleJoinRequest error:', e.message);
        return { error: "Failed to process request" };
    }
}

export async function getTeams(competitionId = null) {
    try {
        await dbConnect();
        const query = competitionId ? { competition: competitionId } : {};
        const teams = await Team.find(query)
            .populate('members', 'name email')
            .populate('joinRequests', 'name email')
            .populate('leader', 'name email')
            .populate('competition', 'title');
        return JSON.parse(JSON.stringify(teams));
    } catch (e) {
        return [];
    }
}

export async function getMyTeam() {
    const session = await auth();
    if (!session) return null;
    try {
        await dbConnect();
        const teams = await Team.find({ members: session.user.id })
            .populate('members', 'name email')
            .populate('joinRequests', 'name email')
            .populate('leader', 'name email')
            .populate('competition', 'title');
        return JSON.parse(JSON.stringify(teams));
    } catch (e) {
        return [];
    }
}

export async function cancelJoinRequest(teamId) {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        if (!team) return { error: "Team not found" };

        const userId = session.user.id;

        if (!team.joinRequests.some(r => r.toString() === userId)) {
            return { error: "No pending request found" };
        }

        team.joinRequests = team.joinRequests.filter(id => id.toString() !== userId);
        await team.save();

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/teams');
        return { success: "Request cancelled" };
    } catch (e) {
        console.error('cancelJoinRequest error:', e.message);
        return { error: "Failed to cancel request" };
    }
}

export async function leaveTeam(teamId) {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    try {
        await dbConnect();
        const team = await Team.findById(teamId);
        if (!team) return { error: "Team not found" };

        const userId = session.user.id;

        // Check if user is the leader
        if (team.leader.toString() === userId) {
            return { error: "Team leader cannot leave the team. Please delete the team or transfer leadership first." };
        }

        // Check if user is a member
        if (!team.members.some(m => m.toString() === userId)) {
            return { error: "You are not a member of this team" };
        }

        // Remove from members
        team.members = team.members.filter(id => id.toString() !== userId);
        await team.save();

        revalidatePath('/dashboard/teams');
        revalidatePath('/dashboard/teams/my-team');
        return { success: "Successfully left the team" };
    } catch (e) {
        console.error('leaveTeam error:', e.message);
        return { error: "Failed to leave team" };
    }
}

export async function getAllTeamsAdmin() {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    try {
        await dbConnect();
        const teams = await Team.find({})
            .populate('members', 'name email role')
            .populate('joinRequests', 'name email')
            .populate('leader', 'name email')
            .populate('competition', 'title')
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(teams));
    } catch (e) {
        console.error('getAllTeamsAdmin error:', e.message);
        return [];
    }
}
