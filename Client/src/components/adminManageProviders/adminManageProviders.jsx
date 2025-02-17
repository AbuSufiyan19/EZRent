import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminManageProviders.css";
import config from "../../utils/configurl";

const AdminManageProviders = () => {
  const [providers, setProviders] = useState([]);

  // Fetch providers from the database
  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${config.BASE_API_URL}/admin/fetchall-providers`);
      setProviders(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch providers";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Approve provider
  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`${config.BASE_API_URL}/admin/approve-provider/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after approval
      fetchProviders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to approve provider";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Reject provider
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this provider?")) return;

    try {
      const response = await axios.put(`${config.BASE_API_URL}/admin/reject-provider/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after rejection
      fetchProviders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reject provider";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleReupload = async (id) => {
    try {
      const response = await axios.put(`${config.BASE_API_URL}/admin/reupload-provider/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after rejection
      fetchProviders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reupload provider";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleBlock = async (id) => {
    try {
      const response = await axios.put(`${config.BASE_API_URL}/admin/block-provider/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after rejection
      fetchProviders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reupload provider";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Delete a provider
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this provider?")) return;

    try {
      const response = await axios.delete(`${config.BASE_API_URL}/admin/remove-provider/${id}`);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the list after deletion
      fetchProviders();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to remove provider";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="renter-content">
      <h2>Manage Providers</h2>
      <table className="providers-table">
        <thead>
          <tr>
            <th>Provider ID</th>
            <th>Provider Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>ID Proof</th>
            <th>Status</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.length > 0 ? (
            providers.map((provider) => (
              <tr key={provider._id}>
                <td>{provider._id}</td>
                <td>{provider.fullName}</td>
                <td>{provider.email}</td>
                <td>{provider.mobileNumber}</td>
                <td>{provider.locationDistrict}</td>
                  <td>
                    {provider.idProof ? (
                      <a
                        href={`${provider.idProof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`${provider.idProof}`}
                          alt="ID Proof"
                          className="provideridproof-image"
                          style={{ cursor: "pointer" }}
                        />
                      </a>
                    ) : (
                      <span>Not Uploaded</span>
                    )}
                  </td>

                <td className={`status-${provider.status}`}>{provider.status}
                {provider.status === "registered" && (
                    <> (Need to upload ID Proof)
                    </>
                  )}
                {provider.status === "reupload" && (
                  <> (Yet to Reupload ID Proof)
                  </>
                )}
                </td>
                <td>
                    {(() => {
                      switch (provider.status) {
                        case "registered":
                          return (
                            <>
                              {/* <button className="approve-btn" onClick={() => handleApprove(provider._id)}>
                                Approve Registration
                              </button> */}
                              <button className="reject-btn" onClick={() => handleReject(provider._id)}>
                                Reject Registration
                              </button>
                            </>
                          );
                  
                        case "uploaded":
                          return (
                            <>
                              <button className="activate-btn" onClick={() => handleApprove(provider._id)}>
                                Activate Account
                              </button>
                              <button className="upload-btn" onClick={() => handleReupload(provider._id)}>
                                Re-upload IDProof
                              </button>
                            </>
                          );

                          case "reupload":
                            return (
                              <>
                                <button className="reject-btn" onClick={() => handleReject(provider._id)}>
                                Reject Registration
                                </button>
                              </>
                            );
                          
                            case "approved":
                              return (
                                <>
                                  <button className="block-btn" onClick={() => handleBlock(provider._id)}>
                                  Block Account
                                  </button>
                                </>
                              );
                            
                              case "blocked":
                                return (
                                  <>
                                    <button className="activate-btn" onClick={() => handleApprove(provider._id)}>
                                    Activate Account
                                    </button>
                                  </>
                                );
                  
                        default:
                          return null; // No buttons for other statuses
                      }
                    })()}
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(provider._id)}>
                    Remove Account
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No providers found</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AdminManageProviders;
