import React from 'react';
import '../styles/Header.css';

const Header = () => {
    return (
        <div className="headerContainer">
            <h1 className="title">Link Shortener</h1>
            <h4 className="subTitle">The link shortener with a long name</h4>
        </div>
    );
};

export default Header;