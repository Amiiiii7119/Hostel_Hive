import { useState } from 'react';
import { useStore } from '@/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  DoorOpen, Building2, Plus, Edit, Trash2,
  MessageSquareWarning, GraduationCap, Wrench, User, X, Mail, Phone
} from 'lucide-react';

interface WardenDashboardProps {
  activeTab: string;
}

export function WardenDashboard({ activeTab }: WardenDashboardProps) {
  const { 
    currentUser, 
    hostels, 
    rooms, 
    users,
    complaints,
    addRoom,
    updateRoom,
    deleteRoom,
    addStaff,
    updateComplaintStatus,
    assignStaffToComplaint
  } = useStore();

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  
  // Room form state
  const [roomHostel, setRoomHostel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomFloor, setRoomFloor] = useState('1');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomAmenities, setRoomAmenities] = useState('');
  
  // Staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffHostel, setStaffHostel] = useState('');
  const [staffSpec, setStaffSpec] = useState('');

  if (!currentUser) return null;

  const wardenHostels = hostels.filter(h => currentUser.hostelIds?.includes(h.id));
  const wardenRooms = rooms.filter(r => currentUser.hostelIds?.includes(r.hostelId));
  const wardenStudents = users.filter(u => 
    u.role === 'student' && currentUser.hostelIds?.includes(u.hostelId || '')
  );
  const wardenStaff = users.filter(u => 
    u.role === 'staff' && currentUser.hostelIds?.includes(u.hostelId || '')
  );
  const wardenComplaints = complaints.filter(c => 
    currentUser.hostelIds?.includes(c.hostelId)
  );

  const handleAddRoom = () => {
    if (!roomHostel || !roomNumber) return;
    addRoom({
      hostelId: roomHostel,
      roomNumber,
      floor: parseInt(roomFloor),
      capacity: parseInt(roomCapacity),
      occupants: [],
      amenities: roomAmenities.split(',').map(a => a.trim()).filter(Boolean),
      status: 'available'
    });
    resetRoomForm();
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;
    updateRoom(editingRoom, {
      roomNumber,
      floor: parseInt(roomFloor),
      capacity: parseInt(roomCapacity),
      amenities: roomAmenities.split(',').map(a => a.trim()).filter(Boolean),
    });
    resetRoomForm();
  };

  const resetRoomForm = () => {
    setShowRoomForm(false);
    setEditingRoom(null);
    setRoomHostel('');
    setRoomNumber('');
    setRoomFloor('1');
    setRoomCapacity('2');
    setRoomAmenities('');
  };

  const handleAddStaff = () => {
    if (!staffName || !staffEmail || !staffPassword || !staffHostel || !staffSpec) return;
    addStaff({
      fullName: staffName,
      email: staffEmail,
      password: staffPassword,
      phone: staffPhone,
      hostelId: staffHostel,
      specialization: staffSpec
    });
    setShowStaffForm(false);
    setStaffName('');
    setStaffEmail('');
    setStaffPassword('');
    setStaffPhone('');
    setStaffHostel('');
    setStaffSpec('');
  };

  const editRoom = (room: typeof rooms[0]) => {
    setEditingRoom(room.id);
    setRoomHostel(room.hostelId);
    setRoomNumber(room.roomNumber);
    setRoomFloor(room.floor.toString());
    setRoomCapacity(room.capacity.toString());
    setRoomAmenities(room.amenities.join(', '));
    setShowRoomForm(true);
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
        <h1 className="text-2xl font-bold text-white">Warden Dashboard 🏛️</h1>
        <p className="text-gray-400 mt-1">Manage your hostels and students</p>
      </div>

      {/* No hostels assigned */}
      {wardenHostels.length === 0 && (
        <GlassCard className="p-6 border-amber-500/30 bg-amber-500/5">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-amber-300">No Hostels Assigned</h3>
            <p className="text-gray-400 mt-1">Please contact the administrator to get hostels assigned to you.</p>
          </div>
        </GlassCard>
      )}

      {/* Stats */}
      {wardenHostels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{wardenHostels.length}</p>
                <p className="text-sm text-gray-400">Hostels</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <DoorOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{wardenRooms.length}</p>
                <p className="text-sm text-gray-400">Rooms</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{wardenStudents.length}</p>
                <p className="text-sm text-gray-400">Students</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <MessageSquareWarning className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {wardenComplaints.filter(c => c.status !== 'resolved').length}
                </p>
                <p className="text-sm text-gray-400">Open Issues</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Hostels Overview */}
      {wardenHostels.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">My Hostels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wardenHostels.map(hostel => {
              const hostelRooms = rooms.filter(r => r.hostelId === hostel.id);
              const occupiedBeds = hostelRooms.reduce((sum, r) => sum + r.occupants.length, 0);
              const totalBeds = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
              
              return (
                <div key={hostel.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-white">{hostel.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{hostel.collegeName}</p>
                  <div className="mt-3 flex gap-4 text-sm text-gray-400">
                    <span>🚪 {hostelRooms.length} rooms</span>
                    <span>🛏️ {occupiedBeds}/{totalBeds} beds</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Room Management 🚪</h1>
          <p className="text-gray-400 mt-1">Create and manage hostel rooms</p>
        </div>
        {wardenHostels.length > 0 && (
          <Button icon={<Plus className="w-5 h-5" />} onClick={() => setShowRoomForm(true)}>
            Add Room
          </Button>
        )}
      </div>

      {/* Room Form */}
      {showRoomForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h3>
            <button onClick={resetRoomForm} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Hostel"
              value={roomHostel}
              onChange={(e) => setRoomHostel(e.target.value)}
              disabled={!!editingRoom}
            >
              <option value="">Select hostel</option>
              {wardenHostels.map(h => (
                <option key={h.id} value={h.id} className="bg-gray-900">{h.name}</option>
              ))}
            </Select>
            <Input
              label="Room Number"
              placeholder="e.g., 101"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
            <Input
              label="Floor"
              type="number"
              value={roomFloor}
              onChange={(e) => setRoomFloor(e.target.value)}
            />
            <Input
              label="Capacity"
              type="number"
              value={roomCapacity}
              onChange={(e) => setRoomCapacity(e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Amenities (comma separated)"
                placeholder="AC, WiFi, Attached Bath"
                value={roomAmenities}
                onChange={(e) => setRoomAmenities(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={editingRoom ? handleUpdateRoom : handleAddRoom}>
              {editingRoom ? 'Update Room' : 'Add Room'}
            </Button>
            <Button variant="secondary" onClick={resetRoomForm}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Rooms List */}
      {wardenHostels.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No hostels assigned to you yet</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wardenRooms.map(room => {
            const hostel = hostels.find(h => h.id === room.hostelId);
            return (
              <GlassCard key={room.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">Room {room.roomNumber}</h4>
                    <p className="text-sm text-gray-400">{hostel?.name}</p>
                  </div>
                  <Badge variant={room.status === 'available' ? 'success' : room.status === 'full' ? 'warning' : 'danger'}>
                    {room.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Floor: {room.floor}</p>
                  <p>Capacity: {room.occupants.length}/{room.capacity}</p>
                  <p>Amenities: {room.amenities.join(', ') || 'None'}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="ghost" onClick={() => editRoom(room)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteRoom(room.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </GlassCard>
            );
          })}
          {wardenRooms.length === 0 && (
            <GlassCard className="p-8 text-center md:col-span-3">
              <DoorOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No rooms created yet. Click "Add Room" to create one.</p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Students 🎓</h1>
        <p className="text-gray-400 mt-1">View students in your hostels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wardenStudents.map(student => {
          const hostel = hostels.find(h => h.id === student.hostelId);
          const room = rooms.find(r => r.id === student.roomId);
          return (
            <GlassCard key={student.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{student.fullName}</h4>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {student.email}
                  </p>
                  {student.phone && (
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {student.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    📚 {student.collegeName} • 🏠 {hostel?.name} • Room {room?.roomNumber || 'Unassigned'}
                  </p>
                </div>
                <Badge variant={student.status === 'active' ? 'success' : 'danger'}>
                  {student.status}
                </Badge>
              </div>
            </GlassCard>
          );
        })}
        {wardenStudents.length === 0 && (
          <GlassCard className="p-8 text-center md:col-span-2">
            <GraduationCap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No students in your hostels yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management 🔧</h1>
          <p className="text-gray-400 mt-1">Manage hostel maintenance staff</p>
        </div>
        {wardenHostels.length > 0 && (
          <Button icon={<Plus className="w-5 h-5" />} onClick={() => setShowStaffForm(true)}>
            Add Staff
          </Button>
        )}
      </div>

      {/* Staff Form */}
      {showStaffForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Add New Staff</h3>
            <button onClick={() => setShowStaffForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Staff member name"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="staff@example.com"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create password"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
            />
            <Input
              label="Phone (Optional)"
              type="tel"
              placeholder="Phone number"
              value={staffPhone}
              onChange={(e) => setStaffPhone(e.target.value)}
            />
            <Select
              label="Hostel"
              value={staffHostel}
              onChange={(e) => setStaffHostel(e.target.value)}
            >
              <option value="">Select hostel</option>
              {wardenHostels.map(h => (
                <option key={h.id} value={h.id} className="bg-gray-900">{h.name}</option>
              ))}
            </Select>
            <Select
              label="Specialization"
              value={staffSpec}
              onChange={(e) => setStaffSpec(e.target.value)}
            >
              <option value="">Select specialization</option>
              <option value="Electrical" className="bg-gray-900">⚡ Electrical</option>
              <option value="Plumbing" className="bg-gray-900">🔧 Plumbing</option>
              <option value="Carpentry" className="bg-gray-900">🪚 Carpentry</option>
              <option value="Cleaning" className="bg-gray-900">🧹 Cleaning</option>
              <option value="AC/Cooling" className="bg-gray-900">❄️ AC/Cooling</option>
              <option value="Internet/WiFi" className="bg-gray-900">📶 Internet/WiFi</option>
              <option value="Security" className="bg-gray-900">🔒 Security</option>
              <option value="General" className="bg-gray-900">🛠️ General Maintenance</option>
            </Select>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleAddStaff}>Add Staff</Button>
            <Button variant="secondary" onClick={() => setShowStaffForm(false)}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wardenStaff.map(staff => {
          const hostel = hostels.find(h => h.id === staff.hostelId);
          const assignedTasks = complaints.filter(c => c.assignedStaffId === staff.id);
          
          return (
            <GlassCard key={staff.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{staff.fullName}</h4>
                  <p className="text-sm text-gray-400">{staff.specialization}</p>
                  <p className="text-xs text-gray-500">{hostel?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{assignedTasks.length}</p>
                  <p className="text-xs text-gray-400">Tasks</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {wardenStaff.length === 0 && (
          <GlassCard className="p-8 text-center md:col-span-2">
            <Wrench className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No staff members yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Complaints 📝</h1>
        <p className="text-gray-400 mt-1">Manage and resolve student complaints</p>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {wardenComplaints.map(complaint => {
          const hostel = hostels.find(h => h.id === complaint.hostelId);
          const room = rooms.find(r => r.id === complaint.roomId);
          
          return (
            <GlassCard key={complaint.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{complaint.title}</h4>
                  <p className="text-gray-400 mt-1">{complaint.description}</p>
                </div>
                {getStatusBadge(complaint.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Student</p>
                  <p className="text-gray-300">{complaint.studentName}</p>
                </div>
                <div>
                  <p className="text-gray-500">College</p>
                  <p className="text-gray-300">{complaint.collegeName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-gray-300">{hostel?.name} - Room {room?.roomNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="text-gray-300">{complaint.category}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Assigned:</span>
                  <Select
                    value={complaint.assignedStaffId || ''}
                    onChange={(e) => assignStaffToComplaint(complaint.id, e.target.value)}
                    className="w-48"
                  >
                    <option value="">Unassigned</option>
                    {wardenStaff.map(s => (
                      <option key={s.id} value={s.id} className="bg-gray-900">
                        {s.fullName} ({s.specialization})
                      </option>
                    ))}
                  </Select>
                </div>

                {complaint.status !== 'resolved' && (
                  <div className="flex gap-2 ml-auto">
                    <Button 
                      size="sm" 
                      variant="success"
                      onClick={() => updateComplaintStatus(complaint.id, 'resolved', 'Resolved by warden')}
                    >
                      Force Resolve
                    </Button>
                  </div>
                )}
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

        {wardenComplaints.length === 0 && (
          <GlassCard className="p-8 text-center">
            <MessageSquareWarning className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No complaints yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'rooms':
      return renderRooms();
    case 'students':
      return renderStudents();
    case 'staff':
      return renderStaff();
    case 'complaints':
      return renderComplaints();
    default:
      return renderDashboard();
  }
}
