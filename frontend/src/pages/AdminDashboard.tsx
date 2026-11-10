import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Calendar,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  X,
  MessageSquare,
  Clock,
  Shield,
  Loader2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Inquiry, DashboardStats, InquiryStatus, InquiryType } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Drawer / Detail modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [isSubmittingNote, setIsSubmittingNote] = useState<boolean>(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err: any) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchInquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: '8',
      });
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (typeFilter !== 'ALL') params.append('inquiryType', typeFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/admin/inquiries?${params.toString()}`);
      if (res.data.success) {
        setInquiries(res.data.data);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalRecords(res.data.pagination.total || 0);
      }
    } catch (err: any) {
      error('Data Load Error', err.message || 'Unable to fetch inquiries');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, typeFilter, search, error]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;

    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/admin/inquiries/${selectedInquiry._id}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        success('Status Updated', `Lead status moved to ${newStatus}`);
        setSelectedInquiry(res.data.data);
        fetchInquiries();
        fetchStats();
      }
    } catch (err: any) {
      error('Update Failed', err.message || 'Could not update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteContent.trim()) return;

    try {
      setIsSubmittingNote(true);
      const res = await api.post(`/admin/inquiries/${selectedInquiry._id}/notes`, {
        content: newNoteContent.trim(),
      });

      if (res.data.success) {
        success('Note Saved', 'Confidential advisor note logged.');
        setSelectedInquiry({
          ...selectedInquiry,
          internalNotes: res.data.notes,
        });
        setNewNoteContent('');
        fetchInquiries();
      }
    } catch (err: any) {
      error('Note Failed', err.message || 'Could not save note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (typeFilter !== 'ALL') params.append('inquiryType', typeFilter);

    // Direct browser download
    window.open(`/api/v1/admin/inquiries/export/csv?${params.toString()}`, '_blank');
    success('Export Initiated', 'Your CSV export file is downloading.');
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">New Lead</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Contacted</span>;
      case 'IN_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">In Review</span>;
      case 'CONVERTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Converted</span>;
      case 'ARCHIVED':
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-platinum-500/15 text-platinum-400 border border-platinum-500/30">Archived</span>;
    }
  };

  const getTypeBadge = (type: InquiryType) => {
    switch (type) {
      case 'CONSULTATION':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gold-500/10 text-gold-400 border border-gold-500/30">Consultation</span>;
      case 'CALLBACK':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">Callback</span>;
      case 'GENERAL':
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-platinum-500/10 text-platinum-300 border border-platinum-500/20">General</span>;
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-8 text-platinum-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
            Executive Partner CRM
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-luxury text-platinum-100">
            Lead & Consultation Pipeline
          </h1>
          <p className="text-xs text-platinum-400 mt-1">
            Logged in as <strong className="text-gold-400">{user?.name}</strong> ({user?.title})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl border border-gold-500/40 text-gold-400 hover:text-gold-300 bg-obsidian-900 text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl border border-obsidian-800 text-platinum-400 hover:text-rose-400 hover:border-rose-500/40 bg-obsidian-900 text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-platinum-400 block">Total Pipeline</span>
            <div className="text-2xl font-bold font-luxury text-platinum-100">{stats.totalInquiries}</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-900 border border-sky-500/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sky-400 block">New Inquiries</span>
            <div className="text-2xl font-bold font-luxury text-sky-400">{stats.newInquiries}</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-900 border border-purple-500/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-purple-400 block">In Review</span>
            <div className="text-2xl font-bold font-luxury text-purple-400">{stats.inReview}</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-900 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 block">Converted Clients</span>
            <div className="text-2xl font-bold font-luxury text-emerald-400">{stats.converted}</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-900 border border-amber-500/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 block">Callbacks</span>
            <div className="text-2xl font-bold font-luxury text-amber-400">{stats.callbacksCount}</div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-gold-400 block">Conversion Rate</span>
            <div className="text-2xl font-bold font-luxury text-gold-gradient">{stats.conversionRate}</div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gold-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, email, ref..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-xs text-platinum-100"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-platinum-400" />
            <span className="text-xs text-platinum-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-xs text-platinum-200 focus:border-gold-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="CONVERTED">Converted</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-platinum-400 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-xs text-platinum-200 focus:border-gold-500 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="CONSULTATION">Consultation</option>
              <option value="CALLBACK">Callback</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl overflow-hidden shadow-luxury">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-obsidian-950/80 border-b border-obsidian-800 text-platinum-400 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-4 px-6">Reference</th>
                <th className="py-4 px-6">Client / Contact</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Portfolio Tier</th>
                <th className="py-4 px-6">Service Area</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-platinum-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gold-500" />
                    <span>Loading consultation pipeline...</span>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-platinum-500">
                    No leads match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    className="hover:bg-obsidian-850/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedInquiry(inq)}
                  >
                    <td className="py-4 px-6 font-mono text-gold-400 font-bold">
                      {inq.referenceNumber}
                      <span className="block text-[10px] text-platinum-500 font-sans font-normal mt-0.5">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-platinum-100 group-hover:text-gold-300 transition-colors">
                        {inq.fullName}
                      </div>
                      <div className="text-[11px] text-platinum-400">{inq.email}</div>
                      <div className="text-[10px] text-platinum-500 font-mono">{inq.phone}</div>
                    </td>

                    <td className="py-4 px-6">{getTypeBadge(inq.inquiryType)}</td>

                    <td className="py-4 px-6 font-mono text-platinum-200">
                      {inq.estimatedPortfolioTier}
                    </td>

                    <td className="py-4 px-6 text-platinum-300 max-w-xs truncate">
                      {inq.serviceOfInterest}
                    </td>

                    <td className="py-4 px-6">{getStatusBadge(inq.status)}</td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 font-semibold transition-all inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-obsidian-950/80 border-t border-obsidian-800 flex items-center justify-between text-xs text-platinum-400">
          <div>
            Showing <strong className="text-platinum-200">{inquiries.length}</strong> of{' '}
            <strong className="text-platinum-200">{totalRecords}</strong> records
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-obsidian-800 disabled:opacity-30 hover:border-gold-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-obsidian-800 disabled:opacity-30 hover:border-gold-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Lead Detail & Notes Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-obsidian-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-luxury text-platinum-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-obsidian-800">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block">
                  Confidential Lead Profile
                </span>
                <h3 className="text-xl font-bold font-luxury text-platinum-100">
                  {selectedInquiry.fullName}
                </h3>
                <span className="font-mono text-xs text-gold-400">
                  {selectedInquiry.referenceNumber}
                </span>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-platinum-400 hover:text-platinum-100 p-1"
                aria-label="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="py-4 border-b border-obsidian-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-platinum-400">Current Status:</span>
                <select
                  disabled={isUpdatingStatus}
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-gold-500/40 text-gold-400 font-semibold text-xs focus:outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_REVIEW">IN_REVIEW</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="text-xs text-platinum-400">
                Type: <strong className="text-platinum-200">{selectedInquiry.inquiryType}</strong>
              </div>
            </div>

            {/* Client Coordinates */}
            <div className="py-4 border-b border-obsidian-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-platinum-400 block mb-0.5">Email Address</span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-gold-400 hover:underline"
                >
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <span className="text-platinum-400 block mb-0.5">Phone Number</span>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-mono text-gold-400 hover:underline"
                >
                  {selectedInquiry.phone}
                </a>
              </div>

              <div>
                <span className="text-platinum-400 block mb-0.5">Location / City</span>
                <span className="text-platinum-200">{selectedInquiry.countryOrCity || 'N/A'}</span>
              </div>

              <div>
                <span className="text-platinum-400 block mb-0.5">Portfolio Bracket</span>
                <span className="font-mono font-bold text-platinum-100">
                  {selectedInquiry.estimatedPortfolioTier}
                </span>
              </div>

              <div>
                <span className="text-platinum-400 block mb-0.5">Service Requested</span>
                <span className="text-platinum-200">{selectedInquiry.serviceOfInterest}</span>
              </div>

              <div>
                <span className="text-platinum-400 block mb-0.5">Meeting Preference</span>
                <span className="text-platinum-200">
                  {selectedInquiry.preferredMode} ({selectedInquiry.preferredTimeSlot || selectedInquiry.callbackWindow || 'General'})
                </span>
              </div>
            </div>

            {selectedInquiry.message && (
              <div className="py-4 border-b border-obsidian-800 text-xs">
                <span className="text-platinum-400 block mb-1">Confidential Client Note</span>
                <p className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-platinum-300 leading-relaxed italic">
                  "{selectedInquiry.message}"
                </p>
              </div>
            )}

            {/* Internal Notes Thread */}
            <div className="pt-4 space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold-400 font-bold flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Confidential Internal Advisor Thread ({selectedInquiry.internalNotes.length})</span>
              </h4>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedInquiry.internalNotes.length === 0 ? (
                  <p className="text-xs text-platinum-500 italic">No partner notes logged yet.</p>
                ) : (
                  selectedInquiry.internalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-platinum-400">
                        <strong className="text-gold-400">{note.authorName}</strong>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-platinum-200 leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  placeholder="Append confidential partner note or call summary..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-xs text-platinum-100"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNoteContent.trim()}
                  className="px-4 py-2 rounded-lg bg-gold-500 text-obsidian-950 text-xs uppercase tracking-wider font-bold hover:shadow-gold-glow transition-all disabled:opacity-40"
                >
                  {isSubmittingNote ? 'Saving Note...' : 'Log Advisor Note'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
