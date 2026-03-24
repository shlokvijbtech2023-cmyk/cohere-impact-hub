import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { CountUp } from '@/components/CountUp';

export default function AdminDashboard() {
  const { ngos, approveNGO, rejectNGO, getStats, resources, volunteerApps, proofs, verifyProof } = useAppStore();
  const stats = getStats();
  const pendingNGOs = ngos.filter(n => n.status === 'pending');
  const pendingProofs = proofs.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center"><Shield className="w-5 h-5 text-primary-foreground" /></div>
          <div><h1 className="font-display text-2xl font-bold">Admin Panel</h1><p className="text-sm text-muted-foreground">System overview & management</p></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active NGOs', value: stats.ngosActive, icon: Users },
            { label: 'Total Resources', value: resources.length, icon: Package },
            { label: 'Volunteers', value: stats.volunteersEngaged, icon: Users },
            { label: 'Pending Approvals', value: pendingNGOs.length, icon: AlertTriangle },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-display font-bold"><CountUp end={s.value} /></div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending NGOs */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Pending NGO Verifications ({pendingNGOs.length})</h2>
          {pendingNGOs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending verifications.</p>
          ) : (
            <div className="space-y-4">
              {pendingNGOs.map(ngo => (
                <div key={ngo.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div>
                    <h3 className="font-semibold">{ngo.name}</h3>
                    <p className="text-sm text-muted-foreground">{ngo.description || 'No description'}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ngo.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { approveNGO(ngo.id); toast.success(`${ngo.name} approved`); }}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => { rejectNGO(ngo.id); toast.info(`${ngo.name} rejected`); }}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Proofs */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Pending Proofs ({pendingProofs.length})</h2>
          {pendingProofs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending proofs.</p>
          ) : (
            <div className="space-y-3">
              {pendingProofs.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{p.ngoName}: {p.description}</p>
                    <p className="text-xs text-muted-foreground">{p.location} · {p.timestamp.toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" onClick={() => { verifyProof(p.id); toast.success('Proof verified'); }}>Verify</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All NGOs */}
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold mb-4">All NGOs ({ngos.length})</h2>
          <div className="space-y-2">
            {ngos.map(ngo => (
              <div key={ngo.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">{ngo.name[0]}</div>
                  <div>
                    <p className="font-medium text-sm">{ngo.name}</p>
                    <p className="text-xs text-muted-foreground">{ngo.location}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  ngo.status === 'verified' ? 'bg-success/10 text-success' :
                  ngo.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>{ngo.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
