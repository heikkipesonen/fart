// var Sequelize = require('sequelize');
var Sequelize = require('sequelize-hierarchy')();
var _ = require('lodash');


var db = new Sequelize('cms', 'root', 'password', {
  host: '192.168.0.16',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var types = [
  'item',
  'text',
  'image',
  'html',
  'relation',
  'file'
];

var Item = db.define('item', {
  type: {
    type: Sequelize.STRING,
    field: 'type',
    validate: {
      isIn: types
    }
  },
  x: {
    type: Sequelize.INTEGER
  },
  y: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  meta: {
    type: Sequelize.TEXT
  },
  order: {
    type: Sequelize.INTEGER
  },
  parentId: {
    type: Sequelize.INTEGER,
    hierarchy: true,
    field: 'parent'
  },
  content: {
    type: Sequelize.TEXT,
    field: 'content'
  },
  tags: {
    field: 'tags',
    type: Sequelize.TEXT,
    set: function (value) {
      return this.setDataValue('tags', value ? value.join(',') : '');
    },
    get: function() {
      var value = this.getDataValue('tags');
      return value ? value.split(',') : [];
    }
  }
}, {
  freezeTableName: true,
  timestamps: true
});


var f = false;

db.sync({force: f});




module.exports = {
  /**
   * list all available items starting from the beginning of hierarchy
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  list: function (req, res, next) {
    Item.findAll({
      hierarchy: true,
    }).then(function (model) {
      res.send(200, model);
    }).catch(function(error) {
      res.send(500, error);
    });
  },

  /**
   * get single item with its children
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  get: function (req, res, next) {
    Item.find({
      hierarchy: true,
      where: {
        id: req.params.id
      }
    }).then(function (model) {
      res.send(200, model);
    }).catch(function(error) {
      res.send(500, error);
    });
  },

  /**
   * add new root item
   * @param {[type]}   req  [description]
   * @param {[type]}   res  [description]
   * @param {Function} next [description]
   */
  add: function (req, res, next) {
    Item.create(req.body).then(function (model) {
      Item.find({
        where: {
          id: model.id
        }
      }).then(function (model) {
        res.send(200, model);
      });
    }, function (error) {
      console.log(error);
      res.send(500, {message: 'Item was not added'});
    });
  },

  /**
   * remove an item
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  remove: function (req, res, next) {
    Item.find({
      where: {
        id: req.params.id
      }
    }).then(function (model) {

      if (model) {
        model.destroy().then(function (response) {
          res.send(200, response);
        }, function (error) {
          console.log(error);
          res.send(500, {message: 'Item has children'});
        });
      } else {
        res.send(404, {message: 'Item not found'});
      }
    });
  },

  /**
   * add child to an item
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  addChild: function(req, res, next) {
    Item.find({
      where: {
        id: req.params.id
      }
    }).then(function (model) {
      model.createChild(req.body).then(function (child) {
        model.addChild(child).then(function () {
          res.send(200, child);
        }, function(error) {
          console.log(error);
          res.send(500, {message: 'Child was not created'});
        });
      }, function(error) {
        console.log(error);
        res.send(500, {message: 'Child was not created'});
      });
    }, function(error) {
      console.log(error);
      res.send(404, {message: 'Not found'});
    });
  },

  /**
   * update item with its children
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  update: function(req, res, next){
    var updated = req.body;

    Item.find({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Item,
          as: 'descendents',
          hierarchy: true
        }
      ]
    }).then(function(model) {
      if (model) {
        model.update(req.body).then(function(result) {
          res.send(200, model);
        }, function (error) {
          console.log(error);
          res.send(500, {message: 'update failed'});
        });
      } else {
        res.send(404, {message: 'item not found'});
      }
    }, function (error) {
      console.log(error);
      res.send(500, {message: 'something failed'});
    });
  }
}
