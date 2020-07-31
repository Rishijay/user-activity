import React from 'react';
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';

const PageNavbar = () => {

  return (
    <div>
      <Navbar style={{backgroundColor: '#333333'}} light expand="md">
        <NavbarBrand>
          <h5 style={{color: 'white'}}>
          <i class="fa fa-users" aria-hidden="true" style={{marginRight: 10}}></i>
          Users and their Activities</h5>
        </NavbarBrand>
          {/* <NavbarText style={{fontSize:12, alignSelf:'bottom'}}>Rishijay</NavbarText> */}
      </Navbar>
    </div>
  );
}

export default PageNavbar;