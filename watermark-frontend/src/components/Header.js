import "../css/Header.css";
import React from "react";

const styles = {
  navBar: {
    backgroundColor: "#2b3541",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    height: "50px",
    overflow: "hidden"
  },
  navOptions: {
    color: "#ffffff",
    marginRight: "50px",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    transition: "color 0.3s ease-in-out",
    fontSize: "15px"
  },
  navButton: {
    backgroundColor: "#ffffff",
    color: "#2b3541",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

const Header = () => {
  return (
    <div>
      <header className="header" style={styles.navBar}>
        <div className="h1" style={styles.h1}>
          <div>
            <img
                src={require('../assets/logo.png')}
                alt="Logo"
                style={{ width: "50px", height: "50px", marginRight: "50px" }}
            ></img>
          </div>
        </div>
        <div className="h2">
          <nav>
            <ul>
              {/* Other navigation options */}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;