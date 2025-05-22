import { Progress } from "@/components/ui/progress";
import { useDataContext } from "@/hooks/useDataContext";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

const images = [
  "/images/sample-1.jpg",
  "/images/sample-2.jpg",
  "/images/sample-3.jpg",
  "/images/sample-4.jpg",
  "/images/sample-5.jpg",
  "/images/sample-6.jpg",
  "/images/sample-7.jpg",
  "/images/sample-8.jpg",
  "/images/sample-9.jpg",
];

const MasonryGrid = () => {
  const { fetchPosts } = useFetch();
  const { data, setData } = useDataContext();
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(80), 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const setPosts = async () => {
      const posts = await fetchPosts();
      setData(posts);
    };
    setPosts();
  }, []);

  if (!data) return <Progress value={progress} />;

  return (
    <div className="columns-1 sm:columns-2 lg:columns-4 gap-2 space-y-2 p-4">
      {data.map((post, i) => (
        <div className="break-inside-avoid" key={post.id ?? i}>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover rounded-xl w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
