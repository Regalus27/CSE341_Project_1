const validator = require('../helpers/validate.js');

const cardFormat = (req, res, next) => {
    const validationRule = {
        actions: 'required',
        valueShop: 'required|integer',
        quantity: 'required|integer',
        cardType: 'required|string',
        cost: 'required|integer',
        border: 'required|string',
        deckId: 'required|string'
    };

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            // Failed
            res.status(412).send({ // precondition failed
                success: false,
                message: 'Validation failed',
                data: err
            });
        }
        else {
            next();
        }
    });
};

module.exports = {
    cardFormat
};