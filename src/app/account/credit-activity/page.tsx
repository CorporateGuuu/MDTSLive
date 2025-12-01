'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Calendar, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreditActivityPage() {
  const [showCreditOnly, setShowCreditOnly] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [transactions] = useState([
    { date: '11/27/25', location: 'Midas Technical', reason: 'In order #1078717', credit: '$0.00', debit: '$12.45', ledger: 'ebca62895', transactionId: 'ebca62895' },
    { date: '11/26/25', location: 'Tech Solutions Inc', reason: 'Return processing fee', credit: '$25.00', debit: '$0.00', ledger: 'abc123def', transactionId: 'abc123def' },
    { date: '11/25/25', location: 'Electronic Parts Co', reason: 'Store credit applied', credit: '$15.50', debit: '$0.00', ledger: 'xyz789ghi', transactionId: 'xyz789ghi' },
    { date: '11/24/25', location: 'Mobile Repair Hub', reason: 'Equipment purchase', credit: '$0.00', debit: '$89.99', ledger: 'jkl456mno', transactionId: 'jkl456mno' },
    { date: '11/23/25', location: 'Parts Warehouse', reason: 'Bulk discount adjustment', credit: '$5.75', debit: '$0.00', ledger: 'pqr012stu', transactionId: 'pqr012stu' },
  ]);

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fromDate: '2025-11-28', toDate: '2025-11-28' },
  });

  const onSubmit = (data: FormData) => {
    // Simulate filter
    toast.success('Date range filtered!');
  };

  const handleExport = () => {
    // Placeholder for jsPDF/PapaParse export
    toast.success(`Exported credit activity as ${exportFormat}`);
  };

  const filteredTransactions = showCreditOnly
    ? transactions.filter(t => parseFloat(t.credit.replace('$', '')) > 0)
    : transactions;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Nexus Tech Hub</h1>
          <input placeholder="What are you looking for?" className="border rounded-lg px-4 py-2 w-64" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>🇺🇸 | USD</span>
          <span>FedEx 03:24:18</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$182.34 | 4</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar – Your existing one, with "Store Credit" highlighted */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            <li className="text-sm text-gray-600 pl-4">— Account Dashboard</li>
            {/* ... */}
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">— Wallet</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Store Credit</li>
            <li className="text-sm text-gray-600 pl-4">— Saved Payment Information</li>
            <li className="text-sm text-gray-600 pl-4">— Balance Sheet</li>
            {/* ... */}
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">MY CREDIT ACTIVITY</h1>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <Input {...register('fromDate')} type="date" className="w-32" />
              </div>
              <span className="text-sm text-gray-600">to</span>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <Input {...register('toDate')} type="date" className="w-32" />
              </div>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
                SUBMIT
              </Button>
              <label className="flex items-center gap-2 ml-auto">
                <Checkbox
                  checked={showCreditOnly}
                  onCheckedChange={(checked) => setShowCreditOnly(checked === true)}
                />
                <span>Show Only Credit Memo</span>
              </label>
              <div className="flex items-center gap-2">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-24"><SelectValue placeholder="PDF" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}>
                  <Download size={16} className="mr-1" />
                </Button>
              </div>
            </form>
          </div>

          {/* Credit Activity Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Location</th>
                  <th className="p-4 text-left font-medium">Reason</th>
                  <th className="p-4 text-left font-medium">Credit</th>
                  <th className="p-4 text-left font-medium">Debit</th>
                  <th className="p-4 text-left font-medium">Ledger</th>
                  <th className="p-4 text-left font-medium">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trans, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-4">{trans.date}</td>
                    <td className="p-4">{trans.location}</td>
                    <td className="p-4">{trans.reason}</td>
                    <td className="p-4 font-bold text-green-600">{trans.credit}</td>
                    <td className="p-4 font-bold text-red-600">{trans.debit}</td>
                    <td className="p-4">{trans.ledger}</td>
                    <td className="p-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto">{trans.transactionId}</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                          </DialogHeader>
                          <p>Full details for {trans.reason}...</p>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t text-center text-sm text-gray-600">
              {filteredTransactions.length} items
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          <div><h3>About</h3><p className="text-sm">About Us • Blog • Quality Policy</p></div>
          <div><h3>Services</h3><p className="text-sm">My Account • LCD Buyback</p></div>
          <div><h3>Our Brands</h3><p className="text-sm">Apple • Google • OnePlus</p></div>
          <div><h3>Support</h3><p className="text-sm">Location • Live Chat • FAQs</p></div>
        </div>
        <div className="flex justify-center gap-4 mt-8 text-sm">VISA • PayPal • AMEX • Discover</div>
        <p className="text-center text-gray-400 mt-4">© 2025 Nexus Tech Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
