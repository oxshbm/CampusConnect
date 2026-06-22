import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getToken } from '../../utils/tokenStorage';
import { useGroups } from '../../hooks/useGroups';
import { useAuth } from '../../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');
const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const GroupChat = ({ group }) => {
  const { user } = useAuth();
  const { fetchGroupMessages, sendExistingGroupMessage } = useGroups();
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const currentUserId = user?.id || user?._id;
  const memberIds = useMemo(() => (group.members || []).map((member) => toId(member)), [group.members]);
  const canChat = currentUserId && memberIds.some((memberId) => sameId(memberId, currentUserId));

  useEffect(() => {
    if (!canChat) return undefined;

    let mounted = true;
    const loadMessages = async () => {
      const data = await fetchGroupMessages(group._id);
      if (mounted) setMessages(data);
    };
    loadMessages();

    const socket = io(SOCKET_URL, { auth: { token: getToken() } });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('group:join', { groupId: group._id }, (response) => {
        if (!response?.success) setError(response?.message || 'Could not join chat');
      });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => setError(err.message));
    socket.on('group:message', (message) => {
      if (!sameId(message.group, group._id)) return;
      setMessages((prev) => (prev.some((item) => item._id === message._id) ? prev : [...prev, message]));
    });

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [canChat, group._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;

    setError('');
    setBody('');

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit('group:message', { groupId: group._id, body: text }, (response) => {
        if (!response?.success) {
          setError(response?.message || 'Failed to send message');
          setBody(text);
        }
      });
      return;
    }

    try {
      const message = await sendExistingGroupMessage(group._id, text);
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send message');
      setBody(text);
    }
  };

  if (!canChat) {
    return (
      <div className="card p-4 md:p-8 border-l-4 border-l-zinc-400">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Group Chat</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Chat is available after the owner approves your join request.</p>
      </div>
    );
  }

  return (
    <div className="card p-4 md:p-8 border-l-4 border-l-green-600">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Group Chat</h2>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${connected ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-700'}`}>
          {connected ? 'Live' : 'Offline'}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-12">No messages yet.</p>
        )}
        {messages.map((message) => {
          const senderId = message.sender?._id || message.sender;
          const mine = sameId(senderId, currentUserId);
          return (
            <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${mine ? 'bg-purple-600 text-white' : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700'}`}>
                <p className={`text-xs font-semibold mb-1 ${mine ? 'text-purple-100' : 'text-purple-600 dark:text-purple-400'}`}>
                  {mine ? 'You' : message.sender?.name || 'Member'}
                </p>
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength="1000"
          placeholder="Message the group..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary" disabled={!body.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
