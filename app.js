var Restaurant = Backbone.Model.extend();

var Restaurants = Backbone.Collection.extend({
    model: Restaurant,

    url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20zip%3D'94085'%20and%20query%3D'sushi'&diagnostics=true",

    setQuery: function(query) {
        var urlBase = "https://query.yahooapis.com/v1/public/yql?q=";
        var url = urlBase + encodeURIComponent(query);
        this.url = url;
    },

    parse: function(data) {
        var restaurants = [];
        $(data).find('Result').each(function(index) {
            restaurants.push({
                title: $(this).find('Title').text(),
                address: $(this).find('Address').text(),
                city: $(this).find('City').text(),
                state: $(this).find('State').text(),
                phone: $(this).find('Phone').text(),
                rating: $(this).find('Rating').find('AverageRating').text()
            });
        });
        return restaurants;
    },

    fetch: function(options) {
        options = options || {};
        options.dataType = "xml";
        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});

var RestaurantView = Backbone.View.extend({
    tagName: "li",
    className: "restaurant",
    render: function() {
        this.$el.html(this.model.get('title'));
        return this;
    }
});

var RestaurantCollectionView = Backbone.View.extend({
    tagName: "ul",
    className: "restaurants",
    el: '#results',

    initialize: function() {
        var that = this;
        this.views = [];
        this.collection.each(function(restaurant) {
            that.views.push(new RestaurantView({
                model: restaurant
            }));
        });
    },

    render: function() {
        var that = this;
        $(this.el).empty();
        _(this.views).each(function(view) {
            $(that.el).append(view.render().el);
        });
        return this;
    }


});

var Query = Backbone.Model.extend({
    render: function() {
        var query = "";
        query += "select * from local.search(20) where ";
        if(this.get('city'))
            query += "location='" + this.get('city') + "' ";
        if(this.get('zip'))
            query += "zip='" + this.get('zip') + "' ";
        if(this.get('type'))
            query += "and query='" + this.get('type') + "' ";
        return query;
    }
});

var restaurants = new Restaurants();

$(document).ready(function() {
    $('#search-button').click(function() {
        var query = new Query({
            city: $('#city-input').val(),
            zip: $('#zip-input').val(),
            type: $('#type-input').val()
        });
        restaurants.setQuery(query.render());
        console.log(restaurants.url);
        restaurants.fetch({
            success: function() {
                var resultsView = new RestaurantCollectionView({
                    collection: restaurants
                });
                resultsView.render();
            }
        });
    });
});
