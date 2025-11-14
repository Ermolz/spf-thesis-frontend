import { useState, useEffect, useRef } from 'react';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { formatDateTime } from '@shared/lib/utils';
import { useAuthStore } from '@entities/user/model/store';

export const ChatWindow = ({ conversationId, messages = [], onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-card rounded-lg border border-border-subtle">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-text-soft py-8">
            No messages. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? 'bg-primary text-text-on-primary'
                      : 'bg-bg-elevated text-text-main'
                  }`}
                >
                  <p className="text-sm sm:text-base break-words">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-text-on-primary opacity-80' : 'text-text-soft'
                    }`}
                  >
                    {formatDateTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-border-subtle p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!message.trim() || isLoading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

