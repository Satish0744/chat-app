import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input/Input';
import { Button } from '../components/common/Button/Button';
import { ThemeToggle } from '../components/common/ThemeToggle/ThemeToggle';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BellIcon, 
  ShieldCheckIcon,
  PaintBrushIcon,
  LanguageIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: UserIcon,
      fields: [
        { label: 'Full Name', value: user?.name || '', type: 'text' },
        { label: 'Email', value: user?.email || '', type: 'email' },
        { label: 'Bio', value: '', type: 'text', placeholder: 'Tell us about yourself...' },
      ]
    },
    {
      title: 'Notification Preferences',
      icon: BellIcon,
      fields: [
        { label: 'Email Notifications', type: 'toggle', default: true },
        { label: 'Push Notifications', type: 'toggle', default: true },
        { label: 'Message Sounds', type: 'toggle', default: false },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      fields: [
        { label: 'Show Online Status', type: 'toggle', default: true },
        { label: 'Read Receipts', type: 'toggle', default: true },
        { label: 'Profile Visibility', type: 'select', options: ['Public', 'Private', 'Contacts Only'] },
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage your account settings and preferences
          </p>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <UserIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    defaultValue={user?.name || ''}
                    icon={UserIcon}
                    placeholder="Your full name"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    defaultValue={user?.email || ''}
                    icon={EnvelopeIcon}
                    placeholder="you@example.com"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:border-primary-400 transition-all duration-200 outline-none resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Update Profile
                </Button>
              </form>
            </div>

            {/* Theme Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <PaintBrushIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Theme Preferences
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose between light and dark mode
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* Settings Sections */}
            {settingsSections.slice(1).map((section, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 ${idx === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-lg`}>
                    <section.icon className={`w-6 h-6 ${idx === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.fields.map((field, fieldIdx) => (
                    <div key={fieldIdx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
                      {field.type === 'toggle' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={field.default} />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      ) : field.type === 'select' ? (
                        <select className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none">
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Language & Region */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <LanguageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Language & Region
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Language
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none">
                    <option value="utc">UTC</option>
                    <option value="est">EST</option>
                    <option value="cst">CST</option>
                    <option value="pst">PST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;