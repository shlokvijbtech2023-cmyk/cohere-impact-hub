import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Users, Camera, FileText, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function NGODashboard() {
  const { currentUser, ngos, resources, volunteerApps, updateVolunteerStatus, addProof, proofs, claimResource,
    feedPosts, addFeedPost, certificates, issueCertificate } = useAppStore();
  const [showProof, setShowProof] = useState(false);
  const [proof, setProof] = useState({ description: '', location: '', imageUrl: '' });
  const [showPost, setShowPost] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'campaign' | 'need' | 'update'>('update');

  if (!currentUser) return null;

  const myNGO = ngos.find(n => n.userId === currentUser.id);
  if (!myNGO) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 text-center">
        <p className="text-muted-foreground">NGO profile not found.</p>
      </div>
    </div>
  );

  const isVerified = myNGO.status === 'verified';
  const myApplicants = volunteerApps.filter(a => a.ngoId === myNGO.id);
  const claimedResources = resources.filter(r => r.claimedById === myNGO.id);
  const availableResources = resources.filter(r => r.status === 'available');
  const myProofs = proofs.filter(p => p.ngoId === myNGO.id);
  const myPosts = feedPosts.filter(p => p.ngoId === myNGO.id);

  const handleClaim = (resourceId: string) => {
    if (!isVerified) { toast.error('Only verified NGOs can claim'); return; }
    claimResource(resourceId, myNGO.id, myNGO.name);
    toast.success('Resource claimed!');
  };

  const handleProof = () => {
    addProof({ ngoId: myNGO.id, ngoName: myNGO.name, imageUrl: proof.imageUrl || 'https://via.placeholder.com/400', location: proof.location, timestamp: new Date(), description: proof.description });
    toast.success('Proof submitted!');
    setShowProof(false);
    setProof({ description: '', location: '', imageUrl: '' });
  };

  const handlePost = () => {
    if (!isVerified) { toast.error('Only verified NGOs can post'); return; }
    addFeedPost({ ngoId: myNGO.id, ngoName: myNGO.name, content: newPost, type: postType });
    toast.success('Posted!');
    setShowPost(false);
    setNewPost('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-lg">{myNGO.name[0]}</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{myNGO.name}</h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-success/10 text-success"><Shield className="w-3 h-3" /> Verified</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">Pending Verification</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{myNGO.location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showPost} onOpenChange={setShowPost}>
              <DialogTrigger asChild><Button variant="outline" size="sm" disabled={!isVerified}><MessageSquare className="w-4 h-4 mr-1" /> Post</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Post</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share update..." rows={3} />
                  <div className="flex gap-2">
                    {(['update', 'campaign', 'need'] as const).map(t => (
                      <Button key={t} variant={postType === t ? 'default' : 'outline'} size="sm" onClick={() => setPostType(t)}>{t}</Button>
                    ))}
                  </div>
                  <Button variant="hero" className="w-full" onClick={handlePost}>Publish</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showProof} onOpenChange={setShowProof}>
              <DialogTrigger asChild><Button variant="hero" size="sm"><Camera className="w-4 h-4 mr-1" /> Upload Proof</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload Impact Proof</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div><Label>Description</Label><Input value={proof.description} onChange={e => setProof(p => ({ ...p, description: e.target.value }))} /></div>
                  <div><Label>Location</Label><Input value={proof.location} onChange={e => setProof(p => ({ ...p, location: e.target.value }))} /></div>
                  <div><Label>Image URL</Label><Input value={proof.imageUrl} onChange={e => setProof(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." /></div>
                  <Button variant="hero" className="w-full" onClick={handleProof}>Submit Proof</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!isVerified && (
          <div className="glass-card p-4 mb-6 border-warning/30 bg-warning/5">
            <p className="text-sm text-warning font-medium">⏳ Your NGO is pending admin verification. Some features are restricted.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card"><Package className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-display font-bold">{claimedResources.length}</div><p className="text-xs text-muted-foreground">Resources Claimed</p></div>
          <div className="stat-card"><Users className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-display font-bold">{myApplicants.length}</div><p className="text-xs text-muted-foreground">Volunteers</p></div>
          <div className="stat-card"><Camera className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-display font-bold">{myProofs.length}</div><p className="text-xs text-muted-foreground">Proofs Submitted</p></div>
          <div className="stat-card"><MessageSquare className="w-5 h-5 text-primary mb-2" /><div className="text-2xl font-display font-bold">{myPosts.length}</div><p className="text-xs text-muted-foreground">Posts</p></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Available Resources */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Available Resources ({availableResources.length})</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableResources.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div><p className="font-medium text-sm">{r.title}</p><p className="text-xs text-muted-foreground">{r.quantity} {r.unit} · {r.location}</p></div>
                  <Button size="sm" onClick={() => handleClaim(r.id)} disabled={!isVerified}>Claim</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteer Applications */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Volunteer Applications ({myApplicants.length})</h2>
            <div className="space-y-3">
              {myApplicants.map(a => (
                <div key={a.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{a.volunteerName}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      a.status === 'accepted' ? 'bg-success/10 text-success' :
                      a.status === 'applied' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                    }`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{a.role} · Skills: {a.skills.join(', ')}</p>
                  {a.status === 'applied' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { updateVolunteerStatus(a.id, 'accepted'); toast.success('Accepted!'); }}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { updateVolunteerStatus(a.id, 'completed'); toast.info('Marked complete'); }}>Complete</Button>
                    </div>
                  )}
                </div>
              ))}
              {myApplicants.length === 0 && <p className="text-sm text-muted-foreground">No volunteer applications yet.</p>}
            </div>
          </div>

          {/* Proofs */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Impact Proofs</h2>
            {myProofs.length === 0 ? <p className="text-sm text-muted-foreground">No proofs uploaded yet.</p> : (
              <div className="space-y-3">
                {myProofs.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-muted/30">
                    <p className="font-medium text-sm">{p.description}</p>
                    <p className="text-xs text-muted-foreground">{p.location} · {p.timestamp.toLocaleDateString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${p.status === 'verified' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-warning" /> Suggestions</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30"><p className="text-sm font-medium">Partner with local restaurants</p><p className="text-xs text-muted-foreground">Connect with nearby food donors</p></div>
              <div className="p-3 rounded-lg bg-muted/30"><p className="text-sm font-medium">Launch a clothing drive</p><p className="text-xs text-muted-foreground">Winter is approaching — start collecting</p></div>
              <div className="p-3 rounded-lg bg-muted/30"><p className="text-sm font-medium">Recruit tech volunteers</p><p className="text-xs text-muted-foreground">Skill-based volunteers available</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
