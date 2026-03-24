import { motion } from 'framer-motion';
import { Users, Briefcase, CheckCircle, Clock, Award, FileText, Lightbulb } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function VolunteerDashboard() {
  const { currentUser, volunteerApps, feedPosts, certificates, issueCertificate, ngos, applyVolunteer } = useAppStore();
  if (!currentUser) return null;

  const myApps = volunteerApps.filter(a => a.volunteerId === currentUser.id);
  const accepted = myApps.filter(a => a.status === 'accepted').length;
  const completed = myApps.filter(a => a.status === 'completed').length;
  const myCerts = certificates.filter(c => c.userId === currentUser.id);

  // Suggested opportunities (campaigns/needs matching user skills)
  const suggested = feedPosts.filter(p => p.type === 'campaign' || p.type === 'need').slice(0, 4);

  const handleQuickApply = (post: typeof feedPosts[0]) => {
    const ngo = ngos.find(n => n.id === post.ngoId);
    if (!ngo) return;
    applyVolunteer({
      volunteerId: currentUser.id,
      volunteerName: currentUser.name,
      ngoId: ngo.id,
      ngoName: ngo.name,
      role: 'Volunteer',
      skills: currentUser.skills || [],
    });
    toast.success(`Applied to ${ngo.name}!`);
  };

  const generateCert = () => {
    issueCertificate({ userId: currentUser.id, userName: currentUser.name, type: 'volunteer', description: `Completed ${completed} volunteer assignments`, ngoName: 'Cohere Platform' });
    toast.success('Certificate generated!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold">Volunteer Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
          {currentUser.skills && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {currentUser.skills.map(s => (
                <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Applications', value: myApps.length, icon: Briefcase },
            { label: 'Accepted', value: accepted, icon: CheckCircle },
            { label: 'Completed', value: completed, icon: Award },
            { label: 'Certificates', value: myCerts.length, icon: FileText },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My Applications */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">My Applications</h2>
            {myApps.length === 0 ? <p className="text-sm text-muted-foreground">No applications yet. Check suggested opportunities!</p> : (
              <div className="space-y-3">
                {myApps.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{a.role}</p>
                      <p className="text-xs text-muted-foreground">{a.ngoName}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      a.status === 'accepted' ? 'bg-success/10 text-success' :
                      a.status === 'applied' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Suggested */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" /> Suggested Opportunities
              </h2>
              {suggested.map(p => (
                <div key={p.id} className="p-3 rounded-lg bg-muted/30 mb-2 flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <p className="text-sm font-medium">{p.ngoName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.content}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleQuickApply(p)}>Apply</Button>
                </div>
              ))}
            </div>

            {/* Certificates */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Certificates</h2>
              <Button variant="outline" size="sm" onClick={generateCert} className="mb-3">Generate Service Certificate</Button>
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
