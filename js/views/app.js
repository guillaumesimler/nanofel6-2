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

	statsTemplate: _.template( $('#stats-template').html() ),
	
	//The call to _.template uses Underscore’s micro-templating to construct
	//a statsTemplate object from our #stats-template. We will
	//use this template later when we render our view.

	// !!!NEW!!!
	//Delegates events for creating a new items and clearing completed ones

	events: {
		'keypress #new-todo': 'createOnEnter',
		'click #clear-completed': 'clearCompleted',
		'click #toglle-all': 'toggleAllComplete'
	},

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

		//New
		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.listenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);

		app.Todos.fetch();
	},

	//!!! New
	// Re-renderiung the App just means refreshing the statistics -- the rest of the
	// app doesn'#'t change 

	render. function(){
		var completed = app.Todos.completed().length;
		var remaining = app.Todos.remaining().length;

		if (app.Todos.length) {
			this.$main.show();
			this.$footer.show()

			this.footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected');
				.filter('[href0"#/' + (app.TodoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}
	}

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
	},

	// New
	filterOne: function(todo) {
		todo.trigger('visible');
	},

	// New

	filterAll: function() {
		app.Todos.each(this.filterOne, this);
	},

	//New
	// Generate the attributes for a new Todo item

	newAttributes: function() {
		return{
			title: this.$input.val().trim(), //trim kicks the white spaces at beginning and end
			order: app.Todos.nextOrder(),
			completed: false,

		};
	},

	//New
	//If you hit return in the main input field, create new Todo Model

	createOnEnter: function(event) {
		if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		app.Todos.create(this.newAttributes());
		this.input.val('');
	},

	//New
	//Clear all completed to do items, destroying their mdoels

	clearCompleted: function(){
		_.invoke(app.Todos.completed(), 'destroy');

		return false;
	},

	// New

	toggleAllComplete: function() {
		var completed = this.allCheckbox.checked;

		app.Todos.each( function(todo){
			todo.save({
				'completed': completed
			});
		});
	}

});