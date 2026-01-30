import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { User, Hostel, Room, Complaint, College, ComplaintStatus, UserRole } from '@/types';

// Admin credentials (fixed)
const ADMIN_EMAIL = 'amteshwarrr@gmail.com';
const ADMIN_PASSWORD = 'ammu078600';

// Extensive list of colleges
const initialColleges: College[] = [
  { id: '1', name: 'Indian Institute of Technology (IIT) Delhi' },
  { id: '2', name: 'Indian Institute of Technology (IIT) Bombay' },
  { id: '3', name: 'Indian Institute of Technology (IIT) Madras' },
  { id: '4', name: 'Indian Institute of Technology (IIT) Kanpur' },
  { id: '5', name: 'Indian Institute of Technology (IIT) Kharagpur' },
  { id: '6', name: 'Indian Institute of Technology (IIT) Roorkee' },
  { id: '7', name: 'Indian Institute of Technology (IIT) Guwahati' },
  { id: '8', name: 'Indian Institute of Technology (IIT) Hyderabad' },
  { id: '9', name: 'National Institute of Technology (NIT) Trichy' },
  { id: '10', name: 'National Institute of Technology (NIT) Warangal' },
  { id: '11', name: 'National Institute of Technology (NIT) Surathkal' },
  { id: '12', name: 'National Institute of Technology (NIT) Calicut' },
  { id: '13', name: 'BITS Pilani' },
  { id: '14', name: 'BITS Hyderabad' },
  { id: '15', name: 'BITS Goa' },
  { id: '16', name: 'VIT Vellore' },
  { id: '17', name: 'VIT Chennai' },
  { id: '18', name: 'SRM Institute of Science and Technology' },
  { id: '19', name: 'Manipal Institute of Technology' },
  { id: '20', name: 'Amity University Noida' },
  { id: '21', name: 'Lovely Professional University' },
  { id: '22', name: 'Christ University Bangalore' },
  { id: '23', name: 'Symbiosis International University' },
  { id: '24', name: 'Anna University Chennai' },
  { id: '25', name: 'Jadavpur University Kolkata' },
  { id: '26', name: 'University of Delhi' },
  { id: '27', name: 'Jawaharlal Nehru University (JNU)' },
  { id: '28', name: 'Banaras Hindu University (BHU)' },
  { id: '29', name: 'Aligarh Muslim University (AMU)' },
  { id: '30', name: 'Jamia Millia Islamia' },
  { id: '31', name: 'Chandigarh University' },
  { id: '32', name: 'Thapar Institute of Engineering & Technology' },
  { id: '33', name: 'PSG College of Technology' },
  { id: '34', name: 'Amrita Vishwa Vidyapeetham' },
  { id: '35', name: 'IIIT Hyderabad' },
  { id: '36', name: 'IIIT Delhi' },
  { id: '37', name: 'IIIT Bangalore' },
  { id: '38', name: 'Delhi Technological University (DTU)' },
  { id: '39', name: 'Netaji Subhas University of Technology (NSUT)' },
  { id: '40', name: 'IGDTUW Delhi' },
  { id: '41', name: 'PEC Chandigarh' },
  { id: '42', name: 'COEP Pune' },
  { id: '43', name: 'VJTI Mumbai' },
  { id: '44', name: 'ICT Mumbai' },
  { id: '45', name: 'RVCE Bangalore' },
  { id: '46', name: 'BMS College of Engineering' },
  { id: '47', name: 'PES University' },
  { id: '48', name: 'MS Ramaiah Institute of Technology' },
  { id: '49', name: 'SSN College of Engineering' },
  { id: '50', name: 'CEG Anna University' },
  { id: '51', name: 'MIT Pune' },
  { id: '52', name: 'KIIT University Bhubaneswar' },
  { id: '53', name: 'SRM AP University' },
  { id: '54', name: 'Shiv Nadar University' },
  { id: '55', name: 'Ashoka University' },
  { id: '56', name: 'FLAME University' },
  { id: '57', name: 'OP Jindal Global University' },
  { id: '58', name: 'Kalinga Institute of Industrial Technology' },
  { id: '59', name: 'Chitkara University' },
  { id: '60', name: 'Bennett University' },
];

const initialHostels: Hostel[] = [
  { id: 'h1', name: 'Vindhya Hostel', collegeName: 'Indian Institute of Technology (IIT) Delhi', address: 'IIT Delhi Campus, Hauz Khas', totalRooms: 100, createdAt: new Date().toISOString() },
  { id: 'h2', name: 'Kumaon Hostel', collegeName: 'Indian Institute of Technology (IIT) Delhi', address: 'IIT Delhi Campus, Hauz Khas', totalRooms: 80, createdAt: new Date().toISOString() },
  { id: 'h3', name: 'Hostel 1', collegeName: 'Indian Institute of Technology (IIT) Bombay', address: 'IIT Bombay, Powai', totalRooms: 120, createdAt: new Date().toISOString() },
  { id: 'h4', name: 'Krishna Hostel', collegeName: 'VIT Vellore', address: 'VIT Campus, Vellore', totalRooms: 200, createdAt: new Date().toISOString() },
  { id: 'h5', name: 'Men\'s Hostel A', collegeName: 'BITS Pilani', address: 'BITS Pilani Campus', totalRooms: 150, createdAt: new Date().toISOString() },
];

const initialRooms: Room[] = [
  { id: 'r1', hostelId: 'h1', roomNumber: '101', floor: 1, capacity: 2, occupants: [], amenities: ['AC', 'WiFi', 'Attached Bath'], status: 'available' },
  { id: 'r2', hostelId: 'h1', roomNumber: '102', floor: 1, capacity: 2, occupants: [], amenities: ['Fan', 'WiFi'], status: 'available' },
  { id: 'r3', hostelId: 'h1', roomNumber: '201', floor: 2, capacity: 3, occupants: [], amenities: ['AC', 'WiFi', 'Balcony'], status: 'available' },
  { id: 'r4', hostelId: 'h2', roomNumber: '101', floor: 1, capacity: 2, occupants: [], amenities: ['AC', 'WiFi'], status: 'available' },
  { id: 'r5', hostelId: 'h2', roomNumber: '102', floor: 1, capacity: 2, occupants: [], amenities: ['Fan', 'WiFi'], status: 'available' },
  { id: 'r6', hostelId: 'h3', roomNumber: '101', floor: 1, capacity: 4, occupants: [], amenities: ['AC', 'WiFi', 'Study Room'], status: 'available' },
  { id: 'r7', hostelId: 'h4', roomNumber: 'A-101', floor: 1, capacity: 3, occupants: [], amenities: ['AC', 'WiFi', 'Attached Bath'], status: 'available' },
  { id: 'r8', hostelId: 'h4', roomNumber: 'A-102', floor: 1, capacity: 3, occupants: [], amenities: ['AC', 'WiFi'], status: 'available' },
  { id: 'r9', hostelId: 'h5', roomNumber: 'B-201', floor: 2, capacity: 2, occupants: [], amenities: ['AC', 'WiFi', 'Attached Bath'], status: 'available' },
];

// Admin user is fixed and cannot be changed
const initialUsers: User[] = [
  // Admin - FIXED credentials
  { 
    id: 'admin1', 
    email: ADMIN_EMAIL, 
    password: ADMIN_PASSWORD, 
    role: 'admin', 
    fullName: 'System Administrator', 
    status: 'active', 
    createdAt: new Date().toISOString() 
  },
];

const initialComplaints: Complaint[] = [];

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  collegeName?: string;
  specialization?: string;
  hostelId?: string;
}

interface AppState {
  // Current user
  currentUser: User | null;
  
  // Data
  users: User[];
  hostels: Hostel[];
  rooms: Room[];
  complaints: Complaint[];
  colleges: College[];
  
  // Loading state
  isLoading: boolean;
  
  // Auth actions
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (data: SignupData) => { success: boolean; message: string };
  logout: () => void;
  
  // User actions
  updateUser: (id: string, data: Partial<User>) => void;
  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
  deleteUser: (id: string) => void;
  
  // Student actions
  selectHostel: (studentId: string, hostelId: string) => void;
  selectRoom: (studentId: string, roomId: string) => void;
  leaveRoom: (studentId: string) => void;
  
  // Hostel actions
  addHostel: (data: Omit<Hostel, 'id' | 'createdAt'>) => void;
  updateHostel: (id: string, data: Partial<Hostel>) => void;
  deleteHostel: (id: string) => void;
  
  // Room actions
  addRoom: (data: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  
  // Staff actions
  addStaff: (data: { email: string; password: string; fullName: string; phone?: string; hostelId: string; specialization: string }) => void;
  updateStaff: (id: string, data: Partial<User>) => void;
  assignStaffToHostel: (staffId: string, hostelId: string) => void;
  
  // Warden actions
  addWarden: (data: { email: string; password: string; fullName: string; phone?: string; hostelIds: string[] }) => void;
  updateWarden: (id: string, data: Partial<User>) => void;
  
  // Complaint actions
  createComplaint: (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'resolutionImageUrl' | 'resolutionNote'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus, note?: string, resolutionImage?: string) => void;
  assignStaffToComplaint: (complaintId: string, staffId: string) => void;
  
  // College actions
  addCollege: (name: string, isCustom?: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: initialUsers,
      hostels: initialHostels,
      rooms: initialRooms,
      complaints: initialComplaints,
      colleges: initialColleges,
      isLoading: false,
      
      // Auth
      login: (email, password) => {
        // Check for admin login first
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser = get().users.find(u => u.role === 'admin' && u.email === ADMIN_EMAIL);
          if (adminUser) {
            set({ currentUser: adminUser });
            return { success: true, message: 'Admin login successful' };
          }
        }
        
        // Regular user login
        const user = get().users.find(u => u.email === email && u.password === password);
        if (!user) {
          return { success: false, message: 'Invalid email or password' };
        }
        if (user.status === 'blocked') {
          return { success: false, message: 'Your account has been blocked. Contact admin.' };
        }
        set({ currentUser: user });
        return { success: true, message: 'Login successful' };
      },
      
      signup: (data) => {
        // Prevent admin signup
        if (data.role === 'admin') {
          return { success: false, message: 'Admin registration is not allowed' };
        }
        
        // Check if email exists
        const exists = get().users.find(u => u.email === data.email);
        if (exists) {
          return { success: false, message: 'Email already registered' };
        }
        
        // Validate password
        if (data.password.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters' };
        }
        
        const newUser: User = {
          id: uuidv4(),
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          role: data.role,
          status: 'active',
          collegeName: data.collegeName || '',
          hostelId: data.role === 'staff' ? data.hostelId : null,
          roomId: null,
          specialization: data.role === 'staff' ? data.specialization : undefined,
          hostelIds: data.role === 'warden' ? [] : undefined,
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({ users: [...state.users, newUser] }));
        return { success: true, message: 'Account created successfully! You can now login.' };
      },
      
      logout: () => set({ currentUser: null }),
      
      // User management
      updateUser: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser,
        }));
      },
      
      blockUser: (id) => {
        // Prevent blocking admin
        const user = get().users.find(u => u.id === id);
        if (user?.role === 'admin') return;
        
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, status: 'blocked' as const } : u),
        }));
      },
      
      unblockUser: (id) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, status: 'active' as const } : u),
        }));
      },
      
      deleteUser: (id) => {
        // Prevent deleting admin
        const user = get().users.find(u => u.id === id);
        if (user?.role === 'admin') return;
        
        set(state => ({
          users: state.users.filter(u => u.id !== id),
        }));
      },
      
      // Student actions
      selectHostel: (studentId, hostelId) => {
        set(state => ({
          users: state.users.map(u => 
            u.id === studentId && u.role === 'student' 
              ? { ...u, hostelId, roomId: null } 
              : u
          ),
          currentUser: state.currentUser?.id === studentId 
            ? { ...state.currentUser, hostelId, roomId: null }
            : state.currentUser,
        }));
      },
      
      selectRoom: (studentId, roomId) => {
        const room = get().rooms.find(r => r.id === roomId);
        if (!room || room.occupants.length >= room.capacity) return;
        
        set(state => ({
          users: state.users.map(u => 
            u.id === studentId && u.role === 'student' 
              ? { ...u, roomId } 
              : u
          ),
          rooms: state.rooms.map(r => 
            r.id === roomId 
              ? { 
                  ...r, 
                  occupants: [...r.occupants, studentId],
                  status: r.occupants.length + 1 >= r.capacity ? 'full' as const : 'available' as const
                } 
              : r
          ),
          currentUser: state.currentUser?.id === studentId 
            ? { ...state.currentUser, roomId }
            : state.currentUser,
        }));
      },
      
      leaveRoom: (studentId) => {
        const student = get().users.find(u => u.id === studentId);
        if (!student?.roomId) return;
        
        const roomIdToLeave = student.roomId;
        
        set(state => ({
          users: state.users.map(u => 
            u.id === studentId && u.role === 'student' 
              ? { ...u, roomId: null } 
              : u
          ),
          rooms: state.rooms.map(r => 
            r.id === roomIdToLeave 
              ? { 
                  ...r, 
                  occupants: r.occupants.filter(id => id !== studentId),
                  status: 'available' as const
                } 
              : r
          ),
          currentUser: state.currentUser?.id === studentId 
            ? { ...state.currentUser, roomId: null }
            : state.currentUser,
        }));
      },
      
      // Hostel actions
      addHostel: (data) => {
        const newHostel: Hostel = {
          id: uuidv4(),
          ...data,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ hostels: [...state.hostels, newHostel] }));
      },
      
      updateHostel: (id, data) => {
        set(state => ({
          hostels: state.hostels.map(h => h.id === id ? { ...h, ...data } : h),
        }));
      },
      
      deleteHostel: (id) => {
        set(state => ({
          hostels: state.hostels.filter(h => h.id !== id),
          rooms: state.rooms.filter(r => r.hostelId !== id),
        }));
      },
      
      // Room actions
      addRoom: (data) => {
        const newRoom: Room = {
          id: uuidv4(),
          ...data,
        };
        set(state => ({ rooms: [...state.rooms, newRoom] }));
      },
      
      updateRoom: (id, data) => {
        set(state => ({
          rooms: state.rooms.map(r => r.id === id ? { ...r, ...data } : r),
        }));
      },
      
      deleteRoom: (id) => {
        set(state => ({
          rooms: state.rooms.filter(r => r.id !== id),
        }));
      },
      
      // Staff actions
      addStaff: (data) => {
        const exists = get().users.find(u => u.email === data.email);
        if (exists) return;
        
        const newStaff: User = {
          id: uuidv4(),
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          role: 'staff',
          status: 'active',
          hostelId: data.hostelId,
          specialization: data.specialization,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ users: [...state.users, newStaff] }));
      },
      
      updateStaff: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
        }));
      },
      
      assignStaffToHostel: (staffId, hostelId) => {
        set(state => ({
          users: state.users.map(u => 
            u.id === staffId && u.role === 'staff' 
              ? { ...u, hostelId } 
              : u
          ),
        }));
      },
      
      // Warden actions
      addWarden: (data) => {
        const exists = get().users.find(u => u.email === data.email);
        if (exists) return;
        
        const newWarden: User = {
          id: uuidv4(),
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          role: 'warden',
          status: 'active',
          hostelIds: data.hostelIds,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ users: [...state.users, newWarden] }));
      },
      
      updateWarden: (id, data) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
        }));
      },
      
      // Complaint actions
      createComplaint: (data) => {
        const newComplaint: Complaint = {
          id: uuidv4(),
          ...data,
          resolutionImageUrl: null,
          resolutionNote: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ complaints: [...state.complaints, newComplaint] }));
      },
      
      updateComplaintStatus: (id, status, note, resolutionImage) => {
        set(state => ({
          complaints: state.complaints.map(c => 
            c.id === id 
              ? { 
                  ...c, 
                  status, 
                  resolutionNote: note || c.resolutionNote,
                  resolutionImageUrl: resolutionImage || c.resolutionImageUrl,
                  updatedAt: new Date().toISOString() 
                } 
              : c
          ),
        }));
      },
      
      assignStaffToComplaint: (complaintId, staffId) => {
        set(state => ({
          complaints: state.complaints.map(c => 
            c.id === complaintId 
              ? { ...c, assignedStaffId: staffId, updatedAt: new Date().toISOString() } 
              : c
          ),
        }));
      },
      
      // College actions
      addCollege: (name, isCustom = false) => {
        const exists = get().colleges.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) return;
        
        const newCollege: College = {
          id: uuidv4(),
          name,
          isCustom,
        };
        set(state => ({ colleges: [...state.colleges, newCollege] }));
      },
    }),
    {
      name: 'hostel-hive-storage-v2',
    }
  )
);
