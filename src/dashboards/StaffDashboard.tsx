import { useState } from 'react';
import { useStore } from '@/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageSquareWarning, Clock, CheckCircle2, 
  AlertCircle, User, Building2, DoorOpen, Wrench, Mail, Phone
} from 'lucide-react';
import { format } from 'date-fns';

interface StaffDashboardProps {
  activeTab: string;
}

export function StaffDashboard({ activeTab }: StaffDashboardProps) {
  const { 
    currentUser, 
    complaints,
    hostels,
    rooms,
    updateComplaintStatus
  } = useStore();

  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  if (!currentUser) return null;

  const myTasks = complaints.filter(c => c.assignedStaffId === currentUser.id);
  const myHostel = hostels.find(h => h.id === currentUser.hostelId);

  const handleStatusChange = (complaintId: string, status: 'pending' | 'in_review' | 'resolved') => {
    if (status === 'resolved' && selectedComplaint === complaintId) {
      updateComplaintStatus(complaintId, status, resolutionNote);
      setResolutionNote('');
      setSelectedComplaint(null);
    } else {
      updateComplaintStatus(complaintId, status);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">⏳ Pending</Badge>;
      case 'in_review':
        return <Badge variant="info">🔍 In Review</Badge>;
      case 'resolved':
        return <Badge variant="success">✅ Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">🔴 High</Badge>;
      case 'medium':
        return <Badge variant="warning">🟡 Medium</Badge>;
      case 'low':
        return <Badge variant="info">🟢 Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {currentUser.fullName}! 🔧</h1>
        <p className="text-gray-400 mt-1">Here's your task overview</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{currentUser.fullName}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {currentUser.email}
              </p>
              {currentUser.phone && (
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {currentUser.phone}
                </p>
              )}
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                {currentUser.specialization || 'General'}
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {myHostel?.name || 'No hostel assigned'}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {myTasks.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Pending Tasks</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {myTasks.filter(c => c.status === 'in_review').length}
              </p>
              <p className="text-sm text-gray-400">In Progress</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {myTasks.filter(c => c.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-400">Resolved</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Tasks */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pending Tasks</h3>
        {myTasks.filter(c => c.status !== 'resolved').length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-gray-400">No pending tasks! Great job! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks
              .filter(c => c.status !== 'resolved')
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{task.category} • Room {rooms.find(r => r.id === task.roomId)?.roomNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </GlassCard>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Tasks 📋</h1>
        <p className="text-gray-400 mt-1">Manage and resolve assigned complaints</p>
      </div>

      {/* Task Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="warning">
          ⏳ Pending: {myTasks.filter(c => c.status === 'pending').length}
        </Badge>
        <Badge variant="info">
          🔍 In Progress: {myTasks.filter(c => c.status === 'in_review').length}
        </Badge>
        <Badge variant="success">
          ✅ Completed: {myTasks.filter(c => c.status === 'resolved').length}
        </Badge>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {myTasks.map(task => {
          const room = rooms.find(r => r.id === task.roomId);
          const hostel = hostels.find(h => h.id === task.hostelId);
          
          return (
            <GlassCard key={task.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                  <p className="text-gray-400 mt-1">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{task.studentName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>{hostel?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <DoorOpen className="w-4 h-4" />
                  <span>Room {room?.roomNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquareWarning className="w-4 h-4" />
                  <span>{task.category}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                📅 Created: {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}
              </div>

              {task.status !== 'resolved' && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {task.status === 'pending' && (
                      <Button 
                        variant="secondary"
                        onClick={() => handleStatusChange(task.id, 'in_review')}
                      >
                        🚀 Start Working
                      </Button>
                    )}
                    {task.status === 'in_review' && (
                      <>
                        {selectedComplaint === task.id ? (
                          <div className="w-full space-y-3">
                            <textarea
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none min-h-[80px]"
                              placeholder="Describe how you resolved the issue..."
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button 
                                variant="success"
                                onClick={() => handleStatusChange(task.id, 'resolved')}
                                disabled={!resolutionNote.trim()}
                              >
                                ✅ Mark as Resolved
                              </Button>
                              <Button 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedComplaint(null);
                                  setResolutionNote('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            variant="success"
                            onClick={() => setSelectedComplaint(task.id)}
                          >
                            ✅ Complete Task
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {task.resolutionNote && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-400">
                    <strong>✅ Resolution:</strong> {task.resolutionNote}
                  </p>
                </div>
              )}
            </GlassCard>
          );
        })}

        {myTasks.length === 0 && (
          <GlassCard className="p-8 text-center">
            <MessageSquareWarning className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No tasks assigned to you yet</p>
            <p className="text-gray-500 text-sm mt-1">Tasks will appear here when assigned by a warden or admin</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'tasks':
      return renderTasks();
    default:
      return renderDashboard();
  }
}
