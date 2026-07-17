import Blogs from '@/components/Blogs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BlogsPage() {
  return (
    <>
      <Header currentPage="blogs" />
      <Blogs />
      <Footer />
    </>
  );
}
