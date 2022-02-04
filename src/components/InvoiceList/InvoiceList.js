import axios from "axios";
import React, { useEffect, useState } from "react";

const getInvoices = async (token) => {
  const url = 'http://localhost:8080/api/v1.0/invoices'
  return axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// function Loading() {
//   return(
//     <div className="spinner-border" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//   )
// }

export default function InvoiceList({ getToken }) {
  const [invoices, setInvoices] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userInvoices = await getInvoices(getToken());
      const data = userInvoices.data.map((invoice, index) => 
          <a href={`/${invoice._id}`} className="list-group-item list-group-item-action" key={index}>{invoice.name}</a>)
      setInvoices(data);
    }
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, [loaded, getToken]);

  return(
    <>
    {!loaded ? 
        (<div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>)
      : 
        (
          <div className="wrapper">
            <div className="listing">
              <div className="list-group">
                {invoices}
              </div>
            </div>
          </div>
        )
    }
  </>
  );
}