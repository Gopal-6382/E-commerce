const Navbar = () => {
  return <div className="flex items-center justify-between py-5 font-medium">
    <div className="text-lg font-bold">My App</div>
    <div className="space-x-4">
      <a href="/" className="hover:underline">Home</a>
      <a href="/collection" className="hover:underline">Collection</a>
      <a href="/about" className="hover:underline">About</a>
      <a href="/contact" className="hover:underline">Contact</a>
      <a href="/login" className="hover:underline">Login</a>
    </div>
  </div>;
};

export default Navbar;
