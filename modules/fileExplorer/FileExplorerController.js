(function () {
  'use strict'

  function FileExplorerController($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast,$timeout,$log,$interval) {
    

    this.initialize = function () {
      $scope.employee = 'obama';  
      $scope.imagePath = './assets/washedout.png';
	  var imagePath = 'assets/60.jpeg';

	  console.log('###FileExplorerController');

	  var walk = require('walk')

		var root = path.join(__dirname)
		var files = [],dirs = [];

		getFileList(path.join(root))


	//init end
	}

   

    // function end
	
	function getFileList(path){
	var walker  = walk.walk(path, { followLinks: false });
 
	walker.on('file', function(roots, stat, next) {
	    files.push(roots + '/' + stat.name);
	    next();
	});
 
	walker.on('directory', function(roots, stat, next) {
	    dirs.push(roots + '/' + stat.name);
	    next();
	});
	walker.on('end', function() {
	    console.log("files "+files);
		console.log("dirs "+dirs);
	});
}
  }
  module.exports = FileExplorerController
})()
