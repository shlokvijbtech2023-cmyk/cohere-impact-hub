// In-memory store for the platform (will be replaced with Supabase later)
import { create } from 'zustand';

export type UserRole = 'admin' | 'donor' | 'volunteer' | 'ngo';
export type ResourceCategory = 'food' | 'clothes' | 'essentials' | 'funds';
export type VolunteerStatus = 'applied' | 'accepted' | 'completed';
export type ProofStatus = 'pending' | 'verified';
export type NGOStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  skills?: string[];
  bio?: string;
  location?: string;
  createdAt: Date;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  category: string;
  status: NGOStatus;
  userId: string;
  location: string;
  lat: number;
  lng: number;
  logo?: string;
  impactScore: number;
  mealsServed: number;
  donationsReceived: number;
  volunteersEngaged: number;
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  donorId: string;
  donorName: string;
  claimedById?: string;
  claimedByName?: string;
  location: string;
  lat: number;
  lng: number;
  status: 'available' | 'claimed' | 'delivered';
  createdAt: Date;
}

export interface FeedPost {
  id: string;
  ngoId: string;
  ngoName: string;
  content: string;
  type: 'campaign' | 'need' | 'update';
  likes: number;
  likedBy: string[];
  applicants: string[];
  donations: number;
  createdAt: Date;
}

export interface VolunteerApplication {
  id: string;
  volunteerId: string;
  volunteerName: string;
  ngoId: string;
  ngoName: string;
  role: string;
  skills: string[];
  status: VolunteerStatus;
  createdAt: Date;
}

export interface Proof {
  id: string;
  ngoId: string;
  ngoName: string;
  imageUrl: string;
  location: string;
  timestamp: Date;
  description: string;
  status: ProofStatus;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  type: 'donation' | 'volunteer';
  description: string;
  issuedAt: Date;
  ngoName: string;
}

// Demo seed data
const seedNGOs: NGO[] = [
  { id: 'ngo-1', name: 'FeedForward Foundation', description: 'Redistributing surplus food to communities in need across urban areas.', category: 'Food', status: 'verified', userId: 'user-ngo-1', location: 'Mumbai, India', lat: 19.076, lng: 72.8777, impactScore: 92, mealsServed: 12450, donationsReceived: 340, volunteersEngaged: 89, createdAt: new Date('2024-01-15') },
  { id: 'ngo-2', name: 'WarmThreads Initiative', description: 'Providing clean clothing and essentials to underprivileged families.', category: 'Clothes', status: 'verified', userId: 'user-ngo-2', location: 'Delhi, India', lat: 28.6139, lng: 77.209, impactScore: 87, mealsServed: 0, donationsReceived: 560, volunteersEngaged: 124, createdAt: new Date('2024-02-20') },
  { id: 'ngo-3', name: 'HopeRise Collective', description: 'Empowering communities through micro-grants and skill development.', category: 'Funds', status: 'verified', userId: 'user-ngo-3', location: 'Bangalore, India', lat: 12.9716, lng: 77.5946, impactScore: 95, mealsServed: 8200, donationsReceived: 780, volunteersEngaged: 210, createdAt: new Date('2024-03-10') },
  { id: 'ngo-4', name: 'GreenPlate Network', description: 'Connecting restaurants with shelters to minimize food waste.', category: 'Food', status: 'pending', userId: 'user-ngo-4', location: 'Chennai, India', lat: 13.0827, lng: 80.2707, impactScore: 0, mealsServed: 0, donationsReceived: 0, volunteersEngaged: 0, createdAt: new Date('2024-06-01') },
];

const seedResources: Resource[] = [
  { id: 'res-1', title: '200 Meal Boxes', description: 'Freshly prepared vegetarian meal boxes, best consumed within 4 hours.', category: 'food', quantity: 200, unit: 'meals', donorId: 'user-donor-1', donorName: 'Sunrise Restaurant', location: 'Mumbai, India', lat: 19.076, lng: 72.8777, status: 'available', createdAt: new Date() },
  { id: 'res-2', title: 'Winter Clothing Bundle', description: '50 sets of warm jackets and blankets in good condition.', category: 'clothes', quantity: 50, unit: 'sets', donorId: 'user-donor-2', donorName: 'GoodWill Donors', location: 'Delhi, India', lat: 28.6139, lng: 77.209, status: 'available', createdAt: new Date() },
  { id: 'res-3', title: 'Hygiene Kits', description: 'Essential hygiene kits including soap, sanitizer, and masks.', category: 'essentials', quantity: 100, unit: 'kits', donorId: 'user-donor-1', donorName: 'Sunrise Restaurant', location: 'Bangalore, India', lat: 12.9716, lng: 77.5946, status: 'claimed', claimedById: 'ngo-3', claimedByName: 'HopeRise Collective', createdAt: new Date() },
];

const seedFeedPosts: FeedPost[] = [
  { id: 'post-1', ngoId: 'ngo-1', ngoName: 'FeedForward Foundation', content: '🍱 We just served 500 meals to families in Dharavi! Thank you to all our donors and volunteers who made this possible. Every contribution matters!', type: 'update', likes: 42, likedBy: [], applicants: [], donations: 15, createdAt: new Date() },
  { id: 'post-2', ngoId: 'ngo-2', ngoName: 'WarmThreads Initiative', content: '❄️ Winter Campaign: We urgently need warm clothing for 200 families in North Delhi. If you can donate jackets, sweaters, or blankets, please reach out!', type: 'need', likes: 28, likedBy: [], applicants: [], donations: 8, createdAt: new Date() },
  { id: 'post-3', ngoId: 'ngo-3', ngoName: 'HopeRise Collective', content: '🎓 Launching our new skill development program! Looking for volunteer mentors in tech, design, and business. Apply now to make a difference!', type: 'campaign', likes: 56, likedBy: [], applicants: ['vol-1'], donations: 22, createdAt: new Date() },
];

const seedVolunteerApps: VolunteerApplication[] = [
  { id: 'va-1', volunteerId: 'user-vol-1', volunteerName: 'Priya Sharma', ngoId: 'ngo-1', ngoName: 'FeedForward Foundation', role: 'Food Distribution Coordinator', skills: ['logistics', 'driving'], status: 'accepted', createdAt: new Date() },
  { id: 'va-2', volunteerId: 'user-vol-2', volunteerName: 'Rahul Mehta', ngoId: 'ngo-3', ngoName: 'HopeRise Collective', role: 'Tech Mentor', skills: ['programming', 'teaching'], status: 'applied', createdAt: new Date() },
];

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (user: Omit<User, 'id' | 'createdAt'>, password: string) => boolean;
  logout: () => void;

  // NGOs
  ngos: NGO[];
  approveNGO: (id: string) => void;
  rejectNGO: (id: string) => void;

  // Resources
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'status'>) => void;
  claimResource: (resourceId: string, ngoId: string, ngoName: string) => void;

  // Feed
  feedPosts: FeedPost[];
  addFeedPost: (post: Omit<FeedPost, 'id' | 'likes' | 'likedBy' | 'applicants' | 'donations' | 'createdAt'>) => void;
  likePost: (postId: string, userId: string) => void;
  applyToPost: (postId: string, userId: string) => void;
  donateToPost: (postId: string) => void;

  // Volunteers
  volunteerApps: VolunteerApplication[];
  applyVolunteer: (app: Omit<VolunteerApplication, 'id' | 'status' | 'createdAt'>) => void;
  updateVolunteerStatus: (appId: string, status: VolunteerStatus) => void;

  // Proofs
  proofs: Proof[];
  addProof: (proof: Omit<Proof, 'id' | 'status'>) => void;
  verifyProof: (proofId: string) => void;

  // Certificates
  certificates: Certificate[];
  issueCertificate: (cert: Omit<Certificate, 'id' | 'issuedAt'>) => void;

  // Stats
  getStats: () => { mealsServed: number; donationsCompleted: number; volunteersEngaged: number; ngosActive: number };
}

const genId = () => Math.random().toString(36).substring(2, 10);

// Simple password store
const passwords: Record<string, string> = {
  'admin@cohere.org': 'admin123',
  'donor@cohere.org': 'donor123',
  'volunteer@cohere.org': 'volunteer123',
  'ngo@cohere.org': 'ngo123',
};

const seedUsers: User[] = [
  { id: 'user-admin', name: 'Admin', email: 'admin@cohere.org', role: 'admin', createdAt: new Date() },
  { id: 'user-donor-1', name: 'Sunrise Restaurant', email: 'donor@cohere.org', role: 'donor', location: 'Mumbai, India', createdAt: new Date() },
  { id: 'user-vol-1', name: 'Priya Sharma', email: 'volunteer@cohere.org', role: 'volunteer', skills: ['logistics', 'driving', 'cooking'], createdAt: new Date() },
  { id: 'user-ngo-1', name: 'FeedForward Foundation', email: 'ngo@cohere.org', role: 'ngo', createdAt: new Date() },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: seedUsers,
  ngos: seedNGOs,
  resources: seedResources,
  feedPosts: seedFeedPosts,
  volunteerApps: seedVolunteerApps,
  proofs: [],
  certificates: [],

  login: (email, _password) => {
    const user = get().users.find(u => u.email === email);
    if (user && passwords[email] === _password) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  signup: (userData, password) => {
    const exists = get().users.find(u => u.email === userData.email);
    if (exists) return false;
    const newUser: User = { ...userData, id: `user-${genId()}`, createdAt: new Date() };
    passwords[userData.email] = password;
    set(s => ({ users: [...s.users, newUser], currentUser: newUser }));
    if (userData.role === 'ngo') {
      const ngo: NGO = {
        id: `ngo-${genId()}`, name: userData.name, description: userData.bio || '',
        category: 'General', status: 'pending', userId: newUser.id,
        location: userData.location || '', lat: 19 + Math.random() * 10, lng: 73 + Math.random() * 7,
        impactScore: 0, mealsServed: 0, donationsReceived: 0, volunteersEngaged: 0, createdAt: new Date(),
      };
      set(s => ({ ngos: [...s.ngos, ngo] }));
    }
    return true;
  },

  logout: () => set({ currentUser: null }),

  approveNGO: (id) => set(s => ({ ngos: s.ngos.map(n => n.id === id ? { ...n, status: 'verified' as NGOStatus } : n) })),
  rejectNGO: (id) => set(s => ({ ngos: s.ngos.map(n => n.id === id ? { ...n, status: 'rejected' as NGOStatus } : n) })),

  addResource: (resource) => set(s => ({
    resources: [...s.resources, { ...resource, id: `res-${genId()}`, createdAt: new Date(), status: 'available' as const }]
  })),

  claimResource: (resourceId, ngoId, ngoName) => set(s => ({
    resources: s.resources.map(r => r.id === resourceId ? { ...r, status: 'claimed' as const, claimedById: ngoId, claimedByName: ngoName } : r)
  })),

  addFeedPost: (post) => set(s => ({
    feedPosts: [{ ...post, id: `post-${genId()}`, likes: 0, likedBy: [], applicants: [], donations: 0, createdAt: new Date() }, ...s.feedPosts]
  })),

  likePost: (postId, userId) => set(s => ({
    feedPosts: s.feedPosts.map(p => {
      if (p.id !== postId) return p;
      if (p.likedBy.includes(userId)) return { ...p, likes: p.likes - 1, likedBy: p.likedBy.filter(id => id !== userId) };
      return { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, userId] };
    })
  })),

  applyToPost: (postId, userId) => set(s => ({
    feedPosts: s.feedPosts.map(p => p.id === postId && !p.applicants.includes(userId) ? { ...p, applicants: [...p.applicants, userId] } : p)
  })),

  donateToPost: (postId) => set(s => ({
    feedPosts: s.feedPosts.map(p => p.id === postId ? { ...p, donations: p.donations + 1 } : p)
  })),

  applyVolunteer: (app) => set(s => ({
    volunteerApps: [...s.volunteerApps, { ...app, id: `va-${genId()}`, status: 'applied' as const, createdAt: new Date() }]
  })),

  updateVolunteerStatus: (appId, status) => set(s => ({
    volunteerApps: s.volunteerApps.map(a => a.id === appId ? { ...a, status } : a)
  })),

  addProof: (proof) => set(s => ({
    proofs: [...s.proofs, { ...proof, id: `proof-${genId()}`, status: 'pending' as const }]
  })),

  verifyProof: (proofId) => set(s => ({
    proofs: s.proofs.map(p => p.id === proofId ? { ...p, status: 'verified' as ProofStatus } : p)
  })),

  issueCertificate: (cert) => set(s => ({
    certificates: [...s.certificates, { ...cert, id: `cert-${genId()}`, issuedAt: new Date() }]
  })),

  getStats: () => {
    const s = get();
    return {
      mealsServed: s.ngos.reduce((a, n) => a + n.mealsServed, 0),
      donationsCompleted: s.resources.filter(r => r.status === 'claimed' || r.status === 'delivered').length + s.ngos.reduce((a, n) => a + n.donationsReceived, 0),
      volunteersEngaged: s.volunteerApps.filter(a => a.status === 'accepted' || a.status === 'completed').length + s.ngos.reduce((a, n) => a + n.volunteersEngaged, 0),
      ngosActive: s.ngos.filter(n => n.status === 'verified').length,
    };
  },
}));
