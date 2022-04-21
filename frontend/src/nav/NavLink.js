import React, { useContext } from "react";
import { NavContext } from "../context/NavContext";

const NavLink = ({ navLinkId, scrollToId }) => {
  const { activeNavLinkId, setActiveNavLinkId } = useContext(NavContext);

  const handleClick = () => {
    setActiveNavLinkId(navLinkId);
    // Array.from(document.getElementsByClassName("activeClass")).forEach(
    //   (element) => {
    //     element.classList().remove("activeClass");
    //   }
    // );
    document.getElementById(scrollToId).scrollIntoView({ behavior: "smooth" });
    // document.getElementById(activeNavLinkId).classList.add("activeClass");
  };

  return (
    <div
      id={navLinkId}
      style={{ height: 30 }}
      className={activeNavLinkId === navLinkId ? "activeClass" : ""}
      onClick={handleClick}
    >
      {navLinkId}
    </div>
  );
};

export default NavLink;
