(function() {
  'use strict';

  angular.module('photoblogApp')
    .controller('ArticleController', ArticleController)
    .controller('ViewArticleController', ViewArticleController)

  //.controller('ArticleController', ArticleListController)
  //.controller('ArticleController', NewArticleController)
  //.controller('ArticleController', EditArticleController);

  ViewArticleController.$inject = ['Article', '$stateParams', '$location'];

  function ViewArticleController(Article, $stateParams, $location) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.date = '';


    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        var date = null;
        var options = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        };
        vm.article = data;
        date = new Date(vm.article.createdAt);
        vm.date = date.toLocaleTimeString("en-us", options);
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


    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        vm.article = data;
      });
    } else {
      Article.getList().then(function(data) {
        vm.articles = data;
        console.log('articles:' + JSON.stringify(vm.articles));
        vm.gridOptions = {
          enableSorting: true,
          columnDefs: vm.columns,
          data: vm.articles
        };
      });
    }



    vm.articleFields = [{
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


    vm.create = function() {
        // Create new Article object
        var article = new Article(vm.article);

        // Redirect after save
        article.$save(function(response) {
          $log.debug('Article created');
          $location.path('article/' + response.id);
        }, function(errorResponse) {
          vm.error = errorResponse.data.summary;
        });
      }
      // Remove existing Article
    vm.remove = function(id) {
      article = Article.get(id);
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
