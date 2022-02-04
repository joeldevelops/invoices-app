import React, {useState} from "react";

import PropTypes from 'prop-types'
import axios from "axios";

async function createInvoice(invoice, token) {
  const res = await axios.post(`/api/v1.0/invoices`, invoice, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  console.log(res);
  return res.data;
}

export default function NewInvoice({ getToken }) {
  const [name, setName] = useState();
  const [dueAt, setDueAt] = useState();
  const [lineItems, setLineItems] = useState([{ name: "", cost: "" }])

  const handleCreation = async (e) => {
    e.preventDefault();
    await createInvoice({
      name,
      lineItems,
      dueAt
    }, getToken());
  }

  const handleChange = (i, e) => {
    let newItemValues = [...lineItems];
    newItemValues[i][e.target.name] = e.target.value;
    setLineItems(newItemValues);
    console.log(lineItems)
  }

  const addFormFields = () => {
    setLineItems([...lineItems, { name: "", cost: "" }])
    console.log(lineItems)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={e => e.preventDefault()}>
            <h3>New Invoice</h3>

            <div className="form-group">
                <label>Invoice For</label>
                <input type="text" className="form-control" placeholder="Enter Invoice Name" onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Due On (mm-dd-yyyy format)</label>
                <input type="text" className="form-control" placeholder="mm-dd-yyyy" onChange={e => setDueAt(e.target.value)} />
            </div>

            {lineItems.map((element, index) => (
              <div className="form-group" key={index}>
                  <label>Billing Line Item</label>
                  <input type="text" name="name" className="form-control" placeholder="Input billing item" value={element.name} onChange={e => handleChange(index, e)} />
                  <input type="text" name="cost" className="form-control" placeholder="Cost" value={element.cost} onChange={e => handleChange(index, e)} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary btn-block" onClick={e => handleCreation(e)}>Submit</button>
            <button className="btn btn-block" onClick={() => addFormFields()}>Add Line Item</button>

        </form>
      </div>
    </div>
  );
}

NewInvoice.propTypes = {
  getToken: PropTypes.func.isRequired
}