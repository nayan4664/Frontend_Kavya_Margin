import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ArrowRight, ShieldCheck, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contractAPI } from '../../services/api';

const UploadContract = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    // Redirect if unauthorized (Team Lead, HR and Viewers should not access this page at all)
    if (user?.role === 'Team Lead' || user?.role === 'HR' || user?.role === 'Viewers') {
      navigate('/dashboard');
    }

    fetchContracts();
  }, [navigate]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractAPI.getAll();
      setUploadedFiles(response.data);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadToBackend = async (file) => {
    try {
      const newFile = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        status: 'Processing',
        date: new Date().toISOString().split('T')[0],
        insights: []
      };
      
      await contractAPI.create(newFile);
      fetchContracts(); // Refresh the list
    } catch (err) {
      console.error("Error uploading contract metadata:", err);
      alert("Failed to save contract information to database.");
    }
  };

  const handleDrag = (e) => {
    if (currentUser?.role === 'Project Manager') return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    if (currentUser?.role === 'Project Manager') return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadToBackend(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (currentUser?.role === 'Project Manager') {
      alert('Unauthorized: Project Managers have read-only access and cannot upload contracts.');
      return;
    }
    if (e.target.files && e.target.files[0]) {
      await uploadToBackend(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
          <Upload className="w-8 h-8 text-blue-500" />
          Contract Upload & Analysis
        </h1>
        <p className="text-slate-400 mt-2 font-medium">Upload legal documents for automated AI analysis of margins, SLAs, and compliance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-slate-800 bg-slate-900/50 backdrop-blur-xl'
            } ${currentUser?.role === 'Project Manager' ? 'cursor-not-allowed opacity-75' : ''}`}
          >
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {currentUser?.role === 'Project Manager' ? 'Upload Restricted' : 'Drag & Drop Contracts'}
            </h3>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              {currentUser?.role === 'Project Manager' ? 'Project Managers have read-only access.' : 'or click to browse from your computer'}
            </p>
            <p className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-widest">Supports PDF, DOCX, TXT (Max 25MB)</p>
            {currentUser?.role !== 'Project Manager' && (
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
              />
            )}
          </div>

          {/* Recent Uploads */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h4 className="font-bold text-slate-100">Recent Uploads</h4>
              <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors">View All</button>
            </div>
            <div className="divide-y divide-slate-800">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{file.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      file.status === 'Analyzed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {file.status}
                    </span>
                    {file.status === 'Analyzed' && (
                      <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">View Insights</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Processing Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/20 text-white border border-slate-800">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              Analysis Engine
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <span className="text-[10px] font-bold text-blue-400">01</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Clause Extraction</p>
                  <p className="text-xs text-slate-400 mt-1">Identifies payment terms, penalties, and resource obligations.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <span className="text-[10px] font-bold text-blue-400">02</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Margin Validation</p>
                  <p className="text-xs text-slate-400 mt-1">Cross-references billing rates with internal cost sheets.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <span className="text-[10px] font-bold text-blue-400">03</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Risk Scoring</p>
                  <p className="text-xs text-slate-400 mt-1">Flags unfavorable terms or potential compliance issues.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-amber-100 uppercase tracking-widest">Compliance Tip</h5>
                <p className="text-xs text-amber-300 mt-1 leading-relaxed font-medium">
                  Ensure all signed addendums are uploaded along with the master service agreement for 100% accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadContract;