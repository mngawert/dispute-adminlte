import React from 'react';

const ContentHeader = ({ title }) => {
  const username = JSON.parse(localStorage.getItem('userLogin'))?.username;
  const homeLocationCode = JSON.parse(localStorage.getItem('userLogin'))?.homeLocationCode;

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">{title}</h1>
          </div>{/* /.col */}
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item active">[ {username} ] [ {homeLocationCode} ]</li>
            </ol>
          </div>{/* /.col */}
        </div>{/* /.row */}
      </div>{/* /.container-fluid */}
    </div>
  );
};

export default ContentHeader;