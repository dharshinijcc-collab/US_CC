import { useNavigate, useLocation, useSearchParams as useQueryParams, useParams } from 'react-router-dom';

export { useParams };

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    pathname: location.pathname
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [searchParams] = useQueryParams();
  
  // Shim next/navigation searchParams methods (get, has, getAll)
  return {
    get: (key: string) => searchParams.get(key),
    has: (key: string) => searchParams.has(key),
    getAll: (key: string) => searchParams.getAll(key),
    entries: () => searchParams.entries(),
    forEach: (cb: any) => searchParams.forEach(cb)
  };
}

export function redirect(url: string) {
  window.location.href = url;
}
