import React, { useState, useEffect } from 'react';
//import './app.module.css';

function App() {
  const [ products, setProducts ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:3000/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        const updatedProducts = [...parsedData];
        console.log('updatedProducts', updatedProducts);
        updatedProducts.map((p,i)=>{
          console.log(i, p);
        });
        //updatedProducts.push(parsedData);
        setProducts(updatedProducts);
      };

      setListening(true);
    }
  });


  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {
          products.map((p, key) => {
            return(
            <tr key={key}>
              <td>{p.info}</td>
              <td>{p.source}</td>
            </tr>
            )
          }
          )
          }
      </tbody>
    </table>
  );
}

export default App;