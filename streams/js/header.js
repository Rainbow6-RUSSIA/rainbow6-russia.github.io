socket = io.connect('https://streams.rainbow6russia.ru');

socket.on('header', syncData);

setTimeout(() => $('body').fadeTo(150, 1), 250);