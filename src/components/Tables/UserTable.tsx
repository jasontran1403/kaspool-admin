import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

type User = {
  walletAddress: string;
  displayName: string | null; // Adjusted to allow null
  rootId: string;
  sales: number;
  teamsales: number;
  leftRef: string;
  rightRef: string;
  rank: number;
  binaryRank: number;
  directRank: number;
  leaderRank: number;
  maxOut: number;
  lock: boolean;
  lockTransaction: boolean;
};

interface UserTableProps {
  data: User[];
}

const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const [accessToken] = useState(localStorage.getItem('access_token'));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleUserPage = (userWallet: string) => {
    if (userWallet === null || userWallet === '') {
      return;
    }

    window.location.href = `/user/${userWallet}`;
  };

  // Filter users based on search term
  const filteredUsers = data.filter(
    (user) =>
      user.walletAddress.includes(searchTerm) ||
      (user.displayName && user.displayName.includes(searchTerm)),
  );

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleToggle = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleToggleTransaction = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock-transaction/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle transaction status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const copyToClipboard = (wallet: string) => {
    navigator.clipboard
      .writeText(wallet)
      .then(() => {
        toast.success('Wallet address copied to clipboard', {
          position: 'top-right',
          autoClose: 1500,
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search by Wallet Address or Display Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Wallet Address
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Display Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Sales
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Rank
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Transaction
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, idx) => (
              <tr key={idx}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className="text-black dark:text-white"
                    onClick={() => {
                      copyToClipboard(user.walletAddress);
                    }}
                  >
                    {truncateAddress(user.walletAddress)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.displayName || 'N/A'} {/* Handle null displayName */}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.sales}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.rank}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      user.lock === false
                        ? 'bg-success text-success'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {user.lock === false ? 'Unlocked' : 'Locked'}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      user.lockTransaction === false
                        ? 'bg-success text-success'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {user.lockTransaction === false ? 'Unlocked' : 'Locked'}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <a
                      className="hover:text-primary"
                      href={`http://localhost:5173/admin/dashboard/${user.walletAddress}`}
                      target="_blank"
                    >
                      {/* Login Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 8.5V10h-4v4h4v1.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-1.5H4v-4h2V8.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5zM21 12c0 4.41-3.59 8-8 8s-8-3.59-8-8h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2z"
                          fill=""
                        />
                      </svg>
                    </a>

                    {/* Eye Icon */}
                    <button
                      className="hover:text-primary"
                      onClick={() => handleUserPage(user.walletAddress)}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6C8.13 6 5.36 9 3.34 12c2.02 3 4.76 6 8.66 6 4.87 0 7.62-3 9.66-6C19.62 9 16.87 6 12 6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {/* Lock Icon */}
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        handleToggleTransaction(user.walletAddress);
                      }}
                    >
                      {/* Transaction Lock Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.69 2 6 4.69 6 8v4H4v8h16v-8h-2V8c0-3.31-2.69-6-6-6zm4 10v6H8v-6h8zm-4-8c2.21 0 4 1.79 4 4v4H8V8c0-2.21 1.79-4 4-4z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {/* Lock Icon */}
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        handleToggle(user.walletAddress);
                      }}
                    >
                      {/* Account Lock Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 1a6 6 0 00-6 6v5H5a3 3 0 00-3 3v5a3 3 0 003 3h14a3 3 0 003-3v-5a3 3 0 00-3-3h-1V7a6 6 0 00-6-6zm3 11H9V7a3 3 0 116 0v5z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1 ? 'bg-gray-300' : 'bg-gray-300 text-black'
          }`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
          const startPage = Math.max(
            1,
            Math.min(currentPage - 1, totalPages - 2),
          ); // Ensure the range ends at totalPages
          const pageIndex = startPage + index;
          return (
            <button
              key={pageIndex}
              onClick={() => handlePageChange(pageIndex)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === pageIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300'
              : 'bg-gray-300 text-black'
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;