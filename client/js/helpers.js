    Ember.Handlebars.helper('format-markdown', function(input) {
        return input
        /*var showdown = new Showdown.converter();
        return new Handlebars.SafeString(showdown.makeHtml(input));*/
    });

    Ember.Handlebars.helper('format-date', function(date) {
        return moment(date).fromNow();
    });