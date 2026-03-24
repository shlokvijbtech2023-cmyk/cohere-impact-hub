import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Welcome back!');
      const user = useAppStore.getState().currentUser;
      navigate(`/dashboard/${user?.role}`);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@cohere.org', pw: 'admin123' },
    { label: 'Donor', email: 'donor@cohere.org', pw: 'donor123' },
    { label: 'Volunteer', email: 'volunteer@cohere.org', pw: 'volunteer123' },
    { label: 'NGO', email: 'ngo@cohere.org', pw: 'ngo123' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md glass-card-elevated p-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">C</span>
            </div>
            <span className="font-display font-bold text-xl">Cohere</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button variant="hero" className="w-full" type="submit">Sign In</Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-center text-muted-foreground mb-3">Quick demo login:</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(a => (
              <Button key={a.label} variant="outline" size="sm" onClick={() => { setEmail(a.email); setPassword(a.pw); }}>
                {a.label}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
