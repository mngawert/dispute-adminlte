import React from "react";
import { jwtDecode } from 'jwt-decode';

export default function Sidebar() {


  const token = localStorage.getItem('authToken');
  //console.log('token:', token);
  let decodedToken = null
  let roles = [];

  if (token) {
    decodedToken = jwtDecode(token);
    roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    //console.log('decodedToken:', decodedToken);
  }

  const userHasRole = (role) => {
    return roles.includes(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <img src="dist/img/logo_nt.svg" alt="NT" className="brand-image" />
        <span className="brand-text font-weight-light"> Adjustor Online</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-th"></i>
                <p>Home</p>
              </a>
            </li>
 
            {/* Creation Tasks */}
            {(userHasRole("Admin") || userHasRole("Creator")) && 
              <li className="nav-item menu-is-opening menu-open">
                <a href="#" className="nav-link">
                  <p>
                    Creation Task
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {/* <li className="nav-item">
                    <a href="/Dispute" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Dispute</p>
                    </a>
                  </li> */}
                  <li className="nav-item">
                    <a href="/AdjustMinus" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Adjust - </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustPlus" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Adjust + </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustP31" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>P31 </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustP32" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>P32 </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustP35" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>P35 </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustP36" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>P36 </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustP3Plus" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>P3 + </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustP3Minus" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>P3 - </p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="/AdjustB" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>B +/- </p>
                    </a>
                  </li>



                  {/* <li className="nav-item">
                    <a href="/Create" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Create Adjustments </p>
                    </a>
                  </li> */}
                </ul>
              </li>
            }

            {/* Review Tasks */}
            {(userHasRole("Admin") || userHasRole("Reviewer")) && 
            <li className="nav-item menu-is-opening menu-open">
              <a href="#" className="nav-link">
                <p>
                  Review Tasks
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/Review" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Review Adjustments </p>
                  </a>
                </li>
              </ul>
            </li>          
            }

            {/* Approve Tasks */}
            {(userHasRole("Admin") || userHasRole("Approver")) && 
              <li className="nav-item menu-is-opening menu-open">
                <a href="#" className="nav-link">
                  <p>
                    Approve Tasks
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="/Approve" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Approve Adjustments</p>
                    </a>
                  </li>
                </ul>
              </li>
            }

            {/* Review Financial Tasks */}
            {(userHasRole("Admin") || userHasRole("Finance")) && 
              <li className="nav-item menu-is-opening menu-open">
                <a href="#" className="nav-link">
                  <p>
                  Review Financial Tasks
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="/Finance" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Review Financially</p>
                    </a>
                  </li>
                </ul>
              </li>
            }


            {/* User Management */}
            <li className="nav-item menu-is-opening menu-open">
              <a href="#" className="nav-link">
                <p>
                  User Management
                </p>
              </a>

              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/SearchAdj" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Search Adjustment</p>
                  </a>
                </li>

                {(userHasRole("Admin") || userHasRole("Approver")) && 
                  <li className="nav-item">
                    <a href="/User" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Users</p>
                    </a>
                  </li>                            
                }
                <li className="nav-item">
                  <a href="#" className="nav-link" onClick={() => { handleLogout() }} >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Logout</p>
                  </a>
                </li>
              </ul>

            </li>

          </ul>
        </nav>
      </div>
    </aside>
  );
}
