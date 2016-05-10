// js/models/todo.js

var app = app || {};

/*
ToDo Model
----------
This basic **Todo** model has 'title' and completed
*/

app.Todo = Backbone.Model.extend({

	// Default attributes ensure that each todo created has the minimum attributes

	defaults: {
		title: '',
		completed: false
	},

	// Toggle the 'completed' state of this todo items

	toggle: function() {
		this.save({
			completed: !this.get('completed')
		});
	}
});