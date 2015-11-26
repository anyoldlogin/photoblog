(function() {
  'use strict';

  angular.module('photoblogApp')
    .controller('ArticleController', ArticleController)
    .controller('ViewArticleController', ViewArticleController);
  //.controller('ArticleController', ArticleListController)
  //.controller('ArticleController', NewArticleController)
  //.controller('ArticleController', EditArticleController);

  ViewArticleController.$inject = ['Article','$stateParams'];

  function ViewArticleController(Article, $stateParams) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.article = {};

    if (vm.id !== undefined) {
      Article.get({
        id: vm.id
      }, function(data) {
        vm.article = data;
        console.log("Found article: " + vm.article);
        console.log("Found article: " + JSON.stringify(data));
      });
    }
  }

  ArticleController.$inject = ['Article', '$stateParams', '$location', '$log']

  function ArticleController(Article, $stateParams, $location, $log, action) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.error = null;
    vm.articles = [];


    console.log("id: " + vm.id);
    if (vm.id !== undefined) {
      Article.get({
        id: vm.id
      }, function(data) {
        vm.article = data;
      });
    }
    else {
      vm.articles = Article.query();
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
      }

    ];


    // create new Article
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
    vm.remove = function(article) {

      if (article) {
        article = Article.get({
          id: article.id
        }, function() {
          article.$remove(function() {
            $log.debug('Article deleted');
            // vm.tableParams.reload();
          });
        });
      } else {
        vm.article.$remove(function() {
          $log.debug('Article deleted');
          $location.path('/article');
        });
      }

    };

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

    vm.toEditArticle = function() {
      vm.article = Article.get({
        articleId: $stateParams.articleId
      });
      vm.setFormFields(false);
    };

  }
})();
