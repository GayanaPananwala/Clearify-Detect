import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

//This function renders the header component
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        ClearifyDetect <FontAwesomeIcon icon={faSearch} />
      </div>
    </header>
  );
};
//Export the header component
export default Header;
