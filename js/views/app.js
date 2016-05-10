// js/views/app.js

var app = app || {};

/*
The Application
---------------

Our overall **Appview** is the top-level piece of UI

*/

app.Appview = Backbone.View.extend({

	// Instead of generating a new element, bin dto the existing skeleton of
	// the App already present in HTML

	el: '#todoapp',

	// Our template for the line of statistics at the bottom of the app.

	statsTemplate: _.template( $(#stats-template).html()),
	
	//The call to _.template uses Underscore’s micro-templating to construct
	//a statsTemplate object from our #stats-template. We will
	//use this template later when we render our view.


	// At initialization we bind to the relevant events on the 'Todos'
	// Collection when the items are added or changed

	initialize: function() {
		this.allCheckbox = this.$('toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$main;

		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll);

		// listenTo(other, event, callback) --> backbone docu
	},

	// Add a single todo item to the lis by creating a view for it and 
	// appending its element to the '<ul>'

	addOne: function(todo) {
		var view = new app.TodoView({model: todo});
		$('#todo-list').append(view.render().el);
	},

	// Add all items in the Todos collection at once

	addAll: function() {
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this)
	}
})