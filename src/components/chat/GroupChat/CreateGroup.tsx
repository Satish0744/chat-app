import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { chatService } from '../../../services/chat.service';
import { User } from '../../../types/chat.types';
import { 
  UserIcon, 
  UsersIcon, 
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const createGroupSchema = z.object({
  name: z.string().min(2, 'Group name must be at least 2 characters'),
  description: z.string().optional(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateGroup: React.FC<CreateGroupProps> = ({ onSubmit, onCancel }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await chatService.getUsers();
      setAvailableUsers(users);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleUserSelect = (user: User) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.find((u) => u.id === user.id)
  );

  const onSubmitGroup = async (data: CreateGroupFormData) => {
    if (selectedUsers.length < 2) {
      toast.error('Please select at least 2 members');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      selectedUsers.forEach((user) => formData.append('members', user.id));
      if (avatar) formData.append('avatar', avatar);

      const group = await chatService.createGroup(data.name, selectedUsers.map(u => u.id), avatar || undefined);
      onSubmit(group);
      toast.success('Group created successfully! 🎉');
    } catch (error) {
      toast.error('Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitGroup)} className="space-y-6">
      {/* Group Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Group avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UsersIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2">
            <label className="cursor-pointer p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors">
              <PhotoIcon className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          {avatarPreview && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Click camera icon to upload group photo
        </p>
      </div>

      {/* Group Info */}
      <Input
        label="Group Name"
        placeholder="Enter group name..."
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Description (Optional)
        </label>
        <textarea
          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
          rows={2}
          placeholder="What's this group about?"
          {...register('description')}
        />
      </div>

      {/* Selected Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Selected Members ({selectedUsers.length})
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
            >
              <span>{user.name}</span>
              <button
                type="button"
                onClick={() => handleUserSelect(user)}
                className="hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Users */}
      <div>
        <Input
          placeholder="Search users to add..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={UserIcon}
        />
      </div>

      {/* Available Users */}
      <div className="max-h-48 overflow-y-auto space-y-1 border rounded-xl border-gray-200 dark:border-gray-700 p-2">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
            {searchQuery ? 'No users found' : 'Search for users to add'}
          </p>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleUserSelect(user)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=32`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
              {selectedUsers.find((u) => u.id === user.id) && (
                <CheckCircleIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Create Group
        </Button>
      </div>
    </form>
  );
};