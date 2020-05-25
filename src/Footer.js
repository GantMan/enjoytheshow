import React from "react";

function Footer() {
  return (
    <div class="footer">
      <div>
        <p>
          Copyright (Now) <a href="https://infnite.red">Infinite Red</a>
        </p>
      </div>

      <img
        className="footerImage"
        src="./masks.png"
        alt="comedy and tragedy masks footer"
      />
      <div>
        <p>
          Created by{" "}
          <a href="https://gantlaborde" target="_blank">
            Gant Laborde
          </a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
