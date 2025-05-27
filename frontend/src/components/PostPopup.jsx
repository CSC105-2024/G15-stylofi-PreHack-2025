import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { getUserById } from '@/services/user';
import { Heart } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'react-hot-toast';

export default function PostPopup({ open, onOpenChange, post }) {
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { likePost, unlikePost, checkLikeStatus } = useFetch();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (post?.authorId) {
        try {
          const data = await getUserById(post.authorId);
          if (data.success) {
            setAuthor(data.data);
          } else {
            setAuthor(null);
          }
        } catch (error) {
          console.error('Error fetching author:', error);
          setAuthor(null);
        }
      }
    };

    fetchAuthor();
  }, [post?.authorId]);

  useEffect(() => {
    if (post) {
      setLikeCount(post.likes);

      const checkIfLiked = async () => {
        try {
          const { success, isLiked } = await checkLikeStatus(post.id);
          if (success) {
            setIsLiked(isLiked);
          }
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };

      checkIfLiked();
    }
  }, [post]);

  const handleLikeToggle = async () => {
    if (!post) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        // unlike post
        const response = await unlikePost(post.id);
        if (response.success) {
          setIsLiked(false);
          setLikeCount((prev) => Math.max(0, prev - 1));
          toast.success('Post unliked');
        }
      } else {
        // like post
        const response = await likePost(post.id);
        if (response.success) {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
          toast.success('Post liked');
        }
      }
    } catch (error) {
      toast.error('Failed to update like status');
      console.error('Error toggling like:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (!post) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 rounded-2xl"
        aria-describedby={`post-${post.id}-description`}
      >
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>{post.title}</DialogTitle>
          <DialogDescription id={`post-${post.id}-description`}>
            {post.description}
          </DialogDescription>
        </DialogHeader>
        <Card className="p-0 shadow-none border-none">
          <div className="flex flex-col items-center">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-w-xs rounded-xl object-cover mb-4 mt-2"
            />
            <CardContent className="w-full flex flex-col gap-2 px-4 pb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag.name}
                    className="text-blue-500 text-xs font-medium hover:underline cursor-pointer"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={author?.profileImage || '/images/sample-1.jpg'}
                    alt={author?.username || 'User'}
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <span className="text-xs font-semibold">{author?.username || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle();
                    }}
                    disabled={isLikeLoading}
                    className="flex items-center gap-1 text-sm"
                    aria-label={isLiked ? 'Unlike post' : 'Like post'}
                  >
                    <Heart
                      size={24}
                      className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'} ${isLikeLoading ? 'opacity-50' : ''}`}
                    />
                    <div className="w-2">
                      <span>{likeCount}</span>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
        <DialogClose className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" />
      </DialogContent>
    </Dialog>
  );
}
