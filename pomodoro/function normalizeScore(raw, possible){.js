function normalizeScore(raw, possible){
    if(isNaN(raw)  || isNaN(possible)){
        throw 'scores must be numbers!';
    }
    return (raw/possible);
}
    //function is called to using sample data 
    let rawscore = 5, possScore = 'ten'
    try{
        const score= normalizeScore(rawscore, possScore);
    } catch(e){
        console.info(e)
    }


    //throw statement allows a developer to create an exception and define the exception message. the exception message is a string following 'throw'. the 'throw' statement will stop the execution of the current function and then pass control to the catch block

    //the console.info() method displays an informational message to the console.