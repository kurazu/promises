$.ajax({
    url: '/x',
    method: 'POST',
    data: 'SOME DATA',
    success: function(data, textStatus, jqXHR) {
        console.log('Data fetched', data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log('Fetch failed', errorThrown);
    }
});
