import React from 'react'
import "../css/Sidebar.css"
// import test_logo_1 from "../../public/images/logos/test_logo_1.png"
// import name_transparent_2 from "../../public/images/logos/name_transparent_2.png"
import HomeIcon from '@mui/icons-material/Home';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { auth } from '../firebase';
import { Link, NavLink } from 'react-router-dom';

function Sidebar() {

    // const sidebar_items = [
    //     {
    //         icon: <HomeIcon/>,
    //         path: "/",
    //         name: "Home"
    //     },
    //     {
    //         icon: <SaveAltOutlinedIcon/>,
    //         path: "/saved",
    //         name: "Saved"
    //     },
    //     {
    //         icon: <AccountCircleIcon/>,
    //         path: "/profile",
    //         name: "Profile"
    //     },
    //     {
    //         icon: <SettingsIcon/>,
    //         path: "/settings",
    //         name: "Settings"
    //     }
    // ]

    return (
        <div className='sidebar'>
            <div className='sidebar_content'>
                <div className='sidebar_menu'>
                    <div className='sidebar_logo'>
                        <img src='/images/logos/test_logo_1.png' /> AskSCoE
                        {/* <img src={name_transparent_2} /> */}
                    </div>

                    {/* {
                            sidebar_items.map((item, index) => (
                                <NavLink to = {item.path} key = { index } className='sidebar_item'>
                                    <div className='icons'>{item.icon}</div>
                                    <div className = 'link-text'>{item.name}</div>
                                </NavLink>
                            ))
                        } */}



                    <div className='sidebar_items'>
                        <Link to='/' className='item_link'>
                            <div className='sidebar_item'>
                                <span>
                                    <HomeIcon />
                                    Home

                                </span>
                            </div>
                        </Link>

                        <Link to='/saved' className='item_link'>
                            <div className='sidebar_item'>
                                <span>
                                    <SaveAltOutlinedIcon />
                                    Saved
                                </span>
                            </div>
                        </Link>

                        <Link to='/profile' className='item_link'>
                            <div className='sidebar_item'>
                                <span>
                                    <AccountCircleIcon />
                                    Profile
                                </span>
                            </div>
                        </Link>

                        <Link to='/settings' className='item_link'>
                            <div className='sidebar_item'>
                                <span>
                                    <SettingsIcon />
                                    Settings
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className='sidebar_footer'>
                    <div className='sidebar_footer_item'>
                        <span onClick={() => auth.signOut()}>
                            <LogoutIcon />
                            Logout
                        </span>
                    </div>

                    <div className='sidebar_footer_item'>
                        <div className='mode'>
                            <div className="moon-sun">
                                {/* <LightModeOutlinedIcon /> */}
                                <DarkModeOutlinedIcon />
                            </div>
                            <span className="mode-text text">Dark mode</span>

                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <main>
                {children}
            </main> */}
        </div >
    )
}

export default Sidebar
