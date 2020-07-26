window.parseBoolean = function(string) {
    let bool;
    if(string !== null)
        bool = (function() {
            switch (false) {
                case string.toLowerCase() !== 'true':
                    return true;
                case string.toLowerCase() !== 'false':
                    return false;
            }
        })();
    else
        return bool = false;
    if (typeof bool === "boolean") {
        return bool;
    }
    return void 0;
};