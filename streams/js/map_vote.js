socket = io.connect('https://streams.rainbow6russia.ru');

function syncData(data) {
    let length = data.pool.length + data.votes.length;
    console.log('TCL: map_vote', data);
    if (data.poolCache.length) {
        data.pool = data.poolCache;
        length = data.poolCache.length;
    }
    data.votes.forEach((v, i, a) => {
        console.log('vote', i);
        let el;
        if (i !== length - 1) {
            el = $(`#${i}.log-maps > .log-action`);
            el.css('background-image', `url(${data.poolCache.find(p => p.id === v.mapId).splash})`);
            $(`#${i}.log-maps > .log-action > .glyph-placeholder > i`).text(v.type === 'ban' ? 'clear' : 'check');
            el.addClass(v.type === 'ban' ? 'log-action-red' : 'log-action-green');
            $(`#${i}.log-maps > .log-action > .team-action-text`).text(data.poolCache.find(p => p.id === v.mapId).titleRu.toUpperCase());
            $(`#${i}.log-maps`).fadeTo(150, 1);
            let e = $(`.footer-overlay`).eq(data.poolCache.findIndex(m => m.id === v.mapId));
            e.css('background-image', `url(${data[`team${i % 2}`].logo})`);
            e.fadeTo(150, 1);
        } else {
            el = $(`.decider`);
            el.css('background-image', `url(${data.poolCache.find(p => p.id === v.mapId).splash})`);
            $(`.decider > .team-action-text`).text(data.poolCache.find(p => p.id === v.mapId).titleRu.toUpperCase());
            $(`#-1.log`).fadeTo(150, 1);
            $('.footer-overlay').fadeTo(150, 1);
        }
    });
}

socket.emit('subscribe', {
    id: location.hash.slice(1),
    room: 'map_vote',
})

socket.on('init', data => {
    const length = data.pool.length + data.votes.length;
    if (data.poolCache.length) {
        data.pool = data.poolCache;
    }
    console.log('TCL: init', data);
    for (let i = 0; i < 2; i++) {
        $(`#${i}.team-logo`).attr('src', data[`team${i}`].logo || './img/XXX.png');
        $(`#${i}.team-title-text`).text(data[`team${i}`].name);
    }

    $(".team-title-text").textfill();

    $('.footer-map > img').attr('src', data.pool[0].splash);
    $('.footer-text').text(data.pool[0].titleRu.toUpperCase());

    if ($('.footer-item').length < length) {
        for (let i = 0; i <= length - 4; i++) {
            console.log('cloning', i,'to', i+2);
            $(`#${i}.log-maps`).clone().attr('id', i+2).appendTo(`#${i % 2}.log`);
        }
        $(`#-1.log > .log-maps`).attr('id', length-1)
        for (let i = 1; i < length; i++) {
            $('.footer-item').eq(0).clone().appendTo('footer');
            $('.footer-map > img').eq(i).attr('src', data.pool[i].splash);
            $('.footer-text').eq(i).text(data.pool[i].titleRu.toUpperCase());
        }
    }

    syncData(data);

    if (length <= 9) {
        $('footer').fadeTo(0, 1);
    }
});

socket.on('swap', (data) => {
    console.log('TCL: swap', data);
    for (let i = 0; i < 2; i++) {
        $(`#${i}.team-logo`).attr('src', data[`team${i}`].logo || './img/XXX.png');
        $(`#${i}.team-title-text`).text(data[`team${i}`].name);
    }
    $(".team-title-text").textfill();
})

socket.on('map_vote', syncData);

setTimeout(() => $('body').fadeTo(150, 1), 250);