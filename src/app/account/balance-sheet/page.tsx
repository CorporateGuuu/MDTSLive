'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Calendar, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import Head from 'next/head';
import { supabase, getBalanceSheetTransactions, exportBalanceSheetData, BalanceSheetTransaction } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function BalanceSheetPage() {
  const router = useRouter();
  const [exportFormat, setExportFormat] = useState('PDF');
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState<Date | null>(new Date('2025-10-28'));
  const [toDate, setToDate] = useState<Date | null>(new Date('2025-11-28'));
  const [selectedTransaction, setSelectedTransaction] = useState<BalanceSheetTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<BalanceSheetTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<BalanceSheetTransaction[]>([]);
  const itemsPerPage = 5;

  // Auth guard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Fetch transactions on component mount and filter changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (isLoading) return;

      try {
        const filters = {
          from_date: fromDate ? fromDate.toISOString().split('T')[0] : undefined,
          to_date: toDate ? toDate.toISOString().split('T')[0] : undefined,
        };

        const data = await getBalanceSheetTransactions(filters);
        setTransactions(data);
        setFilteredTransactions(data);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load balance sheet data');
      }
    };

    fetchTransactions();
  }, [fromDate, toDate, isLoading]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Filtered results for selected date range');
  };

  const handleTransactionClick = (transaction: BalanceSheetTransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      const filters = {
        from_date: fromDate ? fromDate.toISOString().split('T')[0] : undefined,
        to_date: toDate ? toDate.toISOString().split('T')[0] : undefined,
      };

      const exportData = await exportBalanceSheetData(filters);

      if (exportFormat === 'PDF') {
        exportToPDF(exportData);
      } else {
        exportToCSV(exportData);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = (data: BalanceSheetTransaction[]) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Balance Sheet Report', 20, 30);

    if (fromDate && toDate) {
      doc.setFontSize(12);
      doc.text(`Date Range: ${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`, 20, 50);
    }

    let yPosition = 70;
    doc.setFontSize(10);
    doc.text('Date', 20, yPosition);
    doc.text('Transaction Details', 60, yPosition);
    doc.text('Debit', 140, yPosition);
    doc.text('Credit', 160, yPosition);
    doc.text('Balance', 180, yPosition);

    yPosition += 10;
    data.forEach(transaction => {
      doc.text(transaction.date, 20, yPosition);
      doc.text(transaction.details.substring(0, 25), 60, yPosition);
      doc.text(`$${transaction.debit.toFixed(2)}`, 140, yPosition);
      doc.text(`$${transaction.credit.toFixed(2)}`, 160, yPosition);
      doc.text(`$${transaction.balance.toFixed(2)}`, 180, yPosition);
      yPosition += 8;
    });

    doc.save('balance-sheet.pdf');
    toast.success('PDF exported successfully');
  };

  const exportToCSV = (data: BalanceSheetTransaction[]) => {
    const csvData = data.map(transaction => ({
      Date: transaction.date,
      'Transaction Details': transaction.details,
      Debit: transaction.debit.toFixed(2),
      Credit: transaction.credit.toFixed(2),
      Balance: transaction.balance.toFixed(2),
      Type: transaction.type,
      Reference: transaction.reference || ''
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'balance-sheet.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  return (
    <>
      <Head>
        <title>My Balance Sheet - Transaction Ledger | Nexus Tech Hub</title>
        <meta name="description" content="View debit/credit transactions and balance sheet from 10/28/2025 to 11/28/2025. Export PDF/CSV." />
      </Head>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Nexus Tech Hub</h1>
          <input placeholder="What are you looking for?" className="border rounded-lg px-4 py-2 w-64" />
          <select className="border rounded-lg px-3 py-2" aria-label="Product categories">
            <option>Apple/Samsung/Motorola</option>
            <option>Google/OnePlus</option>
            <option>Other Parts</option>
            <option>Game Console</option>
            <option>Accessories</option>
            <option>Tools & Supplies</option>
            <option>Refurbishing</option>
            <option>Board Components</option>
            <option>Pre-Owned Devices</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">👤</span>
          <span>FedEx 07:08 PM</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$744.16 | 2</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            <li className="text-sm text-gray-600 pl-4">— Account Dashboard</li>
            <li className="text-sm text-gray-600 pl-4">— Account Information</li>
            <li className="text-sm text-gray-600 pl-4">— Address Book</li>
            <li className="text-sm text-gray-600 pl-4">— Manage Employee & Locations</li>
            <li className="text-sm text-gray-600 pl-4">— Notification</li>
            <li className="text-sm text-gray-600 pl-4">— Tax Forms</li>

            <li className="font-bold text-blue-600">Checkout</li>
            <li className="text-sm text-gray-600 pl-4">— Saved Shopping Cart</li>

            <li className="font-bold text-blue-600">Order Info.</li>
            <li className="text-sm text-gray-600 pl-4">— My Orders</li>
            <li className="text-sm text-gray-600 pl-4">— Reserve Orders</li>
            <li className="text-sm text-gray-600 pl-4">— Request FedEx Refunds</li>

            <li className="font-bold text-blue-600">Devices</li>
            <li className="text-sm text-gray-600 pl-4">— My Devices</li>
            <li className="text-sm text-gray-600 pl-4">— Device Grading Scale</li>
            <li className="text-sm text-gray-600 pl-4">— Device Returns RMA</li>

            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">Wallet</li>
            <li className="text-sm text-gray-600 pl-4">— Store Credit</li>
            <li className="text-sm text-gray-600 pl-4">— Saved Payment Information</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Balance Sheet</li>

            <li className="font-bold text-blue-600">Services</li>
            <li className="text-sm text-gray-600 pl-4">— LCD BuyBack Program</li>
            <li className="text-sm text-gray-600 pl-4">— Product Returns RMA</li>

            <li className="font-bold text-blue-600">Genuine Apple Parts</li>
            <li className="text-sm text-gray-600 pl-4">— Manage Enrollment</li>
            <li className="text-sm text-gray-600 pl-4">— Core Returns</li>
            <li className="text-sm text-gray-600 pl-4">— Marketing Materials</li>

            <li className="font-bold text-blue-600">Contact Us</li>
            <li className="text-sm text-gray-600 pl-4">— Support Ticket</li>
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">MY BALANCE SHEET</h1>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-wrap gap-4 items-start md:items-end">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="from-date">From Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <DatePicker
                      id="from-date"
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      dateFormat="MM/dd/yy"
                      className="border rounded px-3 py-2 w-32"
                      aria-label="Select from date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="to-date">To Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <DatePicker
                      id="to-date"
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      dateFormat="MM/dd/yy"
                      className="border rounded px-3 py-2 w-32"
                      aria-label="Select to date"
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 w-full sm:w-auto">
                SUBMIT
              </Button>
              <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end">
                <span className="text-sm font-medium">Quick Export</span>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-20"><SelectValue placeholder="PDF" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport} aria-label="Export data">
                  <Download size={16} />
                </Button>
              </div>
            </form>
          </div>

          {/* Balance Sheet Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]" role="table" aria-label="Balance sheet transactions">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium" scope="col">Date</th>
                    <th className="p-4 text-left font-medium" scope="col">Transaction Details</th>
                    <th className="p-4 text-left font-medium" scope="col">Debit</th>
                    <th className="p-4 text-left font-medium" scope="col">Credit</th>
                    <th className="p-4 text-left font-medium" scope="col">Balance</th>
                    <th className="p-4 text-left font-medium" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((trans, index) => (
                    <tr key={trans.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t hover:bg-gray-100`}>
                      <td className="p-4 font-medium" aria-label={`Date: ${trans.date}`}>{trans.date}</td>
                      <td className="p-4" aria-label={`Transaction details: ${trans.details}`}>{trans.details}</td>
                      <td className="p-4 text-red-600 font-medium" aria-label={`Debit amount: $${trans.debit.toFixed(2)}`}>${trans.debit.toFixed(2)}</td>
                      <td className="p-4 text-green-600 font-medium" aria-label={`Credit amount: $${trans.credit.toFixed(2)}`}>${trans.credit.toFixed(2)}</td>
                      <td className="p-4 font-bold text-red-700" aria-label={`Running balance: $${trans.balance.toFixed(2)}`}>${trans.balance.toFixed(2)}</td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTransactionClick(trans)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`View details for transaction ${trans.details}`}
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(filteredTransactions.length / itemsPerPage)} ({filteredTransactions.length} transactions)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </Button>
                {Array.from({ length: Math.ceil(filteredTransactions.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredTransactions.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction Detail Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
              </DialogHeader>
              {selectedTransaction && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-sm">{selectedTransaction.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm">{selectedTransaction.type}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction Details</label>
                    <p className="text-sm">{selectedTransaction.details}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Debit</label>
                      <p className="text-sm text-red-600 font-medium">${selectedTransaction.debit.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit</label>
                      <p className="text-sm text-green-600 font-medium">${selectedTransaction.credit.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Balance</label>
                      <p className="text-sm font-bold">${selectedTransaction.balance.toFixed(2)}</p>
                    </div>
                  </div>
                  {selectedTransaction.reference && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reference</label>
                      <p className="text-sm">{selectedTransaction.reference}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-sm text-gray-300">About Us • Blog • Quality Policy</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Services</h3>
            <p className="text-sm text-gray-300">My Account • LCD Buyback</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Our Brands</h3>
            <p className="text-sm text-gray-300">Apple • Google • OnePlus</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Support</h3>
            <p className="text-sm text-gray-300">Location • Live Chat • FAQs</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8 text-sm text-gray-300">
          VISA • PayPal • AMEX • Discover
        </div>
        <p className="text-center text-gray-400 mt-4">© 2025 Nexus Tech Hub. All rights reserved.</p>
      </footer>
      </div>
    </>
  );
}
