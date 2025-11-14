import { useState, useEffect } from 'react';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { ChatWindow } from '@widgets/chat-window';
import { Loading } from '@shared/ui/Loading';
import { chatApi } from '@entities/chat/api/chatApi';
import { toast } from '@shared/lib/toast';

export const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getConversations();
      const conversationsList = Array.isArray(data) ? data : [];
      setConversations(conversationsList);
      if (conversationsList.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationsList[0]);
      }
    } catch (err) {
      toast.error('Error loading conversations');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    try {
      setIsLoadingMessages(true);
      const data = await chatApi.getMessages(selectedConversation.id);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Error loading messages');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation) return;
    try {
      await chatApi.sendMessage({
        conversationId: selectedConversation.id,
        content,
      });
      loadMessages();
    } catch (err) {
      toast.error('Error sending message');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">
            Chat
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversations.length === 0 ? (
                    <p className="text-text-muted text-sm">
                      No active conversations
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Array.isArray(conversations) && conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedConversation?.id === conv.id
                              ? 'bg-primary-subtle text-primary'
                              : 'hover:bg-bg-elevated text-text-main'
                          }`}
                        >
                          <p className="text-sm font-medium">
                            Conversation #{conv.id}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedConversation ? (
                <div className="h-[600px]">
                  <ChatWindow
                    conversationId={selectedConversation.id}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoadingMessages}
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-text-muted">
                      Select a conversation to start chatting
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

