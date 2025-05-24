import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-4 gap-2 space-y-2 p-4">
      <AnimatePresence>
        {data?.map((post, i) => {
          const isLoaded = loadedImages[post.id];
          return (
            <motion.div
              key={post.id ?? i}
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              layout
            >
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl z-0" />
                )}

                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={`relative w-full object-cover transition-opacity duration-500 z-10 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(post.id)}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MasonryGrid;
