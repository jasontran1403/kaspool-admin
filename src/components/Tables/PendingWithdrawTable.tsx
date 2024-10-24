import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { URL } from "../../types/constant";

type Withdraw = {
  code: string;
  walletAddress: string;
  displayName: string;
  network: string;
  currency: string;
  date: string;
  toWallet: string;
  hash: string;
  amount: number;
  fee: number;
  status: number;
};

interface WithdrawTableProps {
  data: Withdraw[];
  handleApprove: (code: string) => void;
}

const PendingWithdrawTable: React.FC<WithdrawTableProps> = ({ data, handleApprove }) => {
  const [accessToken] = useState(localStorage.getItem('access_token'));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatWalletAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const filteredData = data.filter(item => 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatWalletAddress(item.walletAddress).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.displayName && item.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCancelWithdraw = (withdrawCode: string) => {
    if (withdrawCode === null || withdrawCode === '') return;

    let config = {
      method: 'get',
      url: `${URL}admin/cancel-withdraw/${withdrawCode}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(response => {
        if (response.data === 'ok') {
          // toast.success('Cancel withdraw order success!', {
          //   position: 'top-right',
          //   autoClose: 3000,
          //   onClick: () => window.location.reload(),
          // });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Sign out success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch(error => {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search by code, wallet address, or user"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {/* Table Headers */}
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Code</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Date</th>
              <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">Amount</th>
              <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">Fee</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Wallet</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">User</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.code}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{packageItem.date}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">{packageItem.amount}</h5>
                  <p className="text-sm">{packageItem.currency}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">{packageItem.fee}</h5>
                  <p className="text-sm">{packageItem.currency}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{formatWalletAddress(packageItem.toWallet)}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">{formatWalletAddress(packageItem.walletAddress)}</h5>
                  <p className="text-sm">{packageItem.displayName}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${packageItem.status === 0 ? 'bg-warning text-warning' : packageItem.status === 1 ? 'bg-danger text-success' : 'bg-danger text-danger'}`}>
                    {packageItem.status === 0 ? 'Pending' : packageItem.status === 1 ? 'Success' : 'Cancel'}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => handleApprove(packageItem.code)} className="hover:text-primary">
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                          fill=""
                        />
                        <path
                          d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button onClick={() => handleCancelWithdraw(packageItem.code)} className="hover:text-primary">
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
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
      <ToastContainer />
    </div>
  );
};

export default PendingWithdrawTable;
