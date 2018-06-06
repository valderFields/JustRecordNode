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
 *编码就是表示二进制的一种方式
* 计算机开始的世界是01代码,因为看着很长,所以对二进制数据进行hex编码(也就是说0-9A-E)
* hex编码可读性很差,所以ASCII码出现了,他基本可以表示所有的字母回车
* 为了解决中文,日文等编码的难题,utf-8编码出现了,它兼容了ASCII
* 一个编码的系统文件用另一个编码系统打开,就会出现乱码,这个时候base64作为中间层,可以进行转换
* 
 */
/*
* RSA加密明文最大长度117字节，解密要求密文最大长度为128字节，所以在加密和解密的过程中需要分块进行。
*/
/**
 * RSA公钥加密
 * @Author   LHK
 * @DateTime 2018-06-03
 * @version  [version]
 * @param    {[type]}   toEncrypt                         [加密的字符串]
 * @param    {[type]}   relativeOrAbsolutePathToPublicKey [公钥的路径]
 * @return   {[type]}                                     [description]
 */
var encryptStringWithRsaPublicKey = function(toEncrypt, relativeOrAbsolutePathToPublicKey) {
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

/**
 * RSA私钥解密
 * @Author   LHK
 * @DateTime 2018-06-03
 * @version  [version]
 * @param    {[type]}   toDecrypt                          [需要解密的字符串]
 * @param    {[type]}   relativeOrAbsolutePathtoPrivateKey [私钥的路径]
 * @return   {[type]}                                      [description]
 */
var decryptStringWithRsaPrivateKey = function(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    var decryptedBuffers = [];  /*明文*/
    var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
    var privateKey = fs.readFileSync(absolutePath, "utf8");
    /*在安卓端,使用 公钥 加密出来的 byte[] 需要 补位 转成 hex 字符串*/
    //let toDecryptHex = Buffer.from(toDecrypt,'hex');
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
/**
 * 根据路径解析公钥并返回
 * @Author   LHK
 * @DateTime 2018-06-03
 * @version  [version]
 * @param    {[type]}   relativeOrAbsolutePathToPublicKey [公钥的路径]
 * @return   {[type]}                                     [description]
 */
var getPublicKey = function (relativeOrAbsolutePathToPublicKey) {
	var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    var publicKey = fs.readFileSync(absolutePath, "utf8");
    return publicKey;
}
/**
 * md5不可逆加密
 * @Author   LHK
 * @DateTime 2018-06-03
 * @version  [version]
 * @param    {[type]}   text [description]
 * @return   {[type]}        [description]
 */
var md5IrreEncrypt = function(text){
    return crypto.createHash('md5').update(text).digest('hex')
} 
/**sha1不可逆加密
 * @Author   LHK
 * @DateTime 2018-06-03
 * @version  [version]
 * @param    {[type]}   text [description]
 * @return   {[type]}        [description]
 */
var sha1IrreEncrypt = function(text){
    return crypto.createHash('sha1').update(text).digest('hex');
}


module.exports = {
    encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
    decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey,
    getPublicKey:getPublicKey,
    sha1IrreEncrypt:sha1IrreEncrypt,
    md5IrreEncrypt:md5IrreEncrypt
}

