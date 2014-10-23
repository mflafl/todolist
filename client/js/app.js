App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('items');
  }
});

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
    return posts.findBy('id', params.item_id);
  }
});

App.ItemsRoute = Ember.Route.extend({
  model: function() {
    this.store.find('item');
  }
});

App.ItemsCreateRoute = Ember.Route.extend({
  model: function() {
    console.log('create route');
    var item = {
      title: 'Untitled',
      body: 'Test'
    }
    items.push(item);
    return item;
  }
});

/*App.ItemsController = Ember.ObjectController.extend({
  actions: {
    create: function() {      
      items.push = {
        title: 'Untitled'
      }      
    }
  }
});*/

App.ItemController = Ember.ObjectController.extend({
  isEditing: false,
  actions: {
    edit: function() {
      this.set('isEditing', true);
    },
    doneEditing: function() {
      this.set('isEditing', false);
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