import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function StockDrawer({ open, onClose, stock }) {
  if (!stock) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl p-6 overflow-y-auto animate-slide-in"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{stock.symbol}</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-2">{stock.name}</p>

          <div className="text-3xl font-bold mb-1">
            ₹ {stock.price}
          </div>

          <span
            className={`text-lg font-medium ${
              stock.trendUp ? "text-green-600" : "text-red-500"
            }`}
          >
            {stock.change}%
          </span>

          <div className="mt-6">
            <Sparklines data={stock.sparkData} height={50}>
              <SparklinesLine color={stock.trendUp ? "green" : "red"} />
            </Sparklines>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg w-full font-medium hover:bg-primary-700">
              Invest
            </button>
            <button className="border px-4 py-2 rounded-lg w-full font-medium hover:bg-gray-100">
              SIP
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
