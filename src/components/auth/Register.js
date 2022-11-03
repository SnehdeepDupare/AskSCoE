import React from 'react'
import "./Register.css"
// import name_transparent_2 from "../../images/logos/name_transparent_2.png"

function Register() {
  return (
    <div className='register'>
      <div className='register_container'>

        <div className='register_top'>
          <div className='register_logo'>
            {/* <img src='#'} alt='logo' /> */}
          </div>
          <div className='logo_tagline'>
            <span className='logo_tagline_text'>
              A place to share knowledge and know your Institute well❤️
            </span>
          </div>

          <div className='register_content'>
            <div className='register_text'>Registration Form</div>
            <div className='register_setup'>
              <div className='register_left'>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    Full Name
                  </label>
                  <input className='input' type='text' placeholder='Enter Your Full Name' />
                </div>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    Branch
                  </label>
                  <select className='input'>
                    <option value=''>Select Your Branch</option>
                    <option value='IT'>Information Technonlogy</option>
                    <option value='Comp'>Computer Engineering</option>
                    <option value='Civil'>Civil</option>
                    <option value='Mech'>Mechanical</option>
                    <option value='DS'>Data Science</option>
                  </select>
                </div>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    Year
                  </label>
                  <select className='input'>
                    <option value=''>Select Your Year</option>
                    <option value='FE'>First Year</option>
                    <option value='SE'>Second Year</option>
                    <option value='TE'>Third Year</option>
                    <option value='BE'>Fourth Year</option>
                  </select>
                </div>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    Email Address
                  </label>
                  <input className='input' type='email' placeholder='Enter Your Email Address' />
                </div>

              </div>

              <div className='register_right'>
                <div className='register_inpField'>
                  <label className='reg_label'>
                    Contact No.
                  </label>
                  <input className='input' type='number' placeholder='Enter Your Contact No.' />
                </div>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    LinkedIn ID
                  </label>
                  <input className='input' type='text' placeholder='Enter Your LinkedIn ID' />
                </div>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    Password
                  </label>
                  <input className='input' type='password' placeholder='Enter Password' />
                </div>

                <div className='register_inpField'>
                  <label className='reg_label'>
                    Confirm Password
                  </label>
                  <input className='input' type='password' placeholder='Re-enter Password' />
                </div>
              </div>
            </div>
            <div className='btn'>
              <button className='regBtn'>Register</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register
