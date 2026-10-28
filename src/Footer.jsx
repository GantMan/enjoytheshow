import React from 'react'

function Footer() {
  return (
    <footer className="footer">
      <div>
        <p>
          © {new Date().getFullYear()} <a href="https://infinite.red">Infinite Red</a>
        </p>
      </div>

      <img
        className="footerImage"
        src="/masks.webp"
        alt="Comedy and tragedy masks"
        width="229"
        height="120"
        loading="lazy"
      />
      <div>
        <p>
          Created by{' '}
          <a href="https://gantlaborde.com" target="_blank" rel="noopener author">
            Gant Laborde
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
