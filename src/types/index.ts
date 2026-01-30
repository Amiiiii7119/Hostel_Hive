// User Roles
export type UserRole = 'admin' | 'warden' | 'staff' | 'student';

// User Status
export type UserStatus = 'active' | 'blocked';

// Complaint Status
export type ComplaintStatus = 'pending' | 'in_review' | 'resolved';

// Unified User Interface
export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  // Student fields
  collegeName?: string;
  hostelId?: string | null;
  roomId?: string | null;
  // Staff fields
  specialization?: string;
  // Warden fields
  hostelIds?: string[];
}

// Hostel
export interface Hostel {
  id: string;
  name: string;
  collegeName: string;
  address: string;
  totalRooms: number;
  createdAt: string;
}

// Room
export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupants: string[]; // student IDs
  amenities: string[];
  status: 'available' | 'full' | 'maintenance';
}

// Complaint
export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  collegeName: string;
  hostelId: string;
  roomId: string;
  assignedStaffId: string | null;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: 'low' | 'medium' | 'high';
  imageUrl: string | null;
  resolutionImageUrl: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

// College
export interface College {
  id: string;
  name: string;
  isCustom?: boolean;
}

// Analytics Data
export interface AnalyticsData {
  totalStudents: number;
  totalStaff: number;
  totalHostels: number;
  totalRooms: number;
  occupancyRate: number;
  complaintsByStatus: {
    pending: number;
    in_review: number;
    resolved: number;
  };
  complaintsByCollege: Record<string, number>;
  complaintsByCategory: Record<string, number>;
}
