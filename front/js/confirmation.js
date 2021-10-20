let getParams = (new URL(document.location)).searchParams;
let orderId = getParams.get('order_id');

let order = document.getElementById('orderId');

order.innerText = `${orderId}`;