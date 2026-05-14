exports.up = (pgm) => {
  pgm.addColumn(
    'requests',
    {
      priority: { type: 'varchar(20)', notNull: true, default: 'normal' },
    },
    { ifNotExists: true }
  )
}

exports.down = (pgm) => {
  pgm.dropColumn('requests', 'priority', { ifExists: true })
}
