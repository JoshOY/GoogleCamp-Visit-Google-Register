/**
 * Created by joshoy on 15/9/22.
 */

'use strict';

var HOST_URL = '127.0.0.1:8080';

angular.module('myApp.registerView', ['ngRoute', 'ngMaterial'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'registerView/registerView.html',
            controller: 'RegisterController'
        });
    }])
    .controller('RegisterController', registerControllerFunc);

function registerControllerFunc($scope, $mdSidenav, $window, $resource, SweetAlert) {
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.gradeList = [2012, 2013, 2014, 2015];
    $scope.trueFalselist = [true, false];

    $scope.gradeMap = {
        0: '请填写',
        2012: '2012级',
        2013: '2013级',
        2014: '2014级',
        2015: '2015级'
    };

    $scope.trueFalseMap = {
        true: '是',
        false: '否'
    };

    $scope.userForm = {
        'name': '',
        'studentId': '',
        'grade': 0,
        'phone': '',
        'attendAndroidSummer': null,
        'attendAndroidSunday': null
    };

    $scope.invalidForm = {
        nameError:                false,
        studentIdError:           false,
        gradeError:               false,
        phoneError:               false,
        attendAndroidSummerError: false,
        attendAndroidSundayError: false
    };

    $window.g = function() {
        console.log($scope.userForm);
    };

    $scope.submitForm = function() {
        $scope.examingForm();
        if ($scope.invalidForm.nameError ||
            $scope.invalidForm.studentIdError ||
            $scope.invalidForm.gradeError ||
            $scope.invalidForm.phoneError ||
            $scope.invalidForm.attendAndroidSummerError ||
            $scope.invalidForm.attendAndroidSundayError) {
            return null;
        }
        var res = $resource(HOST_URL,
            {
                'name': '@name',
                'studentId': '@studentId',
                'grade': '@grade',
                'phone': '@phone',
                'attendAndroidSummer': '@attendAndroidSummer',
                'attendAndroidSunday': '@attendAndroidSunday'
            },
            {
                'submit': {
                    method: 'POST'
                }
            });

        res.submit(
            {
                'name': $scope.userForm.name,
                'studentId': $scope.userForm.studentId,
                'grade': parseInt($scope.userForm.grade),
                'phone': $scope.userForm.phone,
                'attendAndroidSummer': ($scope.userForm.attendAndroidSummer.toString() === 'true'),
                'attendAndroidSunday': ($scope.userForm.attendAndroidSunday.toString() === 'true')
            },
            function success(data) {
                SweetAlert.swal("报名成功", "如果您被邀请, 我们会以短信的方式通知您, 敬请期待!", "success");
            },
            function error() {
                SweetAlert.swal("哎呀, 出错了", "网络似乎不太顺畅, 换个地方试试?", "warning");
            });


    };

    $scope.examingForm = function() {
        $scope.invalidForm = {
            nameError:                false,
            studentIdError:           false,
            gradeError:               false,
            phoneError:               false,
            attendAndroidSummerError: false,
            attendAndroidSundayError: false
        };
        if (!$scope.userForm.name) {
            $scope.invalidForm.nameError = true;
        }
        var idReg = /1[2345]([\d]{5})/;
        if ((!$scope.userForm.studentId)
            || ($scope.userForm.studentId.length !== 7)
            || (!idReg.test($scope.userForm.studentId))) {
            $scope.invalidForm.studentIdError = true;
        }
        if (!$scope.userForm.grade) {
            $scope.invalidForm.gradeError = true;
        }
        var phoneReg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
        if ((!$scope.userForm.phone)
            || ($scope.userForm.phone.length !== 11)
            || (!phoneReg.exec($scope.userForm.phone))
        ) {
            $scope.invalidForm.phoneError = true;
        }
        if (!$scope.userForm.attendAndroidSummer) {
            $scope.invalidForm.attendAndroidSummerError = true;
        }
        if (!$scope.userForm.attendAndroidSunday) {
            $scope.invalidForm.attendAndroidSundayError = true;
        }
    };
}