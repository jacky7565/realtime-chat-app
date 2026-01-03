import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const UserList = () => {
  let navigate = useNavigate();
  let [lisData, setListData] = useState(null);
  let API = import.meta.env.VITE_API_BASE_URL;
  let baseUrl=import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    let fetchApi = async () => {
      try {
        let fetchData = await axios.get(`${API}/fetch`, {
          withCredentials: true,
        });
        if (!fetchData.data.success) {
          navigate("/login");
        }
        setListData(fetchData.data.data);
      } catch (error) {
        console.log(error.response.data);

        if (!error.response.data.success) {
          navigate("/login");
        }
      }
    };

    fetchApi();
  }, []);
  return (

    <>
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                ID
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                Name
              </th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                Email
              </th>
               <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                Profile
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                Status
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-semibold border-b">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {lisData &&
              lisData.map((val, index) => {
              
                return (
                  <tr className="hover:bg-gray-50" key={index + 1}>
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{val.name}</td>
                    <td className="px-4 py-2 border-b">{val.phone}</td>
                    <td className="px-4 py-2 border-b">{val.email}</td>
                    <td className="px-4 py-2 border-b"><img style={{width:"50px",borderRadius:"50%"}} src={`${baseUrl}uploads/${val.image}`}   onError={(e) => { e.target.src = "/profile-default.png"; }}/></td>
                    <td className="px-4 py-2 border-b">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {val.status.charAt(0).toUpperCase()}{val.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-slide-down-animation-modal" data-hs-overlay="#hs-slide-down-animation-modal">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>



{/* 
<button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-slide-down-animation-modal" data-hs-overlay="#hs-slide-down-animation-modal">
  Open modal
</button> */}

<div id="hs-slide-down-animation-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabindex="-1" aria-labelledby="hs-slide-down-animation-modal-label">
  <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
    <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
      <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
        <h3 id="hs-slide-down-animation-modal-label" className="font-bold text-gray-800">
          Modal title
        </h3>
        <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#hs-slide-down-animation-modal">
          <span className="sr-only">Close</span>
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <div className="p-4 overflow-y-auto">
        <p className="mt-1 text-gray-800">
          This is a wider card with supporting text below as a natural lead-in to additional content.
        </p>
      </div>
      <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-slide-down-animation-modal">
          Close
        </button>
        <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          Save changes
        </button>
      </div>
    </div>
  </div>
</div>
</>

  );
};

export default UserList;
