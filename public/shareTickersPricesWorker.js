const ports = [];

self.onconnect = (event) => {
  const port = event.ports[0];
  ports.push(port);

  port.onmessage = (e) => {
    const message = e.data;
    for (const client of ports) {
      if (client !== port) client.postMessage(message);
    }
  };
};
