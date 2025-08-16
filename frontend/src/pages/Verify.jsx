import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCartItems, token } = useContext(ShopContext);

  useEffect(() => {
    const verify = async () => {
      const session_id = searchParams.get("session_id");
      if (!session_id || !token) return;

      try {
        const res = await axios.post(
          `${backendUrl}/api/order/verifystripe`,
          { session_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setCartItems({});
          toast.success("Payment successful");
          navigate("/orders");
        } else {
          toast.error("Payment failed");
          navigate("/cart");
        }
      } catch (err) {
        toast.error("Error verifying payment");
        navigate("/cart");
      }
    };

    verify();
  }, [searchParams, token, navigate, setCartItems]);

  return <div>Verifying payment, please wait...</div>;
}

export default Verify;
