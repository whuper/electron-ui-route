(function () {
  'use strict'

  function MaterialController ($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast) {
    /**
     *
     */
    var dialog;
    this.events = []
    var colors = [{
          value: 'red',
          text: 'Red'
          }, {
          value: 'green',
          text: 'Green'
          }, {
          value: 'blue',
          text: 'Blue'
          }];
    /**
     * initialize function - description
     *
     * @return {Promise}  description
     */

    this.initialize = function () {
      console.log('WordsController initialize');
      $scope.employee =  'obama';
        $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;
  $scope.imagePath = './assets/washedout.png';

         
    }
    this.showAlert = function () {
     dialog = $mdDialog.alert({
        title: 'Attention',
        textContent: 'This is an example of how easy dialogs can be!',
        ok: 'Close'
      });

    $mdDialog
        .show( dialog )
   /*     .finally(function() {
          dialog = undefined;
        });*/
    }

   this.closeAlert = function () {
      $mdDialog.hide( dialog, "finished" );
      dialog = undefined;
    }
  this.showCustomGreeting = function () {

       $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,        // use parent scope in template
          preserveScope: true,  // do not forget this if use parent scope

          // Since GreetingController is instantiated with ControllerAs syntax
          // AND we are passing the parent '$scope' to the dialog, we MUST
          // use 'vm.<xxx>' in the template markup

          template: '<md-dialog>' +
                    '  <md-dialog-content>' +
                    '     Hi There {{employee}}' +
                    '  </md-dialog-content>' +
                      '  <md-dialog-actions>' +
                      '    <md-button ng-click="closeDialog()" class="md-primary">' +
                      '      Close Greeting!!' +
                      '    </md-button>' +
                      '  </md-dialog-actions>' +
                    '</md-dialog>',

          controller: function DialogController($scope, $mdDialog) {
            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
          }
       });
    }

    
    this.toggleSidenav = (evt,menuId) => {
            console.log('mdSidenav',menuId);
        $mdSidenav(menuId).toggle();   

      };

    this.showBottomSheet = function() {
     $mdBottomSheet.show({
     templateUrl: 'modules/material/sheet.html',
      controller: [ '$mdBottomSheet', UserSheetController],
      controllerAs: "$sheetCtrl",
      bindToController : true
      }).then(function(value) {
  $mdToast.show(
			  $mdToast.simple()
				.textContent(value)
				.position('top right')
				.hideDelay(3000)
			);
     }, function() {   
        //alert('Nothing');
		   $mdToast.show(
			  $mdToast.simple()
				.textContent('Nothing!')
				.position('top right')
				.hideDelay(3000)
			);
     });
      function UserSheetController() {           
            this.items = [
              { name: 'Phone'       , icon: 'phone'  },
              { name: 'Twitter'     , icon: 'twitter'},
              { name: 'Google+'     , icon: 'google_plus'},
              { name: 'Hangout'     , icon: 'hangouts'}
            ];
            this.performAction = (action) => {
              $mdBottomSheet.hide(action);
            };
          }
   };

  this.filterColor = function(query) {
   return colors.filter(function(color) { 
     return color.text.indexOf(query) === 0;
   });
 }; 

// showListBottomSheet 
this.showListBottomSheet = function() {
   $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'modules/material/views/sheetList.html',
      controller: [ '$mdBottomSheet', ListBottomSheetCtrl],
      controllerAs: "$sheetCtrl"
      // bindToController : true
    }).then(function(clickedItem) {
      $scope.alert = clickedItem['name'] + ' clicked!';
    }).catch(function(error) {
      // User clicked outside or hit escape
    });

    function ListBottomSheetCtrl($scope) {
      this.items = [
        { name: 'Share', icon: 'share-arrow' },
        { name: 'Upload', icon: 'upload' },
        { name: 'Copy', icon: 'copy' },
        { name: 'Print this page', icon: 'print' },
      ];
     this.listItemClick = function($index) {
        var clickedItem = this.items[$index];
        // $scope.alert = this.items[$index].name;
        $mdBottomSheet.hide(clickedItem);
      };
      };


}
// showGridBottomSheet 
  this.showGridBottomSheet = function() {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'modules/material/views/sheetGrid.html',
      controller: ['$mdBottomSheet',GridBottomSheetCtrl],
      controllerAs: "$sheetCtrl",
      clickOutsideToClose: false
    }).then(function(clickedItem) {
      $mdToast.show(
            $mdToast.simple()
              .textContent(clickedItem['name'] + ' clicked!')
              .position('top right')
              .hideDelay(1500)
          );
    }).catch(function(error) {
      // User clicked outside or hit escape
    });

    function GridBottomSheetCtrl() {
        this.items = [
          { name: 'Hangout', icon: 'hangout' },
          { name: 'Mail', icon: 'mail' },
          { name: 'Message', icon: 'message' },
          { name: 'Copy', icon: 'copy2' },
          { name: 'Facebook', icon: 'facebook' },
          { name: 'Twitter', icon: 'twitter' },
        ];

        this.listItemClick = function($index) {
          var clickedItem = this.items[$index];
          $mdBottomSheet.hide(clickedItem);
        };
      }
  };



  // function end

  }
  module.exports = MaterialController
})()
