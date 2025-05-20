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
  return (
    <div className="columns-1 sm:columns-2 lg:columns-4 gap-2 space-y-2 p-4">
      {images.map((src, i) => (
        <div className="break-inside-avoid" key={i}>
          <img
            src={src}
            alt={`sample-${i + 1}`}
            className="object-cover rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
