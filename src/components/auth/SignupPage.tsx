import { useState } from 'react';
import { useStore } from '@/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Building2, Mail, Lock, User, GraduationCap, ArrowLeft, UserPlus, Phone, Wrench, Shield } from 'lucide-react';
import type { UserRole } from '@/types';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup, colleges, hostels, addCollege } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [collegeName, setCollegeName] = useState('');
  const [otherCollegeName, setOtherCollegeName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hostelId, setHostelId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Determine final college name
    let finalCollegeName = collegeName;
    if (collegeName === 'Others' && otherCollegeName.trim()) {
      finalCollegeName = otherCollegeName.trim();
      // Add to colleges list
      addCollege(finalCollegeName, true);
    }

    // Validate role-specific fields
    if (role === 'student' && !finalCollegeName) {
      setError('Please select or enter your college name');
      setLoading(false);
      return;
    }

    if (role === 'staff') {
      if (!specialization) {
        setError('Please select your specialization');
        setLoading(false);
        return;
      }
      if (!hostelId) {
        setError('Please select a hostel to work at');
        setLoading(false);
        return;
      }
    }

    const result = signup({ 
      email, 
      password, 
      fullName, 
      phone,
      role,
      collegeName: finalCollegeName,
      specialization: role === 'staff' ? specialization : undefined,
      hostelId: role === 'staff' ? hostelId : undefined,
    });
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => onSwitchToLogin(), 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'student': return <GraduationCap className="w-5 h-5" />;
      case 'staff': return <Wrench className="w-5 h-5" />;
      case 'warden': return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (r: UserRole, selected: boolean) => {
    if (!selected) return 'bg-white/5 border-white/10 text-gray-400';
    switch (r) {
      case 'student': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'staff': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      case 'warden': return 'bg-violet-500/20 border-violet-500/50 text-violet-400';
      default: return 'bg-white/10 border-white/30 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        <GlassCard className="p-8 max-h-[90vh] overflow-y-auto">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 mt-1">Join Hostel-Hive today</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {(['student', 'staff', 'warden'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${getRoleColor(r, role === r)}`}
                >
                  {getRoleIcon(r)}
                  <span className="text-sm font-medium capitalize">{r}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Admin login is restricted. Only existing admins can access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="tel"
              label="Phone Number (Optional)"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-5 h-5" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="password"
                label="Password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />
            </div>

            {/* Student-specific fields */}
            {role === 'student' && (
              <div className="space-y-4">
                <Select
                  label="College"
                  value={collegeName}
                  onChange={(e) => {
                    setCollegeName(e.target.value);
                    if (e.target.value !== 'Others') {
                      setOtherCollegeName('');
                    }
                  }}
                  icon={<GraduationCap className="w-5 h-5" />}
                  required
                >
                  <option value="">Select your college</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.name} className="bg-gray-900">
                      {college.name}
                    </option>
                  ))}
                  <option value="Others" className="bg-gray-900 text-amber-400">
                    ➕ Others (Add New College)
                  </option>
                </Select>

                {collegeName === 'Others' && (
                  <Input
                    type="text"
                    label="Enter Your College Name"
                    placeholder="Type your college name"
                    value={otherCollegeName}
                    onChange={(e) => setOtherCollegeName(e.target.value)}
                    icon={<Building2 className="w-5 h-5" />}
                    required
                  />
                )}
              </div>
            )}

            {/* Staff-specific fields */}
            {role === 'staff' && (
              <div className="space-y-4">
                <Select
                  label="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  icon={<Wrench className="w-5 h-5" />}
                  required
                >
                  <option value="">Select your specialization</option>
                  <option value="Electrical" className="bg-gray-900">⚡ Electrical</option>
                  <option value="Plumbing" className="bg-gray-900">🔧 Plumbing</option>
                  <option value="Carpentry" className="bg-gray-900">🪚 Carpentry</option>
                  <option value="Cleaning" className="bg-gray-900">🧹 Cleaning</option>
                  <option value="AC/Cooling" className="bg-gray-900">❄️ AC/Cooling</option>
                  <option value="Internet/WiFi" className="bg-gray-900">📶 Internet/WiFi</option>
                  <option value="Security" className="bg-gray-900">🔒 Security</option>
                  <option value="General" className="bg-gray-900">🛠️ General Maintenance</option>
                </Select>

                <Select
                  label="Select Hostel to Work At"
                  value={hostelId}
                  onChange={(e) => setHostelId(e.target.value)}
                  icon={<Building2 className="w-5 h-5" />}
                  required
                >
                  <option value="">Select hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel.id} value={hostel.id} className="bg-gray-900">
                      {hostel.name} ({hostel.collegeName})
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Warden-specific fields */}
            {role === 'warden' && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
                <p className="text-sm text-violet-300">
                  <strong>Note:</strong> As a warden, you'll be assigned to hostels by the admin after registration. 
                  You can manage assigned hostels once approved.
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                ✅ {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              icon={<UserPlus className="w-5 h-5" />}
              disabled={loading}
            >
              {loading ? 'Creating account...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-violet-400 hover:text-violet-300 text-sm font-medium inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Already have an account? Sign in
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
