function fetchDataFromBackend(options) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: options.url,
            method: options.method,
            data: options.data,
            success: function(data, textStatus, jqXHR) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}
