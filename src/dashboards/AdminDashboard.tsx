import { useState } from 'react';
import { useStore } from '@/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  Building2, DoorOpen, GraduationCap, Wrench, Shield,
  MessageSquareWarning, Plus, Edit, Trash2,
  User, Ban, CheckCircle, X, TrendingUp, Mail, Phone
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const { 
    users, 
    hostels, 
    rooms, 
    complaints,
    colleges,
    addHostel,
    updateHostel,
    deleteHostel,
    addRoom,
    deleteRoom,
    blockUser,
    unblockUser,
    deleteUser,
    updateComplaintStatus,
    assignStaffToComplaint,
    addCollege,
    addWarden,
    updateWarden
  } = useStore();

  const [showHostelForm, setShowHostelForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showWardenForm, setShowWardenForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<string | null>(null);
  const [editingWarden, setEditingWarden] = useState<string | null>(null);
  
  // Hostel form
  const [hostelName, setHostelName] = useState('');
  const [hostelCollege, setHostelCollege] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');
  const [hostelRooms, setHostelRooms] = useState('10');
  
  // Room form
  const [roomHostel, setRoomHostel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomFloor, setRoomFloor] = useState('1');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomAmenities, setRoomAmenities] = useState('');
  
  // College form
  const [newCollegeName, setNewCollegeName] = useState('');
  
  // Warden form
  const [wardenName, setWardenName] = useState('');
  const [wardenEmail, setWardenEmail] = useState('');
  const [wardenPassword, setWardenPassword] = useState('');
  const [wardenPhone, setWardenPhone] = useState('');
  const [wardenHostels, setWardenHostels] = useState<string[]>([]);

  const students = users.filter(u => u.role === 'student');
  const staff = users.filter(u => u.role === 'staff');
  const wardens = users.filter(u => u.role === 'warden');

  const handleAddHostel = () => {
    addHostel({
      name: hostelName,
      collegeName: hostelCollege,
      address: hostelAddress,
      totalRooms: parseInt(hostelRooms)
    });
    resetHostelForm();
  };

  const handleUpdateHostel = () => {
    if (!editingHostel) return;
    updateHostel(editingHostel, {
      name: hostelName,
      collegeName: hostelCollege,
      address: hostelAddress,
      totalRooms: parseInt(hostelRooms)
    });
    resetHostelForm();
  };

  const resetHostelForm = () => {
    setShowHostelForm(false);
    setEditingHostel(null);
    setHostelName('');
    setHostelCollege('');
    setHostelAddress('');
    setHostelRooms('10');
  };

  const editHostel = (hostel: typeof hostels[0]) => {
    setEditingHostel(hostel.id);
    setHostelName(hostel.name);
    setHostelCollege(hostel.collegeName);
    setHostelAddress(hostel.address);
    setHostelRooms(hostel.totalRooms.toString());
    setShowHostelForm(true);
  };

  const handleAddRoom = () => {
    addRoom({
      hostelId: roomHostel,
      roomNumber,
      floor: parseInt(roomFloor),
      capacity: parseInt(roomCapacity),
      occupants: [],
      amenities: roomAmenities.split(',').map(a => a.trim()).filter(Boolean),
      status: 'available'
    });
    setShowRoomForm(false);
    setRoomHostel('');
    setRoomNumber('');
    setRoomFloor('1');
    setRoomCapacity('2');
    setRoomAmenities('');
  };

  const handleAddCollege = () => {
    if (!newCollegeName.trim()) return;
    addCollege(newCollegeName.trim());
    setNewCollegeName('');
    setShowCollegeForm(false);
  };

  const handleAddWarden = () => {
    if (!wardenName || !wardenEmail || !wardenPassword) return;
    addWarden({
      fullName: wardenName,
      email: wardenEmail,
      password: wardenPassword,
      phone: wardenPhone,
      hostelIds: wardenHostels,
    });
    resetWardenForm();
  };

  const handleUpdateWarden = () => {
    if (!editingWarden) return;
    updateWarden(editingWarden, {
      fullName: wardenName,
      phone: wardenPhone,
      hostelIds: wardenHostels,
    });
    resetWardenForm();
  };

  const resetWardenForm = () => {
    setShowWardenForm(false);
    setEditingWarden(null);
    setWardenName('');
    setWardenEmail('');
    setWardenPassword('');
    setWardenPhone('');
    setWardenHostels([]);
  };

  const editWardenFunc = (warden: typeof wardens[0]) => {
    setEditingWarden(warden.id);
    setWardenName(warden.fullName);
    setWardenEmail(warden.email);
    setWardenPhone(warden.phone || '');
    setWardenHostels(warden.hostelIds || []);
    setShowWardenForm(true);
  };

  const toggleWardenHostel = (hostelId: string) => {
    setWardenHostels(prev => 
      prev.includes(hostelId) 
        ? prev.filter(id => id !== hostelId)
        : [...prev, hostelId]
    );
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

  // Analytics calculations
  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupants.length, 0);
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '0';

  const complaintsByCollege: Record<string, number> = {};
  complaints.forEach(c => {
    complaintsByCollege[c.collegeName] = (complaintsByCollege[c.collegeName] || 0) + 1;
  });

  const complaintsByCategory: Record<string, number> = {};
  complaints.forEach(c => {
    complaintsByCategory[c.category] = (complaintsByCategory[c.category] || 0) + 1;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard 🎛️</h1>
        <p className="text-gray-400 mt-1">Complete system overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{hostels.length}</p>
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
              <p className="text-2xl font-bold text-white">{rooms.length}</p>
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
              <p className="text-2xl font-bold text-white">{students.length}</p>
              <p className="text-sm text-gray-400">Students</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{staff.length}</p>
              <p className="text-sm text-gray-400">Staff</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Occupancy Rate</p>
              <p className="text-3xl font-bold text-white mt-1">{occupancyRate}%</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-violet-400" />
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Open Complaints</p>
              <p className="text-3xl font-bold text-white mt-1">
                {complaints.filter(c => c.status !== 'resolved').length}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <MessageSquareWarning className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Colleges</p>
              <p className="text-3xl font-bold text-white mt-1">{colleges.length}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Complaints</h3>
        <div className="space-y-3">
          {complaints.slice(0, 5).map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">{c.title}</p>
                <p className="text-xs text-gray-400">{c.studentName} • {c.collegeName}</p>
              </div>
              {getStatusBadge(c.status)}
            </div>
          ))}
          {complaints.length === 0 && (
            <p className="text-gray-400 text-center py-4">No complaints yet</p>
          )}
        </div>
      </GlassCard>
    </div>
  );

  const renderHostels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hostel Management 🏛️</h1>
          <p className="text-gray-400 mt-1">Create and manage hostels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowCollegeForm(true)}>
            Add College
          </Button>
          <Button icon={<Plus className="w-5 h-5" />} onClick={() => setShowHostelForm(true)}>
            Add Hostel
          </Button>
        </div>
      </div>

      {/* College Form */}
      {showCollegeForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Add New College</h3>
            <button onClick={() => setShowCollegeForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-4">
            <Input
              placeholder="College name"
              value={newCollegeName}
              onChange={(e) => setNewCollegeName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCollege}>Add College</Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Existing Colleges ({colleges.length})</p>
            <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2">
              {colleges.map(c => (
                <span key={c.id} className={`px-3 py-1 rounded-full text-sm ${c.isCustom ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-gray-300'}`}>
                  {c.name} {c.isCustom && '(Custom)'}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Hostel Form */}
      {showHostelForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
            </h3>
            <button onClick={resetHostelForm} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hostel Name"
              placeholder="e.g., Phoenix Hall"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
            />
            <Select
              label="College"
              value={hostelCollege}
              onChange={(e) => setHostelCollege(e.target.value)}
            >
              <option value="">Select college</option>
              {colleges.map(c => (
                <option key={c.id} value={c.name} className="bg-gray-900">{c.name}</option>
              ))}
            </Select>
            <Input
              label="Address"
              placeholder="Full address"
              value={hostelAddress}
              onChange={(e) => setHostelAddress(e.target.value)}
            />
            <Input
              label="Total Rooms"
              type="number"
              value={hostelRooms}
              onChange={(e) => setHostelRooms(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={editingHostel ? handleUpdateHostel : handleAddHostel}>
              {editingHostel ? 'Update Hostel' : 'Add Hostel'}
            </Button>
            <Button variant="secondary" onClick={resetHostelForm}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map(hostel => {
          const hostelRoomsList = rooms.filter(r => r.hostelId === hostel.id);
          const occupBeds = hostelRoomsList.reduce((sum, r) => sum + r.occupants.length, 0);
          const totBeds = hostelRoomsList.reduce((sum, r) => sum + r.capacity, 0);
          
          return (
            <GlassCard key={hostel.id} className="p-6" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => editHostel(hostel)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteHostel(hostel.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
              <h4 className="font-semibold text-white">{hostel.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{hostel.collegeName}</p>
              <p className="text-xs text-gray-500 mt-1">{hostel.address}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-4 text-sm text-gray-400">
                <span>🚪 {hostelRoomsList.length} rooms</span>
                <span>🛏️ {occupBeds}/{totBeds}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Room Management 🚪</h1>
          <p className="text-gray-400 mt-1">Manage all hostel rooms</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setShowRoomForm(true)}>
          Add Room
        </Button>
      </div>

      {/* Room Form */}
      {showRoomForm && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Hostel"
              value={roomHostel}
              onChange={(e) => setRoomHostel(e.target.value)}
            >
              <option value="">Select hostel</option>
              {hostels.map(h => (
                <option key={h.id} value={h.id} className="bg-gray-900">{h.name} ({h.collegeName})</option>
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
            <Button onClick={handleAddRoom}>Add Room</Button>
            <Button variant="secondary" onClick={() => setShowRoomForm(false)}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Rooms by Hostel */}
      {hostels.map(hostel => {
        const hostelRoomsList = rooms.filter(r => r.hostelId === hostel.id);
        if (hostelRoomsList.length === 0) return null;
        
        return (
          <div key={hostel.id}>
            <h3 className="text-lg font-semibold text-white mb-3">{hostel.name} ({hostel.collegeName})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hostelRoomsList.map(room => (
                <GlassCard key={room.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DoorOpen className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-white">Room {room.roomNumber}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteRoom(room.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Floor: {room.floor}</p>
                    <p>Beds: {room.occupants.length}/{room.capacity}</p>
                  </div>
                  <Badge 
                    variant={room.status === 'available' ? 'success' : room.status === 'full' ? 'warning' : 'danger'}
                    className="mt-2"
                  >
                    {room.status}
                  </Badge>
                </GlassCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Student Management 🎓</h1>
        <p className="text-gray-400 mt-1">View and manage all students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map(student => {
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
                    📚 {student.collegeName || 'No college'} • 🏠 {hostel?.name || 'No hostel'} • Room {room?.roomNumber || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={student.status === 'active' ? 'success' : 'danger'}>
                    {student.status}
                  </Badge>
                  <div className="flex gap-1">
                    {student.status === 'active' ? (
                      <Button size="sm" variant="ghost" onClick={() => blockUser(student.id)}>
                        <Ban className="w-4 h-4 text-red-400" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => unblockUser(student.id)}>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteUser(student.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {students.length === 0 && (
          <GlassCard className="p-8 text-center md:col-span-2">
            <GraduationCap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No students registered yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Staff Management 🔧</h1>
        <p className="text-gray-400 mt-1">View and manage all staff</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map(s => {
          const hostel = hostels.find(h => h.id === s.hostelId);
          const tasks = complaints.filter(c => c.assignedStaffId === s.id);
          
          return (
            <GlassCard key={s.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{s.fullName}</h4>
                  <p className="text-sm text-gray-400">{s.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">🏠 {hostel?.name || 'No hostel'}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{tasks.length}</p>
                  <p className="text-xs text-gray-400">Tasks</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={s.status === 'active' ? 'success' : 'danger'}>
                    {s.status}
                  </Badge>
                  <div className="flex gap-1">
                    {s.status === 'active' ? (
                      <Button size="sm" variant="ghost" onClick={() => blockUser(s.id)}>
                        <Ban className="w-4 h-4 text-red-400" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => unblockUser(s.id)}>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {staff.length === 0 && (
          <GlassCard className="p-8 text-center md:col-span-2">
            <Wrench className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No staff registered yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  const renderWardens = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Warden Management 🛡️</h1>
          <p className="text-gray-400 mt-1">View and manage all wardens</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setShowWardenForm(true)}>
          Add Warden
        </Button>
      </div>

      {/* Warden Form */}
      {showWardenForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingWarden ? 'Edit Warden' : 'Add New Warden'}
            </h3>
            <button onClick={resetWardenForm} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Warden name"
              value={wardenName}
              onChange={(e) => setWardenName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="warden@example.com"
              value={wardenEmail}
              onChange={(e) => setWardenEmail(e.target.value)}
              disabled={!!editingWarden}
            />
            {!editingWarden && (
              <Input
                label="Password"
                type="password"
                placeholder="Create password"
                value={wardenPassword}
                onChange={(e) => setWardenPassword(e.target.value)}
              />
            )}
            <Input
              label="Phone (Optional)"
              type="tel"
              placeholder="Phone number"
              value={wardenPhone}
              onChange={(e) => setWardenPhone(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Assign Hostels</label>
            <div className="flex flex-wrap gap-2">
              {hostels.map(hostel => (
                <button
                  key={hostel.id}
                  type="button"
                  onClick={() => toggleWardenHostel(hostel.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    wardenHostels.includes(hostel.id)
                      ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {hostel.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={editingWarden ? handleUpdateWarden : handleAddWarden}>
              {editingWarden ? 'Update Warden' : 'Add Warden'}
            </Button>
            <Button variant="secondary" onClick={resetWardenForm}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wardens.map(w => {
          const managedHostels = hostels.filter(h => w.hostelIds?.includes(h.id));
          
          return (
            <GlassCard key={w.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{w.fullName}</h4>
                  <p className="text-sm text-gray-400">{w.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {managedHostels.length > 0 ? managedHostels.map(h => (
                      <span key={h.id} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                        {h.name}
                      </span>
                    )) : (
                      <span className="text-xs text-gray-500">No hostels assigned</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={w.status === 'active' ? 'success' : 'danger'}>
                    {w.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => editWardenFunc(w)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {w.status === 'active' ? (
                      <Button size="sm" variant="ghost" onClick={() => blockUser(w.id)}>
                        <Ban className="w-4 h-4 text-red-400" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => unblockUser(w.id)}>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
        {wardens.length === 0 && (
          <GlassCard className="p-8 text-center md:col-span-2">
            <Shield className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No wardens registered yet</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Complaints 📝</h1>
        <p className="text-gray-400 mt-1">View and manage all complaints system-wide</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="warning">
          ⏳ Pending: {complaints.filter(c => c.status === 'pending').length}
        </Badge>
        <Badge variant="info">
          🔍 In Review: {complaints.filter(c => c.status === 'in_review').length}
        </Badge>
        <Badge variant="success">
          ✅ Resolved: {complaints.filter(c => c.status === 'resolved').length}
        </Badge>
      </div>

      <div className="space-y-4">
        {complaints.map(complaint => {
          const hostel = hostels.find(h => h.id === complaint.hostelId);
          const room = rooms.find(r => r.id === complaint.roomId);
          const assignedStaff = users.find(u => u.id === complaint.assignedStaffId);
          
          return (
            <GlassCard key={complaint.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{complaint.title}</h4>
                  <p className="text-gray-400 mt-1">{complaint.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={
                    complaint.priority === 'high' ? 'danger' : 
                    complaint.priority === 'medium' ? 'warning' : 'info'
                  }>
                    {complaint.priority}
                  </Badge>
                  {getStatusBadge(complaint.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Student</p>
                  <p className="text-gray-300">{complaint.studentName}</p>
                </div>
                <div>
                  <p className="text-gray-500">College</p>
                  <p className="text-gray-300">{complaint.collegeName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Hostel</p>
                  <p className="text-gray-300">{hostel?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="text-gray-300">{room?.roomNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Assigned To</p>
                  <p className="text-gray-300">{assignedStaff?.fullName || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <Select
                  value={complaint.assignedStaffId || ''}
                  onChange={(e) => assignStaffToComplaint(complaint.id, e.target.value)}
                  className="w-48"
                >
                  <option value="">Assign Staff</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id} className="bg-gray-900">
                      {s.fullName} ({s.specialization})
                    </option>
                  ))}
                </Select>

                {complaint.status !== 'resolved' && (
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => updateComplaintStatus(complaint.id, 'resolved', 'Force resolved by admin')}
                  >
                    Force Resolve
                  </Button>
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

        {complaints.length === 0 && (
          <GlassCard className="p-8 text-center">
            <MessageSquareWarning className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No complaints in the system</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics 📊</h1>
        <p className="text-gray-400 mt-1">System-wide statistics and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{hostels.length}</p>
            <p className="text-sm text-gray-400 mt-1">Total Hostels</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{rooms.length}</p>
            <p className="text-sm text-gray-400 mt-1">Total Rooms</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{occupancyRate}%</p>
            <p className="text-sm text-gray-400 mt-1">Occupancy Rate</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{complaints.length}</p>
            <p className="text-sm text-gray-400 mt-1">Total Complaints</p>
          </div>
        </GlassCard>
      </div>

      {/* Complaints by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Complaints by Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Pending</span>
                <span className="text-amber-400">{complaints.filter(c => c.status === 'pending').length}</span>
              </div>
              <div className="bg-white/10 rounded-full h-3">
                <div 
                  className="bg-amber-500 h-3 rounded-full"
                  style={{ width: `${complaints.length ? (complaints.filter(c => c.status === 'pending').length / complaints.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">In Review</span>
                <span className="text-blue-400">{complaints.filter(c => c.status === 'in_review').length}</span>
              </div>
              <div className="bg-white/10 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${complaints.length ? (complaints.filter(c => c.status === 'in_review').length / complaints.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Resolved</span>
                <span className="text-emerald-400">{complaints.filter(c => c.status === 'resolved').length}</span>
              </div>
              <div className="bg-white/10 rounded-full h-3">
                <div 
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{ width: `${complaints.length ? (complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Complaints by College</h3>
          {Object.keys(complaintsByCollege).length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Object.entries(complaintsByCollege).map(([college, count]) => (
                <div key={college} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-gray-300 text-sm truncate flex-1">{college}</span>
                  <Badge variant="info">{count}</Badge>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Complaints by Category */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Complaints by Category</h3>
        {Object.keys(complaintsByCategory).length === 0 ? (
          <p className="text-gray-400 text-center py-4">No complaints yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(complaintsByCategory).map(([category, count]) => (
              <div key={category} className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-sm text-gray-400">{category}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* User Statistics */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-blue-500/10">
            <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{students.length}</p>
            <p className="text-sm text-gray-400">Students</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-500/10">
            <Wrench className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{staff.length}</p>
            <p className="text-sm text-gray-400">Staff</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-violet-500/10">
            <Shield className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{wardens.length}</p>
            <p className="text-sm text-gray-400">Wardens</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-amber-500/10">
            <User className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{users.filter(u => u.status === 'blocked').length}</p>
            <p className="text-sm text-gray-400">Blocked</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  switch (activeTab) {
    case 'hostels':
      return renderHostels();
    case 'rooms':
      return renderRooms();
    case 'students':
      return renderStudents();
    case 'staff':
      return renderStaff();
    case 'wardens':
      return renderWardens();
    case 'complaints':
      return renderComplaints();
    case 'analytics':
      return renderAnalytics();
    default:
      return renderDashboard();
  }
}
