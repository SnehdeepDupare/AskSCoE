import React from 'react'
import "../css/Sidebar.css"
import test_logo_1 from "../images/logos/test_logo_1.png"
import name_transparent_2 from "../images/logos/name_transparent_2.png"
import HomeIcon from '@mui/icons-material/Home';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { auth } from '../firebase';

function Sidebar() {
    return (
        <div className='sidebar'>
            <div className='sidebar_content'>
            <div className='sidebar_menu'>
                <div className='sidebar_logo'>
                    <img src={test_logo_1} /> AskSCoE
                    {/* <img src={name_transparent_2} /> */}
                </div>

                <div className='sidebar_items'>
                    <div className='sidebar_item'>
                        <span>
                        <HomeIcon />
                            Home
                        </span>
                    </div>

                    <div className='sidebar_item'>
                        <span>
                        <SaveAltOutlinedIcon />
                            Saved
                        </span>
                    </div>

                    <div className='sidebar_item'>
                        <span>
                        <AccountCircleIcon />
                            Profile
                        </span>
                    </div>

                    <div className='sidebar_item'>
                        <span>
                        <SettingsIcon />
                            Settings
                        </span>
                    </div>
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
        </div>
    )
}

export default Sidebar
