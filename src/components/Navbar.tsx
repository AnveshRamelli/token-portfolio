import { WalletConnectButton } from "./WalletConnectButton";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 mx-auto flex  justify-between p-4 bg-outer">
      <h1 className="font-semibold text-primary sm:text-lg">
        <img src="/logo.svg" alt="Logo" className="inline h-7 w-7 mr-2"/>
        Token Portfolio
      </h1>
      <span>
        <WalletConnectButton />;
      </span>
    </header>
  );
};

export default Navbar;
