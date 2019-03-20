socket = io.connect('https://streams.rainbow6russia.ru');

socket.emit('subscribe', {
    id: location.hash.slice(1),
    room: 'header',
})

socket.on('swap', (data) => {
    console.log('TCL: swap', data);
    for (let i = 0; i < 2; i++) {
        $(`#${i}.team-logo`).attr('src', data[`team${i}`].logo || './img/XXX.png');
        $(`#${i}.team-title-text`).text(data[`team${i}`].name);
    }
    $(".team-title-text").textfill();
})

socket.on('header', syncData);

setTimeout(() => $('body').fadeTo(150, 1), 250);