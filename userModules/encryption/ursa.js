var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

const MAX_ENCRYPT_BLOCK = 1024/8 - 11; /*RSA最大加密明文大小 */
const MAX_DECRYPT_BLOCK = 1024/8;    /*RSA最大解密密文大小*/
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

/*
* RSA加密明文最大长度117字节，解密要求密文最大长度为128字节，所以在加密和解密的过程中需要分块进行。
*/
var encryptStringWithRsaPublicKey = function(toEncrypt, relativeOrAbsolutePathToPublicKey = publicKey) {
    var encryptedBuffersList = []; /*密文*/
    var bytesDecrypted = 0;  /*开始长度*/
    var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = new Buffer(toEncrypt);
    while (bytesDecrypted < buffer.length) {
        var amountToCopy =  Math.min(MAX_ENCRYPT_BLOCK,buffer.length -  bytesDecrypted);
        var tempBuffer = new Buffer(amountToCopy);
        buffer.copy(tempBuffer, 0, bytesDecrypted, bytesDecrypted + amountToCopy);
        var encryptedBuffer = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, tempBuffer);
        encryptedBuffersList.push(encryptedBuffer);
        bytesDecrypted += amountToCopy;
    }
    return Buffer.concat(encryptedBuffersList).toString('base64'); 
};

var decryptStringWithRsaPrivateKey = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey = privateKey) {
    var decryptedBuffers = [];  /*明文*/
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    var encryptedBuffer = new Buffer(toDecrypt, 'base64');
    var keySizeBytes = MAX_DECRYPT_BLOCK;
    var totalBuffers = encryptedBuffer.length / keySizeBytes;
    for (var i = 0; i < totalBuffers; i++) {
        var tempBuffer = new Buffer(keySizeBytes);
        encryptedBuffer.copy(tempBuffer, 0, i * keySizeBytes, (i + 1) * keySizeBytes);
        var decryptedBuffer = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, new Buffer(tempBuffer));
        decryptedBuffers.push(decryptedBuffer);
    }
    return Buffer.concat(decryptedBuffers).toString('utf8');
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

