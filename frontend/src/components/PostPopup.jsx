import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function PostPopup({ open, onOpenChange, post }) {
  if (!post) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 rounded-2xl">
        <Card className="p-0 shadow-none border-none">
          <div className="flex flex-col items-center">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-w-xs rounded-xl object-cover mb-4 mt-2"
            />
            <CardContent className="w-full flex flex-col gap-2 px-4 pb-4">
              <h2 className="font-bold text-lg mb-1">{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
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
                    src={post.author?.profileImage || '/images/sample-1.jpg'}
                    alt={post.author?.username || 'User'}
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <span className="text-xs font-semibold">
                    {post.author?.username || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-pink-500">
                  <Heart size={16} className="fill-pink-500" />
                  <span className="text-xs font-semibold">{post.likes || 0}</span>
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
