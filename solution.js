{
    init: function(elevators, floors) {
        var loopThruAll = function(elevator) {
            floors.forEach(function(current,index){
                elevator.goToFloor(index);
            });
        };
        
        elevators.forEach(function(elevator,index){
            elevator.on("idle", function(){
                loopThruAll(elevator);
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
