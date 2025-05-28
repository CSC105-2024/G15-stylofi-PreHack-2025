import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'react-hot-toast';
import EditPostForm from './EditPostForm';
import { useDataContext } from '@/hooks/useDataContext';

const UserPostPopup = ({ open, onOpenChange, post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const { likePost, unlikePost, checkLikeStatus, deletePost } = useFetch();
  const { data, setData } = useDataContext();

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

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleEditSuccess = (updatedPost) => {
    // Update the post in the data context
    if (data) {
      const updatedData = data.map((p) => (p.id === updatedPost.id ? updatedPost : p));
      setData(updatedData);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await deletePost(post.id);
      if (response.success) {
        if (data) {
          const updatedData = data.filter((p) => p.id !== post.id);
          setData(updatedData);
        }
        toast.success('Post deleted successfully');
        onOpenChange(false);
        setShowDeleteConfirm(false);
      } else {
        toast.error(response.msg || 'Failed to delete post');
      }
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!post) return null;
  return (
    <>
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
                    <button
                      onClick={handleEdit}
                      tabIndex="-1"
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                      aria-label="Edit post"
                    >
                      <Pencil size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      tabIndex="-1"
                      disabled={isDeleting}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete post"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeToggle();
                      }}
                      tabIndex="-1"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-surface/95 backdrop-blur-xl border border-border/50 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogDescription className="text-text/70 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-3 pt-2">
            <Button
              variant="outline"
              tabIndex="-1"
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-secondary text-white hover:bg-secondary-hover transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              tabIndex="-1"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 cursor-pointer"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </div>
              ) : (
                'Delete Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Form Dialog */}
      <EditPostForm
        post={post}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default UserPostPopup;
