{
    init: function(elevators, floors) {
        var loopThruAll = function(elevator, inOrder) {
            floors.forEach(function(current,index){
                if(inOrder){
                    elevator.goToFloor(index);
                } else {
                    elevator.goToFloor(floors.length - index - 1);
                }
            });
        };
        
        elevators.forEach(function(elevator,index){
            elevator.on("idle", function(){
                loopThruAll(elevator, index%2 === 0);
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
