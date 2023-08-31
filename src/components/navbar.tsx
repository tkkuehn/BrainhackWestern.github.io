import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from '../../public/img/brainhack_logo.png';
import { DisplaySections } from '../interfaces/site-config';
import useScrollPosition from '../services/scroll-position/use';
import * as style from './navbar.css';

interface NavBarProps {
  displaySections: DisplaySections;
  splashMode?: boolean;
  registrationButton?: React.ReactNode | null;
}

export const NavBar = ({
  displaySections,
  splashMode,
  registrationButton
}: NavBarProps) => {
  const {
    state: { scrollPosition }
  } = useScrollPosition();
  const [open, setOpen] = useState(false);

  return (
    <Navbar
      expand="lg"
      variant="light"
      fixed={splashMode ? 'top' : undefined}
      sticky={!splashMode ? 'top' : undefined}
      className={
        !splashMode || scrollPosition > 0 || open ? style.navbarWhite : ''
      }
    >
      <Container fluid={true}>
        <Link href="/" className="navbar-brand">
          <Image src={logo} width={58} height={40} alt="Home"></Image>
        </Link>
        <Navbar.Toggle aria-label="Toggle navigation" onClick={(e) => setOpen(!open)}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
              <Nav.Item>
                <Link href="/#about" className="nav-link">
                  About
                </Link>
              </Nav.Item>
              {displaySections.schedule ?? true ? (
                <Nav.Item>
                  <Link href="/#schedule" className="nav-link">
                    Schedule
                  </Link>
                </Nav.Item>
              ) : null}
              {displaySections.tutorial ?? true ? (
                <Nav.Item>
                  <Link href="/#tutorials" className="nav-link">
                    Tutorials
                  </Link>
                </Nav.Item>
              ) : null}
              <Nav.Item>
                <Link href="/#location" className="nav-link">
                  Location
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  href="https://github.com/BrainhackWestern/BrainhackWestern.github.io/wiki/Projects"
                  className="nav-link"
                >
                  Projects
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link href="/FAQ" className="nav-link">
                  FAQ
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  href="https://brainhack.org/code-of-conduct.html"
                  className="nav-link"
                >
                  Code of Conduct
                </Link>
              </Nav.Item>
          </Nav>
          <span
            className={`${style.registerBtn} ${
              !splashMode || scrollPosition > 0 || open
                ? ''
                : style.registerBtnHide
            }`}
          >
            {registrationButton ?? null}
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
