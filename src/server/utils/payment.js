const paystack = (request) => {
    const MySecretKey = "sk_test_a64a4a9d9ae98c4d63e3c06c8343c0244ffab3d6";

    const initializePayment = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                form
            },
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        };

        const callback = (error, response, body) => {
            return mycallback(error, body);
        };

        request.post(options, callback);
    };

    const verifyPayment = (ref, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
            headers: {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        };

        const callback = (error, response, body) => {
            return mycallback(error, body);
        };

        request(options, callback);
    };

    return { initializePayment, verifyPayment };
};

module.exports = paystack;