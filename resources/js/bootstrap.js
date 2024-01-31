require("jquery")

import 'react-datepicker/dist/react-datepicker.css';
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');
axios.defaults.withCredentials = false;
axios.defaults.baseUrl =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development" ?
        "https://clicpoint.site"
        : ""
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.isset = (value) => {
    return typeof value !== "undefined" ? true : false;
}

window.formatBytes = (a, b = 2) => {
    if (0 === a) return "0 Bytes";
    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    return (
        parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
        " " +
        ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], [d]
    );
};
