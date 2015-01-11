
    App.Router.map(function() {
        this.resource('items', function() {
            this.resource('item', {
                path: ':item_id'
            });
            this.route('create');
        });
    });


    App.ItemRoute = Ember.Route.extend({
        model: function(params) {
            return this.store.find('item', params.item_id);
        }
    });

    App.ItemsRoute = Ember.Route.extend({
        model: function() {
            return this.store.find('item');
        }
    });

    App.ItemsCreateRoute = Ember.Route.extend({
        model: function() {
            return {
                title: 'Title',
                body: 'Body'
            };
        }
    });

    App.ItemsCreateController = Ember.ObjectController.extend({
        actions: {
            create: function() {
                var item = this.store.createRecord('item', this.model)
                item.save();
            }
        }
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


    App.ItemsController = Ember.ObjectController.extend({
        actions: {
            makeDone: function(model) {
                model.set('done', true);
                model.save();
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
            this.transitionTo('items');
        }
    });