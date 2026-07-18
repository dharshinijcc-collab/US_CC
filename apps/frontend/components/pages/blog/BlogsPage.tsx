import Blogs from './Blogs';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';

export default function BlogsPage() {
  return (
    <>
      <Header currentPage="blogs" />
      <Blogs />
      <Footer />
    </>
  );
}
