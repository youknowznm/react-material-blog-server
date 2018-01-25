const userValidator = {
  $and: [
    {
      email: {
        $type: 'string',
        $regex: /^([a-zA-Z0-9]+[\w-]*)(@[\w]{2,})(\.[\w]{2,4})(\.[\w]{2,4})?$/,
      },
    },
    {
      password: {
        $type: 'string',
        $regex: /^.{6,20}$/,
      },
    },
    {
      nickname: {
        $type: 'string',
        $regex: /^[a-zA-Z0-9\x80-\xff]{2,10}$/,
      },
    },
    {
      verified: {
        $type: 'bool',
      },
    },
  ],
}

const addUserCollection = (db, cb) => {
  db.createCollection('users', {
    validator: userValidator,
  })
}

module.exports = addUserCollection
