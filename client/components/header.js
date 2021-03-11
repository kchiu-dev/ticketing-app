import Link from "next/link";
import { signIn, signOut } from 'next-auth/client';

const Header = ({ session }) => {
  const links = [
    !session && { label: "Sign Up/Sign In", onClick: () => signIn(), href: "/" },
    session && { label: "Sell Tickets", onClick: () => {}, href: "/tickets/new" },
    session && { label: "My Orders", onClick: () => {}, href: "/orders" },
    session && { label: "Sign Out", onClick: () => signOut(), href: "/" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, onClick, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a onClick={onClick} className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar narbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;