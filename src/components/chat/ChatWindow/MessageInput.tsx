import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon,
  PaperClipIcon,
  MicrophoneIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useDebounce } from '../../../hooks/useDebounce';
import toast from 'react-hot-toast';

interface MessageInputProps {
  onSendMessage: (content: string, type?: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedMessage = useDebounce(message, 500);

  useEffect(() => {
    if (debouncedMessage) {
      onTypingStart?.();
    } else {
      onTypingStop?.();
    }
  }, [debouncedMessage, onTypingStart, onTypingStop]);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments.length > 0 ? 'media' : 'text');
      setMessage('');
      setAttachments([]);
      setShowEmojiPicker(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      toast.success('Recording... Click again to stop');
    } else {
      // Stop recording and send audio
      toast.success('Voice message sent!');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
            >
              <span className="text-gray-600 dark:text-gray-300">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-2">
        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Attach file"
          >
            <PaperClipIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            title="Add emoji"
          >
            <FaceSmileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <button
            onClick={handleVoiceRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
            title="Voice message"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:border-primary-400 outline-none transition-all duration-200"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all transform hover:scale-105 active:scale-95"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Emoji Picker - Moved outside the flex container */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-0 z-50 animate-fade-in">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="absolute top-2 right-2 z-10 p-1 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              searchPlaceholder="Search emojis..."
              width="100%"
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
};