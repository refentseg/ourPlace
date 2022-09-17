import React, {useState} from "react";

import MainHeader from './MainHeader';
import{ Link } from 'react-router-dom'
;
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer'
import './MainNavigation.css'
import Backdrop from "../UIELEMENTS/Backdrop";

const MainNavigations = props => {
  const [drawerIsOpen,setDrawerIsOpen]=useState(false);

   const OpenDrawerHandler=()=>{
    setDrawerIsOpen(true)
   };
   const closeDrawerHandler = ()=>{
    setDrawerIsOpen(false);
   };
  return (
    <React.Fragment>
      {
        drawerIsOpen && <Backdrop onClick={closeDrawerHandler}/>
      }
    <SideDrawer show={drawerIsOpen} onclick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
           <NavLinks />
        </nav>
    </SideDrawer>
    <MainHeader>
        <button className="main-navigation__menu-btn" onClick={OpenDrawerHandler}>
            <span />
            <span />
            <span />
        </button>
        <h1 className="main-navigation__title"><Link to="/">ourPlaces</Link></h1>
        <nav className="main-navigation__header-nav">
            <NavLinks />
        </nav>
    </MainHeader>
    </React.Fragment>
  )
}

export default MainNavigations