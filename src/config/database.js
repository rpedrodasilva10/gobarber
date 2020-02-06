module.exports = {
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
