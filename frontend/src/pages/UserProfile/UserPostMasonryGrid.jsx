import { useEffect, useState } from 'react';
import { useDataContext } from '@/hooks/useDataContext';
import { useFetch } from '@/hooks/useFetch';
import UserPostPopup from './UserPostPopup';

const UserPostMasonryGrid = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { fetchUserPosts } = useFetch();
  const { data, setData } = useDataContext();
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      try {
        const posts = await fetchUserPosts();
        setData(posts);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      }
    };
    fetchAndSetPosts();
  }, [setData]);

  // trying to "reference" pinterest single color progressive loading style (totally referencing, not stealing)
  const getLowQualityUrl = (originalUrl) => originalUrl.replace('/upload/', '/upload/w_1,q_10/');

  const getProgressiveUrl = (originalUrl) =>
    originalUrl.replace('/upload/', '/upload/fl_progressive,q_auto/');

  const handleImageLoad = (id) => {
    setTimeout(() => {
      setLoadedImages((prev) => ({ ...prev, [id]: true }));
    }, 500); // can change timeout, maybe it's a bit much rn
  };

  const handleImageError = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: false }));
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setPopupOpen(true);
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 p-4 [column-fill:_balance]">
        {data?.map((post) => {
          const isLoaded = loadedImages[post.id];
          const failedToLoad = isLoaded === false;
          const lowResUrl = getLowQualityUrl(post.imageUrl);
          const progressiveUrl = getProgressiveUrl(post.imageUrl);

          return (
            <div
              key={post.id}
              className="mb-4 break-inside-avoid cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-background">
                {failedToLoad ? (
                  <div className="bg-red-100 text-warning text-center p-10 rounded-xl z-20">
                    Failed to load image
                  </div>
                ) : (
                  <>
                    <img
                      src={lowResUrl}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover blur-md animate-pulse scale-105 transition-opacity duration-500"
                    />

                    <img
                      src={progressiveUrl}
                      alt={post.title}
                      className={`relative w-full h-auto object-cover transition-opacity duration-700 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(post.id)}
                      onError={() => handleImageError(post.id)}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <UserPostPopup open={popupOpen} onOpenChange={setPopupOpen} post={selectedPost} />
    </>
  );
};

export default UserPostMasonryGrid;
