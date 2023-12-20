import React from 'react';
import './NotFound.css'; // Import the NotFound CSS file
import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const NotFound = () => {
  return (
    <div id="layoutError">
      <div id="layoutError_content">
        <main>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center mt-4">
                  <pre className="terminal">
                    <span className="command">404 Not Found</span>
                    <br />
                    <span className="output">The requested URL was not found on this server.</span>
                    <br />
                    <span className="command">
                      <Link to="/">
                        <i className="fas fa-arrow-left me-1"></i> Return to Dashboard
                      </Link>
                    </span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="layoutError_footer">
        <footer className="py-4 bg-light mt-auto">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright &copy; {currentYear} Your Website</div>
              <div>
                <a href="#">Privacy Policy</a>
                &middot;
                <a href="#">Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NotFound;
