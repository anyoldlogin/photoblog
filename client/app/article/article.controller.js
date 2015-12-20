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

  var setVisible = function(article) {
    article.isHidden = false;
    article.save(); //post(article);

  }

  var setHidden = function(article) {
    article.isHidden = true;
    article.save(); //post(article);

  }

  // Remove existing Article
  var remove = function(index, id) {
    var article = {};

    Article.one(id).get().then(function(data) {
      article = data;
      vm.articles.splice(index, 1);
      article.remove();
    });
  }

  var editArticle = function(id) {
    $location.path('article/' + id + '/view');
  }


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

  NewArticleController.$inject = ['Article', '$location', '$log', 'Auth', 'Upload'];

  function NewArticleController(Article, $location, $log, Auth, Upload) {
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

  EditArticleController.$inject = ['Article', '$stateParams', '$location', 'Auth', 'Upload', '$timeout', 'uuid'];

  function EditArticleController(Article, $stateParams, $location, Auth, Upload, $timeout, uuid) {
    console.log('In EditArticleController');
    var vm = this;

    vm.isEdit = true;
    vm.isAdmin = Auth.isAdmin;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.date = {};
    vm.articleFields = articleFields;
    vm.files = [];
    vm.progress = 0;
    vm.total = 0;
    vm.errorMag = '';
    vm.result = '';


    vm.pattern = '.tif, .tiff, .gif, .jpeg, jpg, .jif, .jfif, .png';
    vm.task = function update() {
      vm.article.put().then(function() {
        $location.path('/article/' + vm.article._id);
      });
    };

    vm.uploadFiles = function(files) {
      var id = 0;
      if(vm.article) {
        id = vm.article.uuid || uuid.generate();
      }
      else {
        id = uuid.generate();
      }
      console.log('uuid: ' + id);
      vm.files = files;
      console.log('files:  ' + JSON.stringify(vm.files));
      if (files && files.length) {
        Upload.upload({
          url: '/api/photos',
          data: {
            files: vm.files,
            uuid: id
          }
        }).then(function(response) {
          $timeout(function() {
            vm.result = response.data;
            console.log('data:  ' + JSON.stringify(vm.result));
          });
        }, function(response) {
          if (response.status > 0) {
            vm.errorMsg = response.status + ': ' + response.data;
          }
        }, function(evt) {
          console.log('progress: ' + evt.loaded / evt.total);
          vm.total = evt.total;
          vm.progress =
            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    };
    // upload on file select or drop
    vm.upload = function(file) {
      Upload.upload({
        url: '/client/upload/',
        data: {
          file: file,
          'username': $scope.username
        }
      }).then(function(resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, function(resp) {
        console.log('Error status: ' + resp.status);
      }, function(evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };


    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        var date = null;

        vm.article = data;
        console.log("article:" + JSON.stringify(vm.article));
        date = new Date(vm.article.createdAt);
        console.log("date:" + JSON.stringify(date));
        vm.date = formatDate(date);
      });
    }

    // // for multiple files:
    // vm.uploadFiles = function (files) {
    //   if (files && files.length) {
    //     for (var i = 0; i < files.length; i++) {
    //       ;//Upload.upload({..., data: {file: files[i]}, ...})...;
    //     }
    //     // or send them all together for HTML5 browsers:
    //     //Upload.upload({..., data: {file: files}, ...})...;
    //   }
    // }

  }

  ViewArticleController.$inject = ['Article', '$stateParams', '$location', 'Auth'];

  function ViewArticleController(Article, $stateParams, $location, Auth) {
    console.log('In ViewArticleController');
    var vm = this;
    vm.isEdit = false;
    vm.id = $stateParams.id;
    vm.article = {};
    vm.date = '';
    vm.isAdmin = Auth.isAdmin();
    vm.myInterval = 5000;
    vm.noWrapSlides = false;
    vm.slides = [{
      image: 'http://lorempixel.com/1000/1000',
      text: 'Picture 1'
    }, {
      image: 'http://lorempixel.com/1000/1000',
      text: 'Picture 2'
    }, {
      image: 'http://lorempixel.com/1000/1000',
      text: 'Picture 3'
    }, {
      image: 'http://lorempixel.com/1000/1000',
      text: 'Picture 4'
    }, {
      image: 'http://lorempixel.com/1000/1000',
      text: 'Picture 5'
    }, {
      image: 'http://lorempixel.com/1000/1000',
      text: 'Picture 6'
    }];
    vm.setVisible = setVisible;
    vm.setHidden = setHidden;
    vm.remove = remove;
    vm.editArticle = editArticle;

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
    vm.setVisible = setVisible;
    vm.setHidden = setHidden;
    vm.remove = remove;
    vm.editArticle = editArticle;

    if (vm.id !== undefined) {
      Article.one(vm.id).get().then(function(data) {
        vm.article = data;
      });
    } else {
      Article.getList({
        'isHidden': true
      }).then(function(data) {
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
  }



})();
