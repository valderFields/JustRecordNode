var uras = require('./ursa');

let data = "哈哈";

let encrypted = uras.encryptStringWithRsaPublicKey(data);

let decrypted = uras.decryptStringWithRsaPrivateKey(encrypted);

console.log(encrypted);

console.log(decrypted);