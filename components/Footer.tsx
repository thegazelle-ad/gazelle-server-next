import Link from 'next/link';

const Footer = () => {
  return (
    <ul className="footer">
      <li className="footer__item">
        <Link href="/about">About</Link>
      </li>
      <li className="footer__item">
        <Link href="/ethics">Code of Ethics</Link>
      </li>
      <li className="footer__item">
        <Link href="/archives">Previous Issues</Link>
      </li>
    </ul>
  );
}

export default Footer;
