'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Search, Calendar, Plus, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

const schema = z.object({
  subject: z.string().min(1, 'Subject required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category required'),
  priority: z.string().min(1, 'Priority required'),
});

type FormData = z.infer<typeof schema>;

interface Ticket {
  id: string;
  dateCreated: string;
  subject: string;
  preview: string;
  replies: number;
  status: string;
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]); // Empty initially
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
    const newTicket = {
      id: `TKT${Date.now().toString().slice(-6)}`,
      dateCreated: new Date().toLocaleDateString(),
      subject: data.subject,
      preview: data.description.slice(0, 50) + '...',
      replies: 0,
      status: 'Open',
    };
    setTickets(prev => [newTicket, ...prev]);
    toast.success(`Ticket ${newTicket.id} created! We'll respond within 24 hours.`);
    reset();
    setOpenModal(false);
    setLoading(false);
  };

  const handleViewTicket = (ticket: Ticket) => {
    toast.info(`Viewing ticket ${ticket.id}`);
  };

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
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">Contact Us</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Support Ticket</li>
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          {/* Green Banner */}
          <div className="bg-green-50 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-200 p-3 rounded-full">💻</div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Support Tickets</h1>
                <p className="text-green-700 mb-2">Need support? Use this page to file a support ticket and receive updates on your existing requests.</p>
                <p className="text-green-700">For urgent matters, please contact us via <a href="tel:2025409946" className="underline">phone</a> or <a href="mailto:support@nexustechhub.com" className="underline">email</a>.</p>
              </div>
            </div>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
                  <Plus className="mr-2" size={20} /> Create New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Support Ticket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input {...register('subject')} placeholder="Subject *" />
                  {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
                  <Textarea {...register('description')} placeholder="Description *" rows={4} />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                  <Select onValueChange={(value) => register('category').onChange({ target: { value } })}>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="order">Order Issue</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                  <Select onValueChange={(value) => register('priority').onChange({ target: { value } })}>
                    <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
                  <Input type="file" multiple accept="image/*,application/pdf" />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create Ticket'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
              <Input placeholder="Ticket #" className="col-span-1" />
              <div className="flex gap-2">
                <Input placeholder="From" type="date" />
                <Input placeholder="To" type="date" />
              </div>
              <Input placeholder="Search Keyword" />
              <Select defaultValue="all">
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">10/29/2025 - 11/29/2025</span>
                <Button size="icon" variant="ghost"><Search size={18} /></Button>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium">Ticket #</th>
                  <th className="p-4 text-left font-medium">Date Created</th>
                  <th className="p-4 text-left font-medium">Subject</th>
                  <th className="p-4 text-left font-medium">Message Preview</th>
                  <th className="p-4 text-left font-medium">Replies</th>
                  <th className="p-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500">
                      No data found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                      <td className="p-4 font-medium">{ticket.id}</td>
                      <td className="p-4">{ticket.dateCreated}</td>
                      <td className="p-4">{ticket.subject}</td>
                      <td className="p-4">{ticket.preview}</td>
                      <td className="p-4">
                        <Badge>{ticket.replies}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {ticket.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
        <p className="text-center text-gray-400 mt-8">© 2025 Nexus Tech Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
