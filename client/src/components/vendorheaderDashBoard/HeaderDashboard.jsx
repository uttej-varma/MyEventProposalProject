import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./headerDashboard.css";
import Swal from "sweetalert2";


const HeaderDashboard = () => {
    const navigate = useNavigate();
    const checkSession = () => {
        axios.get("http://localhost:8000/check", { withCredentials: true }).then((res) => {
            if (res.data.msg !== "vendor") {
                navigate("/");
            } else {
                axios.get("http://localhost:8000/vendors/info", { withCredentials: true }).then(data => {
                    setVendorName(data.data.vendorName);
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch((err) => {
            console.log("Failed Checking", err);
        })
    }
    useEffect(() => { checkSession() }, [])
    const [vendorName, setVendorName] = useState("");
    return <header id="headerDashboard">
        <img id="headerDashboardLogo" src="/images/logo.jpeg" alt="logo" />
        <div>
            <span>{vendorName}</span>
            <button id="logout" onClick={() => {
                axios.get("http://localhost:8000/vendors/logout", { withCredentials: true }).then(() => {
                    Swal.fire({
                        title: 'Do you want to proceed with logout?',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Logout',
                        denyButtonText: `No`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/");
                        }
                    })
                })
            }}>Log out</button>
        </div>
    </header>
}

export default HeaderDashboard;