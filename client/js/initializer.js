var config = {
  "apiBase": "http://localhost:8452",
  "apiNameSpace": "api/v1"
}

App = Ember.Application.create({});

var attr = DS.attr;

App.Item = DS.Model.extend({
  title: attr(),
  body: attr(),
  done: attr()
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: config.apiBase,
  namespace: config.apiNameSpace,
});

App.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

Ember.Application.initializer({
  name: "configReader",
  initialize: function(container, application) {
    application.set('apiBase', config.apiBase);
  }
});