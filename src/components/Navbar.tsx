const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 mx-auto flex items-center justify-between p-4">
      <h1 className="font-semibold text-primary sm:text-lg">
        Token Portfolio
      </h1>
      <button className="btn primary-btn">Connect Wallet</button>
    </header>
  );
};

export default Navbar;
