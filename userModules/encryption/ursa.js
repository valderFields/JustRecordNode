var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var config = require('../../config/config');
var publicKey = config.publicKey;
var privateKey = config.privateKey;

/*
* 在window中使用openssl密钥工具生成的密钥,
* genrsa -out rsa_private_key.pem 1024--生成私钥
* rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem---生成对应的公钥
* pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -nocrypt--私钥转换为PKCS8格式
 */
/*
* 在linxu中生成
* genrsa -out rsa_private_key.pem 1024 // 生成1024位私钥
* pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM –nocrypt // 把RSA私钥转换成PKCS8格式
* rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem // 生成对应公钥
 */
var encryptStringWithRsaPublicKey = function(toEncrypt, relativeOrAbsolutePathToPublicKey = publicKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

var decryptStringWithRsaPrivateKey = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey = privateKey) {
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    return decrypted.toString("utf8");
};

var getPublicKey = function (relativeOrAbsolutePathToPublicKey = publicKey) {
	var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    return publicKey;
}

module.exports = {
    encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
    decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey,
    getPublicKey:getPublicKey
}

