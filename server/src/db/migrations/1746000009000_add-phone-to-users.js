exports.up = (pgm) => {
  pgm.addColumn(
    'users',
    {
      phone: { type: 'varchar(20)' },
    },
    { ifNotExists: true }
  )
}

exports.down = (pgm) => {
  pgm.dropColumn('users', 'phone', { ifExists: true })
}
