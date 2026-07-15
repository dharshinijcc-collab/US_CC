import { redirect } from 'next/navigation';

export default function AdminIndexHtmlPage() {
  redirect('/admin/login');
}
