var App = Ember.Application.create();

Ember.$.getJSON('/config.json').then(function(config) {
    App.Item = DS.Model.extend({
        title: DS.attr('string', {
            defaultValue: 'Untitled'
        }),
        body: DS.attr('string', {
            defaultValue: ''
        }),
        tags: DS.hasMany('tags'),
        category: DS.belongsTo('category', {
            async: false
        }),
        done: DS.attr(),
        doneAt: DS.attr(),
        created: DS.attr(),
        updated: DS.attr(),
        revisions: DS.attr(),
        version: DS.attr()
    });

    App.Tag = DS.Model.extend({
        title: DS.attr(),
        items: DS.hasMany('items'),
    });

    App.Category = DS.Model.extend({
        items: DS.hasMany('items'),
        title: DS.attr(),
        //created: DS.attr()
    });

    Ember.Application.initializer({
        name: "configReader",
        initialize: function(container, application) {
            application.set('apiBase', config.apiBase);
        }
    });

    App.ApplicationAdapter = DS.RESTAdapter.extend({
        host: config.apiBase,
        namespace: config.apiNameSpace,
    });

    App.ApplicationSerializer = DS.RESTSerializer.extend({
        primaryKey: '_id'
    });

    App.ApplicationRoute = Ember.Route.extend({
        model: function() {
            return Ember.RSVP.hash({
                items: this.store.find('item'),
                categories: this.store.find('category'),
                tags: this.store.find('tag')
            });
        },
        setupController: function(controller, model) {
            controller.set("model", model);
        }
    });

    App.ApplicationController = Ember.ObjectController.extend({
        actions: {
            makeDone: function(model) {
                model.set('done', true);
                model.save();
            }
        }
    });

    App.start(config);
});