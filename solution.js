{
    init: function(elevators, floors) {
        var myLog = function(text, elevator){
            var hasElevator = elevator !== undefined;
            if(hasElevator){
                text = "["+elevator+"]: " + text;
            }
            console.log(text);
        }

        
        elevators.forEach(function(current, index){
            current.on("floor_button_pressed", function(floorNum) { 
                console.log("floor_button_pressed: " + floorNum );
                current.goToFloor(floorNum);
            });
            current.on("passing_floor", function(floorNum, direction) { 
                myLog("passing_floor: " + floorNum + ", " + direction+", load: "+ current.loadFactor(), index);
                if(current.loadFactor() < 0.8){
                    if(direction === "up" && waitingAt_Up[floorNum] > 0){
                        myLog("entered mid lift - up", index);
                        elevators[0].goToFloor(floorNum, true);
                        waitingAt_Up[floorNum] = 0;
                    }
                    if(direction === "down" && waitingAt_Down[floorNum] > 0){
                        myLog("entered mid lift - down", index);
                        elevators[1].goToFloor(floorNum, true);
                        waitingAt_Down[floorNum] = 0;
                    }
                }
            });
            current.on("idle", function(floorNum) { current.goToFloor(0); } );
        });

        var waitingAt_Up= [];
        var waitingAt_Down= [];
        floors.forEach(function(_,index){
            waitingAt_Up.push(0);
            waitingAt_Down.push(0);
        });


        floors.forEach(function(current, index){
            current.on("up_button_pressed", function() { waitingAt_Up[index]++; } );
            current.on("down_button_pressed", function() { waitingAt_Down[index]++; } );
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
