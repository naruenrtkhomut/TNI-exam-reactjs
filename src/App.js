//import logo from './logo.svg';
import { useState, useEffect  } from 'react';
import './App.css';

const check = () => {
  checkOuts.map(checkout => {
    if (checkout.no > 0){
      var request = new XMLHttpRequest();
      request.open('POST', `https://localhost:7263/AllProduct?id=${checkout.id}&stock=${checkout.strock - checkout.no}`, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send();
    }
    checkOuts = []
    buys = [];
    totalCost = 0;
    checkOutHide = true;
  });
}
var checkOutHide = true;
var checkOuts = [];
var buys = [];
const deleteCheck = (id) => {
  var del = false;
  checkOuts.map((checkOut) => {
    if (checkOut.id == id)
    {
      checkOut.no -= 1;
      if (checkOut.no <= 0) del = true;
    }
  })
  checkOuts.filter(c => c.no > 0).map(c => {
    totalCost += (c.no * c.price);});
  checkOuts = [...checkOuts.filter(c => c.no > 0)];
}
const clearAll = () => {
  checkOutHide = true;
  checkOuts = [];
  buys = [];
  totalCost = 0;
}
const addCheck = (id) => {
  var outoff = false;
  checkOuts.map((checkout) => {
    if (checkout.id == id){
      if (checkout.no + 1 > checkout.strock) outoff = true;
    }
  })
  if (outoff) {
    alert("out off stock");
    return;
  }
  checkOuts.map((checkOut) => {
    if (checkOut.id == id)
      checkOut.no += 1;
  })
  checkOuts.filter(c => c.no > 0).map(c => {
    totalCost += (c.no * c.price);
  })
}


var totalCost = 0;
const setBuy = (data) => {
  var checkAdded = false;
  buys.map((buy) => {
    checkAdded = Number.parseInt(buy.id) == data.id ? true : checkAdded;
  });
  if (checkAdded) return;
  buys.push(data);
  var checkOut = {
    name: data.name,
    img: data.img,
    price: data.price,
    id: data.id,
    strock: data.strock,
    no: 1
  }
  checkOuts.push(checkOut)
  checkOuts.filter(c => c.no > 0).map(c => {
    totalCost += (c.no * c.price);
  });
}

function App() {
  const [products, setProduct] = useState([]);
  useEffect(() => {
    fetch('https://localhost:7263/AllProduct')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data)
      });
  })
  
  

  return (
    <div class="header">
      <div class="shopping-header">
        <div class="header-name">Shopping</div>
        <div class="cart" onClick={() => checkOuts.length > 0 ? checkOutHide = !checkOutHide : checkOutHide}>
          <p class="cart-number">{checkOuts.length > 0 ? checkOuts.length : ""}</p>
          <svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="product-list"  style={!checkOutHide ? {display: "none"} : {display: "grid"}}>
        {
          products.filter(product => product.strock > 0).map((product) => (
            <div class="product">
              <div>{product.name}</div>
              <div>
                <img src={product.img} />
              </div>
              <div>{product.price}</div>
              <div>
                <button onClick={() => setBuy(product)}>Buy</button>
              </div>
            </div>
          ))
        }
      </div>
      <div class="check-out"  >
        <div class="summary" style={!checkOutHide ? {display: "grid"} : {display: "none"}}>
          <div>Summary</div>
          <div>{totalCost} baht</div>
          <div>
            <button class="check-total" onClick={() => check()}>Check out</button>
          </div>
        </div>
        <div class="product-checkout" style={!checkOutHide ? {display: "grid"} : {display: "none"}}>
          {
            checkOuts.map((checkOut) => (
              <div class="product-checkout-list">
                <div>{checkOut.name}</div>
                <div>
                  <img src={checkOut.img} />
                </div>
                <div class="button-add">
                  <button class="add" onClick={() => addCheck(checkOut.id)}>+</button>
                  <p>{checkOut.no}</p>
                  <button class="delete" onClick={() => deleteCheck(checkOut.id)}>-</button>
                </div>
                <div>{checkOut.price * checkOut.no}</div>
                <div>
                  <button class="clear" onClick={() => clearAll()}>clear all</button>
                </div>
            </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
