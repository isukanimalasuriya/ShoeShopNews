import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRotateCw, FiAlertTriangle, FiSearch, FiLoader, FiAlertCircle, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import { useNavigate } from "react-router-dom";

const RestockPage = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/employeelogin'); // Redirect if no token found
          }
        }, [navigate]);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shoes');
        const shoes = response.data;
        const flattenedItems = shoes.flatMap((shoe) =>
          shoe.variants.flatMap((variant) =>
            variant.sizes.map((size) => ({
              _id: shoe._id,
              brand: shoe.brand,
              model: shoe.model,
              color: variant.color,
              size: size.size,
              stock: size.stock,
              shoeType: shoe.shoeType,
              shoeWearer: shoe.shoeWearer,
              price: shoe.price,
            }))
          )
        );
        const lowStock = flattenedItems.filter((item) => item.stock < 10);
        setLowStockItems(lowStock);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch low stock items');
        setLoading(false);
      }
    };
    fetchLowStockItems();
  }, []);

  const handleRestockRequest = async (item) => {
    try {
      // Generate PDF for restock request
      const doc = new jsPDF();
      doc.setProperties({
        title: 'Restock Request',
        subject: 'Restock Request for Low Stock Item',
        author: 'Shoe Inventory App',
        keywords: 'restock, inventory, request',
        creator: 'Shoe Inventory App',
      });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('RESTOCK REQUEST', 105, 20, { align: 'center' });

      // Date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

      // Item details
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(41, 128, 185);
      doc.rect(10, 35, 190, 10, 'F');

      const headers = ['Brand', 'Model', 'Color', 'Size', 'Stock'];
      let xPosition = 15;
      headers.forEach((header) => {
        doc.text(header, xPosition, 42);
        xPosition += header === 'Brand' ? 40 :
                     header === 'Model' ? 40 :
                     header === 'Color' ? 40 :
                     header === 'Size' ? 20 : 20;
      });

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(245, 245, 245);
      doc.rect(10, 45, 190, 10, 'F');
      doc.text(item.brand, 15, 52);
      doc.text(item.model, 55, 52);
      doc.text(item.color, 95, 52);
      doc.text(item.size.toString(), 135, 52);
      doc.text(item.stock.toString(), 155, 52);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('© Shoe Inventory App', 105, 285, { align: 'center' });

      // Convert PDF to Blob
      const pdfBlob = doc.output('blob');

      // Prepare FormData for API request
      const formData = new FormData();
      formData.append('shoeId', item._id);
      formData.append('color', item.color);
      formData.append('size', item.size);
      formData.append('supplierEmail', 'senethhettiarachchi2003427@gmail.com');
      formData.append('pdf', pdfBlob, `restock-request-${item.brand}-${item.model}-${item.size}.pdf`);

      // Send request with PDF attachment
      const response = await axios.post('http://localhost:5000/api/restock/request', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(`Restock request sent for ${item.brand} ${item.model}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to send restock request');
      setTimeout(() => setError(''), 3000);
    }
  };

  const generateLowStockReport = () => {
    if (lowStockItems.length === 0) {
      setMessage('No low stock items to report');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setProperties({
        title: 'Low Stock Inventory Report',
        subject: 'Low Stock Items',
        author: 'Your Company Name',
        keywords: 'low stock, inventory, report',
        creator: 'Shoe Inventory App',
      });

      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('LOW STOCK INVENTORY REPORT', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(41, 128, 185);
      doc.rect(10, 35, 190, 10, 'F');

      const headers = ['Brand', 'Model', 'Wearer', 'Size', 'Qty', 'Price'];
      let xPosition = 15;

      headers.forEach((header) => {
        doc.text(header, xPosition, 42);
        xPosition +=
          header === 'Brand' ? 30 :
          header === 'Model' ? 30 :
          header === 'Wearer' ? 25 :
          header === 'Size' ? 15 :
          header === 'Qty' ? 15 : 20;
      });

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      let yPosition = 50;

      lowStockItems.forEach((item, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;

          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(41, 128, 185);
          doc.rect(10, 10, 190, 10, 'F');

          xPosition = 15;
          headers.forEach((header) => {
            doc.text(header, xPosition, 17);
            xPosition +=
              header === 'Brand' ? 30 :
              header === 'Model' ? 30 :
              header === 'Wearer' ? 25 :
              header === 'Size' ? 15 :
              header === 'Qty' ? 15 : 20;
          });

          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          yPosition = 25;
        }

        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(10, yPosition - 5, 190, 10, 'F');
        }

        doc.text(item.brand, 15, yPosition);
        doc.text(item.model, 45, yPosition);
        doc.text(item.shoeWearer, 75, yPosition);
        doc.text(item.size.toString(), 100, yPosition);
        doc.text(item.stock.toString(), 115, yPosition);
        doc.text(`Rs.${item.price.toFixed(2)}`, 130, yPosition);

        yPosition += 10;
      });

      const totalItems = lowStockItems.reduce((sum, item) => sum + item.stock, 0);
      const totalValue = lowStockItems.reduce((sum, item) => sum + (item.price * item.stock), 0);

      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`Total Low Stock Items: ${totalItems}`, 14, yPosition + 15);
      doc.text(`Total Low Stock Value: Rs.${totalValue.toFixed(2)}`, 14, yPosition + 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('© Shoe Inventory App', 105, 285, { align: 'center' });

      doc.save(`low-stock-report-${new Date().toISOString().slice(0, 10)}.pdf`);

      setMessage('Low stock report generated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate report');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredItems = lowStockItems.filter(
    (item) =>
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shoeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-4xl text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading low stock items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 p-8 flex items-center justify-center h-screen">
        <div className="flex flex-col items-center text-red-500">
          <FiAlertCircle className="text-4xl mb-4" />
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiAlertTriangle className="mr-2 text-yellow-500" />
          Restock Low Stock Shoes
        </h1>
        <button
          onClick={generateLowStockReport}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FiDownload className="mr-2" />
          Generate Low Stock Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand, model, color or type..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredItems.length} of {lowStockItems.length} low stock items
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md border ${
            message.includes('successfully')
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr
                    key={`${item._id}-${item.color}-${item.size}-${index}`}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font投入-medium text-gray-900">
                      {item.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.shoeType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: item.color.toLowerCase() }}
                        />
                        {item.color}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleRestockRequest(item)}
                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <FiRotateCw className="mr-1" />
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500">No low stock items (below 10) found.</p>
          ) : (
            <>
              <p className="text-gray-500">No items match your search criteria.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Clear Search
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RestockPage;