
//angular.module("basicAapp", []).controller("PeopleController", PeopleControllerFunction);
// DECLARE v IMPLEMENT controller myModule.controller("PeopleController", function ($scope) {

var myModule = angular.module("basicApp", []);

myModule.controller("PeopleController", PeopleControllerImpl); 
myModule.controller("DebugController", DebugControllerImpl); 

 function PeopleControllerImpl($scope) {
      $scope.people = [
        {name: "Avalon Beltran", phone: "7/18/2008", city: "Niwot"},
        {name: "Susanna Beltran", phone: "7/18/2008", city: "Niwot"},
        {name: "Noah Beltran", phone: "7/18/2008", city: "Niwot"},
        {name: "Basil Beltran", phone: "7/18/2008", city: "Niwot"}
      ];

        $scope.ShowForm=function(){
            $scope.formVisibility=true;
        };

        $scope.AddElem=function(){
            $scope.formVisibility=false;
            $scope.people.push(
                {
                    name:$scope.newPerson.name,
                    phone:$scope.newPerson.phone,
                    city:$scope.newPerson.city
                });
            console.log($scope.formVisibility);
        };

        $scope.RemoveElem=function(idx){
              $scope.people.splice(idx, 1);
        };
};

 function DebugControllerImpl($scope) {

        $scope.ShowDebug=function(){
            $scope.debugVisibility=true;
            $scope.thing="sdfs";
        };
};