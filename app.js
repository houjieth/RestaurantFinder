var Restaurant = Backbone.Model.extend();

var Restaurants = Backbone.Collection.extend({
    model: Restaurant,

    initialize: function() {
        this.comparatorMap = {
            'rating': function(restaurant) {
                if (restaurant.get('rating') == 'NaN')
                    return -1;
                return -restaurant.get('rating');
            },
            'distance': function(restaurant) {
                return parseFloat(restaurant.get('distance'));
            }
        }
    },

    setSortStrategy: function(field) {
        this.comparator = this.comparatorMap[field];
    },

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
                rating: $(this).find('Rating').find('AverageRating').text(),
                distance: $(this).find('Distance').text(),
                url: $(this).find('Url').text()
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
        var template = _.template($('#result-row-template').html());
        this.$el.html(template({
            name: this.model.get('title'),
            rating: this.model.get('rating'),
            distance: this.model.get('distance'),
            address: this.model.get('address'),
            phone: this.model.get('phone'),
            url: this.model.get('url')
        }));
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
        var template = _.template($('#result-template').html());
        $(this.el).empty();
        var rows = [];
        _(this.views).each(function(view) {
            rows += view.render().el.innerHTML;
        });
        $(that.el).append(template({content: rows}));
        return this;
    }
});

var Query = Backbone.Model.extend({
    render: function() {
        var query = "";
        query += "select * from local.search(50) where ";
        if(this.get('type'))
            query += "query='" + this.get('type') + "' ";
        if(this.get('city'))
            query += "and location='" + this.get('city') + "' ";
        if(this.get('zip'))
            query += "and zip='" + this.get('zip') + "' ";
        if(this.get('lat'))
            query += "and latitude='" + this.get('lat') + "' ";
        if(this.get('log'))
            query += "and longitude='" + this.get('log') + "' ";
        return query;
    }
});

var restaurants = new Restaurants();

$(document).ready(function() {
    $('#search-button').click(function() {
        var query = new Query({
            city: $('#city-input').val(),
            zip: $('#zip-input').val(),
            type: $('#type-input').val(),
            lat: $('#lat-input').val(),
            log: $('#log-input').val()
        });
        restaurants.setQuery(query.render());
        var sortOption = $('#sort-option').text();
        if (sortOption == 'Sort by rating')
            restaurants.setSortStrategy('rating');
        else if (sortOption == 'Sort by distance')
            restaurants.setSortStrategy('distance');
        restaurants.fetch({
            success: function() {
                var resultsView = new RestaurantCollectionView({
                    collection: restaurants
                });
                resultsView.render();
            }
        });
    });
    $('#sort-option-dropdown.dropdown-menu li a').click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+'<span class="caret"></span>');
    });
    $('#type-option-dropdown.dropdown-menu li a').click(function(){
        var selText = $(this).text();
        $('#type-input').val(selText);
    });
    $('#locate-button').click(function() {
        function fillLocation(position) {
            $('#lat-input').val(position.coords.latitude);
            $('#log-input').val(position.coords.longitude);
        }
        navigator.geolocation.getCurrentPosition(fillLocation);
    })
});
