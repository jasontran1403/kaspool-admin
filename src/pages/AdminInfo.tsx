import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader';

const AdminInfo = () => {
  const [accessToken, setAccessToken] = useState('');
  const [bscPrivateKey, setBscPrivateKey] = useState('');
  const [mnemonics, setMnemonics] = useState('');
  const [tonWallet, setTonWallet] = useState('');
  const [mctPrice, setMctPrice] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
    }
  }, []);

  const logout = () => {
    let config = {
      method: 'get',
      url: `${URL}auth/logout/${accessToken}`, // Adjusted URL
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    };
  
    Axios.request(config)
      .then(() => {
        localStorage.removeItem('access_token'); // Clear access token
        window.location.href = '/auth/signin';   // Redirect to signin on success
      })
      .catch(() => {
        localStorage.removeItem('access_token'); // Clear access token on error as well
        window.location.href = '/auth/signin';   // Redirect to signin on error
      });
  };

  useEffect(() => {
    setLoading(true);
    let config = {
      method: 'get',
      url: `${URL}admin/admin-tool`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setBscPrivateKey(response.data.privateKey);
        setMctPrice(response.data.price);
        setBnbBalance(response.data.bnbBalance);
        setUsdtBalance(response.data.usdtBalance);
        setTonWallet(response.data.tonWallet);
        setMnemonics(response.data.mnemonics);
        setWalletAddress(response.data.walletAddress);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, [accessToken]);

  const handleUpdate = () => {
    if (isNaN(mctPrice) || mctPrice <= 0) {
      return;
    }

    let data = JSON.stringify({
      privateKey: bscPrivateKey,
      walletAddress: walletAddress,
      mnemonics: "",
      tonWallet: "",
      price: mctPrice,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}admin/update-admin-tool`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'ok') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update info success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
      });
  };

  console.log(accessToken);

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-12 xl:col-span-12">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="p-7">
                  <div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          BSC Wallet PrivateKey
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={bscPrivateKey}
                            onChange={(e) => {
                              setBscPrivateKey(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Wallet address BSC
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={walletAddress}
                          onChange={(e) => {
                            setWalletAddress(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          KASPOOL Price
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={mctPrice}
                          onChange={(e) => {
                            setMctPrice(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          BNB Balance
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={bnbBalance}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          USDT Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={usdtBalance}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                      <button className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminInfo;
