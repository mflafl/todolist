App.start = function(config) {
    App.ItemsCreateRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            this.controllerFor('item').set('isEditing', true);
        },
        model: function() {
            var self = this;
            var model = this.store.createRecord('item', config.defaultItem);
            model.save().then(function() {
                self.transitionTo('item', model.id);
            });
            return model;
        }
    });

    App.ItemRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            controller.set('isEditing', false);
            if (model.get('body') === '') {
                controller.set('isEditing', true);
            }
            controller.set('model', model);
            
            var revisions = DS.PromiseArray.create({
              promise: $.get(config.apiBase + '/' + config.apiNameSpace + '/' + 'items/' + model.get('id') + '/revisions')
            });
            controller.set('revisions', revisions);
        },
        model: function(params) {
            return this.store.find('item', params.item_id);
        },
    });

    App.ItemController = Ember.ObjectController.extend({
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

    App.ApplicationRoute = Ember.Route.extend({
        model: function() {
            return this.store.find('item');
        },
    });

    App.ApplicationController = Ember.ObjectController.extend({
        actions: {
            makeDone: function(model) {
                model.set('done', true);
                model.save();
            }
        }
    });

    var showdown = new Showdown.converter();

    Ember.Handlebars.helper('format-markdown', function(input) {
        return new Handlebars.SafeString(showdown.makeHtml(input));
    });

    Ember.Handlebars.helper('format-date', function(date) {
        return moment(date).fromNow();
    });
}