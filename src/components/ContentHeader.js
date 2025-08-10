import React from 'react';

const ContentHeader = ({ title }) => {
  const userLogin = JSON.parse(localStorage.getItem('userLogin'));
  const username = userLogin?.username;
  const homeLocationCode = userLogin?.homeLocationCode;
  const titleTh = userLogin?.titleTh || '';
  const firstNameTh = userLogin?.firstNameTh || '';
  const lastNameTh = userLogin?.lastNameTh || '';
  
  // Combine Thai name parts, only if at least one of them exists
  const thaiNameDisplay = (titleTh || firstNameTh || lastNameTh) ? 
    `[ ${titleTh} ${firstNameTh} ${lastNameTh} ]` : '';

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">{title}</h1>
          </div>{/* /.col */}
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item active">
                [ {username} ] [ {homeLocationCode} ] {thaiNameDisplay}
              </li>
            </ol>
          </div>{/* /.col */}
        </div>{/* /.row */}
      </div>{/* /.container-fluid */}
    </div>
  );
};

export default ContentHeader;