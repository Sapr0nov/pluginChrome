chrome.runtime.onMessage.addListener(({ type, name }) => {
    switch(type){
        case "apply-styles":
            console.log('name',name);
            console.log('type',type);


            break;
        case "checkTabs":
            tabsWorker();      
            break;
        default:
            console.log("Message listener status active");
            break;
    }
});
