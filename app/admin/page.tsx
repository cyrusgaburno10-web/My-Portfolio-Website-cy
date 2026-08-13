import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/adminAuth';
import { getSettings } from '@/lib/settings';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminSettingsPanel } from '@/components/admin/AdminSettingsPanel';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!authenticated) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-void px-5">
        <AdminLoginForm />
      </main>
    );
  }

  const settings = await getSettings();

  return (
    <main className="min-h-[100dvh] bg-void px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <AdminSettingsPanel initialSettings={settings} />
      </div>
    </main>
  );
}
