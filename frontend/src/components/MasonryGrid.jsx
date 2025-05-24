import { useEffect, useState } from "react";
import { useDataContext } from "@/hooks/useDataContext";
import { useFetch } from "@/hooks/useFetch";

const MasonryGrid = () => {
  const { fetchPosts } = useFetch();
  const { data, setData } = useDataContext();
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      try {
        const posts = await fetchPosts();
        setData(posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchAndSetPosts();
  }, [setData]);

  const getBlurredUrl = (originalUrl) => {
    return originalUrl.replace("/upload/", "/upload/e_blur:2000,q_1,w_20/");
  };

  // TODO: maybe display this in dashboard and only when clicking, show actual quality image, dunno
  const getOptimizedUrl = (originalUrl) => {
    return originalUrl.replace("/upload/", "/upload/w_1000/q_auto/f_auto/");
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 p-4 [column-fill:_balance]">
      {data?.map((post) => {
        const isLoaded = loadedImages[post.id];
        const failedToLoad = isLoaded === false;
        const blurredUrl = getBlurredUrl(post.imageUrl);
        const optimizedUrl = getOptimizedUrl(post.imageUrl);

        return (
          <div key={post.id} className="mb-4 break-inside-avoid">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={blurredUrl}
                alt={failedToLoad ? "" : "Blurred"}
                className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 animate-pulse z-0"
              />

              {failedToLoad ? (
                <div className="bg-red-100 text-red-500 text-center p-10 rounded-xl">
                  Failed to load image
                </div>
              ) : (
                <img
                  src={optimizedUrl}
                  alt={post.title}
                  className={`relative w-full h-auto object-cover transition-opacity duration-500 z-10 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(post.id)}
                  onError={() => handleImageError(post.id)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MasonryGrid;
