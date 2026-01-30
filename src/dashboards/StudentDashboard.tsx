import { useState } from 'react';
import { useStore } from '@/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  Home, Building2, DoorOpen, MessageSquareWarning, 
  Plus, Clock, CheckCircle2, AlertCircle,
  User, GraduationCap, MapPin, Phone, Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface StudentDashboardProps {
  activeTab: string;
}

export function StudentDashboard({ activeTab }: StudentDashboardProps) {
  const { 
    currentUser, 
    hostels, 
    rooms, 
    complaints,
    users,
    colleges,
    selectHostel,
    selectRoom,
    leaveRoom,
    createComplaint,
    updateUser,
    addCollege
  } = useStore();

  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('');
  const [complaintPriority, setComplaintPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  
  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [editCollegeName, setEditCollegeName] = useState('');
  const [otherCollegeName, setOtherCollegeName] = useState('');

  if (!currentUser) return null;

  const studentHostel = hostels.find(h => h.id === currentUser.hostelId);
  const studentRoom = rooms.find(r => r.id === currentUser.roomId);
  const availableRooms = rooms.filter(r => 
    r.hostelId === currentUser.hostelId && 
    r.status === 'available' &&
    r.occupants.length < r.capacity
  );
  const myComplaints = complaints.filter(c => c.studentId === currentUser.id);
  const hostelStaff = users.filter(u => u.role === 'staff' && u.hostelId === currentUser.hostelId);
  
  // Get hostels for student's college
  const collegeHostels = hostels.filter(h => h.collegeName === currentUser.collegeName);

  const handleCreateComplaint = () => {
    if (!currentUser.hostelId || !currentUser.roomId) return;
    
    createComplaint({
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      collegeName: currentUser.collegeName || '',
      hostelId: currentUser.hostelId,
      roomId: currentUser.roomId,
      assignedStaffId: selectedStaffId || null,
      title: complaintTitle,
      description: complaintDesc,
      category: complaintCategory,
      status: 'pending',
      priority: complaintPriority,
      imageUrl: null,
    });

    setShowComplaintForm(false);
    setComplaintTitle('');
    setComplaintDesc('');
    setComplaintCategory('');
    setSelectedStaffId('');
  };

  const handleUpdateCollege = () => {
    let finalCollegeName = editCollegeName;
    if (editCollegeName === 'Others' && otherCollegeName.trim()) {
      finalCollegeName = otherCollegeName.trim();
      addCollege(finalCollegeName, true);
    }
    
    if (finalCollegeName && finalCollegeName !== 'Others') {
      updateUser(currentUser.id, { collegeName: finalCollegeName, hostelId: null, roomId: null });
      setEditingProfile(false);
      setEditCollegeName('');
      setOtherCollegeName('');
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

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {currentUser.fullName}! 👋</h1>
        <p className="text-gray-400 mt-1">Here's your hostel overview</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
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
                  <GraduationCap className="w-4 h-4" />
                  {currentUser.collegeName || 'No college selected'}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {studentHostel?.name || 'No hostel selected'}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <DoorOpen className="w-4 h-4" />
                  {studentRoom ? `Room ${studentRoom.roomNumber}` : 'No room assigned'}
                </p>
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              setEditingProfile(true);
              setEditCollegeName(currentUser.collegeName || '');
            }}
          >
            Edit Profile
          </Button>
        </div>

        {/* Edit Profile Modal */}
        {editingProfile && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-white mb-3">Change College</h4>
            <div className="space-y-3">
              <Select
                value={editCollegeName}
                onChange={(e) => {
                  setEditCollegeName(e.target.value);
                  if (e.target.value !== 'Others') {
                    setOtherCollegeName('');
                  }
                }}
              >
                <option value="">Select college</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.name} className="bg-gray-900">
                    {college.name}
                  </option>
                ))}
                <option value="Others" className="bg-gray-900 text-amber-400">
                  ➕ Others (Add New College)
                </option>
              </Select>

              {editCollegeName === 'Others' && (
                <Input
                  placeholder="Enter your college name"
                  value={otherCollegeName}
                  onChange={(e) => setOtherCollegeName(e.target.value)}
                />
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpdateCollege}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingProfile(false)}>Cancel</Button>
              </div>
              
              <p className="text-xs text-amber-400">
                ⚠️ Changing college will reset your hostel and room selection.
              </p>
            </div>
          </div>
        )}
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
                {myComplaints.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Pending</p>
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
                {myComplaints.filter(c => c.status === 'in_review').length}
              </p>
              <p className="text-sm text-gray-400">In Review</p>
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
                {myComplaints.filter(c => c.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-400">Resolved</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      {!currentUser.collegeName && (
        <GlassCard className="p-6 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-300">Complete Your Profile</h4>
              <p className="text-sm text-gray-400">Please select your college to view available hostels.</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => {
                setEditingProfile(true);
                setEditCollegeName('');
              }}
            >
              Select College
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Recent Complaints */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Complaints</h3>
        {myComplaints.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No complaints yet</p>
        ) : (
          <div className="space-y-3">
            {myComplaints.slice(0, 3).map(complaint => (
              <div key={complaint.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">{complaint.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{complaint.category}</p>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );

  const renderRoom = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Room 🏠</h1>
        <p className="text-gray-400 mt-1">Manage your hostel accommodation</p>
      </div>

      {/* No college selected */}
      {!currentUser.collegeName && (
        <GlassCard className="p-6 text-center">
          <GraduationCap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Please select your college first to view available hostels.</p>
          <Button onClick={() => setEditingProfile(true)}>
            Select College
          </Button>
        </GlassCard>
      )}

      {/* Current Status */}
      {currentUser.collegeName && studentRoom ? (
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-violet-400" />
                Room {studentRoom.roomNumber}
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Hostel:</span> {studentHostel?.name}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Floor:</span> {studentRoom.floor}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Capacity:</span> {studentRoom.occupants.length}/{studentRoom.capacity}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Amenities:</span> {studentRoom.amenities.join(', ')}
                </p>
              </div>
            </div>
            <Button 
              variant="danger" 
              onClick={() => leaveRoom(currentUser.id)}
            >
              Leave Room
            </Button>
          </div>
        </GlassCard>
      ) : currentUser.collegeName && (
        <>
          {/* Select Hostel */}
          {!currentUser.hostelId ? (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Select a Hostel in {currentUser.collegeName}
              </h3>
              {collegeHostels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collegeHostels.map(hostel => (
                    <GlassCard 
                      key={hostel.id} 
                      className="p-4"
                      hover
                      onClick={() => selectHostel(currentUser.id, hostel.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{hostel.name}</h4>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {hostel.address}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No hostels available for your college yet.</p>
                  <p className="text-gray-500 text-sm mt-1">Please contact the administrator.</p>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Select a Room in {studentHostel?.name}</h3>
                <Button variant="ghost" onClick={() => selectHostel(currentUser.id, '')}>
                  Change Hostel
                </Button>
              </div>
              {availableRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map(room => (
                    <GlassCard 
                      key={room.id} 
                      className="p-4"
                      hover
                      onClick={() => selectRoom(currentUser.id, room.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <DoorOpen className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Room {room.roomNumber}</h4>
                          <p className="text-sm text-gray-400">
                            Floor {room.floor} • {room.occupants.length}/{room.capacity} beds
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {room.amenities.map(a => (
                          <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                            {a}
                          </span>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DoorOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No rooms available in this hostel.</p>
                </div>
              )}
            </GlassCard>
          )}
        </>
      )}
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Complaints 📝</h1>
          <p className="text-gray-400 mt-1">Track and manage your complaints</p>
        </div>
        {currentUser.roomId && (
          <Button 
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowComplaintForm(true)}
          >
            New Complaint
          </Button>
        )}
      </div>

      {!currentUser.roomId && (
        <GlassCard className="p-6 text-center">
          <MessageSquareWarning className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">You need to select a room before raising complaints</p>
        </GlassCard>
      )}

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Raise New Complaint</h3>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="Brief description of the issue"
              value={complaintTitle}
              onChange={(e) => setComplaintTitle(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 min-h-[100px]"
                placeholder="Detailed description..."
                value={complaintDesc}
                onChange={(e) => setComplaintDesc(e.target.value)}
              />
            </div>
            <Select
              label="Category"
              value={complaintCategory}
              onChange={(e) => setComplaintCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Electrical" className="bg-gray-900">⚡ Electrical</option>
              <option value="Plumbing" className="bg-gray-900">🔧 Plumbing</option>
              <option value="Furniture" className="bg-gray-900">🪑 Furniture</option>
              <option value="Cleaning" className="bg-gray-900">🧹 Cleaning</option>
              <option value="AC/Cooling" className="bg-gray-900">❄️ AC/Cooling</option>
              <option value="Internet/WiFi" className="bg-gray-900">📶 Internet/WiFi</option>
              <option value="Security" className="bg-gray-900">🔒 Security</option>
              <option value="Other" className="bg-gray-900">📋 Other</option>
            </Select>
            <Select
              label="Priority"
              value={complaintPriority}
              onChange={(e) => setComplaintPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low" className="bg-gray-900">🟢 Low</option>
              <option value="medium" className="bg-gray-900">🟡 Medium</option>
              <option value="high" className="bg-gray-900">🔴 High</option>
            </Select>
            <Select
              label="Assign Staff (Optional)"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <option value="">Auto-assign</option>
              {hostelStaff.map(staff => (
                <option key={staff.id} value={staff.id} className="bg-gray-900">
                  {staff.fullName} - {staff.specialization}
                </option>
              ))}
            </Select>
            <div className="flex gap-3">
              <Button onClick={handleCreateComplaint} disabled={!complaintTitle || !complaintCategory}>
                Submit Complaint
              </Button>
              <Button variant="secondary" onClick={() => setShowComplaintForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        {myComplaints.map(complaint => {
          const assignedStaff = users.find(u => u.id === complaint.assignedStaffId);
          return (
            <GlassCard key={complaint.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{complaint.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{complaint.description}</p>
                </div>
                {getStatusBadge(complaint.status)}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  📁 {complaint.category}
                </span>
                <span className="flex items-center gap-1">
                  🎯 {complaint.priority}
                </span>
                <span className="flex items-center gap-1">
                  👷 {assignedStaff?.fullName || 'Unassigned'}
                </span>
                <span className="flex items-center gap-1">
                  📅 {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              {complaint.resolutionNote && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-400">
                    <strong>Resolution:</strong> {complaint.resolutionNote}
                  </p>
                </div>
              )}
            </GlassCard>
          );
        })}
        {myComplaints.length === 0 && currentUser.roomId && (
          <GlassCard className="p-8 text-center">
            <MessageSquareWarning className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No complaints raised yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'room':
      return renderRoom();
    case 'complaints':
      return renderComplaints();
    default:
      return renderDashboard();
  }
}
