import Dexie from "dexie";

export const db = new Dexie("InvoiceDatabase");

db.version(1).stores({
  invoices: "++id, client, project, amount, date, dueDate, status"
});