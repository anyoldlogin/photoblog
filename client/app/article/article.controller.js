(function() {
  'use strict';

  angular.module('photoblogApp')
    .controller('ArticleController', ArticleController)
    .controller('ViewArticleController', ViewArticleController)
    .controller('NewArticleController', NewArticleController)
    .controller('EditArticleController', EditArticleController);

  //.controller('ArticleController', ArticleListController)
  //.controller('ArticleController', NewArticleController)
  //.controller('ArticleController', EditArticleController);
  var articleFields = [{
    key: 'title',
    type: 'input',
    templateOptions: {
      type: 'text',
      label: 'Title',
      placeHolder: 'Enter the title of the article',
      required: true
    }
  }, {
    key: 'summary',
    type: 'input',
    templateOptions: {
      type: 'text',
      label: 'Summary',
      placeHolder: 'Enter a synopsis of the article',
      required: true
    }
  }, {
    key: 'content',
    type: 'textarea',
    templateOptions: {
      type: 'text',
      label: 'Summary',
      placeHolder: 'Enter a synopsis of the article',
      required: true
    }
  }];



  function formatDate(date) {
    var vm = this;

    var formatedDate = {};
    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    formatedDate = date.toLocaleTimeString('en-us', options);
    return formatedDate;
  }

  NewArticleController.$inject = ['Article',  '$location', '$log', 'Auth'];

  function NewArticleController(Article,  $location, $log, Auth) {
      console.log('In NewArticleController');
    var vm = this;
    vm.article = {};
    vm.articleFields = articleFields;
    vm.author = Auth.getCurrentUser();
    console.log("Author: " + JSON.stringify(vm.author));
    vm.article.author = vm.author._id;

    vm.task = function create() {
        Article.post(vm.article).then(function(article) {
          console.log("Article: " + JSON.stringify(article));
          $location.path('/article/' + article._id);
        });

    }
  }

  EditArticleController.$inject = ['Article', '$stateParams', '$location', 'Auth'];

  function EditArticleController(Article, $stateParams, $location, Auth) {
      console.log('In EditArticleController');
    var vm = this;

    vm.isEdit = true;
    vm.isAdmin = Auth.isAdmin;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.date = {};
    vm.articleFields = articleFields;


    vm.task = function update() {
      vm.article.put().then(function() {
        $location.path('/article/' + vm.article._id);
      });
    };

    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        var date = null;

        vm.article = data;

        date = new Date(vm.article.createdAt);
        console.log("date:" + JSON.stringify(date));
        vm.date = formatDate(date);
      });
    }

  }

  ViewArticleController.$inject = ['Article', '$stateParams', '$location', 'Auth'];

  function ViewArticleController(Article, $stateParams, $location, Auth) {
    console.log('In ViewArticleController');
    var vm = this;
    vm.isEdit = false;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.date = '';
    vm.isAdmin = true; //Auth.isAdmin();

    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        var d = {};
        vm.article = data;
        d = new Date(vm.article.createdAt);
        console.log('Date:' + d);
        vm.date = formatDate(d);
      });
    }
  }

  ArticleController.$inject = ['Article', '$stateParams', '$location', '$log']

  function ArticleController(Article, $stateParams, $location, $log) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.error = null;
    vm.articles = [];
    vm.articleFields = articleFields;
    vm.pageSize = 5;

    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        vm.article = data;
      });
    } else {
      Article.getList().then(function(data) {
        vm.articles = data;
        vm.gridOptions = {
          enableSorting: true,
          columnDefs: vm.columns,
          data: vm.articles
        };
      });
    }






    vm.create = function() {
        // Create new Article object
        var article = new Article(vm.article);

        // Redirect after save
        article.$save(function(response) {
          $location.path('article/' + response.id);
        }, function(errorResponse) {
          vm.error = errorResponse.data.summary;
        });
      }
      // Remove existing Article
    vm.remove = function(index, id) {
      var article = {};

      Article.one(id).get().then(function(data) {
        article = data;
        vm.articles.splice(index, 1);
        article.remove();
      });

    }

    // Update existing Article
    vm.update = function() {
      var article = vm.article;

      article.$update(function() {
        //$log.debug('Article updated');
        $location.path('article/' + article.id);
      }, function(errorResponse) {
        vm.error = errorResponse.data.summary;
      });
    };

    vm.toViewArticle = function() {
      vm.article = Article.get({
        articleId: $stateParams.articleId
      });
      vm.setFormFields(true);
    };

    vm.toEditArticle = function(id) {
      console.log('edit clicked');
      $location.path('article/' + id + '/view');
    };



    // create new Article


  }



})();
