angular.module('app.controllers', [])
.controller('closetCtrl', ['$scope', '$stateParams','$cordovaCamera','$ionicLoading','$ionicModal',
	function ($scope, $stateParams,$cordovaCamera,$ionicLoading,$ionicModal) {
		$scope.items = [];
		$scope.resgataFotos = function($opcao) {
			var options = {
				quality: 40 ,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType[$opcao],
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};


			$cordovaCamera.getPicture(options).then(function(imageData) {
		// BD DO FIRE SALVAR O CLOSET
		$scope.salvaFireBD(imageData);
	});
		}
		$scope.salvaFireBD = function (image) {
			var user = firebase.auth().currentUser;
			firebase.database().ref('usuarios/' + user.uid + '/closet/').push(image);
		}

		$scope.recuperaDados = function() {
			var user = firebase.auth().currentUser.uid;
			var bd = firebase.database().ref('usuarios/' + user + '/closet/');
			$ionicLoading.show({
				content: 'Carregando'
			});
			bd.once('value', function(snapshot) {	
				snapshot.forEach(function(userSnapshot) {
					var chave = userSnapshot.key;
					dado =  "data:image/png;base64, " + userSnapshot.val();
					$scope.items.push({src: dado, chave:chave});
				})	
				$scope.bdOn();
			});
		}
		$scope.bdOn = function () {
			var vetor = [];
			var user = firebase.auth().currentUser.uid;
			var bd = firebase.database().ref('usuarios/' + user + '/closet/');
			bd.on('child_added', function(snapshot) {
				dado =  "data:image/png;base64, " + snapshot.val();
				var chave = snapshot.key;
				console.log(chave);
				vetor.push({src: dado, chave: chave});
				$scope.items=[];
				$scope.items=vetor;

			});
			$ionicLoading.hide();	
		}
		$scope.deletaFoto = function (chave) {
			console.log("Vai remover o Dado:" + chave);
			var user = firebase.auth().currentUser.uid;
			var bd = firebase.database().ref('usuarios/' + user + '/closet/'+ chave);
			bd.remove();
			$scope.bdOn();
		}

//MODAL///
$ionicModal.fromTemplateUrl('image-modal.html', {
	scope: $scope,
	animation: 'slide-in-up'
}).then(function(modal) {
	$scope.modal = modal;
});

$scope.openModal = function() {
	$scope.modal.show();
};

$scope.closeModal = function() {
	$scope.modal.hide();
};

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
    	$scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
  });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
  });
    $scope.$on('modal.shown', function() {
    	console.log('Modal is shown!');
    });
    $scope.imageSrc;
    $scope.mostraFoto = function (dado) {
  	// body...
  	$scope.imageSrc = dado;
  	$scope.openModal();
  }
///FIM DO MODAL///

}])//CLOSETCTRL

.controller('lojasCtrl', ['$scope', '$stateParams','$ionicLoading','$rootScope','$ionicModal','$compile','$cordovaGeolocation',
	function ($scope, $stateParams,$ionicLoading,$rootScope,$ionicModal,$compile,$cordovaGeolocation) {
//$rootScope.valorP=[];
$scope.lojas =[];
var map;
/////<<----Funções---->/////
$scope.salvaLojaBD = function (image) {
	var user = firebase.auth().currentUser;
}
$scope.recuperaLoja = function() {
	$scope.salvaLojaBD();
	var user = firebase.auth().currentUser.uid;
	var bd = firebase.database().ref('lojas/');
	$ionicLoading.show();
	bd.once('value', function(snapshot) {	
		snapshot.forEach(function(userSnapshot) {
			var a = userSnapshot.val();
			$scope.lojas.push({titulo: a.nome, tipo: a.tipo, contato: a.contato, endereco: a.endereco, cidade: a.cidade});
		})	
		console.log($scope.lojas);
		$scope.bdOn();
	});
}
$scope.bdOn = function () {
	var vetor = [];
	var user = firebase.auth().currentUser.uid;
	var bd = firebase.database().ref('lojas/');
	bd.on('child_added', function(snapshot) {
		var a = snapshot.val();
		vetor.push({titulo: a.nome, tipo: a.tipo, contato: a.contato, endereco: a.endereco, cidade: a.cidade});	
		$scope.lojas=[];
		$scope.lojas=vetor;
	});
	$ionicLoading.hide();	
}
$scope.valor = function(item) {
	$rootScope.valorP = item;
	console.log($rootScope.valorP.titulo);

	window.location.href = "#/detalhes";
}
$scope.openMap = function (end,cid) {
	$rootScope.enderecoLoja = end +" "+cid;
	console.log($rootScope.enderecoLoja);
		window.location.href = "#/mapa";
	}
	/////////////Map
	$scope.showMap = function (){
		var myLocation;
		var lat,long;
		var directionsDisplay;
		var directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();


		var mapOptions = {
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP

		};

		map = new google.maps.Map(document.getElementById("map"),mapOptions);
		directionsDisplay.setMap(map);
		console.log(map);
		navigator.geolocation.getCurrentPosition(function(pos) {
			map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
			var start =  new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			var end = $rootScope.enderecoLoja;
			var request = {
				origin: start,
				destination: end,
				travelMode: 'DRIVING'
			};
			directionsService.route(request, function(result, status) {
				if (status == 'OK') {
					directionsDisplay.setDirections(result);
				}
				var a = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				console.log(a);
			});
		});
    }
}])//closeLojaCtrl

.controller('loginCtrl', ['$scope', '$stateParams', 
	function ($scope, $stateParams) {

		$scope.login = function(email,senha) {

			firebase.auth().signInWithEmailAndPassword(email, senha).then(
				function (result) {
					console.log("Login OK!");
					window.location.href = "#/page1/closet";

				},function(error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					alert(errorMessage);
					console.log("Erro no login!")
				});
		}
}])//FechaControllerLOGIN

.controller('cadastroCtrl', ['$scope', '$stateParams',
	function ($scope, $stateParams) {
		$scope.cadastro = function (nome,email,senha) {

			firebase.auth().createUserWithEmailAndPassword(email, senha).then(
				function (result) {
					console.log("Usuario Criado");
					var user = firebase.auth().currentUser;

					user.updateProfile({
						displayName: nome,
					})
					window.location.href = "#/page1/closet";
				},function(error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					alert(errorMessage);
				});
		}
	}])

.controller('detalhesCtrl', ['$scope', '$stateParams','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$rootScope) {


}])
