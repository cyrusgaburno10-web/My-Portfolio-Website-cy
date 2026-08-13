import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/adminAuth';
import { getSettings } from '@/lib/settings';
import { getAllProjects } from '@/lib/customProjects';
import { getAllCredentials } from '@/lib/customCredentials';
import { getAllContacts } from '@/lib/customContacts';
import { getAllTestimonials } from '@/lib/customTestimonials';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminSettingsPanel } from '@/components/admin/AdminSettingsPanel';
import { AdminProjectsPanel } from '@/components/admin/AdminProjectsPanel';
import { AdminCredentialsPanel } from '@/components/admin/AdminCredentialsPanel';
import { AdminContactsPanel } from '@/components/admin/AdminContactsPanel';
import { AdminTestimonialsPanel } from '@/components/admin/AdminTestimonialsPanel';

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

  const [settings, projects, credentials, contacts, testimonials] = await Promise.all([
    getSettings(),
    getAllProjects(),
    getAllCredentials(),
    getAllContacts(),
    getAllTestimonials(),
  ]);

  return (
    <main className="min-h-[100dvh] bg-void px-5 py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-12">
        <AdminSettingsPanel initialSettings={settings} />
        <AdminProjectsPanel initialProjects={projects} />
        <AdminCredentialsPanel initialCredentials={credentials} />
        <AdminContactsPanel initialContacts={contacts} />
        <AdminTestimonialsPanel initialTestimonials={testimonials} />
      </div>
    </main>
  );
}
