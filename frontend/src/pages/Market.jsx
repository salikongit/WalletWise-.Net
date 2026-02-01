import { useState } from "react";

export default function Market() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

const fetchStock = async () => {
  if (!symbol || symbol.length < 2) {
    alert("❌ Enter a valid stock like TCS, INFY, SBIN, etc.");
    return;
  }

  const formatted = symbol.toUpperCase().endsWith(".NS")
    ? symbol.toUpperCase()
    : `${symbol.toUpperCase()}.NS`;

  setLoading(true);

  try {
    const res = await fetch(`http://localhost:5000/api/market/yahoo/${formatted}`);
    const json = await res.json();

    if (!json.price) {
      alert("⚠️ Stock not found. Try: TCS, INFY, SBIN, etc.");
      setLoading(false);
      return;
    }

    setData(json);

  } catch (error) {
    console.error("Fetch error:", error);
  }

  setLoading(false);
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📈 Stock Market Lookup</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-64"
          placeholder="Enter NSE symbol (e.g. TCS.NS)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button
          onClick={fetchStock}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {data && data.price && (
        <div className="p-4 border rounded bg-gray-50">
          <p>📌 <strong>{data.symbol}</strong></p>
          <p>💰 Price: <strong>₹{data.price}</strong></p>
          <p>🏦 Exchange: {data.exchange}</p>
          <p>💱 Currency: {data.currency}</p>
        </div>
      )}

      {data && data.error && (
        <p className="text-red-500">❌ {data.error}</p>
      )}
    </div>
  );
}
