const bcryptjs = require('bcryptjs');

exports.setPasswdEncryption = async function (password) {
  //  加密密码
  const salt = await bcryptjs.genSalt(12);

  return await bcryptjs.hash(password, salt);
};

// module.exports = setPasswdEncryption;
