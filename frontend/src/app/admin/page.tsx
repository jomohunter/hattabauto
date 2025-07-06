'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n';

const AdminRedirectPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">{t('admin.redirect')}</p>
      </div>
    </div>
  );
};

export default AdminRedirectPage; 