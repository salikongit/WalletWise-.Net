import { useState } from "react";
import { getStock } from "../services/marketAPI";

export default function StockSearch() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const result = await getStock(symbol);
    setData(result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 Search NSE Stock</h2>

      <input
        type="text"
        placeholder="TCS, INFY, HDFCBANK..."
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {data && (
        <div style={{ marginTop: 20, border: "1px solid #aaa", padding: 15 }}>
          <h3>{data.symbol}</h3>
          <p>💰 Price: ₹{data.price}</p>
          <p>🏛 Exchange: {data.exchange}</p>
        </div>
      )}
    </div>
  );
}
