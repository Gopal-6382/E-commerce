const NewsletterBox = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off{" "}
      </p>
      <p className="text-gray-400 mt-3">
        Join our newsletter for the latest updates.
      </p>
      <form onSubmit={onSubmitHandler} className="w-full my-6  pl-3 sm:w-1/2 flex item-center gap-3 mx-auto ">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="w-full   sm:flex-1 outline-none border border-gray-700 p-2 rounded"
        />
        <button
          className="bg-black rounded text-white text-xs px-10 py-4"
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
