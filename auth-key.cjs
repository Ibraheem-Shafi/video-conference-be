const crypto = require('crypto');

const generateSecretKey = () => {
  // Generate a random byte array
  const buffer = crypto.randomBytes(32);
  // Convert the byte array to a hexadecimal string
  const secretKey = buffer.toString('hex');
  return secretKey;
};


const secretKey = generateSecretKey();


module.exports = secretKey;
