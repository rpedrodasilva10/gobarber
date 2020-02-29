import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
<<<<<<< HEAD
<<<<<<< HEAD
            return `http://localhost:3000/files/${this.path}`;
=======
            return `http://localhost:3333/files/${this.path}`;
>>>>>>> 97459f4... Add index providers with avatar file url
=======
            return `http://localhost:3000/files/${this.path}`;
>>>>>>> 4d31c56... feat: create notifications and mongodb connection
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
