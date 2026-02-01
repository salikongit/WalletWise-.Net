import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useEffect, useState } from "react";
import StockDrawer from "../components/StockDrawer";

export default function MarketOverview() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchList = async () => {
    const res = await fetch("http://localhost:5000/api/market/nse-list");
    const companies = await res.json();

    const results = await Promise.all(
      companies.map(async (item) => {
        const symbol = item.symbol + ".NS";
        try {
          const priceRes = await fetch(`http://localhost:5000/api/market/yahoo/${symbol}`);
          const priceData = await priceRes.json();

          const price = Number(priceData.price);
          const change = (Math.random() * 4 - 2).toFixed(2); // temporary until real data
          const trendUp = change > 0;

          return {
            name: item.name,
            symbol,
            price,
            change,
            trendUp,
            sparkData: Array.from({ length: 8 }, () => price + (Math.random() * 20 - 10)),
          };
        } catch {
          return { name: item.name, symbol, price: "N/A" };
        }
      })
    );

    setStocks(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openDrawer = (stock) => {
    setSelectedStock(stock);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  if (loading)
    return (
      <div className="text-center text-lg mt-10">
        Fetching live market data...
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-semibold mb-8">Market Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => openDrawer(stock)}
            className="p-5 bg-white border rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{stock.symbol}</h2>
              <div className="text-xl font-bold">
                {stock.price !== "N/A" ? `₹ ${stock.price}` : "N/A"}
              </div>
            </div>

            <p className="text-gray-600 text-sm">{stock.name}</p>

            <div className="mt-3 flex items-center gap-2">
              {stock.trendUp ? (
                <TrendingUp className="text-green-600 w-5 h-5" />
              ) : (
                <TrendingDown className="text-red-600 w-5 h-5" />
              )}

              <span
                className={`font-medium ${
                  stock.trendUp ? "text-green-600" : "text-red-500"
                }`}
              >
                {stock.change}%
              </span>
            </div>

            <div className="mt-4">
              <Sparklines data={stock.sparkData} width={100} height={40}>
                <SparklinesLine color={stock.trendUp ? "green" : "red"} />
              </Sparklines>
            </div>
          </div>
        ))}
      </div>

      {/* 📌 Drawer Component */}
      <StockDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        stock={selectedStock}
      />
    </div>
  );
}
