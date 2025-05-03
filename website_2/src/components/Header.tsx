import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Privacy', path: '/privacy' },
  { label: 'Support', path: '/support' },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const updatePadding = () => {
      const height = headerRef.current?.offsetHeight || 0;
      document.body.style.paddingTop = `${height}px`;
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [location.pathname]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 h-[64px] flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="w-[150px] flex-shrink-0">
          <img
            src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_logo.png"
            alt="Lottery Logo"
            className="w-full h-auto object-contain"
          />
        </Link>

        {/* 내비게이션 */}
        <nav>
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            {navItems.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`transition-colors hover:text-green-600 ${
                    location.pathname === path ? 'text-green-700' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
