socket = io.connect('http://localhost:3001');

socket.emit('subscribe', {
    id: location.hash.slice(1),
    room: 'map_vote',
})

socket.on('init', data => {
    console.log('TCL: data', data);
    data.teams.forEach((t, i) => {
        $(`#${i}.team-logo`).attr('src', t.logo || './img/XXX.png');
        $(`#${i}.team-title-text`).text(t.name);
    });
    $(".team-title-text").textfill();

    $('.footer-map > img').attr('src', data.pool[0].splash);
    $('.footer-text').text(data.pool[0].titleRu.toUpperCase());

    if ($('.footer-item').length < data.pool.length) {
        for (let i = 0; i <= (Math.floor(data.pool.length / 2) + 1); i++) {
            console.log('cloning', i,'to', i+2);
            $(`#${i}.log-maps`).clone().attr('id', i+2).appendTo(`#${i % 2}.log`);
        }
        $(`#-1.log > .log-maps`).attr('id', data.pool.length-1)
        for (let i = 1; i < data.pool.length; i++) {
            $('.footer-item').eq(0).clone().appendTo('footer');
            $('.footer-map > img').eq(i).attr('src', data.pool[i].splash);
            $('.footer-text').eq(i).text(data.pool[i].titleRu.toUpperCase());
        }
    }

    if (data.pool.length <= 9) {
        $('footer').fadeTo(0, 1);
    }
});

socket.on('map_vote', data => {
    data.votes.forEach((v, i, a) => {
        const el = $(`#${i}.log-maps > .log-action`);
        el.css('background-image', `url(${v.map.splash})`);
        $(`#${i}.log-maps > .log-action > .glyph-placeholder > i`).text(v.type === 'ban' ? 'clear' : 'check');
        el.addClass(v.type === 'ban' ? 'log-action-red' : 'log-action-green');
    });
});

setTimeout(() => $('body').fadeTo(150, 1), 250);