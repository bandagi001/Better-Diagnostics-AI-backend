const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.encrypt = (text) => {
    const hash = bcrypt.hashSync(text, saltRounds);
    return hash;
}

exports.compare = (p1, p2) => {
    const valid = bcrypt.compareSync(p1, p2);
    return valid;
}