
    var App = Ember.Application.create();

    App.Router.map(function() {
        this.route('item', {
            path: '/item/:item_id'
        });
        this.route('items.create', {
            path: '/items/create'
        });
    });

    Ember.$.getJSON('/config.json').then(function(data) {
        var config = data;
        var attr = DS.attr;

        App.Item = DS.Model.extend({
            title: attr(),
            body: attr(),
            done: attr(),
            doneAt: attr(),
            created: attr(),
            updated: attr(),
            revisions: attr(),
            version: attr()
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

        App.start(config);
    });
