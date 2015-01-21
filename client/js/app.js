
App.start = function(config) {

    this.Router.map(function() {
        this.route('item', {
            path: '/item/:item_id'
        });
        this.route('items.create', {
            path: '/items/create'
        });
        this.resource('categories', function() {
            this.route('create')
        });
    });

    this.ItemsCreateRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            this.controllerFor('item').set('isEditing', true);
        },
        model: function() {
            var self = this;
            var model = this.store.createRecord('item');
            model.save().then(function() {
                self.transitionTo('item', model.id);
            });
            return model;
        }
    });

    this.ItemRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            controller.set('isEditing', false);
            if (model.get('body') === '') {
                controller.set('isEditing', true);
            }
            controller.set('model', model);

            var revisions = DS.PromiseArray.create({
                promise: $.get(config.apiBase + '/' + config.apiNameSpace + '/' + 'items/' + model.get('id') + '/revisions')
            });
            controller.set('revisionsData', revisions);
            controller.set('categories', this.store.all('category'));
        },
        model: function(params) {
            return this.store.find('item', params.item_id);
        },
    });

    this.ItemController = Ember.ObjectController.extend({
        isEditing: false,
        actions: {
            revertToVersion: function(revision) {
                this.model.set('body', revision.body);
                this.model.set('title', revision.title);
            },
            edit: function() {
                this.set('isEditing', true);
            },
            doneEditing: function() {
                this.set('isEditing', false);
                this.model.save();
            },
            cancelEditing: function() {
                this.set('isEditing', false);
            },
            remove: function() {
                this.model.deleteRecord();
                this.model.save();
                this.transitionTo('index');
            },
        }
    });


    this.CategoriesCreateRoute = Ember.Route.extend({
        model: function() {
            return this.store.createRecord('category');
        }
    });

    this.CategoriesCreateController = Ember.ObjectController.extend({
        actions: {
            save: function() {                
                this.model.save();
                this.transitionTo('index');
            },
            cancel: function() {
                this.model.deleteRecord();
                this.transitionTo('index');
            }
        }
    });
}
