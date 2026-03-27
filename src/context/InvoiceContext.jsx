import { createContext, useState, useEffect } from "react";

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {

  const [invoices, setInvoices] = useState([]);

  // load saved invoices
  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) setInvoices(JSON.parse(stored));
  }, []);

  // save invoices
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};