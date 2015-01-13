
    App.Router.map(function() {
        this.route('item', { path: '/item/:item_id'});
        this.route('items.create', { path: '/items/create'});
    });
    
    App.ItemController = Ember.ObjectController.extend({
        isEditing: false,
        actions: {
            edit: function() {
                this.set('isEditing', true);
            },
            doneEditing: function() {
                this.set('isEditing', false);
                this.model.save();
            },
            remove: function() {
                this.model.deleteRecord();
                this.model.save();
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


    App.ItemRoute = Ember.Route.extend({
        model: function(params) {
            return this.store.find('item', params.item_id);
        }
    });

    App.ItemsRoute = Ember.Route.extend({
        /*model: function() {
            return this.store.find('item');
        }*/
    });

    App.ItemsCreateRoute = Ember.Route.extend({
        model: function() {
            return this.store.createRecord('item', {title: 'Untitled'});
        }
    });

    App.ItemsCreateController = Ember.ObjectController.extend({
        actions: {
            create: function() {
                this.model.save();
            },
            cancel: function() {
                this.model.deleteRecord();
                window.history.back();
            }
        }
    });





    // helpers
    var showdown = new Showdown.converter();

    Ember.Handlebars.helper('format-markdown', function(input) {
        return new Handlebars.SafeString(showdown.makeHtml(input));
    });

    Ember.Handlebars.helper('format-date', function(date) {
        return moment(date).fromNow();
    });

    // index route config
    App.IndexRoute = Ember.Route.extend({
        beforeModel: function() {
            //this.transitionTo('items');
        }
    });