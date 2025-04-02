import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">DreamLottery</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="py-4 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300">
                Home
              </Link>
              <Link to="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-indigo-500 transition duration-300">
                About
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Balance:</span>
                  <span className="font-semibold">₹{user.balance || 0}</span>
                </div>
                <button
                  onClick={logout}
                  className="py-2 px-2 font-medium text-white bg-indigo-500 rounded hover:bg-indigo-400 transition duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;