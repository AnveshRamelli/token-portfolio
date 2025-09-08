import { useAppSelector } from "../app/hooks";
import {
  selectLastUpdated,
  selectPortfolioTotal,
  selectWalletAddress,
} from "../features/portfolio/portfolioSelectors";

const PortfolioSummary = () => {
  const portfolioTotal = useAppSelector(selectPortfolioTotal);
  const lastUpdated = useAppSelector(selectLastUpdated);
  const walletAddress = useAppSelector(selectWalletAddress);

  return (
    <section className="flex flex-col justify-between h-[100%]">
      <div>
        <p className="text-muted text-sm">Portfolio Total</p>
        {walletAddress ? (
          <h2 className="text-5xl text-primary mt-5">
            ${portfolioTotal.toFixed(2)}
          </h2>
        ) : (
          <p className="mt-10 text-center text-muted">
            Please Connect Wallet to see your Portfolio
          </p>
        )}
      </div>
      <p className="text-xs text-muted mt-5">Last updated: {lastUpdated}</p>
    </section>
  );
};

export default PortfolioSummary;
