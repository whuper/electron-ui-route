(function () {
  'use strict'

  function MaterialDireDemoController($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast,$timeout,$log,$interval) {
    
    
    
	this.noCache = true;
	this.simulateQuery = true;
	this.states = loadAll();
	//Chips	
	this.readonly = false;

    // Lists of fruit names and Vegetable objects
    this.fruitNames = ['Apple', 'Banana', 'Orange'];
    this.roFruitNames = angular.copy(this.fruitNames);
    this.editableFruitNames = angular.copy(this.fruitNames);

    this.tags = [];
    this.vegObjs = [
      {
        'name' : 'Broccoli',
        'type' : 'Brassica'
      },
      {
        'name' : 'Cabbage',
        'type' : 'Brassica'
      },
      {
        'name' : 'Carrot',
        'type' : 'Umbelliferous'
      }
    ];
	//datepicker
	this.myDate = new Date();
	this.isOpen = false;
	
	//FAB Speed Dial

	this.topDirections = ['left', 'up'];
      this.bottomDirections = ['down', 'right'];

      this.isDialOpen = false;

      this.availableModes = ['md-fling', 'md-scale'];
      this.selectedMode = 'md-scale';

      this.availableDirections = ['up', 'down', 'left', 'right'];
      this.selectedDirection = 'up';
	
 
	  //Progress Circular
	this.activated = true;

	//radio
	  $scope.data = {
      group1 : 'Banana',
      group2 : '2',
      group3 : 'avatar-1'
    };

   

    this.radioData = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: '3', isDisabled: true },
      { label: '4', value: '4' }
    ];
	//select
    this.submit = function() {
      alert('submit');
    };

    this.addItem = function() {
      var r = Math.ceil(Math.random() * 1000);
      $scope.radioData.push({ label: r, value: r });
    };

    this.removeItem = function() {
      $scope.radioData.pop();
    };


	this.userState = '';
    this.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });

   



    this.initialize = function () {
      $scope.employee = 'obama';  
      $scope.imagePath = './assets/washedout.png';
	  //checkbox
	  $scope.data = {};
	  $scope.data.cb1 = true;
	  $scope.data.cb2 = false;
	  $scope.data.cb3 = false;
	  $scope.data.cb4 = false;
	  $scope.data.cb5 = false;
		//checkbox select all
	  $scope.items = [1,2,3,4,5];
	  $scope.selected = [1];
	  $scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) {
		  list.splice(idx, 1);
		}
		else {
		  list.push(item);
		}
	  };

	  $scope.exists = function (item, list) {
		return list.indexOf(item) > -1;
	  };

	  $scope.isIndeterminate = function() {
		return ($scope.selected.length !== 0 &&
			$scope.selected.length !== $scope.items.length);
	  };

	  $scope.isChecked = function() {
		return $scope.selected.length === $scope.items.length;
	  };

	  $scope.toggleAll = function() {
		if ($scope.selected.length === $scope.items.length) {
		  $scope.selected = [];
		} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
		  $scope.selected = $scope.items.slice(0);
		}
	  
		}
	  //dialogs
	   $scope.status = '  ';
  $scope.customFullscreen = false;

  $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };

  $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };

  $scope.showPrompt = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
      .title('What would you name your dog?')
      .textContent('Bowser is a common name.')
      .placeholder('Dog name')
      .ariaLabel('Dog name')
      .initialValue('Buddy')
      .targetEvent(ev)
      .ok('Okay!')
      .cancel('I\'m a cat person');

    $mdDialog.show(confirm).then(function(result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };

  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'modules/materialDireDemo/views/dialog1.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.showTabDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'modules/materialDireDemo/views/tabDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
  };

  $scope.showPrerenderedDialog = function(ev) {
    $mdDialog.show({
      contentElement: '#myDialog',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };

	  function DialogController($scope, $mdDialog) {
		$scope.hide = function() {
		  $mdDialog.hide();
		};

		$scope.cancel = function() {
		  $mdDialog.cancel();
		};

		$scope.answer = function(answer) {
		  $mdDialog.hide(answer);
		};
	  }
	  //divider && list
	var imagePath = 'assets/60.jpeg';
    $scope.messages = [{
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }];

//FAB Toolbar

	     $scope.isToolbarOpen = false;

      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedDirection: 'left'
      };
//icon
	   var iconData = [
            {name: 'accessibility'  , color: "#777" },
            {name: 'question_answer', color: "rgb(89, 226, 168)" },
            {name: 'backup'         , color: "#A00" },
            {name: 'email'          , color: "#00A" }
          ];

      $scope.fonts = [].concat(iconData);

      // Create a set of sizes...
      $scope.sizes = [
        {size:"md-18",padding:0},
        {size:"md-24",padding:2},
        {size:"md-36",padding:6},
        {size:"md-48",padding:10}
      ];
	  //input
 $scope.user = {
      title: 'Developer',
      email: 'ipsum@lorem.com',
      firstName: '',
      lastName: '',
      company: 'Google',
      address: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
      postalCode: '94043'
    };

    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });
//input-icon
	   $scope.user2 = {
      name: 'John Doe',
      email: '',
      phone: '',
      address: 'Mountain View, CA',
      donation: 19.99
    };
//input-error
//是否显示错误提示
$scope.showHints = true;

$scope.project = {
    description: 'Nuclear Missile Defense System',
    rate: 500,
    special: true
  };

//list
    var imagePath = 'assets/60.jpeg';

    $scope.phones = [
      {
        type: 'Home',
        number: '(555) 251-1234',
        options: {
          icon: 'phone'
        }
      },
      {
        type: 'Cell',
        number: '(555) 786-9841',
        options: {
          icon: 'phone',
          avatarIcon: true
        }
      },
      {
        type: 'Office',
        number: '(555) 314-1592',
        options: {
          face : imagePath
        }
      },
      {
        type: 'Offset',
        number: '(555) 192-2010',
        options: {
          offset: true,
          actionIcon: 'phone'
        }
      }
    ];
    $scope.todos = [
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];
	//List controls
	  $scope.toppings = [
    { name: 'Pepperoni', wanted: true },
    { name: 'Sausage', wanted: false },
    { name: 'Black Olives', wanted: true },
    { name: 'Green Peppers', wanted: false }
  ];

  $scope.settings = [
    { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'wifi', enabled: true },
    { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'bluetooth', enabled: false },
  ];

  $scope.messages = [
    {id: 1, title: "Message A", selected: false},
    {id: 2, title: "Message B", selected: true},
    {id: 3, title: "Message C", selected: true},
  ];

  $scope.people = [
    { name: 'Janet Perkins', img: 'assets/100-0.jpeg', newMessage: true },
    { name: 'Mary Johnson', img: 'assets/100-2.jpeg', newMessage: false },
    { name: 'Peter Carlsson', img: 'assets/100-0.jpeg', newMessage: false }
  ];

  $scope.goToPerson = function(person, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('Inspect ' + person)
        .ariaLabel('Person inspect demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };

  $scope.navigateTo = function(to, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('Imagine being taken to ' + to)
        .ariaLabel('Navigation demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };

  $scope.doPrimaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Primary Action')
        .textContent('Primary actions can be used for one click actions')
        .ariaLabel('Primary click demo')
        .ok('Awesome!')
        .targetEvent(event)
    );
  };

  $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .textContent('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };

     $scope.determinateValue = 30;

      // Iterate every 100ms, non-stop and increment
      // the Determinate loader.
      $interval(function() {

        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 200);

	  
	//silde
  $scope.color = {
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255)
  };

  $scope.vol = Math.floor(Math.random() * 100);
  $scope.bass = Math.floor(Math.random() * 100);
  $scope.master = Math.floor(Math.random() * 100);
	


	//init end
	}

    this.newState = function(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
     this.querySearch = function(query) {
      var results = query ? this.states.filter( this.createFilterFor(query) ) : this.states,
          deferred;
      if (this.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { 
			deferred.resolve( results );
			console.log('results',results);
		}, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    this.searchTextChange = function(text) {
      $log.info('Text changed to ' + text);
    }

    this.selectedItemChange = function(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
   function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
     this.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
    
    this.showAlert = function () {
      dialog = $mdDialog.alert({
        title: 'Attention',
        textContent: 'This is an example of how easy dialogs can be!',
        ok: 'Close'
      });

      $mdDialog.show(dialog)
      /*     .finally(function() {
             dialog = undefined;
           });*/
    }

    this.closeAlert = function () {
      $mdDialog.hide(dialog, "finished");
      dialog = undefined;
    }

    // function end
  }
  module.exports = MaterialDireDemoController
})()
