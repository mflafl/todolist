var config = {
  "apiBase": "http://localhost:8452",
  "apiNameSpace": "api/v1"
}

App = Ember.Application.create({});

var attr = DS.attr;

App.Item = DS.Model.extend({
  title: attr(),
  body: attr()
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: config.apiBase,
  namespace: config.apiNameSpace
});

var items = [{
    id: '1',
    title: "Rails is Omakase",
    date: new Date('12-27-2012'),
    body: "I want this for my ORM, I want that for my template language, and let's finish it off with this routing library. Of course, you're going to have to know what you want, and you'll rarely have your horizon expanded if you always order the same thing, but there it is. It's a very popular way of consuming software.\n\nRails is not that. Rails is omakase."
  }, {
    id: '2',
    title: "The Parley Letter",
    date: new Date('12-24-2012'),
    body: "A long list of topics were raised and I took a time to ramble at large about all of them at once. Apologies for not taking the time to be more succinct, but at least each topic has a header so you can skip stuff you don't care about.\n\n### Maintainability\n\nIt's simply not true to say that I don't care about maintainability. I still work on the oldest Rails app in the world."
  }
];

Ember.Application.initializer({
  name: "configReader",
  initialize: function(container, application) {
    application.set('apiBase', config.apiBase);
  }
});