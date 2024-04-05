import { useEffect, useState } from "react";

const Contact = ({ listing }) => {
  console.log("LISTING", listing);

  const [landlord, setLandlord] = useState(null);
  console.log("listing landlord", landlord);
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`, {
          method: "GET",
        });
        const data = await res.json();
        console.log("Data received:", data);

        setLandlord(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLandlord();
  }, []);

  return <div>{landlord && landlord.username}</div>;
};

export default Contact;
