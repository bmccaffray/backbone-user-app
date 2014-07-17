(function($){
	UserRouter = Backbone.Router.extend({
		routes: {
			"users/index": "index",
			"user/new": "create",
			"user/:id/edit": "edit"
		},

		initialize: function(options) {
			this.users = options.users;
			this.index();
		},
		
		index: function() {
			this.currentView = new UserIndexView({
				users: this.users
			});
			$('#primary-content').html(this.currentView.render().el);
		},
		
		create: function() {
			this.currentView = new UserNewView({
				users: this.users, user: new UserModel()
			});
			$('#primary-content').html(this.currentView.render().el);
		},

		edit: function(id) {
			var user = this.users.get(id);
			this.currentView = new UserEditView({user: user});
			$('#primary-content').html(this.currentView.render().el);
		}
	});


	UserModel = Backbone.Model.extend({
		defaults: {
			firstname: "",
			lastname: "",
			email: ""
		},
	});
		
	UserCollection = Backbone.Collection.extend({
		model: UserModel
	});


	/************
		Views
	************/

	UserIndexView = Backbone.View.extend({
		events: {
			"click button.add": "add"
		},
		
		initialize: function(options) {
			this.users = options.users;
		},
		
		render: function() {
			this.$el.html($('#index').html());
			this.addAll();
			return this;
		},
		
		addAll: function() {
			this.$el.find('tbody').children().remove();
			_.each(this.users.models, $.proxy(this, 'addOne'));
		},
		
		addOne: function(user) {
			var view = new UserRowView({
				users: this.users, 
				user: user
			});
			this.$el.find("tbody").append(view.render().el);
		},
		
		add: function(event) {
			window.location.hash = "user/new";
		}
	});
	
	UserRowView = Backbone.View.extend({
		tagName: "tr",
		events: {
			"click a.delete": "destroy"
		},
		
		initialize: function(options) {
			this.user  = options.user;
			this.users = options.users;
		},
		
		render: function() {
			this.$el.html(_.template($('#row').html(), this.user.toJSON()));
			return this;
		},
		
		destroy: function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.users.remove(this.user);
			this.$el.remove();
		}
	});

	UserNewView = Backbone.View.extend({
		events: {
			"click button.save": "save"
		},
		
		initialize: function(options) {
			this.user  = options.user;
			this.users = options.users;
		},
		
		save: function(event) {
			event.stopPropagation();
			event.preventDefault();
			
			this.user.set({
				firstname: this.$el.find('input[name=firstname]').val(),
				lastname: this.$el.find('input[name=lastname]').val(),
				email: this.$el.find('input[name=email]').val(),
				id: this.$el.find('input[name=firstname]').val()+""+this.$el.find('input[name=lastname]').val()
			});
			if (this.user.isValid()){
				this.users.add(this.user);
				window.location.hash = "users/index";
			}
		},
		
		render: function() {
			this.$el.html(_.template($('#add').html(), this.user.toJSON()));
			return this;
		}
	});

	UserEditView = Backbone.View.extend({
		events: {
			"click button.save": "save"
		},
		
		initialize: function(options) {
			this.user = options.user;
		},
		
		save: function(event) {
			event.stopPropagation();
			event.preventDefault();
			
			this.user.set({
				firstname: this.$el.find('input[name=firstname]').val(),
				lastname: this.$el.find('input[name=lastname]').val(),
				email: this.$el.find('input[name=email]').val()
			});
			window.location.hash = "users/index";
		},
		
		render: function() {
			this.$el.html(_.template($('#add').html(), this.user.toJSON()));
			return this;
		}
	});
})(jQuery);