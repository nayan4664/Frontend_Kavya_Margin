// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import Papa from 'papaparse';

// /**
//  * Exports an HTML element to PDF.
//  * @param {string} elementId - The ID of the element to capture.
//  * @param {string} fileName - The name of the resulting PDF file.
//  */
// export const exportToPDF = async (elementId, fileName = 'document.pdf') => {
//   const element = document.getElementById(elementId);
//   if (!element) return;

//   const canvas = await html2canvas(element, {
//     scale: 2,
//     useCORS: true,
//     logging: false,
//   });

//   const imgData = canvas.toDataURL('image/png');
//   const pdf = new jsPDF('p', 'mm', 'a4');
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//   pdf.save(fileName);
// };

// /**
//  * Exports data to CSV.
//  * @param {Array} data - The array of objects to export.
//  * @param {string} fileName - The name of the resulting CSV file.
//  */
// export const exportToCSV = (data, fileName = 'data.csv') => {
//   const csv = Papa.unparse(data);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   const url = URL.createObjectURL(blob);
//   link.setAttribute('href', url);
//   link.setAttribute('download', fileName);
//   link.style.visibility = 'hidden';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };



// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { saveAs } from "file-saver";

// export const exportToPDF = async (elementId, fileName) => {
//   const element = document.getElementById(elementId);

//   const canvas = await html2canvas(element);
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "mm", "a4");

//   const width = pdf.internal.pageSize.getWidth();
//   const height = (canvas.height * width) / canvas.width;

//   pdf.addImage(imgData, "PNG", 0, 0, width, height);
//   pdf.save(fileName);
// };

// export const exportToCSV = (data, fileName) => {
//   const csvRows = [];

//   const headers = Object.keys(data[0]);
//   csvRows.push(headers.join(","));

//   for (const row of data) {
//     const values = headers.map((header) => row[header]);
//     csvRows.push(values.join(","));
//   }

//   const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//   saveAs(blob, fileName);
// };


import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* PDF EXPORT */

export const exportToPDF = async (elementId, fileName) => {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error("Element not found");
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);

  pdf.save(fileName);
};


/* CSV EXPORT */

export const exportToCSV = (data, fileName) => {

  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);

  const csvRows = [];

  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = headers.map((header) => row[header]);
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], { type: "text/csv" });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = fileName;

  link.click();
};

/* XML EXPORT */

export const exportToXML = (data, fileName = 'data.xml', rootName = 'Records') => {
  if (!data || !data.length) return;

  const escapeXML = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });
  };

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<${rootName}>\n`;

  data.forEach((item) => {
    xml += '  <Record>\n';
    Object.entries(item).forEach(([key, value]) => {
      const tagName = key.replace(/[^a-zA-Z0-9]/g, '_');
      xml += `    <${tagName}>${escapeXML(value)}</${tagName}>\n`;
    });
    xml += '  </Record>\n';
  });

  xml += `</${rootName}>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};