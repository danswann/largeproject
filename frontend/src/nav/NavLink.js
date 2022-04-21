import React from "react";

const NavLink = ({ navLinkId, scrollToId }) => {
  const handleClick = () => {
    // Removing borderbottom from previously selected navlink
    Array.from(document.getElementsByClassName("navLinks")).forEach(
      (element) => {
        element.style.borderBottom = null;
      }
    );
    document.getElementById(scrollToId).scrollIntoView({ behavior: "smooth" });
    // Giving borderbottom to currently selected nav link
    document.getElementById(navLinkId).style.borderBottom = "1px solid white";
    console.log("nav link id", navLinkId);
  };

  return (
    <div
      id={navLinkId}
      style={
        navLinkId === "home"
          ? { height: 30, borderBottom: "1px solid white" }
          : { height: 30 }
      }
      className={"navLinks"}
      onClick={handleClick}
    >
      {navLinkId}
    </div>
  );
};

export default NavLink;
