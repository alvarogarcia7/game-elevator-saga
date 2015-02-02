{
    init: function(elevators, floors) {
        var myLog = function(text, elevator){
            var hasElevator = elevator !== undefined;
            if(hasElevator){
                text = "["+elevator+"]: " + text;
            }
            console.log(text);
        }

        var floorWhereMostPeopleAreWaiting = function(waitingAt_Up, waitingAt_Down){
            var totalWaitingAtDestination = [];
            waitingAt_Up.forEach(function(current, index){
                totalWaitingAtDestination.push(waitingAt_Up[index] + waitingAt_Down[index]);
            });


            var max = totalWaitingAtDestination[0];
            var maxIndex = 0;
            totalWaitingAtDestination.forEach(function(current, index){
                if(current > max){
                    maxIndex = index;
                    max = current;
                }
            });
            return maxIndex;
        }

        
        elevators.forEach(function(current, index){
            current.on("floor_button_pressed", function(floorNum) { 
                console.log("floor_button_pressed: " + floorNum );
                var totalWaitingAtDestination = waitingAt_Up[floorNum] + waitingAt_Down[floorNum];
                if(totalWaitingAtDestination > 0 || current.loadFactor() > 0.1){
                    current.goToFloor(floorNum);
                    if(floorNum > current.currentFloor()){
                        waitingAt_Down[current.currentFloor()]--;    
                    } else {
                        waitingAt_Up[current.currentFloor()]--;
                    }
                    
                }
            });
            current.on("passing_floor", function(floorNum, direction) { 
                myLog("passing_floor: " + floorNum + ", " + direction+", load: "+ current.loadFactor(), index);
                elevators.forEach(function(current, index){
                    var loadFactorBefore = current.loadFactor();
                    if(loadFactorBefore < 0.8){
                        if(waitingAt_Up[floorNum] > 0){
                            if(current.loadFactor() > loadFactorBefore){
                                myLog("entered mid lift - up", index);
                                current.goToFloor(floorNum, true);
                                waitingAt_Up[floorNum]--;
                            } else {
                                myLog("stopped mid lift but nobody got in - up", index);
                            }
                        }
                        if(waitingAt_Down[floorNum] > 0){
                            if(current.loadFactor() > loadFactorBefore){
                                myLog("entered mid lift - down", index);
                                current.goToFloor(floorNum, true);
                                waitingAt_Down[floorNum]--;
                            } else {
                                myLog("stopped mid lift but nobody got in - down", index);
                            }
                        }
                    }
                });
            });
            current.on("idle", function(floorNum) { 
                var maxIndex = floorWhereMostPeopleAreWaiting(waitingAt_Up,waitingAt_Down);
                
                current.goToFloor(maxIndex); 
            });
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
