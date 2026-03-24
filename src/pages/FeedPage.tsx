import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, DollarSign, UserPlus } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function FeedPage() {
  const { feedPosts, currentUser, likePost, applyToPost, donateToPost, addFeedPost, ngos } = useAppStore();
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'campaign' | 'need' | 'update'>('update');

  const userNGO = currentUser?.role === 'ngo' ? ngos.find(n => n.userId === currentUser.id && n.status === 'verified') : null;

  const handlePost = () => {
    if (!userNGO || !newPost.trim()) return;
    addFeedPost({ ngoId: userNGO.id, ngoName: userNGO.name, content: newPost, type: postType });
    setNewPost('');
    toast.success('Post published!');
  };

  const typeColors: Record<string, string> = {
    campaign: 'bg-primary/10 text-primary',
    need: 'bg-accent/10 text-accent',
    update: 'bg-info/10 text-info',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-2">Community Feed</h1>
        <p className="text-muted-foreground mb-8">Updates, campaigns, and needs from NGOs</p>

        {userNGO && (
          <motion.div className="glass-card p-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share an update, campaign, or need..." rows={3} className="mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['update', 'campaign', 'need'] as const).map(t => (
                  <Button key={t} variant={postType === t ? 'default' : 'outline'} size="sm" onClick={() => setPostType(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="hero" size="sm" onClick={handlePost} disabled={!newPost.trim()}>Post</Button>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {feedPosts.map((post, i) => {
            const isLiked = currentUser && post.likedBy.includes(currentUser.id);
            const hasApplied = currentUser && post.applicants.includes(currentUser.id);
            return (
              <motion.div
                key={post.id}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {post.ngoName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{post.ngoName}</h3>
                    <p className="text-xs text-muted-foreground">{post.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${typeColors[post.type]}`}>
                    {post.type}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4">{post.content}</p>
                <div className="flex items-center gap-4 border-t border-border pt-3">
                  <Button
                    variant="ghost" size="sm"
                    className={isLiked ? 'text-accent' : ''}
                    onClick={() => currentUser ? likePost(post.id, currentUser.id) : toast.error('Please login')}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} /> {post.likes}
                  </Button>
                  {post.type !== 'update' && (
                    <Button
                      variant="ghost" size="sm"
                      className={hasApplied ? 'text-primary' : ''}
                      onClick={() => {
                        if (!currentUser) { toast.error('Please login'); return; }
                        if (hasApplied) { toast.info('Already applied'); return; }
                        applyToPost(post.id, currentUser.id);
                        toast.success('Applied!');
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-1" /> {hasApplied ? 'Applied' : 'Apply'}
                    </Button>
                  )}
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => {
                      if (!currentUser) { toast.error('Please login'); return; }
                      donateToPost(post.id);
                      toast.success('Donation recorded!');
                    }}
                  >
                    <DollarSign className="w-4 h-4 mr-1" /> Donate ({post.donations})
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
