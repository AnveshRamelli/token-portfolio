import { useAppSelector } from "../app/hooks";
import {
  selectLastUpdated,
  selectPortfolioTotal,
} from "../features/portfolio/portfolioSelectors";

const PortfolioSummary = () => {
  const portfolioTotal = useAppSelector(selectPortfolioTotal);
  const lastUpdated = useAppSelector(selectLastUpdated);

  return (
    <section className="flex flex-col justify-between h-[100%]">
      <div>
        <p className="text-muted text-sm">Portfolio Total</p>
        <h2 className="text-5xl text-primary mt-5">${portfolioTotal}</h2>
      </div>
      <p className="text-xs text-muted mt-5">Last updated: {lastUpdated}</p>
    </section>
  );
};

export default PortfolioSummary;
