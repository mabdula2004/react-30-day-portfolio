import { ArrowUpRight, Github, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="shell contact-inner">
        <p className="micro-label">HAVE AN IDEA?</p>
        <h2>Let’s build something <em>useful.</em></h2>
        <a className="contact-cta" href="mailto:muhammadabdula7874747@gmail.com">Start a conversation <ArrowUpRight size={24} /></a>
        <div className="footer-row">
          <span>© 2026 Muhammad Abdullah</span>
          <div className="social-links"><a href="https://github.com/mabdula2004" aria-label="GitHub"><Github size={18} /></a><a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a></div>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
