import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  Search,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { exportToCSV } from "../../utils/exportUtils";
import { invoiceAPI } from "../../services/api";

const PaymentTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) setCurrentUser(user);
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getAll();
      // Map invoice data to payment history format
      const mappedPayments = response.data.map(inv => ({
        id: inv._id,
        client: inv.clientName,
        amount: `₹${inv.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`,
        date: new Date(inv.date).toISOString().split('T')[0],
        method: "Direct Deposit",
        status: inv.status === 'Paid' ? 'Completed' : 'Pending',
        rawAmount: inv.items.reduce((sum, item) => sum + item.amount, 0)
      }));
      setPaymentHistory(mappedPayments);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  /* FILTER PAYMENTS */
  const filteredPayments = paymentHistory.filter((p) =>
    p.client?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* TOTALS */
  const totalCollected = paymentHistory
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + p.rawAmount, 0);

  const totalPending = paymentHistory
    .filter((p) => p.status !== "Completed")
    .reduce((acc, p) => acc + p.rawAmount, 0);

  /* CHART DATA */
  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(m => ({ month: m, collected: 0, pending: 0 }));
    
    paymentHistory.forEach(p => {
      const monthIdx = new Date(p.date).getMonth();
      if (p.status === "Completed") {
        data[monthIdx].collected += p.rawAmount;
      } else {
        data[monthIdx].pending += p.rawAmount;
      }
    });
    
    // Filter out months with no data to keep chart clean
    return data.filter(d => d.collected > 0 || d.pending > 0);
  };

  const collectionData = getChartData();

  /* SEND REMINDER FUNCTION */
  const sendReminders = () => {
    const pendingPayments = paymentHistory.filter(
      (p) => p.status !== "Completed"
    );

    if (pendingPayments.length === 0) {
      alert("No pending payments to send reminders.");
      return;
    }

    const clients = pendingPayments.map((p) => p.client).join(", ");

    alert(`Reminder sent to: ${clients}`);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
<IndianRupee className="w-8 h-8 text-blue-500" />
            Payment Tracking
          </h1>
          <p className="text-slate-400">
            Monitor incoming revenue and pending receivables.
          </p>
        </div>

        <div className="flex gap-3">
          {/* EXPORT */}
          {currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Viewers' && (
            <button
              onClick={() =>
                exportToCSV(filteredPayments, "Payment_History.csv")
              }
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 hover:bg-slate-800"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Total Collected</p>
          <p className="text-emerald-400 text-2xl font-bold mt-2">
            ₹{totalCollected.toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Pending Payments</p>
          <p className="text-amber-400 text-2xl font-bold mt-2">
            ₹{totalPending.toLocaleString()}
          </p>
        </div>

      </div>

      {/* COLLECTION CHART */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">

        <h3 className="text-lg font-bold text-slate-100 mb-6">
          Collection Performance
        </h3>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collectionData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis
                stroke="#64748b"
                tickFormatter={(v) => `₹${v / 100000}L`}
              />

              <Tooltip />

              <Legend />

              <Bar dataKey="collected" fill="#10b981" name="Collected" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h4 className="text-slate-100 font-bold">Recent Transactions</h4>
          
          {/* SEARCH moved above table */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search client..."
              className="bg-transparent outline-none text-sm text-slate-200 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-xs text-slate-400">Client</th>
                <th className="px-6 py-3 text-xs text-slate-400">Amount</th>
                <th className="px-6 py-3 text-xs text-slate-400">Date</th>
                <th className="px-6 py-3 text-xs text-slate-400">Method</th>
                <th className="px-6 py-3 text-xs text-slate-400">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">

              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800">

                    <td className="px-6 py-4 text-slate-100 font-semibold">
                      {p.client}
                    </td>

                    <td className="px-6 py-4 text-slate-100 font-bold">
                      {p.amount}
                    </td>

                    <td className="px-6 py-4 text-slate-400">{p.date}</td>

                    <td className="px-6 py-4 text-slate-400">{p.method}</td>

                    <td className="px-6 py-4">

                      <span
                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit ${
                          p.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {p.status === "Completed" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}

                        {p.status}
                      </span>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* SEND REMINDER BUTTON */}

      {currentUser?.role === 'Super Admin' && (
        <div className="flex justify-end">

          <button
            onClick={sendReminders}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
          >
            Send Reminders
            <ArrowUpRight className="w-4 h-4" />
          </button>

        </div>
      )}

    </div>
  );
};

export default PaymentTracking;