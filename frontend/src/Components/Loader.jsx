//The Preview page can take few seconds to load, so we add this Loader

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="size-12 border-3 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
