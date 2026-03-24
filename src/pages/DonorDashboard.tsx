import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Package, Award, TrendingUp, FileText, Plus } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ResourceCategory } from '@/lib/store';

export default function DonorDashboard() {
  const { currentUser, resources, certificates, addResource, feedPosts, issueCertificate } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newRes, setNewRes] = useState({ title: '', description: '', category: 'food' as ResourceCategory, quantity: 1, unit: 'items', location: '' });

  if (!currentUser) return null;

  const myResources = resources.filter(r => r.donorId === currentUser.id);
  const myCerts = certificates.filter(c => c.userId === currentUser.id);
  const totalDonated = myResources.length;
  const claimed = myResources.filter(r => r.status === 'claimed' || r.status === 'delivered').length;

  const handleAdd = () => {
    addResource({ ...newRes, donorId: currentUser.id, donorName: currentUser.name, lat: 19 + Math.random() * 10, lng: 73 + Math.random() * 7 });
    toast.success('Resource posted!');
    setShowAdd(false);
  };

  const generateCertificate = () => {
    issueCertificate({ userId: currentUser.id, userName: currentUser.name, type: 'donation', description: `Donated ${totalDonated} resources through Cohere platform`, ngoName: 'Cohere Platform' });
    toast.success('Certificate generated!');
  };

  // Suggested campaigns
  const suggestedCampaigns = feedPosts.filter(p => p.type === 'campaign' || p.type === 'need').slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Donor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button variant="hero"><Plus className="w-4 h-4 mr-2" /> Donate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Post a Donation</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div><Label>Title</Label><Input value={newRes.title} onChange={e => setNewRes(p => ({ ...p, title: e.target.value }))} /></div>
                <div><Label>Description</Label><Textarea value={newRes.description} onChange={e => setNewRes(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newRes.category} onChange={e => setNewRes(p => ({ ...p, category: e.target.value as ResourceCategory }))}>
                      <option value="food">Food</option><option value="clothes">Clothes</option><option value="essentials">Essentials</option><option value="funds">Funds</option>
                    </select>
                  </div>
                  <div><Label>Quantity</Label><Input type="number" value={newRes.quantity} onChange={e => setNewRes(p => ({ ...p, quantity: +e.target.value }))} /></div>
                </div>
                <div><Label>Location</Label><Input value={newRes.location} onChange={e => setNewRes(p => ({ ...p, location: e.target.value }))} /></div>
                <Button variant="hero" className="w-full" onClick={handleAdd}>Post Donation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Donated', value: totalDonated, icon: Package },
            { label: 'Claimed', value: claimed, icon: Heart },
            { label: 'Certificates', value: myCerts.length, icon: Award },
            { label: 'Impact Score', value: totalDonated * 10, icon: TrendingUp },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My resources */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">My Donations</h2>
            {myResources.length === 0 ? <p className="text-sm text-muted-foreground">No donations yet.</p> : (
              <div className="space-y-3">
                {myResources.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div><p className="font-medium text-sm">{r.title}</p><p className="text-xs text-muted-foreground">{r.quantity} {r.unit}</p></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions + Certs */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Suggested Campaigns</h2>
              {suggestedCampaigns.map(p => (
                <div key={p.id} className="p-3 rounded-lg bg-muted/30 mb-2">
                  <p className="text-sm font-medium">{p.ngoName}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.content}</p>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Certificates</h2>
              <Button variant="outline" size="sm" onClick={generateCertificate} className="mb-3">Generate Certificate</Button>
              {myCerts.map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-muted/30 mb-2">
                  <p className="text-sm font-medium">{c.description}</p>
                  <p className="text-xs text-muted-foreground">{c.issuedAt.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
