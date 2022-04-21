import React from "react";
import NavLink from "./NavLink";
import { navLinks } from "./navLinks";
import "./Nav.css";

const Nav = () => {
  return (
    <nav
      style={{
        width: "100%",
        padding: 0,
        justifyContent: "space-between",
      }}
    >
      <div style={{ width: "70%", alignItems: "left" }}>
        <img
          src="/assets/soundlinklogo.png"
          width="225px"
          height="39px"
          alt=""
          style={{
            marginTop: 7.5,
            backgroundColor: "transparent",
            marginLeft: 20,
          }}
        />
      </div>

      {navLinks.map(({ navLinkId, scrollToId }, idx) => (
        <NavLink navLinkId={navLinkId} scrollToId={scrollToId} />
      ))}
    </nav>
  );
};

export default Nav;
