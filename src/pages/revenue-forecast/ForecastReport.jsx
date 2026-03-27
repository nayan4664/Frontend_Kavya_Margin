import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Search,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import { exportToCSV } from "../../utils/exportUtils";
import { forecastAPI } from "../../services/api";

const ForecastReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [financialYear, setFinancialYear] = useState("All");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await forecastAPI.getReports();
      setReportData(response.data);
    } catch (err) {
      console.error("Error fetching forecast reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get Financial Year from date
  const getFinancialYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    if (month >= 4) {
      return `FY ${year}-${year + 1}`;
    } else {
      return `FY ${year - 1}-${year}`;
    }
  };

  // Filter Reports
  const filteredReports = reportData.filter((report) => {
    const searchMatch = report.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || report.type === category;

    const fyMatch =
      financialYear === "All" ||
      getFinancialYear(report.date) === financialYear;

    return searchMatch && categoryMatch && fyMatch;
  });

  const handleExport = (data, filename) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role?.toLowerCase() === 'hr' || currentUser?.role === 'Project Manager') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    exportToCSV(data, filename);
  };

  // Download report
  const downloadReport = (report) => {
    handleExport([report], `${report.name}.csv`);
  };

  // Stats
  const totalReports = reportData.length;

  const financialReports = reportData.filter(
    (r) => r.type === "Financial"
  ).length;

  const forecastReports = reportData.filter(
    (r) => r.type === "Forecast"
  ).length;

  return (
    <div className="space-y-8" id="forecast-report-content">

      {/* Header */}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            Forecast Reports
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Access and download generated financial and projection reports.</p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && currentUser?.role !== 'Project Manager' && (
            <>
              <button
                onClick={() => handleExport(filteredReports, "ForecastReports.csv")}
                className="flex items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-400 text-sm font-bold hover:bg-emerald-600/20 transition-all"
              >
                <Download className="w-4 h-4" /> 
                <span>CSV Export</span>
              </button>

              <button
                onClick={() => handleExport(reportData, "Forecast_Report.csv")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Stats Cards */}

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
          <p className="text-gray-400 text-sm">Total Reports</p>
          <h3 className="text-2xl text-white">{totalReports}</h3>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
          <p className="text-gray-400 text-sm">Financial Reports</p>
          <h3 className="text-2xl text-white">{financialReports}</h3>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
          <p className="text-gray-400 text-sm">Forecast Reports</p>
          <h3 className="text-2xl text-white">{forecastReports}</h3>
        </div>

      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-slate-200 w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <select
            className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Financial</option>
            <option>Forecast</option>
            <option>Efficiency</option>
            <option>Strategy</option>
          </select>

          {/* Financial Year Selector */}
          <select
            className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
          >
            <option value="All">All Financial Years</option>
            <option value="FY 2025-2026">FY 2025-2026</option>
            <option value="FY 2026-2027">FY 2026-2027</option>
            <option value="FY 2027-2028">FY 2027-2028</option>
          </select>
        </div>
        
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing {filteredReports.length} Reports
        </div>
      </div>

      {/* Report Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group flex flex-col h-full shadow-sm"
          >
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>

            <h4 className="text-slate-100 font-bold text-lg mb-1 leading-tight group-hover:text-blue-400 transition-colors">
              {report.name}
            </h4>

            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6">
              {report.type}
            </p>

            <div className="space-y-2 mb-8 flex-grow">
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                <span>Author:</span>
                <span className="text-slate-300">{report.author}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                <span>Date:</span>
                <span className="text-slate-300">{report.date}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                <span>FY:</span>
                <span className="text-slate-300">{getFinancialYear(report.date)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                <span>Size:</span>
                <span className="text-slate-300">{report.size}</span>
              </div>
            </div>

            {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && currentUser?.role !== 'Project Manager' && (
              <button
                onClick={() => downloadReport(report)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> 
                <span>Download</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* AI Insight */}

      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">

        <h3 className="text-xl text-white mb-2 flex items-center gap-2">
          <TrendingUp /> AI Financial Insight
        </h3>

        <p className="text-slate-400 text-sm">
          The March financial close report has been automatically generated
          by the AI engine. It includes reconciliation of actual billing
          vs forecast with 98% accuracy.
        </p>

        <button
          onClick={() => setShowAnalysis(true)}
          className="mt-6 flex gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          View Analysis <ChevronRight size={16} />
        </button>

      </div>

      {/* Analysis Modal */}

      {showAnalysis && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">

          <div className="bg-slate-900 p-8 rounded-xl w-[500px] border border-slate-700">

            <h2 className="text-xl text-white mb-4">
              Financial Analysis Report
            </h2>

            <p className="text-slate-400 text-sm mb-4">
              Revenue increased by 14% in March compared to February.
            </p>

            <ul className="text-sm text-slate-300 space-y-2">
              <li>📈 Revenue Growth: +14%</li>
              <li>💰 Profit Margin: 32%</li>
              <li>📊 Forecast Accuracy: 98%</li>
            </ul>

            <button
              onClick={() => setShowAnalysis(false)}
              className="mt-6 bg-blue-600 px-4 py-2 rounded text-white"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default ForecastReport;