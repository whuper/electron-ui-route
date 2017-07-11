(function () {
  'use strict'

  function MaterialDireDemo2Controller($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast,$timeout,$log,$interval) {
    
    
    
	this.noCache = true;

   

    this.initialize = function () {
      $scope.employee = 'obama';  
      $scope.imagePath = './assets/washedout.png';
	  var imagePath = 'assets/60.jpeg';

//switch
  $scope.data = {
    cb1: true,
    cb4: true,
    cb5: false
  };


  $scope.message = 'false';

  $scope.onChange = function(cbState) {
  	$scope.message = cbState;
  };
  //toast


$scope.showSimpleToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Simple Toast!')
        .position('top right')
		.hideDelay(3000)
    );
	 
  };

	//init end
	}

   

    // function end
  }
  module.exports = MaterialDireDemo2Controller
})()
