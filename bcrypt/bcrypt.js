const bcrypt = require('bcrypt')

const hashPassword = async (pw) => {
  const hash = await bcrypt.hash(pw, 12)
  console.log(hash)
}

// hashPassword('134')
// $2b$12$GWvbzB5nxhXjuC28tNxzb.X0AZEBpy7xns4NgbfShLF5QxvMcm/La

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw)
  if (result) {
    console.log('ログイン成功！！！')
  } else {
    console.log('ログイン失敗！！！')
  }
}

login('134', '$2b$12$GWvbzB5nxhXjuC28tNxzb.X0AZEBpy7xns4NgbfShLF5QxvMcm/La')