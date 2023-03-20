const url = "wss://stream.data.alpaca.markets/v1beta2/crypto";
const socket = new WebSocket(url);

const auth = {"action":"auth","key":"AKV99MA7QYELVRLAOX7L","secret":"4tZqbujWteLgcLBhpiUN78ysasdVvM0UYcGmnP2V"};
const subscribe = {"action":"subscribe", "trades":["ETH/USD"],"quotes":["ETH/USD"],"bars":["ETH/USD"]};

const quotesElement = document.getElementById("quotes");
const tradesElement = document.getElementById("trades");

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const message = data[0]["msg"];
    console.log(data);

    if (message == "connected") {
        console.log("do authentication");
        socket.send(JSON.stringify(auth));
    }

    if (message == "authenticated") {
        socket.send(JSON.stringify(subscribe));
    }

    for (var key in data) {
        console.log(data[key]);

        const type = data[key].T;

        if (type == "q") {
            console.log("got a quote");
            console.log(data[key]);

            const quoteElement = document.createElement("div");
            quoteElement.className = "quote";
            quoteElement.innerHTML = `<b>${data[key].t}</b> ${data[key].bp} ${data[key].ap}`;
            quotesElement.appendChild(quoteElement);

            const elements = document.getElementsByClassName("quote");
            if (elements.length > 10) {
                quotesElement.removeChild(elements[0]);
            }
        }

        if (type == "t") {
            console.log("got a trade");
            console.log(data[key]);

            const tradeElement = document.createElement("div");
            tradeElement.className = "trade";
            tradeElement.innerHTML = `<b>${data[key].t}</b> ${data[key].p} ${data[key].s}`;
            tradesElement.appendChild(tradeElement);

            const elements = document.getElementsByClassName("trade");
            if (elements.length > 10) {
                tradesElement.removeChild(elements[0]);
            }
        }

        if (type == "b") {
            console.log("got a new bar");
            console.log(data[key]);
        }
    }
}