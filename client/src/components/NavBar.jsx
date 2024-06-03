import React from 'react';
import "./style.css";

function Nav({ pages, setCurrentPage, currentPage }) {
    const handleScroll = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="nav-container">

        </nav>
    );
}

export default Nav;
