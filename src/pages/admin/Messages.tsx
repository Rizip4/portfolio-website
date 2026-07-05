import { useEffect, useState } from "react";
import { messageService, type Message } from "@/services/messages";
import { Trash2, Mail, MailOpen } from "lucide-react";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Toast from "@/components/admin/ui/Toast";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try { setMessages((await messageService.getAll()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try { await messageService.delete(id); setToast({ message: "Message deleted", type: "success" }); if (selectedMessage?.id === id) setSelectedMessage(null); loadMessages(); }
    catch { setToast({ message: "Failed to delete", type: "error" }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-[#D7E2EA] mb-6">Messages</h2>
      {messages.length === 0 ? (
        <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-12 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-[#D7E2EA]/20" />
          <h3 className="text-lg font-medium text-[#D7E2EA]/60 mb-2">No messages yet</h3>
          <p className="text-sm text-[#D7E2EA]/30">Messages from your contact form will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {messages.map((m) => (
              <div key={m.id} onClick={() => setSelectedMessage(m)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedMessage?.id === m.id ? "bg-orange-500/10 border-orange-500/20" : "bg-[#111] border-[#D7E2EA]/10 hover:border-[#D7E2EA]/20"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.read ? <MailOpen className="w-3.5 h-3.5 text-[#D7E2EA]/30" /> : <Mail className="w-3.5 h-3.5 text-orange-400" />}
                  <span className="font-medium text-sm text-[#D7E2EA]">{m.name}</span>
                </div>
                <p className="text-xs text-[#D7E2EA]/30 line-clamp-1">{m.message}</p>
                <p className="text-[10px] text-[#D7E2EA]/20 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#D7E2EA]">{selectedMessage.name}</h3>
                    <p className="text-sm text-[#D7E2EA]/40">{selectedMessage.email}</p>
                  </div>
                  <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-[#D7E2EA]/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-[#D7E2EA]/20 uppercase tracking-wider mb-4">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                <p className="text-[#D7E2EA]/70 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
              </div>
            ) : (
              <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-12 text-center">
                <p className="text-[#D7E2EA]/30">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
