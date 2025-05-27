import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FormField from '@/components/FormField';
import { useFetch } from '@/hooks/useFetch';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function EditPostForm({ post, open, onOpenChange, onSuccess }) {
  const { updatePost } = useFetch();
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updatePost(post.id, { title, description });
      if (response.success) {
        toast.success('Post updated successfully');
        onSuccess?.(response.data);
        onOpenChange(false);
      } else {
        toast.error(response.msg || 'Failed to update post');
      }
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        <DialogHeader className="px-4 pt-4 space-y-3">
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <FormField
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />

          <FormField
            id="description"
            label="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />

          <DialogFooter className="gap-2 sm:gap-0 space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="bg-secondary text-white hover:bg-secondary-hover transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
