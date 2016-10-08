
var mainApp = angular.module("mainApp", ['ngRoute','datatables','checklist-model','chart.js',"ngResource"]);
 mainApp.config(function($routeProvider) {
    $routeProvider
      .when('/pengelola', {
        templateUrl:"pengelola",
			  controller :"pengelola"
	}).when('/gedung', {
    templateUrl:"gedung",
    controller :"gedung"
}).when('/user', {
  templateUrl:"user",
  controller :"user"
}).when('/harga', {
  templateUrl:"harga",
  controller :"harga"
}).when('/transaksi', {
  templateUrl:"transaksi",
  controller :"transaksi"
}).when('/sewa', {
  templateUrl:"sewa",
  controller :"sewa"
}).when('/grafikpenjualan', {
  templateUrl:"grafikpenjualan.html",
  controller :"grafikpenjualan"

}).when('/jumlahuser', {
   templateUrl:"jumlahuser.html",
   controller :"jumlahuser"

 }).when('/asisten', {
     templateUrl:"asisten",
     controller :"asisten"

   }).when('/gedungadmin', {
        templateUrl:"gedungadmin",
        controller :"gedungadmin"
       })
       .when('/dataclient', {
            templateUrl:"dataclient",
            controller :"dataclient"
           });
 });


 mainApp.factory('socket', ['$rootScope', function($rootScope) {
   var socket = io.connect();

   return {
     on: function(eventName, callback){
       socket.on(eventName, callback);
     },
     emit: function(eventName, data) {
       socket.emit(eventName, data);
     }
   };
 }]);
mainApp.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;

                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);
		mainApp.service('fileUpload', ['$http', function ($http,$scope) {
    this.uploadFileToUrl = function(nama,notlp,alamat,jenis,email,gambar,uploadUrl){
        var fd = new FormData();
        fd.append('nama', nama);
        fd.append('notlp', notlp);
        fd.append('alamat', alamat);
        fd.append('jenis', jenis);
        fd.append('email',email)
        fd.append('gambar', gambar);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
			alert("data sukses diupload");
			$http.get("lihat_asisten").success(function(data){
		asisten = data;
			});

        })
        .error(function(){
				alert("data gagal di input");
        });

    }

}]);
mainApp.service('gedungUpload', ['$http', function ($http,$scope) {
this.uploadFileToUrl = function(nama,alamat,kota,deskripsi,status,gambar,pengelola,uploadUrl){
    var fd = new FormData();
    fd.append('nama', nama);
    fd.append('alamat', alamat);
    fd.append('kota', kota);
    fd.append('deskripsi', deskripsi);
    fd.append('status',status)
    fd.append('gambar', gambar);
    fd.append('pengelola', pengelola);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(data){
  alert("data sukses diupload");
  $http.get("lihat_gedung").success(function(data){
gedung = data;
  });

    })
    .error(function(){
    alert("data gagal di input");
    });

}

}]);
mainApp.service('gedunguploadedit', ['$http', function ($http,$scope) {
this.uploadFileToUrl = function(nama,alamat,kota,deskripsi,status,id,gambar,pengelola,uploadUrl){
    var fd = new FormData();
    fd.append('nama', nama);
    fd.append('alamat', alamat);
    fd.append('kota', kota);
    fd.append('deskripsi', deskripsi);
    fd.append('status',status);
    fd.append('id',id);
    fd.append('gambar', gambar);
    fd.append('pengelola', pengelola);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(data){
  alert("data sukses diupload");
  $http.get("lihat_gedung").success(function(data){
gedung = data;
  });

    })
    .error(function(){
    alert("data gagal di input");
    });

}

}]);
mainApp.service('fileicon', ['$http', function ($http,$scope) {
this.uploadFileToUrl = function(id,gambar,uploadUrl){
    var fd = new FormData();
    fd.append('id', id);
    fd.append('gambar', gambar);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(data){
  alert("data sukses diupload");
  $http.get("lihat_gambar_icon").success(function(data){
gambaricon = data;
  });

    })
    .error(function(){
    alert("data gagal di input");
    });

}

}]);
mainApp.service('fileGedung', ['$http', function ($http,$scope) {
this.uploadFileToUrl = function(id,gambar,uploadUrl){
    var fd = new FormData();
    fd.append('gambar', gambar);
    fd.append('id', id);
        $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(data){
  alert("data sukses diupload");
  $http.get("lihat_gambar").success(function(data){
    gambar1 = data;
  });

    })
    .error(function(){
    alert("data gagal di input");
    });

}

}]);
mainApp.service('fileEdit', ['$http', function ($http,$scope) {
this.uploadFileToUrl = function(nama,notlp,alamat,jenis,email,id,path,gambar,uploadUrl){
    var fd = new FormData();
    fd.append('nama', nama);
    fd.append('notlp', notlp);
    fd.append('alamat', alamat);
    fd.append('jenis', jenis);
    fd.append('email',email);
    fd.append('id',id);
    fd.append('path',path);
    fd.append('gambar', gambar);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(data){
  alert("data sukses ubah");
  $http.get("lihat_asisten").success(function(data){
asisten = data;
  });

    })
    .error(function(){
    alert("data gagal di ubah");
    });

}

}]);
mainApp.controller("pengelola",function($scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(5)
        .withOption('bLengthChange', false)
        .withOption('autoWidth', false)
        .withOption('scrollX', false);
        $scope.getdata = function(){
        $http.get("lihat_pengelola").success(function(data){
          $scope.pengelola= data;
        });
    }
  $scope.getdata();
  $scope.tambah=function(){
    var nama = $scope.nama;
    var alamat = $scope.alamat;
    var notlp = $scope.tlp;
    var email = $scope.email;
    var password =$scope.password;
    alert(password);
    if((nama==undefined)||(alamat==undefined)||(notlp==undefined)||(email==undefined)||(password==undefined)){
      alert("data harus di isi semua");
      return false;
    }else{
  $http.post("insert_pengelola",{nama:nama,alamat:alamat,notlp:notlp,email:email,password:password}).success(function(){
    alert("data sukses di input");
    $scope.getdata();
  })
  }
}
  $scope.edit=function(item){
    $scope.nama = item.nama;
    $scope.alamat = item.alamat;
    $scope.tlp = item.notlp;
    $scope.email = item.email;
    $scope.password = item.password;
    $scope.id = item._id;
  }
  $scope.actionedit=function(){
    var nama = $scope.nama;
    var alamat = $scope.alamat;
    var notlp = $scope.tlp;
    var email = $scope.email;
    var password =$scope.password;
    var id = $scope.id;
  $http.post("ubah_pengelola",{id:id,nama:nama,alamat:alamat,notlp:notlp,email:email,password:password}).success(function(){
    alert("data sukses di ubah");
    $scope.getdata();
  })
  }
  $scope.user={
    hapuspengelola:[]
  }
  $scope.hapus=function(){
    var id = $scope.user;
    if(confirm("apakah anda yakin menghapus data ini?")){
    $http.post("hapus_pengelola",{id:id}).success(function(){
      alert("data sukses dihapus");
      $scope.getdata();
    })
  }else{
    return false;
  }
  }
    })
    mainApp.controller("gedung",function(fileicon,fileGedung,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
      $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(5)
            .withOption('bLengthChange', false)
            .withOption('autoWidth', false)
            .withOption('scrollX', false);
            $scope.getdata = function(){
            $http.get("lihat_gedung").success(function(data){
              $scope.gedung= data;
            });
        }
        $scope.gedung = {};
        $scope.getdatagedung=function(){
          $http.get("lihat_gedung").success(function(data){
            $scope.gedung = data;
          })
        }
        $scope.getdatagedung();
        $scope.getdataharga = function(){
          $http.get("lihat_harga").success(function(data){
          $scope.harga= data;
          });
      }
    $scope.getdataharga();
    $scope.inisialidharga=function(item){
      $scope.id = item._id;
    }
    $scope.tambahharga = function(){
      var pembayaran = $scope.pembayaran;
      var harga = $scope.hargaku;
      var currency = $scope.currency;
      var gabung = currency + harga;
      var currency1 = $scope.currency1;
      var service = $scope.service;
      var gabung1 = currency1 + service;
      var floor=$scope.floor;
      var size = $scope.size;
      var condition = $scope.condition;
      var namagedung = $scope.gedung;
    if((pembayaran==undefined)||(harga==undefined)){
        alert("isi semua data");
        return false;
      }else{
      $http.post("insert_harga",{namagedung:namagedung,harga:gabung,pembayaran:pembayaran,service:gabung1,floor:floor,size:size,condition:condition}).success(function(){
        alert("harga sukses di input");
        $scope.getdataharga();
      })
    }
    }
    $scope.editharga=function(item){
      $scope.service = item.service;
      $scope.pembayaran = item.pembayaran;
      $scope.hargaku = item.harga;
      $scope.floor=item.floor;
      $scope.size=item.size;
      $scope.condition = item.condition;
      $scope.id = item._id;
    }

    $scope.actioneditharga=function(){
      var pembayaran = $scope.pembayaran;
      var harga = $scope.hargaku;
      var currency = $scope.currency;
      var currency1 = $scope.currency1;
      var service = $scope.service;
      var gabung1 = currency1 + service;
      var gabung = currency + harga;
      var id = $scope.id ;
      var floor=$scope.floor;
      var size = $scope.size;
      var condition = $scope.condition;
      $http.post("ubah_harga",{id:id,pembayaran:pembayaran,harga:gabung,service:gabung1,floor:floor,size:size,condition:condition}).success(function(){
        alert("harga sukses di ubah");
        $scope.getdataharga();
      })
    }
      $scope.getdata();
      $scope.user={
      hapusharga:[]
        }
      $scope.hapushargasaja=function(){
        var id = $scope.user;
        $http.post("hapus_harga",{id:id}).success(function(){
          alert("data sukses di hapus");
          $scope.getdataharga();
        })
      }
          $scope.datagambar=function(){
            $http.get("lihat_gedung").success(function(data){
              $scope.gambarku=data;
            })
          }
          $scope.dataicon=function(){
            $http.get("lihat_gambar_icon").success(function(data){
              $scope.gambaricon=data;
            })
          }
          $scope.dataicon();
          $scope.uploadicon=function(item){
            $scope.id = item._id;
          }
          $scope.uploadgambaricon=function(){
            var gambar = $scope.icon1;
            var id = $scope.id
            var uploadUrl = "tambah_iconku";
            fileicon.uploadFileToUrl(id,gambar,uploadUrl);
            $scope.dataicon();
          }

          $scope.upload=function(item){
            $scope.id = item._id;
          }
          $scope.uploadgambar=function(){
            var id = $scope.id;
            var gambar = $scope.gambar1;
            var uploadUrl = "tambah_gambar";
          fileGedung.uploadFileToUrl(id,gambar,uploadUrl);
            $scope.datagambar()
          }
          $scope.datagambar()

          $scope.getdeposit=function(){
            $http.get("ambil_deposit").success(function(data){
              $scope.deposite = data;
            })
          }
          $scope.getdeposit();
          $scope.tambahdeposit=function(){
            var jenis = $scope.jenisdeposit;
            var keterangan = $scope.keterangandeposit;
            $http.post("tambah_deposit",{jenis:jenis,keterangan:keterangan}).success(function(){
              alert("data sukses di input");
              $scope.getdeposit();
            })
          }
          $scope.editdeposit=function(item){
            $scope.jenisdeposit = item.jenis;
            $scope.keterangandeposit = item.keterangan;
            $scope.id = item._id
          }
          $scope.user2={
            hapusdeposit:[]
          }
          $scope.actioneditdeposit=function(){
            var jenis = $scope.jenisdeposit;
            var keterangan = $scope.keterangandeposit;
            var id = $scope.id;
            $http.post("ubah_deposit",{id:id,jenis:jenis,keterangan:keterangan}).success(function(){
              alert("data sukses di input");
              $scope.getdeposit();
            })
          }
          $scope.hapusdeposit=function(){
            var id = $scope.user2;
            $http.post("hapus_deposit",{id:id}).success(function(){
              alert("data sukses di hapus");
              $scope.getdeposit();
            })
          }
          $scope.getbuildinginfo=function(){
            $http.get("ambil_buildinginfo").success(function(data){
              $scope.buildinginfo=data;
            })
          }
          $scope.getbuildinginfo();
          $scope.tambahbuildinginfo=function(){
            var office = $scope.office;
            var parking = $scope.parking;
            var overtime = $scope.overtime;
            $http.post("tambah_buildinginfo",{office:office,parking:parking,overtime:overtime}).success(function(){
              alert("data sukses di input");
              $scope.getbuildinginfo();
            })
          }
          $scope.editbuildinginfo=function(item){
            $scope.office = item.office;
            $scope.parking = item.parking;
            $scope.overtime = item.overtime;
            $scope.id = item._id
          }
          $scope.actioneditbuildinginfo=function(){
            var office = $scope.office;
            var parking = $scope.parking;
            var overtime = $scope.overtime;
            var id = $scope.id;
            $http.post("ubah_buildinginfo",{office:office,parking:parking,overtime:overtime,id:id}).success(function(){
              alert("data sukses di ubah");
              $scope.getbuildinginfo();
            })
          }
          $scope.user3={
            hapusbuildinginfo:[]
          }
          $scope.hapusinfobuilding=function(){
            var id = $scope.user3;
            $http.post("hapus_buildinginfo",{id:id}).success(function(){
              alert("data sukses dihapus");
              $scope.getbuildinginfo();
            })
          }
          $scope.getbuildingspesification=function(){
            $http.get("ambil_buildingspesification").success(function(data){
              $scope.spesifikasigedung = data;
            });
          };
          $scope.getbuildingspesification();
          $scope.tambahbuildingspesification=function(){
            var floor = $scope.floor;
            var lift = $scope.lift;
            var capacity = $scope.capacity;
            var safety = $scope.safety;
            var ac = $scope.ac;
            var telcom = $scope.telecom;
            var facility = $scope.facility;
            $http.post("tambah_buildingspesification",{floor:floor,lift:lift,capacity:capacity,safety:safety,ac:ac,telcom:telcom,facility:facility}).success(function(){
              alert("data sukses di input");
              $scope.getbuildingspesification();
            })
          }
          $scope.editbuildingspesification=function(item){
            $scope.floor = item.floor;
            $scope.lift = item.lift;
            $scope.capacity = item.capacity;
            $scope.safety = item.safety;
            $scope.ac = item.ac;
            $scope.telecom = item.telcom;
            $scope.facility = item.facility;
            $scope.id = item._id;
          }
          $scope.actioneditbuildingspesification=function(){
            var floor = $scope.floor;
            var lift = $scope.lift;
            var capacity = $scope.capacity;
            var safety = $scope.safety;
            var ac = $scope.ac;
            var telcom = $scope.telecom;
            var facility = $scope.facility;
            var id = $scope.id;
            $http.post("ubah_buildingspesification",{floor:floor,lift:lift,capacity:capacity,safety:safety,ac:ac,telcom:telcom,facility:facility}).success(function(){
              alert("data sukses di ubah");
              $scope.getbuildingspesification();
            })
          }
          $scope.user4={
            hapusbuildingspesification:[]
          }
          $scope.hapusspesifikasigedung=function(){
            var id = $scope.user4;
            $http.post("hapus_buildingspesification",{id:id}).success(function(){
              alert("data sukses dihapus");
              $scope.getbuildingspesification();
            })
          }
        })
mainApp.controller("user",function(socket,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDisplayLength(5)
    .withOption('bLengthChange', false)
    .withOption('autoWidth', false)
    .withOption('scrollX', false);
      $scope.getdata = function(){
          $http.get("lihat_pengguna").success(function(data){
              $scope.pengguna= data;
              socket.emit("view_registered",data);
                });
        }
$scope.getdata();
$scope.tambah=function(){
  var nama = $scope.nama;
  var gedung = $scope.namagedung;
  var alamat = $scope.alamat;
  var notlp = $scope.tlp;
  var email = $scope.email;
  var password =$scope.password;
  var level = $scope.level;
  if((level==undefined)||(nama==undefined)||(alamat==undefined)||(notlp==undefined)||(email==undefined)||(password==undefined)){
    alert("semua data harus di isi");
    return false;
  }else{
$http.post("insert_pengguna",{level:level,nama:nama,alamat:alamat,notlp:notlp,email:email,password:password,gedung:gedung}).success(function(){
  alert("data sukses di input");
  $scope.getdata();
})
}
}
$scope.edit=function(item){
  $scope.nama = item.nama;
  $scope.namagedung = item.gedung;
  $scope.alamat = item.alamat;
  $scope.tlp = item.notlp;
  $scope.email = item.email;
  $scope.password = item.password;
  $scope.level = item.level;
  $scope.id = item._id;
}
$scope.actionedit=function(){
  var nama = $scope.nama;
  var alamat = $scope.alamat;
  var notlp = $scope.tlp;
  var email = $scope.email;
  var password =$scope.password;
  var gedung = $scope.namagedung;
  var level = $scope.level;
  var id = $scope.id;
$http.post("ubah_pengguna",{id:id,nama:nama,alamat:alamat,notlp:notlp,email:email,password:password,level:level,gedung:gedung}).success(function(){
  alert("data sukses di ubah");
  $scope.getdata();
})
}
$scope.user={
  hapuspengguna:[]
}
$scope.hapus=function(){
  var id = $scope.user;
  if(confirm("apakah anda yakin menghapus data ini?")){
  $http.post("hapus_pengguna",{id:id}).success(function(){
    alert("data sukses dihapus");
    $scope.getdata();
  })
}else{
  return false;
}
}
})
mainApp.controller("harga",function($scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withDisplayLength(5)
  .withOption('bLengthChange', false)
  .withOption('autoWidth', false)
  .withOption('scrollX', false);
    $scope.getdata = function(){
      $http.get("lihat_harga").success(function(data){
      $scope.harga= data;
      });
  }
$scope.getdata();
$scope.tambah = function(){
  var pembayaran = $scope.pembayaran;
  var harga = $scope.hargaku;
  var nama = $scope.nama;
  var service = $scope.service;
  if((pembayaran==undefined)||(harga==undefined)||(nama==undefined)){
    alert("semua data harus di isi");
    return false;
  }else{
  $http.post("insert_harga",{pembayaran:pembayaran,harga:harga,nama:nama,service:service}).success(function(){
    alert("harga sukses di input");
    $scope.getdata();
  })
}
}
$scope.edit=function(item){
  $scope.nama = item.nama;
  $scope.pembayaran = item.pembayaran;
  $scope.hargaku = item.harga;
  $scope.id = item._id;
}
$scope.actionedit=function(){
  var nama = $scope.nama;
  var pembayaran = $scope.pembayaran;
  var harga = $scope.hargaku;
  var id = $scope.id ;
  $http.post("ubah_harga",{id:id,pembayaran:pembayaran,harga:harga,nama:nama}).success(function(){
    alert("harga sukses di ubah");
    $scope.getdata();
  })
}
$scope.user={
  hapusharga:[]
}
$scope.hapus=function(){
  var id = $scope.user;
  if(confirm("apakah anda yakin ingin menghapus data ini?")){
  $http.post("hapus_harga",{id:id}).success(function(){
    alert("data sukses di hapus");
    $scope.getdata();
  })
}else{
  return false;
}
}
})
mainApp.controller("transaksi",function($scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withDisplayLength(5)
  .withOption('bLengthChange', false)
  .withOption('autoWidth', false)
  .withOption('scrollX', false);
    $scope.getdata = function(){
      $http.get("lihat_transaksi").success(function(data){
      $scope.transaksi= data;
      });
  }
  $scope.getdata();
  $scope.tambah=function(){
    var nama = $scope.nama;
    var namagedung = $scope.namagedung;
    var jumlah = $scope.jumlah;
    var total = $scope.total;
    var status = $scope.status;
    $http.post("tambah_transaksi",{nama:nama,namagedung:namagedung,jumlah:jumlah,total:total,status:status}).success(function(){
      alert("data sukses diinput");
      $scope.getdata();
    })
  }
  $scope.edit=function(item){
    $scope.status = item.status;
    $scope.id = item._id;
  }
  $scope.actionedit=function(){
    var status  = $scope.status;
    var id = $scope.id;
    $http.post("ubah_status",{status:status,id:id}).success(function(){
      alert("data sukses di ubah");
      $scope.getdata();
    })
  }
  $scope.user={
    hapustransaksi:[]
  }
  $scope.hapus=function(){
    var id = $scope.user;
    $http.post("hapus_transaksi",{id:id}).success(function(){
      alert("data sukses dihapus");
      $scope.getdata();
    })
  }

})
mainApp.controller("sewa",function($scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withDisplayLength(5)
  .withOption('bLengthChange', false)
  .withOption('autoWidth', false)
  .withOption('scrollX', false);
    $scope.getdata = function(){
      $http.get("lihat_monitoring").success(function(data){
      $scope.harga= data;
      });
  }
$scope.getdata();
})
mainApp.controller("grafikpenjualan",function(socket,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July","Agustus","september","oktober","november","desember"];

$scope.series = ['Upload'];
 $scope.data = [
   [65, 59, 80, 81, 56, 55, 40,90,80,40,70],
   [28, 48, 40, 19, 86, 27, 90,80,50,60,90,30]
 ];
 $scope.onClick = function (points, evt) {
     console.log(points, evt);
   };

});
mainApp.controller("jumlahuser",function(socket,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July","Agustus","september","oktober","november","desember"];
$scope.series = ['User Register'];
 $scope.getdata1=function(){
    $http.get("lihat_pengguna").success(function(msg){
      $scope.pengguna = msg;
      socket.emit('view_registered',msg)
    });
  }
  $scope.getdata1();
socket.on('userregister', function(msg) {
  $scope.$apply(function () {
    $scope.data = [[10,20,11,msg.length]];
})
});
 $scope.onClick = function (points, evt) {
     console.log(points, evt);
   };

});
mainApp.controller("asisten",function(fileUpload,fileEdit,socket,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withDisplayLength(5)
  .withOption('bLengthChange', false)
  .withOption('autoWidth', false)
  .withOption('scrollX', false);
    $scope.getdata = function(){
      $http.get("lihat_asisten").success(function(msg){
      $scope.asisten= msg;
        socket.emit("asisten_terdaftar",msg)
      });
  }
  $scope.tambah=function(){
    var nama = $scope.nama;
     var notlp = $scope.notlp;
     var alamat = $scope.alamat;
     var jenis = $scope.jenis;
     var gambar = $scope.gambar;
    var asisten = $scope.asisten;
    var email = $scope.email;
    var uploadUrl = "tambah_asisten";
     fileUpload.uploadFileToUrl(nama,notlp,alamat,jenis,email,gambar,uploadUrl);
     $scope.getdata();
  }
  $scope.edit=function(item){
    $scope.nama = item.nama;
    $scope.alamat=item.alamat;
    $scope.jenis=item.jenis;
    $scope.notlp=item.notlp;
    $scope.email = item.email;
    $scope.id = item._id;
    $scope.path = item.gambar;
  }
  $scope.actionedit=function(){
    var nama = $scope.nama;
     var notlp = $scope.notlp;
     var alamat = $scope.alamat;
     var jenis = $scope.jenis;
     var gambar = $scope.gambar;
    var asisten = $scope.asisten;
    var email = $scope.email;
    var path = $scope.path;
    var id = $scope.id;
    var uploadUrl = "edit_asisten";
    if(gambar==undefined){
      $http.post("edit_asisten_noimage",{id:id,nama:nama,notlp:notlp,alamat:alamat,jenis:jenis,email:email}).success(function(){
        alert("data sukses di ubah");
        $scope.getdata();
      })
    }else{
     fileEdit.uploadFileToUrl(nama,notlp,alamat,jenis,email,id,path,gambar,uploadUrl);
     $scope.getdata();
   }
 }
 $scope.user={
   hapusasisten:[]
 }
 $scope.hapus=function(){
   var id = $scope.user;
   $http.post("hapus_asisten",{id:id}).success(function(){
     alert("data sukses dihapus");
     $scope.getdata();
   })
 }
 $scope.change=function(){
   var id = $scope.user;
   $http.post("ganti_status",{status:"not avaible",id:id}).success(function(){
     alert("data sukses di ubah");
     $scope.getdata();
   })
 }
$scope.getdata();

})
mainApp.controller("gedungadmin",function(gedunguploadedit,gedungUpload,socket,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withDisplayLength(5)
  .withOption('bLengthChange', false)
  .withOption('autoWidth', false)
  .withOption('scrollX', false);
    $scope.getdata = function(){
      $http.get("lihat_gedung").success(function(data){
      $scope.gedung= data;
      });
  }
$scope.getdata();
$scope.tambah=function(){
  var nama = $scope.nama;
  var alamat = $scope.alamat;
  var kota = $scope.kota;
  var deskripsi = $scope.deskripsi;
  var gambar = $scope.gambar;
  var pengelola = $scope.pengelolaku;
  var status = "avaible";
  var uploadUrl = "insert_gedung";
  var gedung = $scope.gedung;
  gedungUpload.uploadFileToUrl(nama,alamat,kota,deskripsi,status,gambar,pengelola,uploadUrl);
  $scope.getdata();
};
$scope.edit=function(item){
  $scope.nama = item.nama;
  $scope.alamat = item.alamat;
  $scope.kota = item.kota;
  $scope.deskripsi = item.deskripsi;
  $scope.id  = item._id;
}
$scope.getpengelola=function(){
  $http.get("/ambil_pengelola").success(function(data){
    $scope.pengelola= data;
  })
}
$scope.getpengelola();
$scope.actionedit=function(){
  var nama = $scope.nama;
  var alamat = $scope.alamat;
  var kota = $scope.kota;
  var deskripsi = $scope.deskripsi;
  var gambar = $scope.gambar;
  var status = "avaible";
  var id = $scope.id;
  var gedung = $scope.gedung;
  var pengelola = $scope.pengelolaku;
  var uploadUrl = "ubah_gedung_upload";
  if(gambar==undefined){
  $http.post("ubah_gedung",{nama:nama,alamat:alamat,kota:kota,deskripsi:deskripsi,pengelola:pengelola,status:status,id:id}).success(function(){
    alert("data sukses di ubah");
    $scope.getdata();
  });
}else{
  gedunguploadedit.uploadFileToUrl(nama,alamat,kota,deskripsi,status,id,gambar,pengelola,uploadUrl);
  $scope.getdata();
}
}
$scope.user={
  hapusgedung:[]
}
$scope.hapus=function(){
  var id = $scope.user;
  $http.post("hapus_gedung",{id:id}).success(function(){
    alert("data sukses dihapus");
    $scope.getdata();
  })
}
})
mainApp.controller("dataclient",function(socket,$scope,DTOptionsBuilder,DTColumnBuilder,$http){
  $scope.dtOptions = DTOptionsBuilder.newOptions()
  .withDisplayLength(5)
  .withOption('bLengthChange', false)
  .withOption('autoWidth', false)
  .withOption('scrollX', false);
    $scope.getdata = function(){
      $http.get("ambil_dataclient").success(function(data){
      $scope.client= data;
      });
  }
$scope.getdata();
})
