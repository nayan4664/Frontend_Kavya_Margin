import React, { useState, useEffect } from 'react';
import { Receipt, Save, ArrowLeft, Plus, Trash2, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { exportToPDF } from '../../utils/exportUtils';
import { invoiceAPI } from '../../services/api';

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const isViewOnly = currentUser?.role === 'Project Manager';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    // Redirect if unauthorized (Team Lead and Viewers should not access this page)
    if (user?.role === 'Team Lead' || user?.role === 'Viewers') {
      navigate('/invoicing/list');
    }
  }, [navigate]);

  const [invoiceData, setInvoiceData] = useState({
    invoiceId: `INV-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    clientName: '',
    project: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ id: 1, description: 'Development Services', hours: 160, rate: 45, amount: 7200 }],
    taxRate: 18,
    notes: 'Payment due within 15 days.',
  });

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { id: Date.now(), description: '', hours: 0, rate: 0, amount: 0 }]
    });
  };

  const updateItem = (id, field, value) => {
    const newItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'hours' || field === 'rate') updatedItem.amount = updatedItem.hours * updatedItem.rate;
        return updatedItem;
      }
      return item;
    });
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const removeItem = (id) => {
    setInvoiceData({ ...invoiceData, items: invoiceData.items.filter(item => item.id !== id) });
  };

  const subtotal = invoiceData.items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + tax;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!invoiceData.clientName || !invoiceData.project || !invoiceData.dueDate) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        invoiceId: invoiceData.invoiceId,
        clientName: invoiceData.clientName,
        project: invoiceData.project,
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        items: invoiceData.items.map(({ description, hours, rate, amount }) => ({
          description,
          hours,
          rate,
          amount
        })),
        taxRate: invoiceData.taxRate,
        notes: invoiceData.notes,
        status: 'Pending'
      };

      await invoiceAPI.create(payload);
      alert('Invoice generated successfully!');
      navigate('/invoicing/list');
    } catch (err) {
      console.error("Error creating invoice:", err);
      alert(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/invoicing/list" className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Receipt className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
              {isViewOnly ? 'View Invoice' : 'Generate Invoice'}
            </h1>
            <p className="text-slate-400 mt-1 font-bold tracking-wide">
              {isViewOnly ? 'Review professional client invoice details.' : 'Create and customize professional client invoices.'}
            </p>
          </div>
        </div>
        {currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Viewers' && currentUser?.role !== 'Project Manager' && (
          <button 
            onClick={() => exportToPDF('invoice-preview', `Invoice_${invoiceData.invoiceId}.pdf`)} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl group"
          >
            <Download className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            PREVIEW PDF
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Invoice Form */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Client Name</label>
              <input 
                type="text" 
                placeholder="Enter client name" 
                disabled={isViewOnly}
                value={invoiceData.clientName} 
                onChange={e => setInvoiceData({ ...invoiceData, clientName: e.target.value })} 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Reference</label>
              <input 
                type="text" 
                placeholder="Enter project name" 
                disabled={isViewOnly}
                value={invoiceData.project} 
                onChange={e => setInvoiceData({ ...invoiceData, project: e.target.value })} 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Invoice Date</label>
              <input 
                type="date" 
                disabled={isViewOnly}
                value={invoiceData.date} 
                onChange={e => setInvoiceData({ ...invoiceData, date: e.target.value })} 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Due Date</label>
              <input 
                type="date" 
                disabled={isViewOnly}
                value={invoiceData.dueDate} 
                onChange={e => setInvoiceData({ ...invoiceData, dueDate: e.target.value })} 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
              <h3 className="text-xl font-black text-white tracking-tight">Invoice Items</h3>
              {!isViewOnly && (
                <button 
                  onClick={handleAddItem} 
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Line Item
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {invoiceData.items.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50 group">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Description</label>
                    <input 
                      type="text" 
                      disabled={isViewOnly}
                      value={item.description} 
                      onChange={e => updateItem(item.id, 'description', e.target.value)} 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Hours</label>
                    <input 
                      type="number" 
                      disabled={isViewOnly}
                      value={item.hours} 
                      onChange={e => updateItem(item.id, 'hours', Number(e.target.value))} 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Rate</label>
                    <input 
                      type="number" 
                      disabled={isViewOnly}
                      value={item.rate} 
                      onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 px-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Total</label>
                      <span className="text-sm font-black text-blue-500">₹{item.amount.toLocaleString()}</span>
                    </div>
                    {!isViewOnly && (
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtotal</p>
                <p className="text-xl font-black text-white">₹{subtotal.toLocaleString()}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tax (18%)</p>
                <p className="text-xl font-black text-slate-400">₹{tax.toLocaleString()}</p>
              </div>
            </div>
            {!isViewOnly && (
              <button 
                onClick={handleSave} 
                className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-blue-500/20"
              >
                <Save className="w-5 h-5" />
                GENERATE INVOICE
              </button>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl space-y-8 sticky top-8" id="invoice-preview">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-white tracking-tight">INVOICE</h2>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">#{invoiceData.invoiceId}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Billed To</p>
              <p className="text-lg font-black text-white mt-1">{invoiceData.clientName || '---'}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mt-1">{invoiceData.project || 'Project Reference'}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Line Items</p>
              {invoiceData.items.map(i => (
                <div key={i.id} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-300">{i.description || 'New Service'}</span>
                  <span className="font-black text-white">₹{i.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Tax Total</span>
                <span className="font-bold text-slate-400">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-white uppercase tracking-tight">Grand Total</span>
                <span className="text-2xl font-black text-blue-500">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Invoice Notes</p>
            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">"{invoiceData.notes}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;