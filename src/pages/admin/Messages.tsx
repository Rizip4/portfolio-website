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
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      {messages.length === 0 ? (
        <div className="bg-[#111] border border-gray-700 rounded-xl p-12 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-gray-500">Messages from your contact form will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {messages.map((m) => (
              <div key={m.id} onClick={() => setSelectedMessage(m)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedMessage?.id === m.id ? "bg-orange-600/10 border-orange-600/30" : "bg-[#111] border-gray-700 hover:border-gray-600"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.read ? <MailOpen className="w-4 h-4 text-gray-500" /> : <Mail className="w-4 h-4 text-orange-500" />}
                  <span className="font-medium text-sm">{m.name}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{m.message}</p>
                <p className="text-xs text-gray-600 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-[#111] border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMessage.name}</h3>
                    <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                  </div>
                  <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-gray-500 mb-4">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
              </div>
            ) : (
              <div className="bg-[#111] border border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-500">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
